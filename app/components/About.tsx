export default function About() {
  return (
    <section id="about" className="section-shell flex items-center" style={{ minHeight: "72vh" }}>
      <div className="about-inner">
        <div className="about-grid">
          {/* Left: content */}
          <div className="about-content section-fade-enter">
            <p className="section-label">ABOUT</p>
            <h2 className="section-title">ENGINEER PROFILE</h2>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.24em] text-exhibit-red/85 mt-2">
              Systems • Backend • AI
            </p>
            <div className="fine-text mt-6 flex flex-col gap-4" style={{ maxWidth: "620px", lineHeight: 1.9 }}>
              <p>
                I build intelligent systems—not just applications.
              </p>
              <p>
                My work spans machine learning, backend engineering,
                LLM workflows, and production-grade data platforms.
              </p>
              <p>
                Recently, I’ve been building AutoML pipelines,
                training orchestration, model observability,
                and AI-powered developer tooling.
              </p>
            </div>
          </div>

          {/* Right: profile panel */}
          <div className="about-panel panel panel-red exhibit-card section-fade-enter relative transition-all duration-300">
            {/* 4 corner bracket points */}
            <div className="absolute left-[-1px] top-[-1px] h-5 w-5 border-l-2 border-t-2 border-exhibit-red" />
            <div className="absolute right-[-1px] top-[-1px] h-5 w-5 border-r-2 border-t-2 border-exhibit-red" />
            <div className="absolute bottom-[-1px] left-[-1px] h-5 w-5 border-b-2 border-l-2 border-exhibit-red" />
            <div className="absolute bottom-[-1px] right-[-1px] h-5 w-5 border-b-2 border-r-2 border-exhibit-red" />
            
            {/* Header with tiny status dot indicator */}
            <div className="flex items-center justify-between border-b border-exhibit-red/15 pb-4 mb-4">
              <span className="font-display text-[10px] font-bold uppercase tracking-[0.24em] text-exhibit-red">SYSTEM // PROFILE</span>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-exhibit-red animate-pulse" />
                <span className="font-mono text-[9px] uppercase tracking-wider text-exhibit-red/60">ONLINE</span>
              </div>
            </div>

            {/* Profile rows */}
            {[
              ["NAME", "ALLURI JESWANTH JOEL"],
              ["INSTITUTE", "IIIT Kottayam, Kerala"],
              ["DEGREE", "B.Tech — Computer Science Engineering"],
              ["GRADUATED", "May 2026"],
            ].map(([label, value]) => (
              <div className="about-row" key={label}>
                <span className="about-label">{label}</span>
                <span className="about-value">{value}</span>
              </div>
            ))}

            {/* Multi-value: Focus */}
            <div className="about-row items-start">
              <span className="about-label mt-1">FOCUS</span>
              <div className="flex flex-col gap-1.5 items-end max-w-[70%] text-right">
                {["AI ENGINEERING", "ML SYSTEMS", "BACKEND SYSTEMS"].map((focus) => (
                  <span key={focus} className="about-chip">
                    {focus}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
