import type { CSSProperties } from "react";
import ResumeButton from "./ResumeButton";

import { audio } from "../lib/audio";

const titleLines = ["ALLURI", "JESWANTH", "JOEL"];

function AnimatedLine({ line, offset }: { line: string; offset: number }) {
  return (
    <span className={`hero-title-line ${line === "JESWANTH" ? "text-exhibit-red" : ""}`}>
      {line.split("").map((letter, index) => (
        <span
          className="hero-title-letter"
          key={`${line}-${letter}-${index}`}
          style={{ "--letter-index": offset + index } as CSSProperties}
        >
          {letter}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  let offset = 0;

  return (
    <section id="home" className="section-shell hero-stage flex min-h-screen items-center">
      <div className="section-inner">
        <div className="content-column">
          <p className="section-label">Interactive Engineering Portfolio</p>
          <h1 className="mt-5 max-w-[10ch] font-display text-[clamp(3.6rem,8vw,7.6rem)] font-bold uppercase leading-[0.82] tracking-0 text-exhibit-chrome drop-shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
            {titleLines.map((line) => {
              const currentOffset = offset;
              offset += line.length;

              return <AnimatedLine key={line} line={line} offset={currentOffset} />;
            })}
          </h1>
          <p className="hero-subheading mt-6 max-w-xl border-l border-exhibit-red/40 pl-4 font-display text-sm font-semibold uppercase tracking-[0.24em] text-exhibit-silver/75">
            Full-Stack Engineer | AI Systems | Backend Architecture
          </p>
          <p className="hero-body-copy fine-text mt-7 max-w-[35rem]">
            IIIT Kottayam CSE engineer building production systems where intelligence
            meets infrastructure: RAG pipelines, semantic search, enterprise APIs, and
            polished web experiences.
          </p>
          <div className="hero-actions mt-9 flex flex-wrap gap-3">
            <a
              className="cta-btn clip-corners inline-flex items-center justify-center bg-exhibit-blue px-5 py-3 font-display text-xs font-bold uppercase tracking-[0.22em] text-[var(--text-primary)] transition hover:bg-exhibit-blueDark"
              href="#projects"
              onClick={() => audio?.play("servoStart")}
              onMouseEnter={() => audio?.play("uiHover")}
            >
              Featured Projects
            </a>
            <ResumeButton />
          </div>
        </div>
      </div>
    </section>
  );
}
