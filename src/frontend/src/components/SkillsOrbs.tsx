import { Html } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useCallback, useRef, useState } from "react";
import * as THREE from "three";

const ORB_COLORS = [
  "#00e5ff",
  "#00ccee",
  "#00aafe",
  "#00ffaa",
  "#00ee88",
  "#00d4ff",
  "#4488ff",
  "#00ffcc",
  "#22ccff",
  "#00ff88",
];

function fibonacciSphere(n: number, r: number): [number, number, number][] {
  const golden = (1 + Math.sqrt(5)) / 2;
  return Array.from({ length: n }, (_, i) => {
    const theta = (2 * Math.PI * i) / golden;
    const phi = Math.acos(1 - (2 * (i + 0.5)) / n);
    return [
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi),
    ] as [number, number, number];
  });
}

interface OrbProps {
  skill: string;
  position: [number, number, number];
  index: number;
  color: string;
}

function SkillOrb({ skill, position, index, color }: OrbProps) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const scaleRef = useRef(1);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime * 0.45 + index * 0.63;
    groupRef.current.position.set(
      position[0] + Math.cos(t * 0.5) * 0.1,
      position[1] + Math.sin(t) * 0.18,
      position[2] + Math.sin(t * 0.7) * 0.08,
    );
    const target = hovered ? 1.35 : 1.0;
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, target, 0.12);
    groupRef.current.scale.setScalar(scaleRef.current);
  });

  const onOver = useCallback(() => {
    setHovered(true);
    document.body.style.cursor = "pointer";
  }, []);

  const onOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = "default";
  }, []);

  return (
    <group ref={groupRef}>
      <mesh onPointerOver={onOver} onPointerOut={onOut}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial
          color={hovered ? "#ffffff" : color}
          emissive={color}
          emissiveIntensity={hovered ? 2.0 : 0.6}
          metalness={0.85}
          roughness={0.08}
        />
      </mesh>
      <Html position={[0, -0.52, 0]} center distanceFactor={7}>
        <span
          style={{
            color: hovered ? "#ffffff" : color,
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            textShadow: hovered
              ? `0 0 16px ${color}, 0 0 30px ${color}`
              : `0 0 8px ${color}`,
            transition: "all 0.25s ease",
            fontFamily: "system-ui, sans-serif",
            pointerEvents: "none",
          }}
        >
          {skill}
        </span>
      </Html>
    </group>
  );
}

function OrbsScene({ skills }: { skills: string[] }) {
  const positions = fibonacciSphere(skills.length, 2.6);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.07;
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[4, 4, 6]} intensity={3} color="#00e5ff" />
      <pointLight position={[-4, -3, 4]} intensity={1.5} color="#0044ff" />
      <pointLight position={[0, 0, 8]} intensity={1} color="#ffffff" />
      <group ref={groupRef}>
        {skills.map((skill, i) => (
          <SkillOrb
            key={skill}
            skill={skill}
            position={positions[i]}
            index={i}
            color={ORB_COLORS[i % ORB_COLORS.length]}
          />
        ))}
      </group>
    </>
  );
}

export function SkillsOrbs({ skills }: { skills: string[] }) {
  return (
    <div className="w-full h-[480px]">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <OrbsScene skills={skills} />
      </Canvas>
    </div>
  );
}
