import { LiquidEtherBackground } from "@/app/components/LiquidEtherBackground"
import { ConversationWidget } from "@/app/components/ConversationWidget"

export default function Home() {
  return (
    <div className="bg-background text-foreground relative min-h-dvh">
      <LiquidEtherBackground />

      <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 py-10">
        <div className="grid flex-1 items-start gap-8 lg:grid-cols-2 lg:items-center">
          <section className="space-y-6">
            <h1 className="text-balance font-[var(--font-nohemi)] text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Diese Seite wurde zu 100% mit KI erstellt.
            </h1>
            <p className="text-pretty text-base leading-7 text-foreground/75 sm:text-lg">
              Wenn du ebenso lernen möchtest, wie man mit Künstlicher Intelligenz
              Apps und Webseiten erstellen kann, hinterlasse deine Daten.
            </p>

            <div className="max-w-md rounded-3xl border bg-background/30 p-4 backdrop-blur-md">
              <form className="grid gap-3">
                <input
                  className="h-11 w-full rounded-2xl border bg-background/40 px-4 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring/40"
                  placeholder="Name"
                  autoComplete="name"
                  name="name"
                />
                <input
                  className="h-11 w-full rounded-2xl border bg-background/40 px-4 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring/40"
                  placeholder="E-Mail"
                  autoComplete="email"
                  name="email"
                  type="email"
                />
                <button
                  className="h-11 w-full rounded-2xl bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                  type="button"
                >
                  Absenden
                </button>
                <p className="text-xs leading-5 text-foreground/60">
                  Demo-Formular. Anbindung an Newsletter/CRM können wir als
                  nächsten Schritt machen.
                </p>
              </form>
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
