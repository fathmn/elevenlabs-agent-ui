"use client"

import LiquidEther from "@/components/LiquidEther"

export function LiquidEtherBackground() {
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
      <LiquidEther
        // Fill the viewport. LiquidEther measures its container size.
        style={{ width: "100%", height: "100%" }}
        colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
        mouseForce={20}
        cursorSize={70}
        isViscous
        viscous={30}
        iterationsViscous={32}
        iterationsPoisson={64}
        resolution={0.5}
        isBounce={false}
        autoDemo
        autoSpeed={0.05}
        autoIntensity={4}
        takeoverDuration={0.25}
        autoResumeDelay={3000}
        autoRampDuration={0.6}
      />
    </div>
  )
}
