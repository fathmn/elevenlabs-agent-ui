import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const apiKey = process.env.ELEVENLABS_API_KEY
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing ELEVENLABS_API_KEY" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    )
  }

  if (!agentId) {
    return NextResponse.json(
      { error: "Missing NEXT_PUBLIC_ELEVENLABS_AGENT_ID" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    )
  }

  const url = new URL(
    "https://api.elevenlabs.io/v1/convai/conversation/token"
  )
  url.searchParams.set("agent_id", agentId)

  const res = await fetch(url, {
    headers: {
      "xi-api-key": apiKey,
    },
    cache: "no-store",
  })

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to get conversation token" },
      { status: res.status, headers: { "Cache-Control": "no-store" } }
    )
  }

  const data = (await res.json()) as { token?: string }
  const token = data.token

  if (!token) {
    return NextResponse.json(
      { error: "Malformed response from ElevenLabs (missing token)" },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    )
  }

  return NextResponse.json(
    { token },
    { headers: { "Cache-Control": "no-store" } }
  )
}

