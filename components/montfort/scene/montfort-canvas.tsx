"use client"

import { Suspense, useEffect, type RefObject } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import gsap from "gsap"
import TerrainScene from "./terrain-scene"
import type { SceneBridge } from "./bridge"

interface MontfortCanvasProps {
  bridge: RefObject<SceneBridge>
}

/* Master-timeline ranges in which the WebGL scene is on screen. Outside them nothing is rendered. */
const ACTIVE_RANGES: [number, number][] = [[66, 82]]

/* Renders on demand: only while the timeline playhead is inside an active range. */
function Driver({ bridge }: MontfortCanvasProps) {
  const invalidate = useThree((s) => s.invalidate)

  useEffect(() => {
    const tick = (): void => {
      const t = bridge.current.time
      if (ACTIVE_RANGES.some(([from, to]) => t >= from && t <= to)) invalidate()
    }
    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
    }
  }, [bridge, invalidate])

  return null
}

export default function MontfortCanvas({ bridge }: MontfortCanvasProps) {
  return (
    <Canvas
      frameloop="demand"
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 45, near: 0.1, far: 80, position: [0, 14, 0.01] }}
      style={{ pointerEvents: "none" }}
    >
      <Suspense fallback={null}>
        <TerrainScene bridge={bridge} />
      </Suspense>
      <Driver bridge={bridge} />
    </Canvas>
  )
}

