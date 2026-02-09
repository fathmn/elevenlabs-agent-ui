"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useConversation } from "@elevenlabs/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ui/conversation"
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message"
import { Orb, type AgentState } from "@/components/ui/orb"
import { Response } from "@/components/ui/response"

const DEFAULT_AGENT_ID = "agent_1901kh130f0bexrsmn6pc0ejn8g0"

type UiMessage = {
  id: string
  from: "user" | "assistant"
  text: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function getStringField(
  obj: Record<string, unknown>,
  key: string
): string | null {
  const value = obj[key]
  return typeof value === "string" ? value : null
}

function safeStringifyError(err: unknown): string {
  if (err instanceof Error) return err.message
  if (typeof err === "string") return err
  try {
    return JSON.stringify(err)
  } catch {
    return String(err)
  }
}

async function requestMicrophonePermission(): Promise<void> {
  if (!("mediaDevices" in navigator) || !navigator.mediaDevices.getUserMedia) {
    throw new Error("This browser does not support microphone access.")
  }

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  // We only need to trigger the permission prompt here.
  for (const track of stream.getTracks()) track.stop()
}

function useStableUserId() {
  const key = "elevenlabs_user_id"

  const [userId] = useState<string | undefined>(() => {
    if (typeof window === "undefined") return undefined

    const existing = window.localStorage.getItem(key)
    if (existing) return existing

    return typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`
  })

  useEffect(() => {
    if (!userId) return
    if (typeof window === "undefined") return

    const existing = window.localStorage.getItem(key)
    if (!existing) window.localStorage.setItem(key, userId)
  }, [key, userId])

  return userId
}

async function fetchConversationToken(): Promise<string | null> {
  try {
    const res = await fetch("/api/conversation-token", { cache: "no-store" })
    if (!res.ok) return null
    const data = (await res.json()) as { token?: string }
    return typeof data.token === "string" && data.token.length > 0
      ? data.token
      : null
  } catch {
    return null
  }
}

async function fetchSignedUrl(): Promise<string | null> {
  try {
    const res = await fetch("/api/get-signed-url", { cache: "no-store" })
    if (!res.ok) return null
    const data = (await res.json()) as { signedUrl?: string }
    return typeof data.signedUrl === "string" && data.signedUrl.length > 0
      ? data.signedUrl
      : null
  } catch {
    return null
  }
}

export function ConversationWidget() {
  const userId = useStableUserId()
  const agentId =
    process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || DEFAULT_AGENT_ID

  const [messages, setMessages] = useState<UiMessage[]>([])
  const [lastError, setLastError] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)

  const isStartingRef = useRef(false)

  const conversation = useConversation({
    onConnect: ({ conversationId }) => {
      console.log("[ElevenLabs] connected", { conversationId })
      setConversationId(conversationId)
      setLastError(null)
    },
    onDisconnect: (details) => {
      console.log("[ElevenLabs] disconnected", details)
      setConversationId(null)
    },
    onMessage: (event: unknown) => {
      // The SDK passes `{ source, role, message }` for user transcripts and agent responses.
      if (!isRecord(event)) return
      const msg = getStringField(event, "message")
      const source = getStringField(event, "source")

      if (!msg) return

      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          from: source === "user" ? "user" : "assistant",
          text: msg,
        },
      ])
    },
    onError: (err) => {
      console.error("[ElevenLabs] error", err)
      setLastError(safeStringifyError(err))
    },
  })

  const statusLabel = useMemo(() => {
    switch (conversation.status) {
      case "connected":
        return "connected"
      case "connecting":
        return "connecting"
      case "disconnected":
        return "disconnected"
      case "disconnecting":
        return "disconnecting"
      default:
        return String(conversation.status)
    }
  }, [conversation.status])

  const isConnected = conversation.status === "connected"
  const isConnecting = conversation.status === "connecting"
  const isDisconnecting = conversation.status === "disconnecting"

  const orbState: AgentState = useMemo(() => {
    if (isConnected) return conversation.isSpeaking ? "talking" : "listening"
    if (isConnecting) return "thinking"
    return null
  }, [conversation.isSpeaking, isConnected, isConnecting])

  const handleStart = useCallback(async () => {
    if (isStartingRef.current) return
    isStartingRef.current = true

    try {
      setLastError(null)
      setMessages([])
      await requestMicrophonePermission()

      // Public agent: connect directly with agentId (no backend / API key required).
      // Private agent: the direct attempt will fail; then we try server-minted auth.
      let id: string
      try {
        id = await conversation.startSession({
          agentId,
          connectionType: "webrtc",
          userId,
        })
      } catch (publicErr) {
        console.warn("[ElevenLabs] public startSession failed; trying auth fallback")

        // Private agent (WebRTC preferred): mint conversation token server-side.
        const token = await fetchConversationToken()
        if (token) {
          id = await conversation.startSession({
            conversationToken: token,
            connectionType: "webrtc",
            userId,
          })
        } else {
          // Private agent (WebSocket): mint signed URL server-side.
          const signedUrl = await fetchSignedUrl()
          if (!signedUrl) throw publicErr

          id = await conversation.startSession({
            signedUrl,
            connectionType: "websocket",
            userId,
          })
        }
      }

      console.log("[ElevenLabs] session started", { id })
      setConversationId(id)
    } catch (err) {
      setLastError(safeStringifyError(err))
    } finally {
      isStartingRef.current = false
    }
  }, [agentId, conversation, userId])

  const handleStop = useCallback(async () => {
    try {
      await conversation.endSession()
    } catch (err) {
      setLastError(safeStringifyError(err))
    }
  }, [conversation])

  return (
    <section className="flex min-h-[calc(100dvh-2rem)] flex-col gap-4">
      <header className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold leading-6">ElevenLabs Agent</h1>
          <p className="text-muted-foreground text-sm leading-5">
            Start a voice conversation with your Agent (WebRTC preferred).
          </p>
        </div>

        <StatusPill status={statusLabel} />
      </header>

      <div className="bg-card relative overflow-hidden rounded-2xl border">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_10%,oklch(0.985_0_0)_0%,transparent_50%),radial-gradient(circle_at_80%_40%,oklch(0.92_0.004_286.32)_0%,transparent_45%)] dark:bg-[radial-gradient(circle_at_25%_10%,oklch(0.21_0.006_285.885)_0%,transparent_55%),radial-gradient(circle_at_80%_40%,oklch(0.274_0.006_286.033)_0%,transparent_50%)]" />
        <div className="relative grid grid-cols-1 gap-4 p-4 sm:grid-cols-[160px_1fr] sm:items-center">
          <div className="h-36 w-full sm:h-32 sm:w-40">
            <Orb
              agentState={orbState}
              className="h-full w-full"
              getInputVolume={conversation.getInputVolume}
              getOutputVolume={conversation.getOutputVolume}
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm">
              <div className="text-muted-foreground">Agent</div>
              <div className="font-medium break-all">{agentId}</div>
            </div>

            {conversationId && (
              <div className="text-sm">
                <div className="text-muted-foreground">Conversation</div>
                <div className="font-medium break-all">{conversationId}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-card flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border">
        <Conversation className="min-h-0">
          <ConversationContent className="space-y-1">
            {messages.length === 0 ? (
              <ConversationEmptyState
                title="No messages yet"
                description="Press Start and begin speaking."
              />
            ) : (
              messages.map((m) => (
                <Message key={m.id} from={m.from}>
                  <MessageAvatar
                    name={m.from === "user" ? "You" : "AI"}
                    src={
                      m.from === "user"
                        ? "/user.svg"
                        : "/agent.svg"
                    }
                  />
                  <MessageContent>
                    {m.from === "assistant" ? (
                      <Response>{m.text}</Response>
                    ) : (
                      <p className="whitespace-pre-wrap">{m.text}</p>
                    )}
                  </MessageContent>
                </Message>
              ))
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>

      {lastError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm">
          <div className="font-medium">Error</div>
          <div className="text-muted-foreground break-words">{lastError}</div>
        </div>
      )}

      <footer className="grid grid-cols-2 gap-3">
        <Button
          onClick={handleStart}
          disabled={isConnected || isConnecting || isDisconnecting}
          type="button"
        >
          Start
        </Button>
        <Button
          onClick={handleStop}
          disabled={!isConnected && !isConnecting && !isDisconnecting}
          type="button"
          variant="outline"
        >
          Stop
        </Button>
      </footer>
    </section>
  )
}

function StatusPill({ status }: { status: string }) {
  const classes =
    status === "connected"
      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
      : status === "connecting"
        ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
        : status === "disconnecting"
          ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
          : "bg-zinc-500/10 text-zinc-700 dark:text-zinc-300"

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
        classes
      )}
      aria-live="polite"
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          status === "connected"
            ? "bg-emerald-500"
            : status === "connecting" || status === "disconnecting"
              ? "bg-amber-500"
              : "bg-zinc-400"
        )}
      />
      <span className="capitalize">{status}</span>
    </div>
  )
}
