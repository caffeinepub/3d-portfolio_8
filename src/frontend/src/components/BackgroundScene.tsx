import { Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";

interface ParticleProps {
  position: [number, number, number];
  speed: number;
  size: number;
  phase: number;
  id: string;
}

function Particle({ position, speed, size, phase }: ParticleProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime * speed + phase;
    meshRef.current.position.set(
      position[0] + Math.cos(t * 0.7) * 0.25,
      position[1] + Math.sin(t) * 0.35,
      position[2],
    );
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[size, 6, 6]} />
      <meshBasicMaterial color="#00e5ff" transparent opacity={0.55} />
    </mesh>
  );
}

interface TorusProps {
  position: [number, number, number];
  color: string;
  scale: number;
  rotSpeed: [number, number, number];
}

function FloatingTorus({ position, color, scale, rotSpeed }: TorusProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * rotSpeed[0];
    meshRef.current.rotation.y += delta * rotSpeed[1];
    meshRef.current.rotation.z += delta * rotSpeed[2];
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <torusGeometry args={[1, 0.025, 16, 80]} />
      <meshBasicMaterial color={color} transparent opacity={0.22} />
    </mesh>
  );
}

function IcosahedronWireframe({
  position,
}: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.08;
    meshRef.current.rotation.y += delta * 0.12;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <icosahedronGeometry args={[1.5, 0]} />
      <meshBasicMaterial color="#00ffaa" transparent opacity={0.12} wireframe />
    </mesh>
  );
}

function CameraDrift() {
  useFrame((state) => {
    state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.06) * 0.7;
    state.camera.position.y = Math.cos(state.clock.elapsedTime * 0.05) * 0.45;
  });
  return null;
}

const PARTICLES: ParticleProps[] = Array.from({ length: 38 }, (_, i) => ({
  id: `particle-${i}`,
  position: [
    (((i * 137.5) % 22) - 11) as number,
    (((i * 93.7) % 16) - 8) as number,
    (-(i % 8) - 2) as number,
  ] as [number, number, number],
  speed: 0.18 + (i % 5) * 0.07,
  size: 0.025 + (i % 4) * 0.015,
  phase: i * 0.82,
}));

function Scene() {
  return (
    <>
      <CameraDrift />
      <Stars
        radius={150}
        depth={60}
        count={4500}
        factor={3}
        saturation={0}
        fade
        speed={0.4}
      />
      {PARTICLES.map((p) => (
        <Particle key={p.id} {...p} />
      ))}
      <FloatingTorus
        position={[6, 4, -5]}
        color="#00e5ff"
        scale={3.5}
        rotSpeed={[0.1, 0.14, 0.06]}
      />
      <FloatingTorus
        position={[-7, -3, -7]}
        color="#0055ff"
        scale={4.5}
        rotSpeed={[0.06, 0.1, 0.13]}
      />
      <FloatingTorus
        position={[1, -6, -9]}
        color="#00ffaa"
        scale={5}
        rotSpeed={[0.12, 0.07, 0.09]}
      />
      <IcosahedronWireframe position={[-4, 5, -6]} />
      <IcosahedronWireframe position={[7, -5, -8]} />
      <ambientLight intensity={0.15} />
      <pointLight position={[3, 3, 5]} intensity={3} color="#00e5ff" />
      <pointLight position={[-5, -3, -2]} intensity={1.5} color="#0044ff" />
    </>
  );
}

export function BackgroundScene() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 65 }}
        gl={{ antialias: false }}
        dpr={[1, 1.5]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
