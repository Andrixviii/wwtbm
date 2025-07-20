import { Howl } from 'howler';

// Sound sprite config
export const SOUNDS = {
  mainMenu: {
    src: ['/sfx/op.mp3'],
    volume: 0.7,
    loop: true,
  },
  gameBoard: {
    src: ['/sfx/game-board.mp3'],
    volume: 0.7,
    loop: true,
  },
  correct: {
    src: ['/sfx/correct.mp3'],
    volume: 0.7,
  },
  wrong: {
    src: ['/sfx/wrong.mp3'],
    volume: 0.7,
  }
};

// Sound manager
class SoundManager {
  private sounds: Map<string, Howl> = new Map();
  private loading: Map<string, boolean> = new Map();
  private loaded: Map<string, boolean> = new Map();

  // Preload semua sound
  async preloadAll(): Promise<void> {
    const promises = Object.keys(SOUNDS).map(key => this.preload(key as keyof typeof SOUNDS));
    await Promise.all(promises);
  }

  // Preload single sound
  async preload(key: keyof typeof SOUNDS): Promise<void> {
    if (this.loading.get(key) || this.loaded.get(key)) return;

    return new Promise((resolve, reject) => {
      try {
        this.loading.set(key, true);
        const sound = new Howl({
          ...SOUNDS[key],
          onload: () => {
            this.loaded.set(key, true);
            this.loading.set(key, false);
            resolve();
          },
          onloaderror: (id, error) => {
            this.loading.set(key, false);
            reject(error);
          }
        });
        this.sounds.set(key, sound);
      } catch (error) {
        this.loading.set(key, false);
        reject(error);
      }
    });
  }

  loadSound(key: keyof typeof SOUNDS): Howl {
    if (!this.sounds.has(key)) {
      // Lazy loading jika belum di-preload
      const sound = new Howl(SOUNDS[key]);
      this.sounds.set(key, sound);
      this.loaded.set(key, true);
    }
    return this.sounds.get(key)!;
  }

  play(key: keyof typeof SOUNDS): number {
    try {
      const sound = this.loadSound(key);
      return sound.play();
    } catch (error) {
      console.error(`Failed to play sound: ${key}`, error);
      return -1;
    }
  }

  stop(key: keyof typeof SOUNDS): void {
    try {
      const sound = this.sounds.get(key);
      sound?.stop();
    } catch (error) {
      console.error(`Failed to stop sound: ${key}`, error);
    }
  }

  fade(key: keyof typeof SOUNDS, from: number, to: number, duration: number): void {
    try {
      const sound = this.sounds.get(key);
      sound?.fade(from, to, duration);
    } catch (error) {
      console.error(`Failed to fade sound: ${key}`, error);
    }
  }

  // Unload specific sound
  unload(key: keyof typeof SOUNDS): void {
    const sound = this.sounds.get(key);
    if (sound) {
      sound.unload();
      this.sounds.delete(key);
      this.loaded.delete(key);
    }
  }

  // Unload all sounds
  unloadAll(): void {
    this.sounds.forEach(sound => sound.unload());
    this.sounds.clear();
    this.loaded.clear();
    this.loading.clear();
  }

  // Check if sound is loaded
  isLoaded(key: keyof typeof SOUNDS): boolean {
    return this.loaded.get(key) || false;
  }

  // Check if sound is loading
  isLoading(key: keyof typeof SOUNDS): boolean {
    return this.loading.get(key) || false;
  }
}

export const soundManager = new SoundManager();