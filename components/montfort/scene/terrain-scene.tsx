"use client"

import { useEffect, useMemo, useRef, type RefObject } from "react"
import { useFrame } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import * as THREE from "three"
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js"
import type { SceneBridge } from "./bridge"

interface TerrainSceneProps {
  bridge: RefObject<SceneBridge>
}

interface CloudPuff {
  position: [number, number, number]
  scale: number
  opacity: number
  rotation: number
}

const TERRAIN_SRC = "/montfort/terrain_map.jpg"
/* Source image is 1376x768; the ground keeps that aspect ratio. */
const ASPECT = 768 / 1376
const WIDTH = 26
const DEPTH = WIDTH * ASPECT
const SEG_X = 320
const SEG_Z = Math.round(SEG_X * ASPECT)
/* Brightness below this is treated as water (ocean, bays, rivers). */
const WATER_LUMA = 0.27
const RELIEF = 1.1
const FOG = "#e9eef2"
/* Same airplane path as the 2D fallback icon (24x24 viewBox). */
const PLANE_PATH =
  "M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"

/* Camera descent keyframes, mapped onto master timeline 69 → 81. */
const CAM_FROM = new THREE.Vector3(0, 14, 0.01)
const CAM_TO = new THREE.Vector3(0.4, 4.8, 3.4)
const LOOK_FROM = new THREE.Vector3(0, 0, 0)
const LOOK_TO = new THREE.Vector3(0.2, 0, -1)
/* Plane flight path, mapped onto master timeline 70 → 80. */
const FLY_FROM = new THREE.Vector3(-5.5, 2.4, 2.8)
const FLY_TO = new THREE.Vector3(5.5, 2.4, -2.8)

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v))
const smooth = (from: number, to: number, v: number): number => {
  const x = clamp01((v - from) / (to - from))
  return x * x * (3 - 2 * x)
}

/* Height field from the map's brightness: ridges are bright, water is dark. Blurred to avoid spiky noise. */
function buildHeights(image: HTMLImageElement, cols: number, rows: number): Float32Array {
  const out = new Float32Array(cols * rows)
  const canvas = document.createElement("canvas")
  canvas.width = cols
  canvas.height = rows
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (!ctx) return out
  ctx.filter = "blur(1.5px)"
  /* Overdraw slightly so the blur doesn't darken (and sink) the borders. */
  ctx.drawImage(image, -4, -4, cols + 8, rows + 8)
  const data = ctx.getImageData(0, 0, cols, rows).data
  for (let i = 0; i < cols * rows; i++) {
    const l = (0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2]) / 255
    out[i] = l < WATER_LUMA ? -0.06 : 0.04 + Math.pow(smooth(WATER_LUMA, 0.75, l), 1.3) * RELIEF
  }
  return out
}

/* Soft cloud puff drawn procedurally, so no extra asset is needed. */
function makeCloudTexture(): THREE.CanvasTexture {
  const size = 256
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")
  if (ctx) {
    for (let i = 0; i < 46; i++) {
      const angle = Math.random() * Math.PI * 2
      const dist = Math.random() * size * 0.22
      const x = size / 2 + Math.cos(angle) * dist * 1.3
      const y = size / 2 + Math.sin(angle) * dist * 0.7
      const r = size * (0.1 + Math.random() * 0.16)
      const g = ctx.createRadialGradient(x, y, 0, x, y, r)
      g.addColorStop(0, "rgba(255, 255, 255, 0.16)")
      g.addColorStop(1, "rgba(255, 255, 255, 0)")
      ctx.fillStyle = g
      ctx.fillRect(0, 0, size, size)
    }
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/* Extruded airplane built from the SVG icon path. Nose points to -Z, wings lie flat on XZ. */
function makePlaneGeometry(): THREE.BufferGeometry {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${PLANE_PATH}"/></svg>`
  const data = new SVGLoader().parse(svg)
  const shapes = data.paths.flatMap((path) => SVGLoader.createShapes(path))
  const geometry = new THREE.ExtrudeGeometry(shapes, {
    depth: 1.2,
    bevelEnabled: true,
    bevelThickness: 0.3,
    bevelSize: 0.2,
    bevelSegments: 2,
  })
  geometry.center()
  geometry.scale(0.022, 0.022, 0.022)
  /* The icon is symmetric, so the SVG's flipped Y axis does not mirror anything visible. */
  geometry.rotateX(Math.PI / 2)
  return geometry
}

export default function TerrainScene({ bridge }: TerrainSceneProps) {
  const map = useTexture(TERRAIN_SRC)
  const planeRef = useRef<THREE.Group>(null)
  const planeMatRef = useRef<THREE.MeshStandardMaterial>(null)
  const cloudMats = useRef<(THREE.SpriteMaterial | null)[]>([])
  const cloudSprites = useRef<(THREE.Sprite | null)[]>([])
  const camPos = useMemo(() => new THREE.Vector3(), [])
  const camLook = useMemo(() => new THREE.Vector3(), [])

  const terrainGeometry = useMemo(() => {
    map.colorSpace = THREE.SRGBColorSpace
    map.anisotropy = 8
    map.needsUpdate = true

    const geometry = new THREE.PlaneGeometry(WIDTH, DEPTH, SEG_X, SEG_Z)
    geometry.rotateX(-Math.PI / 2)
    const { image } = map
    if (image instanceof HTMLImageElement) {
      const heights = buildHeights(image, SEG_X + 1, SEG_Z + 1)
      const position = geometry.getAttribute("position")
      for (let i = 0; i < position.count; i++) position.setY(i, heights[i])
      position.needsUpdate = true
      geometry.computeVertexNormals()
    }
    return geometry
  }, [map])

  const planeGeometry = useMemo(() => makePlaneGeometry(), [])
  const cloudTexture = useMemo(() => makeCloudTexture(), [])
  const puffs = useMemo<CloudPuff[]>(
    () =>
      Array.from({ length: 14 }, () => ({
        position: [(Math.random() - 0.5) * 16, 6 + Math.random() * 5.5, (Math.random() - 0.5) * 10],
        scale: 4 + Math.random() * 4,
        opacity: 0.5 + Math.random() * 0.35,
        rotation: Math.random() * Math.PI * 2,
      })),
    [],
  )

  useEffect(() => {
    return () => {
      terrainGeometry.dispose()
      planeGeometry.dispose()
      cloudTexture.dispose()
    }
  }, [terrainGeometry, planeGeometry, cloudTexture])

  useFrame((state) => {
    const { time: t, camX, camY } = bridge.current
    const elapsed = state.clock.elapsedTime

    /* Camera: straight-down from altitude, descending and tilting toward the horizon. */
    const u = smooth(69, 81, t)
    camPos.lerpVectors(CAM_FROM, CAM_TO, u)
    camLook.lerpVectors(LOOK_FROM, LOOK_TO, u)
    camPos.x += camX * 0.4 + Math.sin(elapsed * 0.21) * 0.06
    camPos.y -= camY * 0.25
    camPos.z += Math.sin(elapsed * 0.17 + 1.3) * 0.05
    state.camera.position.copy(camPos)
    state.camera.lookAt(camLook)

    /* Cloud puffs fade as the camera passes through them, instead of clipping. */
    cloudSprites.current.forEach((sprite, i) => {
      const mat = cloudMats.current[i]
      if (!sprite || !mat) return
      const d = sprite.position.distanceTo(camPos)
      mat.opacity = puffs[i].opacity * smooth(0.6, 2.8, d)
    })

    /* Airplane: crosses the map, banking gently, and casts a real shadow on the relief. */
    const plane = planeRef.current
    const planeMat = planeMatRef.current
    if (plane && planeMat) {
      const alpha = smooth(71.5, 73, t) * (1 - smooth(78, 80, t))
      plane.visible = alpha > 0.01
      planeMat.opacity = alpha
      const p = clamp01((t - 70) / 10)
      plane.position.lerpVectors(FLY_FROM, FLY_TO, p)
      plane.position.y += Math.sin(p * Math.PI) * 0.4
      const yaw = Math.atan2(-(FLY_TO.x - FLY_FROM.x), -(FLY_TO.z - FLY_FROM.z))
      plane.rotation.set(Math.sin(p * Math.PI) * -0.06, yaw + Math.sin(p * Math.PI * 2) * 0.12, Math.sin(p * Math.PI * 2) * 0.28)
    }
  })

  return (
    <>
      <color attach="background" args={[FOG]} />
      <fogExp2 attach="fog" args={[FOG, 0.04]} />

      <hemisphereLight args={["#dfe7ef", "#2c333a", 0.7]} />
      <directionalLight
        position={[-7, 9, 5]}
        intensity={2.4}
        color="#fff0dc"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
      />

      <mesh geometry={terrainGeometry} castShadow receiveShadow>
        <meshStandardMaterial map={map} roughness={0.92} metalness={0} />
      </mesh>

      {/* Water surface: glossy, so the low sun leaves a glint on the bays and the ocean */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[WIDTH, DEPTH]} />
        <meshStandardMaterial color="#1f2d36" roughness={0.18} metalness={0} transparent opacity={0.6} />
      </mesh>

      <group ref={planeRef} rotation-order="YXZ" visible={false}>
        <mesh geometry={planeGeometry} castShadow>
          <meshStandardMaterial
            ref={planeMatRef}
            color="#f5f6f8"
            roughness={0.35}
            metalness={0.25}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {puffs.map((puff, i) => (
        <sprite
          key={i}
          ref={(s) => {
            cloudSprites.current[i] = s
          }}
          position={puff.position}
          scale={[puff.scale, puff.scale * 0.6, 1]}
        >
          <spriteMaterial
            ref={(m) => {
              cloudMats.current[i] = m
            }}
            map={cloudTexture}
            transparent
            depthWrite={false}
            opacity={puff.opacity}
            rotation={puff.rotation}
          />
        </sprite>
      ))}
    </>
  )
}
