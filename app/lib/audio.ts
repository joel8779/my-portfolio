import { Howl } from 'howler';

export type SoundName = 'boot' | 'hoverSoft' | 'clickTech' | 'scrollPass' | 'themeToggle' | 'resumeDownload';

const SOUND_MAP: Record<SoundName, string> = {
  boot: '/sfx/boot.mp3',
  hoverSoft: '/sfx/hover-soft.mp3',
  clickTech: '/sfx/click-tech.mp3',
  scrollPass: '/sfx/scroll-pass.mp3',
  themeToggle: '/sfx/theme-toggle.mp3',
  resumeDownload: '/sfx/resume-download.mp3',
};

const MASTER_VOLUME = 0.18;

class AudioManager {
  private sounds: Map<SoundName, Howl> = new Map();
  private _muted: boolean;
  private _unlocked = false;

  constructor() {
    this._muted = typeof window !== 'undefined'
      ? window.localStorage.getItem('portfolio-sound-muted') === 'true'
      : false;
  }

  private getOrLoad(name: SoundName): Howl {
    let sound = this.sounds.get(name);
    if (!sound) {
      sound = new Howl({
        src: [SOUND_MAP[name]],
        volume: MASTER_VOLUME,
        preload: false,
      });
      this.sounds.set(name, sound);
    }
    return sound;
  }

  unlock() {
    if (this._unlocked) return;
    this._unlocked = true;
    // Preload common sounds after first interaction
    (['hoverSoft', 'clickTech'] as SoundName[]).forEach(name => {
      this.getOrLoad(name).load();
    });
  }

  play(name: SoundName, volumeOverride?: number) {
    if (this._muted || !this._unlocked) return;
    if (typeof window === 'undefined') return;
    const sound = this.getOrLoad(name);
    if (sound.state() === 'unloaded') sound.load();
    const id = sound.play();
    if (volumeOverride !== undefined) {
      sound.volume(volumeOverride, id);
    }
  }

  get muted() {
    return this._muted;
  }

  setMuted(muted: boolean) {
    this._muted = muted;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('portfolio-sound-muted', String(muted));
    }
  }

  toggleMute(): boolean {
    this.setMuted(!this._muted);
    return this._muted;
  }
}

export const audio = typeof window !== 'undefined' ? new AudioManager() : null;
