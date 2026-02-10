"use client"

const STATIC_BACKGROUND =
  "radial-gradient(1000px 700px at 50% 0%, rgba(3, 151, 167, 0.28), rgba(255, 255, 255, 0) 60%), radial-gradient(900px 650px at 90% 30%, rgba(254, 204, 92, 0.26), rgba(255, 255, 255, 0) 55%), linear-gradient(180deg, #ffffff 0%, #ffffff 100%)"

export function LiquidEtherBackground() {
  // Keep only the static background (former "Aus" mode). No WebGL / animated variants.
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <div className="absolute inset-0" style={{ background: STATIC_BACKGROUND }} />
    </div>
  )
}

