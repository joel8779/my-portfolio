"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { Howler } from "howler";
import { audio } from "../lib/audio";

interface AudioContextType {
  isMuted: boolean;
  isAudioUnlocked: boolean;
  toggleMute: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);

  const tBootRef = useRef<NodeJS.Timeout | null>(null);
  const tServoRef = useRef<NodeJS.Timeout | null>(null);
  const tMetalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync mute state on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isMobile = window.innerWidth < 768;
    const savedMute = window.localStorage.getItem("portfolio-sound-muted");
    const initialMute = savedMute !== null ? savedMute === "true" : isMobile;

    setIsMuted(initialMute);
    Howler.mute(initialMute);
    audio?.setMuted(initialMute);
  }, []);

  const toggleMute = () => {
    if (typeof window === "undefined") return;

    setIsMuted((prevMuted) => {
      const nextMuted = !prevMuted;
      Howler.mute(nextMuted);
      audio?.setMuted(nextMuted);
      window.localStorage.setItem("portfolio-sound-muted", String(nextMuted));
      return nextMuted;
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleUnlock = async () => {
      // Run once
      Howler.autoUnlock = true;
      if (Howler.ctx && Howler.ctx.state === "suspended") {
        try {
          await Howler.ctx.resume();
        } catch (err) {
          console.error("Failed to resume Howler context:", err);
        }
      }

      audio?.unlock();
      setIsAudioUnlocked(true);
      console.log("[AUDIO] unlocked");

      // Remove listeners
      removeListeners();

      // Boot Sound Sequence
      const siteBootPlayed = sessionStorage.getItem("siteBootPlayed") === "true";
      if (!siteBootPlayed) {
        tBootRef.current = setTimeout(() => {
          audio?.play("bootHum");

          tServoRef.current = setTimeout(() => {
            audio?.play("servoStart");

            tMetalRef.current = setTimeout(() => {
              audio?.play("metalLock");
            }, 600);
          }, 600);

          sessionStorage.setItem("siteBootPlayed", "true");
          console.log("[AUDIO] boot played");
        }, 150);
      }
    };

    const removeListeners = () => {
      window.removeEventListener("pointerdown", handleUnlock);
      window.removeEventListener("keydown", handleUnlock);
      window.removeEventListener("touchstart", handleUnlock);
      window.removeEventListener("wheel", handleUnlock);
    };

    window.addEventListener("pointerdown", handleUnlock, { once: true });
    window.addEventListener("keydown", handleUnlock, { once: true });
    window.addEventListener("touchstart", handleUnlock, { once: true });
    window.addEventListener("wheel", handleUnlock, { once: true });

    return () => {
      removeListeners();
      if (tBootRef.current) clearTimeout(tBootRef.current);
      if (tServoRef.current) clearTimeout(tServoRef.current);
      if (tMetalRef.current) clearTimeout(tMetalRef.current);
    };
  }, []);

  return (
    <AudioContext.Provider value={{ isMuted, isAudioUnlocked, toggleMute }}>
      {children}
    </AudioContext.Provider>
  );
}
