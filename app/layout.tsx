import type { Metadata } from "next";
import { Exo_2, Rajdhani } from "next/font/google";
import { Github, Linkedin, Mail } from "lucide-react";
import "./globals.css";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rajdhani",
});

const exo = Exo_2({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-exo",
});

export const metadata: Metadata = {
  title: "ALLURI JESWANTH JOEL | Portfolio",
  description:
    "Interactive engineering portfolio for ALLURI JESWANTH JOEL, full-stack and AI systems engineer.",
};

const footerActions = [
  {
    label: "GitHub",
    href: "https://github.com/joel8779",
    icon: Github,
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/joel8779",
    icon: Linkedin,
    external: true,
  },
  {
    label: "Email",
    href: "mailto:jeswanthjoel8779@gmail.com",
    icon: Mail,
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${rajdhani.variable} ${exo.variable}`}>
      <head>
        <link rel="preload" href="/resume/Alluri_Jeswanth_Joel_Resume.pdf" as="fetch" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
        <footer className="global-footer">
          <div className="global-footer__inner">
            <p className="global-footer__name">ALLURI JESWANTH JOEL</p>
            <div className="global-footer__icons">
              {footerActions.map((action) => {
                const Icon = action.icon;

                return (
                  <a
                    aria-label={action.label}
                    className="global-footer__icon"
                    href={action.href}
                    key={action.label}
                    rel={action.external ? "noreferrer" : undefined}
                    target={action.external ? "_blank" : undefined}
                    title={action.label}
                  >
                    <Icon size={18} aria-hidden="true" />
                  </a>
                );
              })}
            </div>
            <p className="global-footer__year">© {new Date().getFullYear()}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
