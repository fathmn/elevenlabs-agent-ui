# ElevenLabs Agent UI (Next.js)

Production-ready Next.js (App Router, TypeScript) web app that hosts a chat-first UI and starts an ElevenLabs Agent session via `@elevenlabs/react`.

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
pnpm dlx @elevenlabs/cli@latest components add conversation-bar
pnpm dlx @elevenlabs/cli@latest components add voice-button
pnpm dlx @elevenlabs/cli@latest components add speech-input
```

## Public vs Private Agent

The UI lives in `app/components/ConversationWidget.tsx` and is chat-first (auto-connects, text input via `ConversationBar`).
Voice/mic is optional and only requested if the user uses the voice button (browser SpeechRecognition).

### Public agent (no backend required)

Nothing to configure; it falls back to the default agent/branch in `app/components/ConversationWidget.tsx`.

### Private agent (recommended for production)

Set environment variables (locally in `.env.local`, on Vercel in Project Settings):

```bash
ELEVENLABS_API_KEY=...
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=agent_...
NEXT_PUBLIC_ELEVENLABS_BRANCH_ID=agtbrch_... # optional
```

Server routes:

- `app/api/get-signed-url/route.ts`: returns a `signedUrl` for WebSocket connections
- `app/api/conversation-token/route.ts`: returns a `token` (included for completeness; not required for the public-agent chat flow)

Important: the API key stays server-side (never exposed to the client).
In production, protect these routes with your own app auth if you don’t want anonymous users to start sessions.

## Deploy (Vercel)

1. Push this repo to GitHub/GitLab.
2. Create a new Vercel Project and import the repo.
3. If using a private agent, set `ELEVENLABS_API_KEY` in Vercel Project Settings.
4. If using a private agent, set `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` in Vercel Project Settings.
5. Optional: set `NEXT_PUBLIC_ELEVENLABS_BRANCH_ID` if you want to pin a specific branch.
6. Deploy.

Mic and some browser speech APIs require a secure context (HTTPS); Vercel provides this automatically (localhost is also a secure context).
