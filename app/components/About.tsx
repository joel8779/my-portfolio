export default function About() {
  return (
    <section id="about" className="section-shell section-fade-enter flex items-center">
      <div className="section-inner">
        <div className="grid items-start gap-8 lg:grid-cols-[0.8fr_1fr]">
          <div className="content-column">
            <p className="section-label">About</p>
            <h2 className="section-title">Engineer Profile</h2>
            <p className="fine-text mt-6">
              I build backends that do more than serve data. My work focuses on the
              intersection of distributed systems and machine intelligence, including
              RAG architectures, vector databases, semantic search, and multi-tenant
              enterprise platforms.
            </p>
          </div>
          <div className="panel panel-red exhibit-card relative p-7">
            <div className="absolute left-[-1px] top-[-1px] h-4 w-4 border-l-2 border-t-2 border-exhibit-red" />
            <div className="absolute bottom-[-1px] right-[-1px] h-4 w-4 border-b-2 border-r-2 border-exhibit-red" />
            {[
              ["Name", "ALLURI JESWANTH JOEL"],
              ["Institute", "IIIT Kottayam, Kerala"],
              ["Program", "B.Tech CSE"],
              ["Period", "Nov 2022 - May 2026"],
              ["Certification", "Google Cloud Study Jam 2023"],
              ["Certification", "AlgoUniversity Graph Camp 2024"],
              ["Focus", "AI systems, backend architecture, full-stack products"],
            ].map(([label, value]) => (
              <div
                className="flex items-baseline justify-between gap-6 border-b border-white/5 py-3"
                key={`${label}-${value}`}
              >
                <span className="font-display text-[0.68rem] uppercase tracking-[0.28em] text-exhibit-muted">
                  {label}
                </span>
                <span className="text-right text-sm text-exhibit-silver">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
