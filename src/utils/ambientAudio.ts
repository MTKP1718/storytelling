/**
 * Ambient Japanese Soundscape Engine
 * Pure Web Audio API synthesis for offline Japanese climate soundscapes:
 * - Rain (Tsuyu rain on wooden eaves)
 * - Storm (Arashi summer tempest with distant rolling thunder)
 * - Wind (Kaze mountain wind through bamboo groves)
 * - Sakura (Spring meadow breeze with gentle harmonic chimes)
 * - Snow (Fuyu winter stillness with soft icy shimmer)
 * - Suzumushi bell crickets & Japanese bronze temple bell gong
 */

import type { JapaneseClimate } from '../context/ThemeMoodContext';

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeChannels: Map<string, { gain: GainNode; stop: () => void }> = new Map();
  private currentClimate: JapaneseClimate | null = null;
  private isPlaying: boolean = false;
  private targetVolume: number = 0.45;
  private isDucked: boolean = false;
  private bellIntervalId: number | null = null;

  private initContext() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.targetVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    } catch {
      // AudioContext unavailable
    }
  }

  // Create pink/brownish noise buffer for natural rain/wind simulation
  private createNoiseBuffer(seconds: number = 3): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * seconds;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    return buffer;
  }

  /**
   * Sound 1: Tsuyu Rain Generator (Japanese Plum Rain)
   * Continuous gentle rain patter through multi-stage filters with occasional roof droplet taps
   */
  private startRainSound(): { gain: GainNode; stop: () => void } | null {
    if (!this.ctx || !this.masterGain) return null;
    const ctx = this.ctx;

    const channelGain = ctx.createGain();
    channelGain.gain.setValueAtTime(0.001, ctx.currentTime);
    channelGain.connect(this.masterGain);

    const noiseBuffer = this.createNoiseBuffer(4);
    if (!noiseBuffer) return null;

    // Continuous noise loop
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Lowpass filter for smooth garden rain on eaves
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, ctx.currentTime);

    // Highpass to eliminate harsh sub-bass
    const hpFilter = ctx.createBiquadFilter();
    hpFilter.type = 'highpass';
    hpFilter.frequency.setValueAtTime(250, ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(hpFilter);
    hpFilter.connect(channelGain);
    noiseSource.start();

    // Occasional subtle droplet ticks
    const dropInterval = window.setInterval(() => {
      if (!this.isPlaying) return;
      try {
        const osc = ctx.createOscillator();
        const dropGain = ctx.createGain();
        osc.type = 'sine';
        const freq = 1200 + Math.random() * 1400;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + 0.04);

        dropGain.gain.setValueAtTime(0.025, ctx.currentTime);
        dropGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

        osc.connect(dropGain);
        dropGain.connect(channelGain);

        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } catch {
        // ignore
      }
    }, 450);

    return {
      gain: channelGain,
      stop: () => {
        clearInterval(dropInterval);
        try {
          noiseSource.stop();
          noiseSource.disconnect();
        } catch {
          // ignore
        }
      },
    };
  }

  /**
   * Sound 2: Summer Tempest (Arashi Storm)
   * Rain + periodic rolling low-frequency thunder rumbles
   */
  private startStormSound(): { gain: GainNode; stop: () => void } | null {
    if (!this.ctx || !this.masterGain) return null;
    const ctx = this.ctx;

    const channelGain = ctx.createGain();
    channelGain.gain.setValueAtTime(0.001, ctx.currentTime);
    channelGain.connect(this.masterGain);

    const noiseBuffer = this.createNoiseBuffer(5);
    if (!noiseBuffer) return null;

    // Heavy rain noise source
    const rainSource = ctx.createBufferSource();
    rainSource.buffer = noiseBuffer;
    rainSource.loop = true;

    const rainFilter = ctx.createBiquadFilter();
    rainFilter.type = 'bandpass';
    rainFilter.frequency.setValueAtTime(1400, ctx.currentTime);
    rainFilter.Q.setValueAtTime(0.6, ctx.currentTime);

    rainSource.connect(rainFilter);
    rainFilter.connect(channelGain);
    rainSource.start();

    // Thunder rumbler generator
    const triggerThunder = () => {
      if (!this.isPlaying) return;
      try {
        const thunderNoise = ctx.createBufferSource();
        thunderNoise.buffer = noiseBuffer;

        const thunderFilter = ctx.createBiquadFilter();
        thunderFilter.type = 'lowpass';
        thunderFilter.frequency.setValueAtTime(90, ctx.currentTime);

        const thunderGain = ctx.createGain();
        const now = ctx.currentTime;
        thunderGain.gain.setValueAtTime(0.0001, now);
        thunderGain.gain.linearRampToValueAtTime(0.4, now + 0.8);
        thunderGain.gain.exponentialRampToValueAtTime(0.08, now + 2.5);
        thunderGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.2);

        thunderNoise.connect(thunderFilter);
        thunderFilter.connect(thunderGain);
        thunderGain.connect(channelGain);

        thunderNoise.start(now);
        thunderNoise.stop(now + 4.5);
      } catch {
        // ignore
      }
    };

    // Trigger thunder initially and on random intervals
    const initialTimer = window.setTimeout(triggerThunder, 1500);
    const thunderInterval = window.setInterval(() => {
      triggerThunder();
    }, 11000 + Math.random() * 5000);

    return {
      gain: channelGain,
      stop: () => {
        clearTimeout(initialTimer);
        clearInterval(thunderInterval);
        try {
          rainSource.stop();
          rainSource.disconnect();
        } catch {
          // ignore
        }
      },
    };
  }

  /**
   * Sound 3: Mountain Wind (Kaze through Bamboo)
   * Whispering wind with sweeping bandpass LFO filter
   */
  private startWindSound(): { gain: GainNode; stop: () => void } | null {
    if (!this.ctx || !this.masterGain) return null;
    const ctx = this.ctx;

    const channelGain = ctx.createGain();
    channelGain.gain.setValueAtTime(0.001, ctx.currentTime);
    channelGain.connect(this.masterGain);

    const noiseBuffer = this.createNoiseBuffer(5);
    if (!noiseBuffer) return null;

    const windSource = ctx.createBufferSource();
    windSource.buffer = noiseBuffer;
    windSource.loop = true;

    const bpFilter = ctx.createBiquadFilter();
    bpFilter.type = 'bandpass';
    bpFilter.frequency.setValueAtTime(450, ctx.currentTime);
    bpFilter.Q.setValueAtTime(2.5, ctx.currentTime);

    // LFO to modulate wind frequency (gusts)
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.18, ctx.currentTime); // slow swell

    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(280, ctx.currentTime); // modulate ±280 Hz

    lfo.connect(lfoGain);
    lfoGain.connect(bpFilter.frequency);

    windSource.connect(bpFilter);
    bpFilter.connect(channelGain);

    windSource.start();
    lfo.start();

    return {
      gain: channelGain,
      stop: () => {
        try {
          windSource.stop();
          lfo.stop();
          windSource.disconnect();
          lfo.disconnect();
        } catch {
          // ignore
        }
      },
    };
  }

  /**
   * Sound 4: Sakura Breeze (Soft Floral Spring Wind)
   * Gentle whispering breeze + subtle harmonic chime tones
   */
  private startSakuraSound(): { gain: GainNode; stop: () => void } | null {
    if (!this.ctx || !this.masterGain) return null;
    const ctx = this.ctx;

    const channelGain = ctx.createGain();
    channelGain.gain.setValueAtTime(0.001, ctx.currentTime);
    channelGain.connect(this.masterGain);

    const noiseBuffer = this.createNoiseBuffer(4);
    if (!noiseBuffer) return null;

    const windSource = ctx.createBufferSource();
    windSource.buffer = noiseBuffer;
    windSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, ctx.currentTime);

    windSource.connect(filter);
    filter.connect(channelGain);
    windSource.start();

    // Occasional soft wind-chime sparkle (kaze-chime)
    const chimeInterval = window.setInterval(() => {
      if (!this.isPlaying) return;
      try {
        const freqs = [880, 1174, 1318, 1760]; // Pentatonic gentle chime
        const f = freqs[Math.floor(Math.random() * freqs.length)];
        const osc = ctx.createOscillator();
        const chimeGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime);

        const now = ctx.currentTime;
        chimeGain.gain.setValueAtTime(0.0001, now);
        chimeGain.gain.linearRampToValueAtTime(0.02, now + 0.05);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

        osc.connect(chimeGain);
        chimeGain.connect(channelGain);

        osc.start(now);
        osc.stop(now + 2.0);
      } catch {
        // ignore
      }
    }, 4500);

    return {
      gain: channelGain,
      stop: () => {
        clearInterval(chimeInterval);
        try {
          windSource.stop();
          windSource.disconnect();
        } catch {
          // ignore
        }
      },
    };
  }

  /**
   * Sound 5: Fuyu Snow (Winter Stillness & Shimmer)
   * Deep quietude with subtle crystalline high-frequency flutter & soft low whisper
   */
  private startSnowSound(): { gain: GainNode; stop: () => void } | null {
    if (!this.ctx || !this.masterGain) return null;
    const ctx = this.ctx;

    const channelGain = ctx.createGain();
    channelGain.gain.setValueAtTime(0.001, ctx.currentTime);
    channelGain.connect(this.masterGain);

    const noiseBuffer = this.createNoiseBuffer(4);
    if (!noiseBuffer) return null;

    const softSource = ctx.createBufferSource();
    softSource.buffer = noiseBuffer;
    softSource.loop = true;

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(320, ctx.currentTime);

    softSource.connect(lp);
    lp.connect(channelGain);
    softSource.start();

    return {
      gain: channelGain,
      stop: () => {
        try {
          softSource.stop();
          softSource.disconnect();
        } catch {
          // ignore
        }
      },
    };
  }

  /**
   * Resonant Japanese Bronze Temple Bell (Bonshō - 梵鐘)
   * Can be triggered on demand or periodically at 35s intervals
   */
  public ringTempleBell(volumeScale: number = 0.5) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    try {
      const ctx = this.ctx;
      const now = ctx.currentTime;
      const fundamental = 128; // C3 bronze bell tone
      const harmonicRatios = [1, 2.02, 2.78, 3.84, 5.16];
      const harmonicGains = [0.4, 0.25, 0.15, 0.08, 0.04];

      harmonicRatios.forEach((ratio, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(fundamental * ratio, now);

        const initialGain = harmonicGains[idx] * volumeScale;
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(initialGain, now + 0.03);
        // Long bronze bell ring decay
        gain.gain.exponentialRampToValueAtTime(0.0001, now + (6 + idx * 1.5));

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(now);
        osc.stop(now + 9.5);
      });
    } catch {
      // ignore
    }
  }

  /**
   * Switch Climate Sound with Smooth 1.5-Second Cross-Fade
   */
  public setClimate(climate: JapaneseClimate) {
    if (this.currentClimate === climate && this.isPlaying) return;
    this.currentClimate = climate;

    if (!this.isPlaying) return;

    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const crossFadeDuration = 1.5;
    const now = this.ctx.currentTime;

    // Fade out and stop existing channels
    this.activeChannels.forEach((channel) => {
      try {
        channel.gain.gain.setValueAtTime(channel.gain.gain.value, now);
        channel.gain.gain.linearRampToValueAtTime(0.0001, now + crossFadeDuration);
        setTimeout(() => {
          channel.stop();
        }, crossFadeDuration * 1000 + 100);
      } catch {
        channel.stop();
      }
    });
    this.activeChannels.clear();

    // Start new channel
    let newChannel: { gain: GainNode; stop: () => void } | null = null;
    switch (climate) {
      case 'tsuyu_rain':
        newChannel = this.startRainSound();
        break;
      case 'arashi_storm':
        newChannel = this.startStormSound();
        break;
      case 'kaze_mountain_wind':
        newChannel = this.startWindSound();
        break;
      case 'fuyu_snow':
        newChannel = this.startSnowSound();
        break;
      case 'sakura_spring':
      default:
        newChannel = this.startSakuraSound();
        break;
    }

    if (newChannel) {
      newChannel.gain.gain.setValueAtTime(0.0001, now);
      newChannel.gain.gain.linearRampToValueAtTime(1.0, now + crossFadeDuration);
      this.activeChannels.set(climate, newChannel);
    }
  }

  /**
   * Start / Play Ambient Soundscape
   */
  public play(climate: JapaneseClimate) {
    this.initContext();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    this.isPlaying = true;
    this.setClimate(climate);

    // Start periodic gentle temple bell chime (every 32s)
    if (!this.bellIntervalId) {
      this.bellIntervalId = window.setInterval(() => {
        if (this.isPlaying && !this.isDucked) {
          this.ringTempleBell(0.28);
        }
      }, 32000);
    }
  }

  /**
   * Stop Ambient Soundscape
   */
  public stop() {
    this.isPlaying = false;
    if (this.bellIntervalId) {
      clearInterval(this.bellIntervalId);
      this.bellIntervalId = null;
    }

    if (this.ctx) {
      const now = this.ctx.currentTime;
      this.activeChannels.forEach((channel) => {
        try {
          channel.gain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
          setTimeout(() => channel.stop(), 900);
        } catch {
          channel.stop();
        }
      });
      this.activeChannels.clear();
    }
  }

  /**
   * Update Master Volume (0.0 to 1.0)
   */
  public setVolume(volume: number) {
    this.targetVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain && this.ctx) {
      const effectiveVol = this.isDucked ? this.targetVolume * 0.25 : this.targetVolume;
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(effectiveVol, this.ctx.currentTime + 0.3);
    }
  }

  /**
   * Auto-Duck Volume during Text-to-Speech (lowers volume to 25% for crystal clear narration)
   */
  public duckVolume(duck: boolean) {
    this.isDucked = duck;
    if (this.masterGain && this.ctx) {
      const effectiveVol = duck ? this.targetVolume * 0.22 : this.targetVolume;
      const now = this.ctx.currentTime;
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(effectiveVol, now + 0.4);
    }
  }
}

export const ambientAudio = new AmbientAudioEngine();
