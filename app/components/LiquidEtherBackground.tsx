"use client"

import { useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"

const LiquidEther = dynamic(() => import("@/components/LiquidEther"), {
  ssr: false,
})

function computeQuality(): "high" | "low" {
  if (typeof window === "undefined") return "low"

  const conn = (navigator as unknown as { connection?: unknown }).connection as
    | { saveData?: boolean; effectiveType?: string }
    | undefined

  const saveData = Boolean(conn?.saveData)
  const effectiveType = conn?.effectiveType ?? ""
  const slowNetwork =
    effectiveType === "slow-2g" ||
    effectiveType === "2g" ||
    effectiveType === "3g"

  if (saveData || slowNetwork) return "low"

  const deviceMemory = (navigator as unknown as { deviceMemory?: number })
    .deviceMemory
  const cores = navigator.hardwareConcurrency
  const isMobile = window.innerWidth < 1024

  const lowEnd =
    isMobile ||
    (typeof deviceMemory === "number" && deviceMemory > 0 && deviceMemory <= 6) ||
    (typeof cores === "number" && cores > 0 && cores <= 6)

  return lowEnd ? "low" : "high"
}

export function LiquidEtherBackground() {
  const [renderEffect, setRenderEffect] = useState(false)
  const [quality] = useState<"high" | "low">(() => computeQuality())

  useEffect(() => {
    // Keep first paint fast: render a static wash immediately, then mount WebGL when idle.
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const conn = (navigator as unknown as { connection?: unknown }).connection as
      | { saveData?: boolean; effectiveType?: string }
      | undefined

    const saveData = Boolean(conn?.saveData)
    const effectiveType = conn?.effectiveType ?? ""
    const slowNetwork =
      effectiveType === "slow-2g" ||
      effectiveType === "2g" ||
      effectiveType === "3g"

    if (prefersReducedMotion || saveData || slowNetwork) return

    let raf = 0
    const start = () => setRenderEffect(true)

    const w = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number
      cancelIdleCallback?: (id: number) => void
    }

    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(start, { timeout: 1_200 })
      return () => w.cancelIdleCallback?.(id)
    }

    raf = window.setTimeout(start, 240)
    return () => window.clearTimeout(raf)
  }, [])

  const etherProps = useMemo(() => {
    if (quality === "low") {
      return {
        resolution: 0.22,
        iterationsPoisson: 32,
        iterationsViscous: 22,
        autoIntensity: 3.2,
      }
    }

    return {
      // Still visually rich, but ~50% less work than the "max" preset.
      resolution: 0.32,
      iterationsPoisson: 48,
      iterationsViscous: 28,
      autoIntensity: 3.8,
    }
  }, [quality])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    >
      {/* Base wash (color0/1/2 in your snippet) shown through the transparent fluid canvas. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1000px 700px at 50% 0%, rgba(3, 151, 167, 0.28), rgba(255, 255, 255, 0) 60%), radial-gradient(900px 650px at 90% 30%, rgba(254, 204, 92, 0.26), rgba(255, 255, 255, 0) 55%), linear-gradient(180deg, #ffffff 0%, #ffffff 100%)",
        }}
      />
      {renderEffect ? (
        <LiquidEther
          // Fill the viewport. LiquidEther measures its container size.
          style={{ width: "100%", height: "100%" }}
          colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
          mouseForce={20}
          cursorSize={70}
          isViscous
          viscous={30}
          iterationsViscous={etherProps.iterationsViscous}
          iterationsPoisson={etherProps.iterationsPoisson}
          resolution={etherProps.resolution}
          isBounce={false}
          autoDemo
          autoSpeed={0.05}
          autoIntensity={etherProps.autoIntensity}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      ) : null}
    </div>
  )
}
