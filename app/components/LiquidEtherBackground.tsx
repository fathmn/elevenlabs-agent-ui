"use client"

import LiquidEther from "@/components/LiquidEther"

export function LiquidEtherBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    >
      <LiquidEther
        // Fill the viewport. LiquidEther measures its container size.
        style={{ width: "100%", height: "100%" }}
        colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
        mouseForce={32}
        cursorSize={90}
        isViscous
        viscous={30}
        iterationsViscous={32}
        iterationsPoisson={32}
        resolution={0.5}
        isBounce
        autoDemo
        autoSpeed={0.5}
        autoIntensity={1.2}
        takeoverDuration={0.25}
        autoResumeDelay={3000}
        autoRampDuration={0.6}
      />
    </div>
  )
}
