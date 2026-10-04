// Web Audio Ambient Synthesizer for SoulFlow
// Provides high-fidelity psychoacoustic sound generation (432Hz, 528Hz Solfeggio, pink noise ocean, crystal bowl reverberation)
// Acts as both fallback and harmonic enhancer for streamed wellness audio.

class SoulFlowAudioEngine {
  private ctx: AudioContext | null = null;
  private isSynthesizing = false;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private noiseNode: AudioNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private currentFrequency = 432;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public startHarmonicAmbient(mood: string = 'relax') {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      this.stop();

      this.isSynthesizing = true;
      const t = this.ctx.currentTime;

      // Select root frequencies based on wellness mood
      let root = 432;
      let second = 432 * 1.5; // Perfect fifth
      let third = 432 * 1.25; // Major third

      if (mood === 'sleep') {
        root = 108; // Deep delta / sub harmonic
        second = 112; // 4Hz binaural beat difference for deep delta sleep
        third = 216;
      } else if (mood === 'spiritual') {
        root = 528; // Transformation & DNA Solfeggio
        second = 528 * 1.5;
        third = 264;
      } else if (mood === 'focus') {
        root = 256;
        second = 266; // 10Hz Alpha flow binaural beat
        third = 384;
      } else if (mood === 'stress') {
        root = 396; // Solfeggio releasing fear & anxiety
        second = 396 * 1.5;
        third = 198;
      }

      this.currentFrequency = root;

      // Primary warm sine wave
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(root, t);

      // Secondary harmonizer with gentle chorus detune
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(second, t);

      // Third sub-bass floor
      const osc3 = this.ctx.createOscillator();
      osc3.type = 'triangle';
      osc3.frequency.setValueAtTime(third, t);

      // Warm low-pass filter
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, t);
      this.filterNode = filter;

      // LFO for breathing swell
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.12, t); // 8-second breathing cycle
      lfoGain.gain.setValueAtTime(0.15, t);
      lfo.connect(lfoGain.gain);

      const localGain = this.ctx.createGain();
      localGain.gain.setValueAtTime(0.01, t);
      localGain.gain.exponentialRampToValueAtTime(0.25, t + 2.5); // Smooth fade in

      osc1.connect(filter);
      osc2.connect(filter);
      osc3.connect(filter);
      filter.connect(localGain);
      localGain.connect(this.masterGain);

      osc1.start(t);
      osc2.start(t);
      osc3.start(t);
      lfo.start(t);

      this.oscillators = [osc1, osc2, osc3, lfo];

      // Add gentle soothing pink noise ocean wash for sleep/relax
      if (mood === 'sleep' || mood === 'relax' || mood === 'stress') {
        this.addOceanWaves();
      }
    } catch (e) {
      console.warn('AudioEngine ambient start error:', e);
    }
  }

  private addOceanWaves() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    
    // Pink noise filter approximation
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const waveFilter = this.ctx.createBiquadFilter();
    waveFilter.type = 'lowpass';
    waveFilter.frequency.setValueAtTime(350, this.ctx.currentTime);

    // Ocean surge modulation
    const swell = this.ctx.createOscillator();
    const swellGain = this.ctx.createGain();
    swell.frequency.setValueAtTime(0.08, this.ctx.currentTime); // ~12s wave period
    swellGain.gain.setValueAtTime(200, this.ctx.currentTime);
    swell.connect(waveFilter.frequency);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    whiteNoise.connect(waveFilter);
    waveFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    whiteNoise.start();
    swell.start();
    this.noiseNode = noiseGain;
    this.oscillators.push(swell);
  }

  private ambientNodes: Record<string, { gainNode: GainNode; stop: () => void }> = {};

  public setAmbientLayer(layerId: string, volumePercent: number) {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const normVolume = Math.max(0, Math.min(1, volumePercent / 100));

      if (normVolume <= 0) {
        if (this.ambientNodes[layerId]) {
          try {
            this.ambientNodes[layerId].gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
            this.ambientNodes[layerId].stop();
          } catch (_) {}
          delete this.ambientNodes[layerId];
        }
        return;
      }

      // If already playing, adjust volume
      if (this.ambientNodes[layerId]) {
        this.ambientNodes[layerId].gainNode.gain.setValueAtTime(normVolume * 0.35, this.ctx.currentTime);
        return;
      }

      // Start layer synthesizer
      const t = this.ctx.currentTime;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(normVolume * 0.35, t);
      gain.connect(this.masterGain);

      let stopFn = () => {};

      if (layerId === 'rain') {
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.15;
        }
        const src = this.ctx.createBufferSource();
        src.buffer = buffer;
        src.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, t);
        filter.Q.setValueAtTime(1.5, t);

        src.connect(filter);
        filter.connect(gain);
        src.start();
        stopFn = () => { try { src.stop(); src.disconnect(); } catch (_) {} };
      } else if (layerId === 'waves') {
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          lastOut = (lastOut + 0.02 * white) / 1.02;
          data[i] = lastOut * 0.4;
        }
        const src = this.ctx.createBufferSource();
        src.buffer = buffer;
        src.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, t);

        const swell = this.ctx.createOscillator();
        const swellGain = this.ctx.createGain();
        swell.frequency.setValueAtTime(0.08, t);
        swellGain.gain.setValueAtTime(250, t);
        swell.connect(filter.frequency);

        src.connect(filter);
        filter.connect(gain);
        src.start();
        swell.start();
        stopFn = () => { try { src.stop(); swell.stop(); } catch (_) {} };
      } else if (layerId === 'fire') {
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          const isPop = Math.random() < 0.002;
          data[i] = isPop ? (Math.random() * 2 - 1) * 0.6 : (Math.random() * 2 - 1) * 0.03;
        }
        const src = this.ctx.createBufferSource();
        src.buffer = buffer;
        src.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, t);

        src.connect(filter);
        filter.connect(gain);
        src.start();
        stopFn = () => { try { src.stop(); src.disconnect(); } catch (_) {} };
      } else if (layerId === 'wind') {
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.12;
        }
        const src = this.ctx.createBufferSource();
        src.buffer = buffer;
        src.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(320, t);
        filter.Q.setValueAtTime(3.0, t);

        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(0.1, t);
        lfoGain.gain.setValueAtTime(150, t);
        lfo.connect(filter.frequency);

        src.connect(filter);
        filter.connect(gain);
        src.start();
        lfo.start();
        stopFn = () => { try { src.stop(); lfo.stop(); } catch (_) {} };
      } else if (layerId === 'bowl') {
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(432, t);
        osc2.frequency.setValueAtTime(864, t);

        const tremolo = this.ctx.createOscillator();
        const tremoloGain = this.ctx.createGain();
        tremolo.frequency.setValueAtTime(0.2, t);
        tremoloGain.gain.setValueAtTime(0.08, t);
        tremolo.connect(gain.gain);

        osc1.connect(gain);
        osc2.connect(gain);
        osc1.start();
        osc2.start();
        tremolo.start();
        stopFn = () => { try { osc1.stop(); osc2.stop(); tremolo.stop(); } catch (_) {} };
      }

      this.ambientNodes[layerId] = { gainNode: gain, stop: stopFn };
    } catch (e) {
      console.warn('setAmbientLayer error:', e);
    }
  }

  public setVolume(val: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, val * 0.4)), this.ctx.currentTime);
    }
  }

  public stop() {
    try {
      this.oscillators.forEach(osc => {
        try { osc.stop(); osc.disconnect(); } catch (_) {}
      });
      this.oscillators = [];
      if (this.noiseNode) {
        try { this.noiseNode.disconnect(); } catch (_) {}
        this.noiseNode = null;
      }
      Object.keys(this.ambientNodes).forEach(k => {
        try { this.ambientNodes[k].stop(); } catch (_) {}
      });
      this.ambientNodes = {};
      this.isSynthesizing = false;
    } catch (_) {}
  }
}

export const audioEngine = new SoulFlowAudioEngine();
