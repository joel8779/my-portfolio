"use client";

import { RefreshCw, Star } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { GitHubPortfolioData, Repository } from "../types";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

function RepoRow({ repo }: { repo: Repository }) {
  return (
    <a
      className="repo-row grid items-center gap-4 border-b border-white/5 px-5 transition hover:bg-exhibit-panel2/80 md:grid-cols-[1fr_0.6fr_0.4fr_0.6fr]"
      href={repo.url}
      target="_blank"
      rel="noreferrer"
      style={{ height: "76px" }}
    >
      <div className="flex items-center">
        <h3 className="font-display text-base font-bold uppercase text-exhibit-chrome transition-all duration-200 group-hover:text-white repo-name-glow">
          {repo.name}
        </h3>
      </div>
      <div className="flex items-center justify-center gap-2 text-sm text-exhibit-silver/70">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: repo.primaryLanguage?.color ?? "#6B7280" }}
        />
        {repo.primaryLanguage?.name ?? "—"}
      </div>
      <div className="flex items-center justify-center gap-1 text-sm text-exhibit-flame/75">
        <Star size={14} aria-hidden="true" />
        {repo.stargazerCount}
      </div>
      <div className="flex items-center justify-end font-display text-[0.72rem] uppercase tracking-[0.14em] text-exhibit-muted">
        {formatDate(repo.updatedAt)}
      </div>
    </a>
  );
}

export default function RepositoryArchive() {
  const [data, setData] = useState<GitHubPortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRepositories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/github", { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to load repositories.");
      }

      setData(payload);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Unable to load repositories.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRepositories();
  }, [loadRepositories]);

  const repositories = useMemo(
    () => data?.repositories.filter((repo) => !repo.isFork) ?? [],
    [data],
  );

  return (
    <section id="repos" className="section-shell">
      <div className="section-inner">
        <div className="content-column">
          <p className="section-label">Repository Archive</p>
          <h2 className="section-title">Public Repositories</h2>
          <p className="fine-text mt-4">
            A complete public repository archive from GitHub GraphQL, sorted by recent updates.
          </p>
        </div>

        <div className="panel exhibit-card mt-10 overflow-hidden">
          {/* Table header */}
          <div className="hidden border-b border-white/8 px-5 py-3 md:grid md:grid-cols-[1fr_0.6fr_0.4fr_0.6fr]">
            <span className="font-display text-[0.65rem] font-bold uppercase tracking-[0.22em] text-exhibit-muted">
              Repository
            </span>
            <span className="text-center font-display text-[0.65rem] font-bold uppercase tracking-[0.22em] text-exhibit-muted">
              Language
            </span>
            <span className="text-center font-display text-[0.65rem] font-bold uppercase tracking-[0.22em] text-exhibit-muted">
              Stars
            </span>
            <span className="text-right font-display text-[0.65rem] font-bold uppercase tracking-[0.22em] text-exhibit-muted">
              Updated
            </span>
          </div>

          {isLoading ? (
            <div className="p-10 text-center font-display text-xs uppercase tracking-[0.28em] text-exhibit-muted">
              Loading repositories...
            </div>
          ) : null}

          {!isLoading && error ? (
            <div className="flex flex-col items-center gap-5 p-10 text-center">
              <p className="font-display text-sm uppercase tracking-[0.24em] text-exhibit-red">
                Repository archive unavailable.
              </p>
              <p className="max-w-xl text-sm leading-7 text-exhibit-silver/60">{error}</p>
              <button
                className="clip-corners inline-flex items-center gap-2 bg-exhibit-red px-5 py-3 font-display text-xs font-bold uppercase tracking-[0.22em] text-white transition hover:bg-exhibit-redDark"
                onClick={loadRepositories}
                type="button"
              >
                <RefreshCw size={15} aria-hidden="true" />
                Retry
              </button>
            </div>
          ) : null}

          {!isLoading && !error && repositories.length === 0 ? (
            <div className="p-10 text-center font-display text-xs uppercase tracking-[0.28em] text-exhibit-muted">
              No public repositories found.
            </div>
          ) : null}

          {!isLoading && !error ? repositories.map((repo) => <RepoRow key={repo.id} repo={repo} />) : null}
        </div>
      </div>
    </section>
  );
}
