import { Howl } from 'howler';

export class AudioManager {
  private static instance: AudioManager;
  private sounds: Map<string, Howl>;

  private constructor() {
    this.sounds = new Map();
    this.initializeSounds();
  }

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  private initializeSounds() {
    this.sounds.set('hit', new Howl({
      src: ['sounds/hit.mp3'],
      volume: 0.5
    }));
    this.sounds.set('score', new Howl({
      src: ['sounds/score.mp3'],
      volume: 0.7
    }));
    this.sounds.set('powerup', new Howl({
      src: ['sounds/powerup.mp3'],
      volume: 0.6
    }));
  }

  play(soundName: string) {
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.play();
    }
  }

  setVolume(soundName: string, volume: number) {
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.volume(Math.max(0, Math.min(1, volume)));
    }
  }
}