# ElevenLabs Agent UI (Next.js)

Production-ready Next.js (App Router, TypeScript) web app that hosts a simple chat/voice UI and starts an ElevenLabs Agent session via `@elevenlabs/react`.

## Requirements

- Node.js >= 18
- pnpm (recommended): `corepack enable`

## Setup

Install deps:

```bash
pnpm install
```

Start dev server:

```bash
pnpm dev
```

Open `http://localhost:3000`.

## ElevenLabs UI Components

This repo vendors ElevenLabs UI components locally (shadcn-style) under `components/ui/*`.

To (re)install components from the ElevenLabs UI registry:

```bash
pnpm dlx @elevenlabs/cli@latest components add orb
pnpm dlx @elevenlabs/cli@latest components add conversation
pnpm dlx @elevenlabs/cli@latest components add message
pnpm dlx @elevenlabs/cli@latest components add response
```

## Public vs Private Agent

The UI lives in `app/components/ConversationWidget.tsx` and uses WebRTC (`connectionType: "webrtc"`).

### Public agent (no backend required)

Nothing to configure; it falls back to the default agent id in `app/components/ConversationWidget.tsx`.

### Private agent (recommended for production)

Set environment variables (locally in `.env.local`, on Vercel in Project Settings):

```bash
ELEVENLABS_API_KEY=...
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=agent_...
```

Server routes:

- `app/api/conversation-token/route.ts`: mints a WebRTC `conversationToken` (used by the UI)
- `app/api/get-signed-url/route.ts`: returns a `signedUrl` for WebSocket connections (included for completeness)

Important: the API key stays server-side (never exposed to the client).
In production, protect these routes with your own app auth if you don’t want anonymous users to start sessions.

## Deploy (Vercel)

1. Push this repo to GitHub/GitLab.
2. Create a new Vercel Project and import the repo.
3. If using a private agent, set `ELEVENLABS_API_KEY` in Vercel Project Settings.
4. If using a private agent, set `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` in Vercel Project Settings.
5. Deploy.

Mic/WebRTC requires HTTPS; Vercel provides this automatically (localhost is also a secure context).
