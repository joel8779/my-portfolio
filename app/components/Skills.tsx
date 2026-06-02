const skillGroups = [
  {
    title: "LANGUAGES",
    items: ["Python", "Java", "TypeScript", "JavaScript", "SQL", "C / C++", "R"],
  },
  {
    title: "BACKEND",
    items: ["FastAPI", "Spring Boot 3", "Node.js / Express", "Flask", "LangChain", "Celery"],
  },
  {
    title: "FRONTEND",
    items: ["Next.js", "React", "Tailwind CSS", "Framer Motion"],
  },
  {
    title: "DATA & AI",
    items: ["PostgreSQL", "MongoDB Atlas", "Redis", "Pinecone / Qdrant", "MLflow", "TensorFlow"],
  },
  {
    title: "INFRASTRUCTURE",
    items: ["Docker", "GitHub Actions", "GCP", "Vercel / Render", "PySpark"],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="section-shell section-fade-enter">
      <div className="section-inner">
        <div className="content-column right">
          <p className="section-label">TECHNOLOGY STACK</p>
          <h2 className="section-title">CORE CAPABILITIES</h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-px bg-exhibit-blue/10 sm:grid-cols-2 lg:grid-cols-5">
          {skillGroups.map((group) => (
            <div className="panel exhibit-card p-6" key={group.title}>
              <h3 className="border-b border-exhibit-red/15 pb-3 font-display text-xs font-bold uppercase tracking-[0.28em] text-exhibit-red">
                {group.title}
              </h3>
              <div className="mt-5 flex flex-col gap-2">
                {group.items.map((item) => (
                  <span
                    className="border-b border-white/5 pb-2 text-sm text-exhibit-silver/70"
                    key={item}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
