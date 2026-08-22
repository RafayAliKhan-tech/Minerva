import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { backgroundMotion } from '../../lib/backgroundMotionState'

const WARM_WHITE = new THREE.Color('#e8e4df')
const SOFT_GLOW = new THREE.Color('#c9c2b8')
const DIM_LINE = new THREE.Color('#8a847c')

/** Horizontal ridges — career paths flowing left → right */
function waveHeight(x, z, time, amplitude) {
  const ridge = Math.sin(z * 1.35 + 0.4) * amplitude
  const travel = Math.sin(x * 0.72 - time * 0.28) * amplitude * 0.28
  const breathe = Math.cos(x * 0.18 + time * 0.16) * amplitude * 0.12
  return ridge + travel + breathe
}

function createWaveGrid(segmentsX, segmentsZ, width, depth) {
  const count = (segmentsX + 1) * (segmentsZ + 1)
  const base = new Float32Array(count * 3)
  let i = 0

  for (let z = 0; z <= segmentsZ; z += 1) {
    for (let x = 0; x <= segmentsX; x += 1) {
      const px = (x / segmentsX - 0.5) * width
      const pz = (z / segmentsZ - 0.5) * depth
      base[i] = px
      base[i + 1] = 0
      base[i + 2] = pz
      i += 3
    }
  }

  return { count, base }
}

function WaveLayer({
  segmentsX,
  segmentsZ,
  width,
  depth,
  amplitude,
  yBase,
  zOffset,
  pointSize,
  opacity,
  driftSpeed,
  fadeEdges,
}) {
  const pointsRef = useRef()
  const { count, base } = useMemo(
    () => createWaveGrid(segmentsX, segmentsZ, width, depth),
    [segmentsX, segmentsZ, width, depth],
  )
  const positions = useMemo(() => new Float32Array(base), [base])

  useFrame(({ clock }) => {
    const mesh = pointsRef.current
    if (!mesh) return

    const attr = mesh.geometry.attributes.position
    const arr = attr.array
    const t = clock.getElapsedTime()
    const scroll = backgroundMotion.scroll
    const mx = backgroundMotion.mouseX

    const drift = scroll * 1.1 - t * driftSpeed

    for (let i = 0; i < count; i += 1) {
      const bi = i * 3
      const x = base[bi]
      const z = base[bi + 2]

      const edgeFade = fadeEdges
        ? THREE.MathUtils.smoothstep(Math.abs(x) / (width * 0.5), 0.55, 1)
        : 1

      if (edgeFade <= 0.02) {
        arr[bi + 1] = -999
        continue
      }

      arr[bi] = x + drift * 0.18 + mx * 0.22
      arr[bi + 1] = yBase + waveHeight(x + drift * 0.12, z, t, amplitude)
      arr[bi + 2] = z + zOffset
    }

    attr.needsUpdate = true
  })

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        color={WARM_WHITE}
        size={pointSize}
        transparent
        opacity={opacity}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

/** Nodes chained along horizontal path lanes */
function PathNetwork() {
  const groupRef = useRef()
  const linesRef = useRef()
  const nodeRefs = useRef([])

  const { lanes, linePairs } = useMemo(() => {
    const laneConfigs = [
      { z: -0.55, y: -0.18, count: 9, xStart: -3.8, xEnd: 3.8 },
      { z: 0, y: -0.08, count: 11, xStart: -4.2, xEnd: 4.2 },
      { z: 0.55, y: 0.02, count: 8, xStart: -3.4, xEnd: 3.4 },
    ]

    const allNodes = []
    const pairs = []

    laneConfigs.forEach((lane, laneIndex) => {
      const laneStart = allNodes.length
      for (let i = 0; i < lane.count; i += 1) {
        const t = i / (lane.count - 1)
        allNodes.push({
          x: THREE.MathUtils.lerp(lane.xStart, lane.xEnd, t),
          y: lane.y,
          z: lane.z,
          lane: laneIndex,
          indexOnLane: i,
        })
      }
      for (let i = 0; i < lane.count - 1; i += 1) {
        pairs.push([laneStart + i, laneStart + i + 1])
      }
    })

    pairs.push([1, 10], [12, 21])

    return { lanes: allNodes, linePairs: pairs }
  }, [])

  const linePositions = useMemo(() => {
    const arr = new Float32Array(linePairs.length * 6)
    linePairs.forEach(([a, b], index) => {
      const offset = index * 6
      arr[offset] = lanes[a].x
      arr[offset + 1] = lanes[a].y
      arr[offset + 2] = lanes[a].z
      arr[offset + 3] = lanes[b].x
      arr[offset + 4] = lanes[b].y
      arr[offset + 5] = lanes[b].z
    })
    return arr
  }, [lanes, linePairs])

  const getNodePosition = (node, t, scroll, drift) => {
    const pulse = Math.sin(t * 0.55 + node.indexOnLane * 0.45 + node.lane * 0.9) * 0.025
    return [
      node.x + drift * 0.16,
      node.y + pulse + scroll * 0.08,
      node.z,
    ]
  }

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const scroll = backgroundMotion.scroll
    const mx = backgroundMotion.mouseX
    const drift = scroll * 1.1 - t * 0.06

    if (groupRef.current) {
      groupRef.current.position.x = mx * 0.14
      groupRef.current.position.y = scroll * 0.12
    }

    nodeRefs.current.forEach((nodeMesh, index) => {
      if (!nodeMesh) return
      const [x, y, z] = getNodePosition(lanes[index], t, scroll, drift)
      nodeMesh.position.set(x, y, z)
    })

    const lines = linesRef.current
    if (!lines) return

    const attr = lines.geometry.attributes.position
    const arr = attr.array

    linePairs.forEach(([a, b], index) => {
      const offset = index * 6
      const [ax, ay, az] = getNodePosition(lanes[a], t, scroll, drift)
      const [bx, by, bz] = getNodePosition(lanes[b], t, scroll, drift)
      arr[offset] = ax
      arr[offset + 1] = ay
      arr[offset + 2] = az
      arr[offset + 3] = bx
      arr[offset + 4] = by
      arr[offset + 5] = bz
    })

    attr.needsUpdate = true
  })

  return (
    <group ref={groupRef} position={[0, -0.42, 0.15]}>
      {lanes.map((node, index) => (
        <mesh
          key={`path-node-${index}`}
          ref={(el) => {
            nodeRefs.current[index] = el
          }}
          position={[node.x, node.y, node.z]}
        >
          <sphereGeometry args={[0.014 + (index % 4 === 0 ? 0.008 : 0), 8, 8]} />
          <meshBasicMaterial
            color={index % 4 === 0 ? SOFT_GLOW : WARM_WHITE}
            transparent
            opacity={index % 4 === 0 ? 0.62 : 0.38}
            depthWrite={false}
          />
        </mesh>
      ))}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePairs.length * 2}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={DIM_LINE} transparent opacity={0.16} depthWrite={false} />
      </lineSegments>
    </group>
  )
}

/** Subtle horizontal horizon guides */
function HorizonGuides() {
  const groupRef = useRef()

  const lines = useMemo(() => {
    const widths = [8.5, 7.2, 5.8]
    return widths.map((width, i) => {
      const y = 0.35 + i * 0.22
      const z = -1.4 - i * 0.25
      return new Float32Array([
        -width * 0.5, y, z,
        width * 0.5, y, z,
      ])
    })
  }, [])

  useFrame(() => {
    if (!groupRef.current) return
    const scroll = backgroundMotion.scroll
    const mx = backgroundMotion.mouseX
    groupRef.current.position.x = mx * 0.08 + scroll * 0.35
    groupRef.current.position.y = scroll * 0.06 - 0.05
  })

  return (
    <group ref={groupRef}>
      {lines.map((positions, index) => (
        <line key={`horizon-${index}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={positions}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={DIM_LINE} transparent opacity={0.08 - index * 0.015} depthWrite={false} />
        </line>
      ))}
    </group>
  )
}

/** Milestone glows spaced along the main path */
function PathMilestones() {
  const groupRef = useRef()

  const milestones = useMemo(
    () =>
      [-2.8, -1.2, 0.4, 1.8, 3.1].map((x, i) => ({
        x,
        y: -0.05 + (i % 2) * 0.06,
        z: (i % 3 - 1) * 0.18,
        phase: i * 1.2,
      })),
    [],
  )

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    const scroll = backgroundMotion.scroll
    const mx = backgroundMotion.mouseX
    const drift = scroll * 1.1 - t * 0.06

    groupRef.current.position.x = mx * 0.1 + drift * 0.16

    groupRef.current.children.forEach((child, i) => {
      const m = milestones[i]
      const pulse = 0.7 + Math.sin(t * 0.5 + m.phase) * 0.3
      child.position.set(m.x, m.y + Math.sin(t * 0.35 + m.phase) * 0.03, m.z)
      child.scale.setScalar(pulse)
    })
  })

  return (
    <group ref={groupRef} position={[0, -0.38, 0.2]}>
      {milestones.map((m, index) => (
        <mesh key={`milestone-${index}`} position={[m.x, m.y, m.z]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial
            color={SOFT_GLOW}
            transparent
            opacity={0.42}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}

function SceneRig() {
  const rigRef = useRef()

  useFrame(({ camera }) => {
    const scroll = backgroundMotion.scroll
    const mx = backgroundMotion.mouseX
    const my = backgroundMotion.mouseY

    const targetX = mx * 0.28 + scroll * 0.45
    const targetY = 1.65 + my * 0.08 + scroll * 0.18
    const targetZ = 6.4

    camera.position.x += (targetX - camera.position.x) * 0.035
    camera.position.y += (targetY - camera.position.y) * 0.035
    camera.position.z += (targetZ - camera.position.z) * 0.035
    camera.lookAt(scroll * 0.35, -0.22, 0)

    if (rigRef.current) {
      rigRef.current.position.x = scroll * 0.55
      rigRef.current.rotation.y = mx * 0.018
    }
  })

  return (
    <group ref={rigRef} rotation={[-0.22, 0, 0]}>
      <WaveLayer
        segmentsX={88}
        segmentsZ={32}
        width={11}
        depth={3.2}
        amplitude={0.14}
        yBase={-0.62}
        zOffset={0}
        pointSize={0.02}
        opacity={0.3}
        driftSpeed={0.05}
        fadeEdges
      />
      <WaveLayer
        segmentsX={72}
        segmentsZ={24}
        width={9.5}
        depth={2.6}
        amplitude={0.09}
        yBase={-0.78}
        zOffset={-0.35}
        pointSize={0.015}
        opacity={0.16}
        driftSpeed={0.035}
        fadeEdges
      />
      <HorizonGuides />
      <PathNetwork />
      <PathMilestones />
    </group>
  )
}

export default function CareerPathScene() {
  return (
    <>
      <color attach="background" args={['#1c1b1a']} />
      <fog attach="fog" args={['#1c1b1a', 5, 13]} />
      <ambientLight intensity={0.32} color="#e8e4df" />
      <directionalLight position={[4, 3, 2]} intensity={0.22} color="#d8d2ca" />
      <SceneRig />
    </>
  )
}
