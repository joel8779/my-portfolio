"use client";

import { ExternalLink, Github, RefreshCw, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { GitHubPortfolioData, Repository } from "../types";

function ProjectCard({ repo, index }: { repo: Repository; index: number }) {
  return (
    <article className="panel panel-red exhibit-card relative flex flex-col p-7 transition-transform duration-300 hover:-translate-y-1.5 hover:bg-exhibit-panel2/90">
      <p className="font-display text-xs font-bold uppercase tracking-[0.28em] text-exhibit-red/60">
        Project {String(index + 1).padStart(2, "0")}
      </p>
      <div className="absolute right-6 top-7 inline-flex items-center gap-1 text-xs text-exhibit-flame/80">
        <Star size={14} aria-hidden="true" />
        {repo.stargazerCount}
      </div>
      <h3 className="mt-4 pr-12 font-display text-2xl font-bold uppercase leading-tight text-exhibit-chrome">
        {repo.name.replaceAll("-", " ")}
      </h3>
      <p className="fine-text mt-3 line-clamp-2">
        {repo.description || "Engineering project available on GitHub."}
      </p>
      <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
        {repo.primaryLanguage ? (
          <span className="border border-exhibit-blue/40 px-2.5 py-1 font-display text-[0.68rem] uppercase tracking-[0.18em] text-exhibit-silver/75">
            {repo.primaryLanguage.name}
          </span>
        ) : null}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <a
          className="inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-exhibit-blue transition hover:text-exhibit-red"
          href={repo.url}
          target="_blank"
          rel="noreferrer"
        >
          <Github size={15} aria-hidden="true" />
          Source
        </a>
        {repo.homepageUrl ? (
          <a
            className="inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-exhibit-blue transition hover:text-exhibit-red"
            href={repo.homepageUrl}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink size={15} aria-hidden="true" />
            Live
          </a>
        ) : null}
      </div>
    </article>
  );
}

export default function FeaturedProjects() {
  const [data, setData] = useState<GitHubPortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/github", { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to load pinned repositories.");
      }

      setData(payload);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Unable to load pinned repositories.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  return (
    <section id="projects" className="section-shell">
      <div className="section-inner">
        <div className="content-column right">
          <p className="section-label">Featured Projects</p>
          <h2 className="section-title">Pinned GitHub Work</h2>
          <p className="fine-text mt-4">
            This section is powered only by pinned GitHub repositories, keeping the
            featured work aligned with the public profile.
          </p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="panel col-span-full p-10 text-center font-display text-xs uppercase tracking-[0.28em] text-exhibit-muted">
              Loading pinned repositories...
            </div>
          ) : null}

          {!isLoading && error ? (
            <div className="panel col-span-full flex flex-col items-center gap-5 p-10 text-center">
              <p className="font-display text-sm uppercase tracking-[0.24em] text-exhibit-red">
                GitHub pinned repositories could not be loaded.
              </p>
              <p className="max-w-xl text-sm leading-7 text-exhibit-silver/60">{error}</p>
              <button
                className="clip-corners inline-flex items-center gap-2 bg-exhibit-red px-5 py-3 font-display text-xs font-bold uppercase tracking-[0.22em] text-white transition hover:bg-exhibit-redDark"
                onClick={loadProjects}
                type="button"
              >
                <RefreshCw size={15} aria-hidden="true" />
                Retry
              </button>
            </div>
          ) : null}

          {!isLoading && !error && data?.pinned.length === 0 ? (
            <div className="panel col-span-full p-10 text-center font-display text-xs uppercase tracking-[0.28em] text-exhibit-muted">
              No pinned repositories found on GitHub.
            </div>
          ) : null}

          {!isLoading && !error
            ? data?.pinned.map((repo, index) => <ProjectCard index={index} key={repo.id} repo={repo} />)
            : null}
        </div>
      </div>
    </section>
  );
}
