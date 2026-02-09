import { LiquidEtherBackground } from "@/app/components/LiquidEtherBackground"
import { BlurredNavbar } from "@/app/components/BlurredNavbar"
import { ConversationWidget } from "@/app/components/ConversationWidget"

export default function Home() {
  return (
    <div className="text-foreground relative min-h-dvh overflow-x-hidden">
      <LiquidEtherBackground />
      <BlurredNavbar />

      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-10 pt-24 sm:pb-14 sm:pt-28">
        <section
          aria-labelledby="hero"
          className="grid items-start gap-8 lg:grid-cols-[1fr_520px] lg:gap-8"
        >
          <div className="rounded-[32px] border bg-background/20 p-6 shadow-sm backdrop-blur-md sm:p-8">
            <h1
              id="hero"
              className="text-balance font-[var(--font-nohemi)] text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
            >
              Diese Seite wurde zu 100% mit KI erstellt.
            </h1>
            <p className="text-pretty mt-4 text-base leading-7 text-foreground/75 sm:text-lg">
              Wenn du ebenso lernen möchtest, wie man mit Künstlicher
              Intelligenz Apps und Webseiten erstellen kann, hinterlasse deine
              Daten.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#chat"
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                Zum Chat
              </a>
              <div className="text-sm text-foreground/70">
                Public agent · kein Backend · startet automatisch
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border bg-background/10 p-4">
                <div className="text-sm font-medium">Chat-first</div>
                <p className="mt-1 text-sm leading-6 text-foreground/70">
                  Tippe unten in die Conversation Bar. Keine Start-Buttons.
                </p>
              </div>
              <div className="rounded-3xl border bg-background/10 p-4">
                <div className="text-sm font-medium">Voice optional</div>
                <p className="mt-1 text-sm leading-6 text-foreground/70">
                  Mikrofon wird erst angefragt, wenn du auf das Mic klickst.
                </p>
              </div>
            </div>
          </div>

          <div
            id="chat"
            className="w-full lg:sticky lg:top-10"
            style={{ scrollMarginTop: 80 }}
          >
            <ConversationWidget />
          </div>
        </section>

        <section
          aria-labelledby="about"
          className="mt-12 grid gap-4 md:grid-cols-3"
        >
          <h2 id="about" className="sr-only">
            Info
          </h2>
          <div className="rounded-3xl border bg-background/15 p-5 backdrop-blur-md">
            <div className="text-sm font-medium">Next.js + Vercel</div>
            <p className="mt-2 text-sm leading-6 text-foreground/70">
              App Router, TypeScript, Tailwind. Deployments laufen automatisch.
            </p>
          </div>
          <div className="rounded-3xl border bg-background/15 p-5 backdrop-blur-md">
            <div className="text-sm font-medium">ElevenLabs UI</div>
            <p className="mt-2 text-sm leading-6 text-foreground/70">
              Komponenten liegen lokal im Repo (shadcn-style) und sind
              anpassbar.
            </p>
          </div>
          <div className="rounded-3xl border bg-background/15 p-5 backdrop-blur-md">
            <div className="text-sm font-medium">Sichere Defaults</div>
            <p className="mt-2 text-sm leading-6 text-foreground/70">
              Kein API Key im Client. Public Agent funktioniert ohne Backend.
            </p>
          </div>
        </section>

        <footer className="mt-12 text-xs text-foreground/60">
          HTTPS ist notwendig für manche Browser-Media-Features; Vercel liefert
          das automatisch.
        </footer>
      </main>
    </div>
  )
}
