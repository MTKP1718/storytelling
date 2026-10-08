import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

// Mock HTMLCanvasElement.prototype.getContext
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn(),
    putImageData: vi.fn(),
    createImageData: vi.fn(),
    setTransform: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    fillText: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    stroke: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    createRadialGradient: vi.fn().mockReturnValue({ addColorStop: vi.fn() }),
    createLinearGradient: vi.fn().mockReturnValue({ addColorStop: vi.fn() }),
    bezierCurveTo: vi.fn(),
    quadraticCurveTo: vi.fn(),
    ellipse: vi.fn(),
    clip: vi.fn(),
  });
}

// Mock Web Audio API
class MockAudioContext {
  state = 'running';
  currentTime = 0;
  destination = {};
  createOscillator() {
    return {
      connect: vi.fn(),
      disconnect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      frequency: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
        value: 440,
      },
      type: 'sine',
    };
  }
  createGain() {
    return {
      connect: vi.fn(),
      disconnect: vi.fn(),
      gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
        value: 1,
      },
    };
  }
  createBiquadFilter() {
    return {
      connect: vi.fn(),
      disconnect: vi.fn(),
      frequency: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
        value: 1000,
      },
      Q: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
        value: 1,
      },
      type: 'lowpass',
    };
  }
  createBufferSource() {
    return {
      connect: vi.fn(),
      disconnect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      buffer: null,
      loop: false,
    };
  }
  createBuffer() {
    return {
      getChannelData: vi.fn().mockReturnValue(new Float32Array(1024)),
    };
  }
  resume = vi.fn().mockResolvedValue(undefined);
  close = vi.fn().mockResolvedValue(undefined);
}

// Assign to window if in browser environment
if (typeof window !== 'undefined') {
  window.AudioContext = MockAudioContext as unknown as typeof AudioContext;
  (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext = MockAudioContext as unknown as typeof AudioContext;

  // Mock Web Speech API
  class MockSpeechSynthesisUtterance {
    text: string;
    lang = 'en-US';
    rate = 1;
    pitch = 1;
    volume = 1;
    voice: SpeechSynthesisVoice | null = null;
    onboundary: ((e: { name: string; charIndex: number; charLength?: number }) => void) | null = null;
    onend: (() => void) | null = null;
    onerror: (() => void) | null = null;

    constructor(text = '') {
      this.text = text;
    }
  }

  const mockSpeechSynthesis = {
    speaking: false,
    paused: false,
    pending: false,
    onvoiceschanged: null,
    getVoices: vi.fn().mockReturnValue([
      { name: 'Google US English', lang: 'en-US', default: true },
      { name: 'Samantha', lang: 'en-US', default: false },
    ]),
    speak: vi.fn(),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
  };

  window.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance as unknown as typeof SpeechSynthesisUtterance;
  window.speechSynthesis = mockSpeechSynthesis as unknown as SpeechSynthesis;

  // Mock matchMedia
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

  // Mock requestAnimationFrame / cancelAnimationFrame
  window.requestAnimationFrame = vi.fn().mockImplementation((cb: FrameRequestCallback) => {
    return setTimeout(() => cb(Date.now()), 16) as unknown as number;
  });
  window.cancelAnimationFrame = vi.fn().mockImplementation((id: number) => {
    clearTimeout(id);
  });
}
