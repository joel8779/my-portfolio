"use client";

const RESUME_URL = "/resume/Alluri_Jeswanth_Joel_Resume.pdf";

export default function ResumeButton() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Fallback: if the browser blocks the download, open in new tab
    const link = e.currentTarget;
    setTimeout(() => {
      window.open(link.href, "_blank");
    }, 150);
  };

  return (
    <a
      className="cta-btn resume-btn clip-corners inline-flex items-center justify-center border border-exhibit-red/45 bg-exhibit-dark/40 px-5 py-3 font-display text-xs font-bold uppercase tracking-[0.22em] text-exhibit-silver transition-all duration-200 hover:scale-[1.03] hover:border-exhibit-red hover:bg-exhibit-red/10 hover:text-white active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-exhibit-red focus:ring-offset-2 focus:ring-offset-exhibit-dark"
      href={RESUME_URL}
      download="Alluri_Jeswanth_Joel_Resume.pdf"
      title="Download Resume"
      onClick={handleClick}
    >
      Resume
    </a>
  );
}
