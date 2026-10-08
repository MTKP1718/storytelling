import { ambientAudio } from './ambientAudio';

/**
 * Web Speech API text-to-speech integration for Story Teacher
 * Provides warm, expressive, paced reading aloud for children.
 */

class TTSEngine {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private preferredVoice: SpeechSynthesisVoice | null = null;
  private isPaused: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return;

    // Prefer high-quality warm English voices (female or warm friendly male)
    const preferred = voices.find(
      (v) =>
        (v.name.includes('Natural') ||
          v.name.includes('Samantha') ||
          v.name.includes('Google UK English Female') ||
          v.name.includes('Google US English') ||
          v.name.includes('Victoria') ||
          v.name.includes('Serena') ||
          v.name.includes('Zira')) &&
        v.lang.startsWith('en')
    );

    this.preferredVoice = preferred || voices.find((v) => v.lang.startsWith('en')) || voices[0];
  }

  public speak(
    text: string,
    options?: {
      rate?: number;
      pitch?: number;
      onBoundary?: (charIndex: number, charLength: number) => void;
      onEnd?: () => void;
      onError?: () => void;
    }
  ) {
    if (!this.synth) return;

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.preferredVoice) {
      utterance.voice = this.preferredVoice;
    }

    // Warm, slightly slower rate for young readers
    utterance.rate = options?.rate ?? 0.88;
    utterance.pitch = options?.pitch ?? 1.06;

    if (options?.onBoundary) {
      utterance.onboundary = (e) => {
        if (e.name === 'word') {
          options.onBoundary?.(e.charIndex, e.charLength || 4);
        }
      };
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      this.isPaused = false;
      ambientAudio.duckVolume(false);
      options?.onEnd?.();
    };

    utterance.onerror = () => {
      this.currentUtterance = null;
      this.isPaused = false;
      ambientAudio.duckVolume(false);
      options?.onError?.();
    };

    this.currentUtterance = utterance;
    this.isPaused = false;
    ambientAudio.duckVolume(true);
    this.synth.speak(utterance);
  }

  public speakWord(word: string) {
    if (!this.synth) return;
    this.stop();
    const utterance = new SpeechSynthesisUtterance(word);
    if (this.preferredVoice) utterance.voice = this.preferredVoice;
    utterance.rate = 0.82;
    utterance.pitch = 1.1;
    this.synth.speak(utterance);
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
      this.isPaused = false;
      ambientAudio.duckVolume(false);
    }
  }

  public pause() {
    if (this.synth && this.synth.speaking && !this.isPaused) {
      this.synth.pause();
      this.isPaused = true;
      ambientAudio.duckVolume(false);
    }
  }

  public resume() {
    if (this.synth && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
      ambientAudio.duckVolume(true);
    }
  }

  public isPlaying(): boolean {
    return !!this.synth && this.synth.speaking && !this.isPaused;
  }

  public getPaused(): boolean {
    return this.isPaused;
  }

  public getCurrentUtterance(): SpeechSynthesisUtterance | null {
    return this.currentUtterance;
  }
}

export const tts = new TTSEngine();
