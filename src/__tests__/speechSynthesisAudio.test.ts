import { describe, it, expect, vi, beforeEach } from 'vitest';
import { tts } from '../utils/tts';
import { sound } from '../utils/audio';
import { ambientAudio } from '../utils/ambientAudio';

describe('Speech Synthesis & Audio Mocks with Safe Fallback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('TTSEngine - Safe Fallback in Unsupported Environments', () => {
    it('does not throw when window.speechSynthesis is undefined or null', async () => {
      // Temporarily remove speechSynthesis from window
      const originalSpeech = window.speechSynthesis;
      // @ts-expect-error simulating unsupported browser environment
      delete window.speechSynthesis;

      // Dynamically re-import or construct an engine instance in isolation
      const { tts: isolatedTTS } = await import('../utils/tts');

      expect(() => {
        isolatedTTS.speak('Testing safe fallback in unsupported browser');
        isolatedTTS.speakWord('Fallback');
        isolatedTTS.pause();
        isolatedTTS.resume();
        isolatedTTS.stop();
      }).not.toThrow();

      expect(isolatedTTS.isPlaying()).toBe(false);
      expect(isolatedTTS.getPaused()).toBe(false);
      expect(isolatedTTS.getCurrentUtterance()).toBeNull();

      // Restore
      window.speechSynthesis = originalSpeech;
    });
  });

  describe('TTSEngine - Supported Speech Synthesis Operations', () => {
    it('configures speech rates and boundaries for young readers', () => {
      const mockSpeak = vi.spyOn(window.speechSynthesis, 'speak');
      const onBoundary = vi.fn();
      const onEnd = vi.fn();

      tts.speak('Once upon a starlight quest', {
        rate: 0.9,
        pitch: 1.1,
        onBoundary,
        onEnd,
      });

      expect(mockSpeak).toHaveBeenCalled();
      const utterance = tts.getCurrentUtterance();
      expect(utterance).toBeDefined();
      expect(utterance?.rate).toBe(0.9);
      expect(utterance?.pitch).toBe(1.1);

      // Trigger boundary event
      utterance?.onboundary?.({ name: 'word', charIndex: 5, charLength: 4 } as unknown as SpeechSynthesisEvent);
      expect(onBoundary).toHaveBeenCalledWith(5, 4);

      // Trigger end event
      utterance?.onend?.({} as unknown as SpeechSynthesisEvent);
      expect(onEnd).toHaveBeenCalled();
      expect(tts.isPlaying()).toBe(false);
    });

    it('handles utterance errors gracefully without throwing', () => {
      const onError = vi.fn();

      tts.speak('Sample narrative text', { onError });
      const utterance = tts.getCurrentUtterance();
      utterance?.onerror?.({} as unknown as SpeechSynthesisErrorEvent);

      expect(onError).toHaveBeenCalled();
      expect(tts.isPlaying()).toBe(false);
    });

    it('speaks individual vocabulary words with slower paced rate', () => {
      const mockSpeak = vi.spyOn(window.speechSynthesis, 'speak');
      tts.speakWord('Photosynthesis');

      expect(mockSpeak).toHaveBeenCalled();
    });

    it('pauses, resumes, and stops speech synthesis correctly', () => {
      const mockPause = vi.spyOn(window.speechSynthesis, 'pause');
      const mockResume = vi.spyOn(window.speechSynthesis, 'resume');
      const mockCancel = vi.spyOn(window.speechSynthesis, 'cancel');

      tts.speak('A journey through the stars');
      // Simulate speaking flag
      (window.speechSynthesis as any).speaking = true;

      tts.pause();
      expect(mockPause).toHaveBeenCalled();
      expect(tts.getPaused()).toBe(true);

      tts.resume();
      expect(mockResume).toHaveBeenCalled();
      expect(tts.getPaused()).toBe(false);

      tts.stop();
      expect(mockCancel).toHaveBeenCalled();
      expect(tts.getCurrentUtterance()).toBeNull();

      (window.speechSynthesis as any).speaking = false;
    });
  });

  describe('SoundEngine (Web Audio API Synthesizer)', () => {
    it('toggles audio muting and manages mute state', () => {
      const initialMute = sound.getIsMuted();
      const toggled = sound.toggleMute();
      expect(toggled).toBe(!initialMute);
      expect(sound.getIsMuted()).toBe(!initialMute);

      // Toggle back to restore
      sound.toggleMute();
      expect(sound.getIsMuted()).toBe(initialMute);
    });

    it('executes all synthesized sound effects without errors', () => {
      expect(() => {
        sound.playStarChime();
        sound.playStarChime(1.5);
        sound.playTilePlace();
        sound.playGentleClue();
        sound.playCorrectSparkle();
        sound.playPageFlip();
        sound.playCelebrationFanfare();
      }).not.toThrow();
    });

    it('suppresses audio effects cleanly when muted', () => {
      if (!sound.getIsMuted()) {
        sound.toggleMute();
      }
      expect(sound.getIsMuted()).toBe(true);
      expect(() => {
        sound.playStarChime();
        sound.playTilePlace();
        sound.playCorrectSparkle();
      }).not.toThrow();
      // Unmute
      sound.toggleMute();
    });
  });

  describe('AmbientAudioEngine (Background Soundscapes & Ducking)', () => {
    it('manages volume ducking during voice-over narration', () => {
      expect(() => {
        ambientAudio.duckVolume(true);
        ambientAudio.duckVolume(false);
      }).not.toThrow();
    });

    it('switches climate soundscapes and manages volume controls', () => {
      expect(() => {
        ambientAudio.play('tsuyu_rain');
        ambientAudio.play('arashi_storm');
        ambientAudio.play('fuyu_snow');
        ambientAudio.play('kaze_mountain_wind');
        ambientAudio.play('sakura_spring');
        ambientAudio.setVolume(0.4);
        ambientAudio.duckVolume(true);
        ambientAudio.duckVolume(false);
        ambientAudio.stop();
      }).not.toThrow();
    });
  });
});
