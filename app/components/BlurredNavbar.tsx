import { MenuIcon } from "lucide-react"

export function BlurredNavbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-20">
      <div className="mx-auto w-full max-w-6xl px-4 pt-4">
        <div className="flex h-14 items-center justify-between gap-3 rounded-3xl border bg-background/30 px-4 shadow-sm backdrop-blur-md">
          <a href="#" className="flex items-center gap-3">
            <span className="inline-flex size-9 items-center justify-center rounded-2xl bg-foreground text-xs font-semibold tracking-wide text-background">
              GMK
            </span>
            <span className="font-[var(--font-nohemi)] text-sm font-semibold tracking-tight">
              GENAUMEINKURS
            </span>
          </a>

          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-1 text-sm md:flex">
              <a
                href="#chat"
                className="rounded-2xl px-3 py-2 text-foreground/80 transition-colors hover:bg-background/50 hover:text-foreground"
              >
                Chat
              </a>
              <a
                href="#about"
                className="rounded-2xl px-3 py-2 text-foreground/80 transition-colors hover:bg-background/50 hover:text-foreground"
              >
                Info
              </a>
              <a
                href="#chat"
                className="ml-2 inline-flex h-10 items-center justify-center rounded-2xl bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                Zum Chat
              </a>
            </nav>

            <details className="relative md:hidden">
              <summary className="inline-flex h-10 w-10 list-none items-center justify-center rounded-2xl border bg-background/40 backdrop-blur-md [&::-webkit-details-marker]:hidden">
                <MenuIcon className="size-5" aria-hidden="true" />
                <span className="sr-only">Menü</span>
              </summary>
              <div className="absolute right-0 mt-2 w-48 rounded-3xl border bg-background/55 p-2 shadow-lg backdrop-blur-md">
                <a
                  href="#chat"
                  className="block rounded-2xl px-3 py-2 text-sm text-foreground/85 hover:bg-background/60 hover:text-foreground"
                >
                  Chat
                </a>
                <a
                  href="#about"
                  className="block rounded-2xl px-3 py-2 text-sm text-foreground/85 hover:bg-background/60 hover:text-foreground"
                >
                  Info
                </a>
                <a
                  href="#chat"
                  className="mt-1 block rounded-2xl bg-foreground px-3 py-2 text-center text-sm font-medium text-background"
                >
                  Zum Chat
                </a>
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  )
}
