"use client"

import LightRays from "@/components/LightRays"

export function LightRaysBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    >
      {/* Base layer: slightly darker top so white rays remain visible. */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-600/45 via-slate-200 to-white" />
      <LightRays
        raysOrigin="top-center"
        raysColor="#ffffff"
        raysSpeed={1}
        lightSpread={0.5}
        rayLength={3}
        followMouse
        mouseInfluence={0.1}
        noiseAmount={0}
        distortion={0}
        pulsating={false}
        fadeDistance={1}
        saturation={1}
        className="custom-rays"
      />
    </div>
  )
}

