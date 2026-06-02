"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { IntroRobotCanvas } from "./FixedExhibit";

type BootSequenceProps = {
  finish: "dark" | "light";
  isReady: boolean;
  onRobotReady: () => void;
  onStage: (stage: number) => void;
  onToggleSound: () => void;
  soundEnabled: boolean;
};

const messages = ["LOADING ENVIRONMENT", "SYNCING MOTION", "CALIBRATING SYSTEMS", "READY"];

export default function BootSequence({
  finish,
  isReady,
  onRobotReady,
  onStage,
  onToggleSound,
  soundEnabled,
}: BootSequenceProps) {
  const reduceMotion = useReducedMotion();
  const [messageIndex, setMessageIndex] = useState(0);
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const message = useMemo(() => messages[messageIndex], [messageIndex]);

  useEffect(() => {
    const messageTimer = window.setInterval(() => {
      setMessageIndex((current) => Math.min(current + 1, messages.length - 1));
    }, 420);

    return () => window.clearInterval(messageTimer);
  }, []);

  useEffect(() => {
    const startedAt = performance.now();
    let frame = 0;

    const tick = () => {
      const elapsed = performance.now() - startedAt;
      const nextProgress = Math.min(100, (elapsed / 3200) * 100);

      setProgress(nextProgress);
      if (nextProgress < 40) setPhase(0);
      if (nextProgress >= 40 && nextProgress < 85) setPhase(1);
      if (nextProgress >= 85) setPhase(2);
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    onStage(phase);
  }, [onStage, phase]);

  if (reduceMotion || isReady) return null;

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="boot-sequence fixed inset-0 z-[80] grid min-h-screen place-items-center overflow-hidden bg-exhibit-dark text-exhibit-chrome"
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      initial={{ opacity: 1 }}
    >
      <motion.div
        animate={{ opacity: phase === 0 ? 0.18 : 0.5 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(179,0,34,0.18),transparent_34rem),radial-gradient(circle_at_50%_18%,rgba(26,74,158,0.18),transparent_30rem)]"
      />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />

      <motion.div
        animate={{ opacity: phase === 0 ? 1 : 0, y: phase === 0 ? 0 : -24 }}
        className="relative z-10 flex w-[min(86vw,520px)] flex-col items-center text-center"
        transition={{ duration: 0.45 }}
      >
        <p className="font-display text-[clamp(1.6rem,4vw,3.2rem)] font-bold uppercase tracking-[0.18em] text-exhibit-chrome">
          Engineering Exhibit
        </p>
        <p className="mt-3 font-display text-xs font-semibold uppercase tracking-[0.34em] text-exhibit-red">
          Initializing
        </p>
        <div className="mt-8 grid h-1 w-full grid-cols-12 gap-1">
          {Array.from({ length: 12 }).map((_, index) => (
            <span
              className="h-full bg-exhibit-red/25"
              key={index}
              style={{ opacity: progress / 40 > index / 12 ? 1 : 0.25 }}
            />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 min-h-5 font-display text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-exhibit-silver/70"
            exit={{ opacity: 0, y: -8 }}
            initial={{ opacity: 0, y: 8 }}
            key={message}
          >
            {message}
          </motion.p>
        </AnimatePresence>
      </motion.div>

      <motion.div
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
        className="absolute inset-0 z-10"
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-black/35" />
        <motion.div
          animate={{ opacity: [0.35, 0.75, 0.35] }}
          className="absolute bottom-[12vh] left-1/2 h-28 w-[min(42vw,520px)] -translate-x-1/2 rounded-[50%] bg-exhibit-red/20 blur-3xl"
          transition={{ duration: 1.4, repeat: Infinity }}
        />
        <IntroRobotCanvas finish={finish} onReady={onRobotReady} />
      </motion.div>

      <motion.div
        animate={{ opacity: phase === 2 ? 1 : 0 }}
        className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-r from-exhibit-dark via-transparent to-transparent"
        transition={{ duration: 0.5 }}
      />

      <button
        className="absolute right-5 top-5 z-30 border border-exhibit-blue/35 px-3 py-2 font-display text-[0.65rem] font-bold uppercase tracking-[0.2em] text-exhibit-silver transition hover:border-exhibit-red hover:text-white"
        onClick={onToggleSound}
        type="button"
      >
        Sound {soundEnabled ? "On" : "Off"}
      </button>
    </motion.div>
  );
}
