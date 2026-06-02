import { Howl } from "howler";

export type SoundName =
  | "bootHum"
  | "servoStart"
  | "metalLock"
  | "uiHover"
  | "uiClick"
  | "themeShift"
  | "resumeDownload"
  | "repoScan"
  | "contactSuccess"
  | "contactError"
  | "footerEnd"
  | "robotHydraulic"
  | "robotClick"
  | "robotIdle";

const SOUND_MAP: Record<SoundName, { src: string; volume: number }> = {
  bootHum: { src: "/sfx/boot-hum.mp3", volume: 0.12 },
  servoStart: { src: "/sfx/servo-start.mp3", volume: 0.14 },
  metalLock: { src: "/sfx/metal-lock.mp3", volume: 0.15 },
  uiHover: { src: "/sfx/ui-hover.mp3", volume: 0.08 },
  uiClick: { src: "/sfx/ui-click.mp3", volume: 0.12 },
  themeShift: { src: "/sfx/theme-shift.mp3", volume: 0.14 },
  resumeDownload: { src: "/sfx/resume-download.mp3", volume: 0.18 },
  repoScan: { src: "/sfx/repo-scan.mp3", volume: 0.12 },
  contactSuccess: { src: "/sfx/contact-success.mp3", volume: 0.15 },
  contactError: { src: "/sfx/contact-error.mp3", volume: 0.12 },
  footerEnd: { src: "/sfx/footer-end.mp3", volume: 0.15 },
  robotHydraulic: { src: "/sfx/repo-scan.mp3", volume: 0.05 },
  robotClick: { src: "/sfx/ui-hover.mp3", volume: 0.05 },
  robotIdle: { src: "/sfx/repo-scan.mp3", volume: 0.02 },
};

class AudioManager {
  private sounds: Map<SoundName, Howl> = new Map();
  private muted: boolean = true;
  private unlocked: boolean = false;
  private lastPlayTime: number = 0;
  private lastRobotPlayTime: number = 0;
  private wasFooterPlayed: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      const isMobile = window.innerWidth < 768;
      const savedMute = window.localStorage.getItem("portfolio-sound-muted");

      // Default muted on mobile, respect localStorage otherwise
      if (savedMute !== null) {
        this.muted = savedMute === "true";
      } else {
        this.muted = isMobile;
      }

      // Preload boot-hum, servo-start, metal-lock only
      this.preloadBootSounds();
    }
  }

  private preloadBootSounds() {
    this.getOrLoad("bootHum");
    this.getOrLoad("servoStart");
    this.getOrLoad("metalLock");
  }

  private getOrLoad(name: SoundName): Howl {
    let sound = this.sounds.get(name);
    if (!sound) {
      sound = new Howl({
        src: [SOUND_MAP[name].src],
        volume: SOUND_MAP[name].volume,
        preload: name === "bootHum" || name === "servoStart" || name === "metalLock",
      });
      this.sounds.set(name, sound);
    }
    return sound;
  }

  unlock() {
    if (this.unlocked) return;
    this.unlocked = true;
  }

  play(name: SoundName, volumeOverride?: number) {
    if (typeof window === "undefined") return;
    if (this.muted || !this.unlocked) return;

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const now = Date.now();

    // Cooldown logic for robot hydraulic and clicks
    if (name === "robotHydraulic" || name === "robotClick") {
      if (now - this.lastRobotPlayTime < 1500) return; // 1.5s robot cooldown
      this.lastRobotPlayTime = now;
    } else {
      // General 250ms cooldown for other UI interactions
      if (now - this.lastPlayTime < 250) return;
      this.lastPlayTime = now;
    }

    const sound = this.getOrLoad(name);
    if (sound.state() === "unloaded") {
      sound.load();
    }

    const id = sound.play();
    if (volumeOverride !== undefined) {
      sound.volume(volumeOverride, id);
    }
  }

  playOnceFooter() {
    if (this.wasFooterPlayed) return;
    this.wasFooterPlayed = true;
    this.play("footerEnd");
  }

  isMuted() {
    return this.muted;
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (typeof window !== "undefined") {
      window.localStorage.setItem("portfolio-sound-muted", String(muted));
    }
  }

  toggleMute(): boolean {
    const nextMute = !this.muted;
    this.setMuted(nextMute);
    return nextMute;
  }
}

export const audio = typeof window !== "undefined" ? new AudioManager() : null;
