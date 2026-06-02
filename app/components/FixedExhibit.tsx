"use client";

import { Environment } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { Suspense, useMemo, useRef, useEffect } from "react";
import type { Group } from "three";
import { Color, MathUtils } from "three";
import { audio } from "../lib/audio";

type MechPose = {
  cameraY: number;
  cameraZ: number;
  figureY: number;
  rotationY: number;
};

type BlockProps = {
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  finish?: RobotFinish;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale: [number, number, number];
};

type RobotFinish = "dark" | "light";

type RobotProps = {
  finish?: RobotFinish;
  intro?: boolean;
  onReady?: () => void;
};

const pose: MechPose = {
  cameraY: -0.2,
  cameraZ: 9.8,
  figureY: -0.5,
  rotationY: -0.08,
};

const colors = {
  red: "#b30022",
  blue: "#0a1b44",
  chrome: "#9aa0a8",
  black: "#151515",
};

function Block({
  color,
  emissive,
  emissiveIntensity = 0,
  finish = "dark",
  position,
  rotation = [0, 0, 0],
  scale,
}: BlockProps) {
  const isLight = finish === "light";

  return (
    <mesh castShadow receiveShadow position={position} rotation={rotation} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshPhysicalMaterial
        clearcoat={isLight ? 0.12 : 0.35}
        clearcoatRoughness={isLight ? 0.42 : 0.2}
        color={color}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        envMapIntensity={isLight ? 0.34 : 0.85}
        metalness={isLight ? 0.45 : 0.85}
        roughness={isLight ? 0.58 : 0.28}
      />
    </mesh>
  );
}

function Joint({ finish, position, scale }: Pick<BlockProps, "finish" | "position" | "scale">) {
  return <Block color={colors.black} finish={finish} position={position} scale={scale} />;
}

function HeroicMech({ finish = "dark", intro = false }: RobotProps) {
  const groupRef = useRef<Group>(null);
  const visorMaterial = useMemo(
    () => (
      <meshPhysicalMaterial
        color="#d9f2ff"
        emissive={new Color("#7fd7ff")}
        emissiveIntensity={1.9}
        metalness={0.25}
        roughness={0.12}
      />
    ),
    [],
  );

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (intro) {
      const elapsed = state.clock.getElapsedTime();
      const progress = MathUtils.clamp(elapsed / 1.8, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      groupRef.current.position.y = MathUtils.lerp(-2.25, -0.5, eased);
      groupRef.current.rotation.y = MathUtils.lerp(MathUtils.degToRad(60), 0, eased);
      groupRef.current.scale.setScalar(MathUtils.lerp(0.54, 1.34, eased));
    } else {
      groupRef.current.position.y = MathUtils.damp(groupRef.current.position.y, pose.figureY, 4.2, delta);
      groupRef.current.rotation.y = MathUtils.damp(groupRef.current.rotation.y, pose.rotationY, 3.8, delta);
      groupRef.current.scale.setScalar(MathUtils.damp(groupRef.current.scale.x, 1.34, 4.2, delta));
    }

    state.camera.position.y = MathUtils.damp(state.camera.position.y, pose.cameraY, 3.4, delta);
    state.camera.position.z = MathUtils.damp(state.camera.position.z, pose.cameraZ, 3.4, delta);
    state.camera.lookAt(0, -0.1, 0);
  });

  return (
    <group
      ref={groupRef}
      name="heroic-engineering-mech"
      position={[0, intro ? -2.25 : pose.figureY, 0]}
      rotation={[0, intro ? MathUtils.degToRad(60) : pose.rotationY, 0]}
      scale={intro ? 0.54 : 1.34}
    >
      <group name="spine">
        <Joint finish={finish} position={[0, 0.55, -0.04]} scale={[0.36, 1.7, 0.28]} />
        <Block color={colors.blue} finish={finish} position={[0, -0.42, 0.02]} scale={[0.7, 0.52, 0.38]} />
        <Block color={colors.chrome} finish={finish} position={[0, -0.03, 0.24]} scale={[0.26, 0.98, 0.16]} />
      </group>

      <group name="layered-chest">
        <Block color={colors.red} finish={finish} position={[-0.46, 0.72, 0.04]} rotation={[0, 0, 0.13]} scale={[0.82, 1.02, 0.42]} />
        <Block color={colors.red} finish={finish} position={[0.46, 0.72, 0.04]} rotation={[0, 0, -0.13]} scale={[0.82, 1.02, 0.42]} />
        <Block color={colors.blue} finish={finish} position={[0, 0.38, 0.28]} scale={[0.82, 0.46, 0.22]} />
        <Block color={colors.chrome} finish={finish} position={[0, 0.88, 0.31]} scale={[1.02, 0.18, 0.16]} />
        <Block color={colors.black} finish={finish} position={[0, 0.16, 0.18]} scale={[0.58, 0.22, 0.24]} />
      </group>

      <group name="head">
        <Block color={colors.black} finish={finish} position={[0, 1.54, 0]} scale={[0.62, 0.42, 0.4]} />
        <Block color={colors.chrome} finish={finish} position={[0, 1.76, -0.02]} scale={[0.72, 0.22, 0.36]} />
        <Block color={colors.red} finish={finish} position={[-0.43, 1.58, -0.02]} rotation={[0, 0, -0.22]} scale={[0.18, 0.5, 0.25]} />
        <Block color={colors.red} finish={finish} position={[0.43, 1.58, -0.02]} rotation={[0, 0, 0.22]} scale={[0.18, 0.5, 0.25]} />
        <mesh position={[0, 1.53, 0.23]} scale={[0.5, 0.055, 0.015]}>
          <boxGeometry args={[1, 1, 1]} />
          {visorMaterial}
        </mesh>
      </group>

      <group name="left-arm">
        <Block color={colors.red} finish={finish} position={[-1.2, 0.86, 0]} rotation={[0, 0, 0.12]} scale={[0.68, 0.3, 0.38]} />
        <Joint finish={finish} position={[-1.03, 0.54, -0.02]} scale={[0.24, 0.36, 0.24]} />
        <Block color={colors.blue} finish={finish} position={[-1.2, 0.1, 0]} rotation={[0, 0, -0.08]} scale={[0.34, 0.84, 0.34]} />
        <Joint finish={finish} position={[-1.22, -0.42, 0]} scale={[0.28, 0.24, 0.26]} />
        <Block color={colors.red} finish={finish} position={[-1.16, -0.85, 0.04]} rotation={[0, 0, 0.08]} scale={[0.38, 0.78, 0.34]} />
        <Block color={colors.chrome} finish={finish} position={[-1.15, -1.32, 0.02]} scale={[0.34, 0.24, 0.28]} />
      </group>

      <group name="right-arm">
        <Block color={colors.red} finish={finish} position={[1.2, 0.86, 0]} rotation={[0, 0, -0.12]} scale={[0.68, 0.3, 0.38]} />
        <Joint finish={finish} position={[1.03, 0.54, -0.02]} scale={[0.24, 0.36, 0.24]} />
        <Block color={colors.blue} finish={finish} position={[1.2, 0.1, 0]} rotation={[0, 0, 0.08]} scale={[0.34, 0.84, 0.34]} />
        <Joint finish={finish} position={[1.22, -0.42, 0]} scale={[0.28, 0.24, 0.26]} />
        <Block color={colors.red} finish={finish} position={[1.16, -0.85, 0.04]} rotation={[0, 0, -0.08]} scale={[0.38, 0.78, 0.34]} />
        <Block color={colors.chrome} finish={finish} position={[1.15, -1.32, 0.02]} scale={[0.34, 0.24, 0.28]} />
      </group>

      <group name="left-leg">
        <Joint finish={finish} position={[-0.34, -0.76, -0.02]} scale={[0.3, 0.34, 0.28]} />
        <Block color={colors.black} finish={finish} position={[-0.42, -1.22, 0]} rotation={[0, 0, -0.04]} scale={[0.42, 0.94, 0.36]} />
        <Block color={colors.chrome} finish={finish} position={[-0.42, -1.2, 0.24]} scale={[0.18, 0.76, 0.12]} />
        <Joint finish={finish} position={[-0.46, -1.86, 0]} scale={[0.34, 0.24, 0.28]} />
        <Block color={colors.blue} finish={finish} position={[-0.48, -2.45, 0.02]} rotation={[0, 0, -0.03]} scale={[0.44, 1.12, 0.36]} />
        <Block color={colors.red} finish={finish} position={[-0.48, -2.36, 0.25]} scale={[0.2, 0.72, 0.14]} />
        <Block color={colors.black} finish={finish} position={[-0.5, -3.08, 0.16]} scale={[0.72, 0.24, 0.58]} />
      </group>

      <group name="right-leg">
        <Joint finish={finish} position={[0.34, -0.76, -0.02]} scale={[0.3, 0.34, 0.28]} />
        <Block color={colors.black} finish={finish} position={[0.42, -1.22, 0]} rotation={[0, 0, 0.04]} scale={[0.42, 0.94, 0.36]} />
        <Block color={colors.chrome} finish={finish} position={[0.42, -1.2, 0.24]} scale={[0.18, 0.76, 0.12]} />
        <Joint finish={finish} position={[0.46, -1.86, 0]} scale={[0.34, 0.24, 0.28]} />
        <Block color={colors.blue} finish={finish} position={[0.48, -2.45, 0.02]} rotation={[0, 0, 0.03]} scale={[0.44, 1.12, 0.36]} />
        <Block color={colors.red} finish={finish} position={[0.48, -2.36, 0.25]} scale={[0.2, 0.72, 0.14]} />
        <Block color={colors.black} finish={finish} position={[0.5, -3.08, 0.16]} scale={[0.72, 0.24, 0.58]} />
      </group>
    </group>
  );
}

function FloorReflection() {
  return (
    <mesh position={[0, -3.24, -0.1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[4.4, 2.4]} />
      <meshBasicMaterial color="#b30022" transparent opacity={0.08} />
    </mesh>
  );
}

function ExhibitScene({ finish = "dark", intro = false }: RobotProps) {
  return (
    <>
      {intro ? <fog attach="fog" args={["#040814", 7.2, 13]} /> : null}
      <ambientLight intensity={intro ? 0.3 : 0.4} />
      <directionalLight castShadow color="#f8f2e8" intensity={3.2} position={[-2.6, 5.2, 4.2]} shadow-mapSize={[1024, 1024]} />
      <directionalLight color="#6db7ff" intensity={1.65} position={[4.2, 2.1, 2.8]} />
      <directionalLight color="#ffffff" intensity={1.2} position={[0, 1.8, 4]} />
      <directionalLight color="#000000" intensity={0.4} position={[0, -2, -1]} />
      <HeroicMech finish={finish} intro={intro} />
      {intro ? <FloorReflection /> : null}
      <Environment preset="warehouse" environmentIntensity={finish === "light" ? 0.3 : 0.55} />
    </>
  );
}

export function IntroRobotCanvas({ finish = "dark", onReady }: Pick<RobotProps, "finish" | "onReady">) {
  return (
    <Canvas
      camera={{ fov: 30, position: [0, pose.cameraY, pose.cameraZ] }}
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true }}
      onCreated={onReady}
      shadows
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <ExhibitScene finish={finish} intro />
      </Suspense>
    </Canvas>
  );
}

export default function FixedExhibit({ finish = "dark" }: Pick<RobotProps, "finish">) {
  const { scrollYProgress } = useScroll();
  const exhibitX = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.7, 1], ["0vw", "0vw", "-18vw", "-27vw", "-27vw"]);
  const exhibitScale = useTransform(scrollYProgress, [0, 0.2, 0.4, 1], [1, 1, 0.88, 0.88]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.35, 1], [0.98, 0.98, 0.80, 0.68]);
  const y = useTransform(scrollYProgress, [0, 0.7, 1], [-0.5, -0.46, -0.46]);
  const rotateY = useTransform(scrollYProgress, [0, 0.7, 1], [-0.08, -0.08, Math.PI]);
  const cameraY = useTransform(scrollYProgress, [0, 1], [-0.2, -0.12]);
  const cameraZ = useTransform(scrollYProgress, [0, 1], [9.8, 10.3]);

  const lastRotateRef = useRef(-0.08);
  const lastProgressRef = useRef(0);

  useMotionValueEvent(y, "change", (value) => {
    pose.figureY = value;
  });
  useMotionValueEvent(rotateY, "change", (value) => {
    pose.rotationY = value;
    if (Math.abs(value - lastRotateRef.current) > 0.05) {
      lastRotateRef.current = value;
      audio?.play("robotClick", 0.05);
    }
  });
  useMotionValueEvent(cameraY, "change", (value) => {
    pose.cameraY = value;
  });
  useMotionValueEvent(cameraZ, "change", (value) => {
    pose.cameraZ = value;
  });
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (Math.abs(value - lastProgressRef.current) > 0.08) {
      lastProgressRef.current = value;
      audio?.play("robotHydraulic", 0.05);
    }
  });

  useEffect(() => {
    const timer = setInterval(() => {
      if (scrollYProgress.get() < 0.05) {
        audio?.play("robotIdle", 0.01);
      }
    }, 8000);
    return () => clearInterval(timer);
  }, [scrollYProgress]);

  return (
    <motion.div
      aria-hidden="true"
      className="fixed bottom-0 right-[clamp(-40px,2vw,40px)] z-0 h-screen w-[min(42vw,760px)] overflow-visible pointer-events-none max-lg:hidden"
      style={{
        filter: "drop-shadow(0 0 26px rgba(109, 183, 255, 0.2)) drop-shadow(0 0 18px rgba(179, 0, 34, 0.14))",
        opacity,
        scale: exhibitScale,
        transformOrigin: "bottom center",
        x: exhibitX,
        marginLeft: 24,
      }}
    >
      <Canvas
        camera={{ fov: 30, position: [0, pose.cameraY, pose.cameraZ] }}
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: true }}
        shadows
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ExhibitScene finish={finish} />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}
