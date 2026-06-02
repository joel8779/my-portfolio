"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [hoveringRobot, setHoveringRobot] = useState(false);

  useEffect(() => {
    // Only on desktop with fine pointer
    const isDesktop = window.matchMedia("(pointer: fine)").matches;
    if (!isDesktop) return;

    setVisible(true);
    document.documentElement.classList.add("custom-cursor-active");

    const move = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest("a, button, [role='button'], input, textarea, select, label");
      const isRobot = target.closest("canvas");
      setHovering(!!isInteractive);
      setHoveringRobot(!!isRobot && !isInteractive);
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", handleOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", handleOver);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, []);

  if (!visible) return null;

  let ringClass = "cursor-ring";
  if (hovering) ringClass += " cursor-ring--expand";
  if (hoveringRobot) ringClass += " cursor-ring--robot";

  return <div ref={cursorRef} className={ringClass} />;
}
