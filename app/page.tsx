import { LiquidEtherBackground } from "@/app/components/LiquidEtherBackground"
import { ConversationWidget } from "@/app/components/ConversationWidget"

export default function Home() {
  return (
    <div className="text-foreground relative min-h-dvh overflow-hidden">
      <LiquidEtherBackground />

      <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 py-10">
        <div className="grid flex-1 items-start gap-8 lg:grid-cols-2 lg:items-center">
          <section className="space-y-6">
            <h1 className="text-balance font-[var(--font-nohemi)] text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Diese Seite wurde zu 100% mit KI erstellt.
            </h1>
            <p className="text-pretty text-base leading-7 text-foreground/75 sm:text-lg">
              Wenn du ebenso lernen möchtest, wie man mit Künstlicher Intelligenz
              Apps und Webseiten erstellen kann, hinterlasse deine Daten.
            </p>

            <div className="max-w-md rounded-3xl border bg-background/15 p-4 text-sm leading-6 text-foreground/75 backdrop-blur-md">
              Der Chat rechts startet automatisch. Du kannst dort direkt
              schreiben und deine Daten im Gespräch hinterlassen.
            </div>
          </section>

          <section className="w-full">
            <ConversationWidget />
          </section>
        </div>

        <footer className="mt-10 text-xs text-foreground/60">
          HTTPS ist notwendig für manche Browser-Media-Features; Vercel liefert
          das automatisch.
        </footer>
      </main>
    </div>
  );
}
