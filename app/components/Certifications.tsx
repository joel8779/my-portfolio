"use client";

import { ExternalLink } from "lucide-react";

interface Certification {
  title: string;
  issuer: string;
  type: string;
  issued: string;
  verify: string;
}

const certificationsData: Certification[] = [
  {
    title: "Digital Transformation with Google Cloud",
    issuer: "Google Cloud",
    type: "Professional Course",
    issued: "Jun 2026",
    verify: "https://coursera.org/verify/S584OA0L03TN"
  },
  {
    title: "Machine Learning in Production",
    issuer: "DeepLearning.AI",
    type: "Production ML",
    issued: "Jun 2026",
    verify: "https://coursera.org/verify/JTW5H0HOI8AY"
  },
  {
    title: "Supervised Machine Learning: Regression and Classification",
    issuer: "DeepLearning.AI × Stanford",
    type: "Machine Learning",
    issued: "Jun 2026",
    verify: "https://coursera.org/verify/3VJFFJ1A8Y3X"
  },
  {
    title: "Generative AI and LLMs: Architecture and Data Preparation",
    issuer: "IBM",
    type: "Generative AI",
    issued: "Jun 2026",
    verify: "https://coursera.org/verify/QN4JTS13A025"
  },
  {
    title: "What is Data Science?",
    issuer: "IBM",
    type: "Data Science Foundations",
    issued: "Jun 2026",
    verify: "https://coursera.org/verify/Q89VX1EO8431"
  }
];

function GoogleCloudLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-exhibit-red/80">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" />
      <path d="M12 22V12" />
      <path d="M12 12L2 7" />
      <path d="M12 12l10-5" />
    </svg>
  );
}

function DeepLearningLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-exhibit-red/80">
      <circle cx="12" cy="12" r="3" />
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
      <line x1="8.5" y1="8.5" x2="10" y2="10" />
      <line x1="15.5" y1="8.5" x2="14" y2="10" />
      <line x1="8.5" y1="15.5" x2="10" y2="14" />
      <line x1="15.5" y1="15.5" x2="14" y2="14" />
    </svg>
  );
}

function IBMLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-exhibit-red/80">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="15" x2="21" y2="15" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <line x1="15" y1="3" x2="15" y2="21" />
    </svg>
  );
}

function getLogo(issuer: string) {
  if (issuer.includes("Google")) return <GoogleCloudLogo />;
  if (issuer.includes("DeepLearning")) return <DeepLearningLogo />;
  return <IBMLogo />;
}

function CertificationCard({ cert }: { cert: Certification }) {
  return (
    <article className="panel panel-red exhibit-card cert-card flex flex-col p-6 rounded-sm">
      {/* Top row with issuer logo and issued date */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-full border border-exhibit-red/20 bg-exhibit-red/5">
            {getLogo(cert.issuer)}
          </div>
          <span className="font-display text-[10px] font-bold uppercase tracking-[0.2rem] text-exhibit-red/80">
            {cert.issuer}
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-exhibit-red/60 bg-exhibit-red/5 px-2 py-0.5 border border-exhibit-red/10 rounded-sm">
          {cert.issued}
        </span>
      </div>

      {/* Certification Title */}
      <h3 className="font-display text-lg font-bold uppercase tracking-[0.04em] leading-snug text-exhibit-chrome mb-4 min-h-[56px] flex items-center">
        {cert.title}
      </h3>

      {/* Metadata blocks */}
      <div className="cert-meta">
        <div className="cert-meta-item">
          <span className="cert-meta-label">ISSUER</span>
          <span className="cert-meta-value truncate" title={cert.issuer}>{cert.issuer}</span>
        </div>
        <div className="cert-meta-item">
          <span className="cert-meta-label">TYPE</span>
          <span className="cert-meta-value truncate" title={cert.type}>{cert.type}</span>
        </div>
        <div className="cert-meta-item">
          <span className="cert-meta-label">ISSUED</span>
          <span className="cert-meta-value truncate">{cert.issued}</span>
        </div>
      </div>

      {/* Verify Button */}
      <div className="mt-auto pt-2">
        <a
          href={cert.verify}
          target="_blank"
          rel="noopener noreferrer"
          className="verify-btn flex items-center justify-center gap-2 rounded-sm"
        >
          Verify Credential
          <ExternalLink size={12} className="inline-block" />
        </a>
      </div>
    </article>
  );
}

export default function Certifications() {
  return (
    <section id="certifications" className="section-shell">
      <div className="section-inner">
        <div className="content-column left mb-10 section-fade-enter">
          <p className="section-label">CERTIFICATIONS // KNOWLEDGE STACK</p>
          <h2 className="section-title">VERIFIED CREDENTIALS</h2>
          <div className="fine-text mt-4 flex flex-col gap-1">
            <p>Verified learning and specialization across AI,</p>
            <p>ML systems, cloud infrastructure,</p>
            <p>and production engineering.</p>
          </div>
        </div>

        <div className="cert-grid">
          {certificationsData.map((cert, index) => (
            <CertificationCard key={index} cert={cert} />
          ))}
        </div>
      </div>
    </section>
  );
}
