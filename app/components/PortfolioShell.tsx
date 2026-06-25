"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import About from "./About";
import Certifications from "./Certifications";
import Contact from "./Contact";
import CustomCursor from "./CustomCursor";
import Hero from "./Hero";
import Skills from "./Skills";
import { audio } from "../lib/audio";
import { useAudio } from "./AudioProvider";

const BootSequence = dynamic(() => import("./BootSequence"), { ssr: false });
const FixedExhibit = dynamic(() => import("./FixedExhibit"), { ssr: false });

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
  ["About", "#about"],
  ["Projects", "#projects"],
  ["Knowledge", "#certifications"],
  ["Contact", "#contact"],
];

type ThemeMode = "dark" | "light";

/* ── Section reveal on scroll & Audio Triggers ── */
function useSectionReveal(bootComplete: boolean) {
  useEffect(() => {
    if (!bootComplete || typeof window === "undefined") return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Reveal elements with section-fade-enter
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    document.querySelectorAll(".section-fade-enter").forEach((el) => {
      revealObserver.observe(el);
    });

    // Spacing transitions and Sound triggers for sections
    const sections = document.querySelectorAll("section");
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id === "projects") audio?.play("repoScan");
            if (id === "repos") audio?.play("repoScan", 0.08);
            if (id === "skills") audio?.play("themeShift", 0.08);
            if (id === "about") audio?.play("bootHum", 0.1);
            if (id === "certifications") audio?.play("themeShift", 0.08);
            if (id === "contact") audio?.play("uiHover", 0.12);
            sectionObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    sections.forEach((s) => sectionObserver.observe(s));

    // Footer observer for shutdown sound
    const footer = document.querySelector(".global-footer");
    let footerObserver: IntersectionObserver | null = null;
    if (footer) {
      footerObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              audio?.playOnceFooter();
              footerObserver?.disconnect();
            }
          });
        },
        { threshold: 0.05 }
      );
      footerObserver.observe(footer);
    }

    return () => {
      revealObserver.disconnect();
      sectionObserver.disconnect();
      footerObserver?.disconnect();
    };
  }, [bootComplete]);
}

export default function PortfolioShell() {
  const reduceMotion = useReducedMotion();
  const [bootComplete, setBootComplete] = useState(false);
  const [minimumElapsed, setMinimumElapsed] = useState(false);
  const [robotReady, setRobotReady] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");
  const [themeFlash, setThemeFlash] = useState(false);

  const { isMuted, toggleMute } = useAudio();

  const robotFinish = themeMode === "light" ? "light" : "dark";
  const canReveal = reduceMotion || (minimumElapsed && robotReady);

  useSectionReveal(bootComplete);

  const toggleTheme = useCallback(() => {
    audio?.play("themeShift");
    setThemeFlash(true);
    setTimeout(() => setThemeFlash(false), 400);
    setThemeMode((current) => (current === "dark" ? "light" : "dark"));
  }, []);

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
  }, [canReveal]);

  /* Nav hover / click SFX */
  const handleNavHover = useCallback(() => audio?.play("uiHover"), []);
  const handleNavClick = useCallback(() => audio?.play("uiClick"), []);

  const headerClass = useMemo(
    () =>
      `portfolio-nav fixed left-0 right-0 top-0 z-30 border-b border-white/10 bg-exhibit-dark/72 px-5 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl md:px-14 ${
        bootComplete ? "is-ready" : ""
      }`,
    [bootComplete],
  );

  return (
    <>
      <CustomCursor />

      {themeFlash ? <div className="theme-flash-overlay" /> : null}

      <AnimatePresence>
        {!bootComplete && !reduceMotion ? (
          <BootSequence
            finish={robotFinish}
            isReady={bootComplete}
            onRobotReady={() => setRobotReady(true)}
            onStage={() => {}}
            onToggleSound={toggleMute}
            soundEnabled={!isMuted}
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
                  className="nav-link font-display text-[0.68rem] font-semibold uppercase tracking-[0.25em] text-exhibit-muted transition hover:text-exhibit-red"
                  href={href}
                  key={href}
                  onClick={handleNavClick}
                  onMouseEnter={handleNavHover}
                >
                  {label}
                </a>
              ))}
            </div>
            <button
              aria-label="Toggle exhibit theme"
              className="cta-btn flex h-11 w-11 items-center justify-center border border-exhibit-blue/35 font-display text-lg text-exhibit-silver transition hover:border-exhibit-red hover:text-[var(--text-primary)]"
              onClick={toggleTheme}
              onMouseEnter={handleNavHover}
              title={themeMode === "dark" ? "Exhibit Light" : "Dark"}
              type="button"
            >
              ◐
            </button>
            <button
              aria-label={isMuted ? "Unmute sound" : "Mute sound"}
              className="cta-btn hidden h-11 w-11 items-center justify-center border border-exhibit-blue/35 text-exhibit-silver transition hover:border-exhibit-red hover:text-[var(--text-primary)] sm:flex"
              onClick={toggleMute}
              title={isMuted ? "Sound Off" : "Sound On"}
              type="button"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <a
              className="nav-resume-glow cta-btn flex h-11 items-center justify-center border border-exhibit-red/45 px-4 font-display text-[0.68rem] font-bold uppercase tracking-[0.22em] text-exhibit-silver transition-all duration-200 hover:scale-[1.03] hover:border-exhibit-red hover:bg-exhibit-red/10 hover:text-[var(--text-primary)] active:scale-[0.97]"
              download="Alluri_Jeswanth_Joel_Resume.pdf"
              href="/resume/Alluri_Jeswanth_Joel_Resume.pdf"
              onClick={() => audio?.play("resumeDownload")}
              onMouseEnter={handleNavHover}
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
          <About />
          <FeaturedProjects />
          <RepositoryArchive />
          <Skills />
          <Certifications />
          <Contact />
        </motion.main>
      ) : null}

    </>
  );
}
