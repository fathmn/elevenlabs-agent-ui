"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import LiquidGlass from "liquid-glass-react"
import type { Status } from "@elevenlabs/react"

import { cn } from "@/lib/utils"
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
import { Response } from "@/components/ui/response"
import { ConversationBar } from "@/components/ui/conversation-bar"

const DEFAULT_AGENT_ID = "agent_1901kh130f0bexrsmn6pc0ejn8g0"

type UiMessage = {
  id: string
  from: "user" | "assistant"
  text: string
  createdAt: number
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

export function ConversationWidget() {
  const userId = useStableUserId()
  const agentId =
    process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || DEFAULT_AGENT_ID

  const mouseContainerRef = useRef<HTMLDivElement | null>(null)

  const [status, setStatus] = useState<Status>("disconnected")
  const [messages, setMessages] = useState<UiMessage[]>([])
  const [lastError, setLastError] = useState<string | null>(null)

  const lastLocalUserMessageRef = useRef<{ text: string; ts: number } | null>(
    null
  )

  const addMessage = useCallback((m: Omit<UiMessage, "id">) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${m.createdAt}-${Math.random().toString(16).slice(2)}`,
        ...m,
      },
    ])
  }, [])

  const handleSendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return

      const ts = Date.now()
      lastLocalUserMessageRef.current = { text: trimmed, ts }

      addMessage({
        from: "user",
        text: trimmed,
        createdAt: ts,
      })
    },
    [addMessage]
  )

  const handleIncomingMessage = useCallback(
    (msg: { source: "user" | "ai"; message: string }) => {
      const text = msg.message.trim()
      if (!text) return

      const ts = Date.now()

      if (msg.source === "user") {
        const last = lastLocalUserMessageRef.current
        if (last && last.text === text && ts - last.ts < 2_000) {
          // Avoid duplicating the optimistic local message.
          return
        }
        addMessage({ from: "user", text, createdAt: ts })
        return
      }

      addMessage({ from: "assistant", text, createdAt: ts })
    },
    [addMessage]
  )

  const statusLabel = useMemo(() => {
    switch (status) {
      case "connected":
        return "connected"
      case "connecting":
        return "connecting"
      case "disconnected":
        return "disconnected"
      case "disconnecting":
        return "disconnecting"
      default:
        return String(status)
    }
  }, [status])

  return (
    <div ref={mouseContainerRef} className="w-full">
      <LiquidGlass
        mouseContainer={mouseContainerRef}
        mode="standard"
        displacementScale={200}
        blurAmount={1.0}
        saturation={100}
        aberrationIntensity={0}
        elasticity={0}
        cornerRadius={32}
        padding="0px"
        className="w-full"
      >
        <section className="flex h-[70dvh] min-h-[460px] w-full flex-col sm:min-h-[520px]">
          <header className="flex items-center justify-between gap-3 px-5 pt-5 pb-3">
            <div className="space-y-0.5">
              <div className="text-sm font-medium leading-5">
                ElevenLabs Chat
              </div>
              <div className="text-muted-foreground text-xs leading-4">
                Public agent · auto-connected
              </div>
            </div>
            <StatusPill status={statusLabel} />
          </header>

          <div className="min-h-0 flex-1 px-3 pb-3">
            <div className="bg-background/10 ring-foreground/10 h-full overflow-hidden rounded-2xl ring-1">
              <Conversation className="min-h-0">
                <ConversationContent className="space-y-1">
                  {messages.length === 0 ? (
                    <ConversationEmptyState
                      title="Sag hallo"
                      description="Der Chat startet automatisch. Tipp einfach los."
                    />
                  ) : (
                    messages.map((m) => (
                      <Message key={m.id} from={m.from}>
                        <MessageAvatar
                          name={m.from === "user" ? "Du" : "AI"}
                          src={m.from === "user" ? "/user.svg" : "/agent.svg"}
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
          </div>

          <div className="px-3 pb-4">
            <ConversationBar
              agentId={agentId}
              userId={userId}
              autoStart
              textOnly
              connectionType="websocket"
              enableVoiceInput
              onStatusChange={(s) => setStatus(s)}
              onMessage={handleIncomingMessage}
              onSendMessage={handleSendMessage}
              onError={(err) => setLastError(err.message)}
              className="px-2"
            />

            {lastError && (
              <div className="mt-3 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm">
                <div className="font-medium">Error</div>
                <div className="text-muted-foreground break-words">
                  {lastError}
                </div>
              </div>
            )}
          </div>
        </section>
      </LiquidGlass>
    </div>
  )
}

function StatusPill({ status }: { status: string }) {
  const classes =
    status === "connected"
      ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200"
      : status === "connecting" || status === "disconnecting"
        ? "bg-amber-500/15 text-amber-800 dark:text-amber-200"
        : "bg-zinc-500/10 text-zinc-800 dark:text-zinc-200"

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
