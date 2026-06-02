"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import About from "./About";
import BootSequence from "./BootSequence";
import Contact from "./Contact";
import FixedExhibit from "./FixedExhibit";
import Hero from "./Hero";
import Skills from "./Skills";

const FeaturedProjects = dynamic(() => import("./FeaturedProjects"), {
  loading: () => (
    <section id="projects" className="section-shell">
      <div className="section-inner">
        <div className="panel p-10 text-center font-display text-xs uppercase tracking-[0.28em] text-exhibit-muted">
          Loading exhibit archive...
        </div>
      </div>
    </section>
  ),
  ssr: false,
});

const RepositoryArchive = dynamic(() => import("./RepositoryArchive"), {
  loading: () => (
    <section id="repos" className="section-shell">
      <div className="section-inner">
        <div className="panel p-10 text-center font-display text-xs uppercase tracking-[0.28em] text-exhibit-muted">
          Loading repository archive...
        </div>
      </div>
    </section>
  ),
  ssr: false,
});

const navItems = [
  ["Projects", "#projects"],
  ["Repos", "#repos"],
  ["Skills", "#skills"],
  ["About", "#about"],
  ["Contact", "#contact"],
];

type ThemeMode = "dark" | "light";

type AudioEngine = {
  ambient?: OscillatorNode;
  context: AudioContext;
  master: GainNode;
};

type AudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

function useExhibitAudio(enabled: boolean) {
  const engineRef = useRef<AudioEngine | null>(null);

  const ensureAudio = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!engineRef.current) {
      const audioWindow = window as AudioWindow;
      const AudioContextConstructor = audioWindow.AudioContext || audioWindow.webkitAudioContext;
      if (!AudioContextConstructor) return null;
      const context = new AudioContextConstructor();
      const master = context.createGain();
      master.gain.value = 0.18;
      master.connect(context.destination);
      engineRef.current = { context, master };
    }

    return engineRef.current;
  }, []);

  const startAmbient = useCallback(() => {
    if (!enabled) return;
    const engine = ensureAudio();
    if (!engine || engine.ambient) return;

    const oscillator = engine.context.createOscillator();
    const humGain = engine.context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 46;
    humGain.gain.value = 0.18;
    oscillator.connect(humGain);
    humGain.connect(engine.master);
    oscillator.start();
    engine.ambient = oscillator;
  }, [enabled, ensureAudio]);

  const playTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = "triangle") => {
      if (!enabled) return;
      const engine = ensureAudio();
      if (!engine) return;

      void engine.context.resume();
      const now = engine.context.currentTime;
      const oscillator = engine.context.createOscillator();
      const gain = engine.context.createGain();

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, now);
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(24, frequency * 0.55), now + duration);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.28, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      oscillator.connect(gain);
      gain.connect(engine.master);
      oscillator.start(now);
      oscillator.stop(now + duration + 0.03);
    },
    [enabled, ensureAudio],
  );

  useEffect(() => {
    if (enabled) {
      startAmbient();
      return;
    }

    engineRef.current?.ambient?.stop();
    if (engineRef.current) engineRef.current.ambient = undefined;
  }, [enabled, startAmbient]);

  useEffect(() => {
    if (!enabled) return;

    const resume = () => {
      const engine = ensureAudio();
      void engine?.context.resume();
      startAmbient();
    };

    window.addEventListener("pointerdown", resume, { once: true });
    return () => window.removeEventListener("pointerdown", resume);
  }, [enabled, ensureAudio, startAmbient]);

  return { playTone, startAmbient };
}

export default function PortfolioShell() {
  const reduceMotion = useReducedMotion();
  const [bootComplete, setBootComplete] = useState(false);
  const [minimumElapsed, setMinimumElapsed] = useState(false);
  const [robotReady, setRobotReady] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");
  const { playTone, startAmbient } = useExhibitAudio(soundEnabled);

  const robotFinish = themeMode === "light" ? "light" : "dark";
  const canReveal = reduceMotion || (minimumElapsed && robotReady);

  const toggleSound = useCallback(() => {
    setSoundEnabled((current) => !current);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeMode((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const handleBootStage = useCallback(
    (stage: number) => {
      if (stage === 0) playTone(144, 0.08, "sine");
      if (stage === 1) playTone(220, 0.18, "sawtooth");
      if (stage === 2) playTone(480, 0.06, "square");
    },
    [playTone],
  );

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("portfolio-theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setThemeMode(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
    window.localStorage.setItem("portfolio-theme", themeMode);
  }, [themeMode]);

  useEffect(() => {
    if (reduceMotion) {
      setMinimumElapsed(true);
      setRobotReady(true);
      return;
    }

    document.documentElement.classList.add("boot-lock");
    const timer = window.setTimeout(() => setMinimumElapsed(true), 3400);
    return () => {
      window.clearTimeout(timer);
      document.documentElement.classList.remove("boot-lock");
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (!canReveal) return;

    setBootComplete(true);
    document.documentElement.classList.remove("boot-lock");
    startAmbient();
  }, [canReveal, startAmbient]);

  const headerClass = useMemo(
    () =>
      `portfolio-nav fixed left-0 right-0 top-0 z-30 border-b border-white/10 bg-exhibit-dark/72 px-5 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl md:px-14 ${
        bootComplete ? "is-ready" : ""
      }`,
    [bootComplete],
  );

  return (
    <>
      <AnimatePresence>
        {!bootComplete && !reduceMotion ? (
          <BootSequence
            finish={robotFinish}
            isReady={bootComplete}
            onRobotReady={() => setRobotReady(true)}
            onStage={handleBootStage}
            onToggleSound={toggleSound}
            soundEnabled={soundEnabled}
          />
        ) : null}
      </AnimatePresence>

      {bootComplete ? <FixedExhibit finish={robotFinish} /> : null}

      <header className={headerClass}>
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-5">
          <a
            className="font-display text-sm font-bold uppercase tracking-[0.24em] text-exhibit-red transition hover:text-[var(--text-primary)]"
            href="#home"
          >
            ALLURI <span className="text-exhibit-silver">JOEL</span>
          </a>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-7 md:flex">
              {navItems.map(([label, href]) => (
                <a
                  className="font-display text-[0.68rem] font-semibold uppercase tracking-[0.25em] text-exhibit-muted transition hover:text-exhibit-red"
                  href={href}
                  key={href}
                >
                  {label}
                </a>
              ))}
            </div>
            <button
              aria-label="Toggle exhibit theme"
              className="flex h-11 w-11 items-center justify-center border border-exhibit-blue/35 font-display text-lg text-exhibit-silver transition hover:border-exhibit-red hover:text-[var(--text-primary)]"
              onClick={toggleTheme}
              title={themeMode === "dark" ? "Exhibit Light" : "Dark"}
              type="button"
            >
              ◐
            </button>
            <button
              className="hidden h-11 items-center justify-center border border-exhibit-blue/35 px-3 font-display text-[0.62rem] font-bold uppercase tracking-[0.18em] text-exhibit-silver transition hover:border-exhibit-red hover:text-[var(--text-primary)] sm:flex"
              onClick={toggleSound}
              type="button"
            >
              Sound {soundEnabled ? "On" : "Off"}
            </button>
            <a
              className="flex h-11 items-center justify-center border border-exhibit-red/45 px-4 font-display text-[0.68rem] font-bold uppercase tracking-[0.22em] text-exhibit-silver transition-all duration-200 hover:scale-[1.03] hover:border-exhibit-red hover:bg-exhibit-red/10 hover:text-[var(--text-primary)] active:scale-[0.97]"
              download="Alluri_Jeswanth_Joel_Resume.pdf"
              href="/resume/Alluri_Jeswanth_Joel_Resume.pdf"
              title="Download Resume"
            >
              Resume
            </a>
          </div>
        </nav>
      </header>

      {bootComplete ? (
        <motion.main
          animate={{ opacity: 1 }}
          className="museum-flow portfolio-reveal relative z-10"
          initial={{ opacity: reduceMotion ? 1 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.45 }}
        >
          <Hero />
          <FeaturedProjects />
          <RepositoryArchive />
          <Skills />
          <About />
          <Contact />
        </motion.main>
      ) : null}

    </>
  );
}
