/**
 * Web Audio API synthesizer for ambient background study music & interactive sound effects.
 * 100% offline, zero external dependencies, peaceful and educational tone.
 * Conforms strictly to browser audio autoplay policies: only triggers on explicit user click.
 */

class SoundController {
  private ctx: AudioContext | null = null;
  private isMusicPlaying: boolean = false;
  private isSfxEnabled: boolean = true;
  private musicInterval: number | null = null;
  private musicGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- AMBIENT BACKGROUND MUSIC (Peaceful Study Chords) ---
  public toggleMusic(enable?: boolean): boolean {
    const targetState = enable !== undefined ? enable : !this.isMusicPlaying;
    if (targetState) {
      this.startAmbientMusic();
    } else {
      this.stopAmbientMusic();
    }
    return this.isMusicPlaying;
  }

  public getMusicState(): boolean {
    return this.isMusicPlaying;
  }

  public toggleSfx(enable?: boolean): boolean {
    this.isSfxEnabled = enable !== undefined ? enable : !this.isSfxEnabled;
    return this.isSfxEnabled;
  }

  public getSfxState(): boolean {
    return this.isSfxEnabled;
  }

  private startAmbientMusic() {
    try {
      this.initContext();
      if (!this.ctx) return;

      this.isMusicPlaying = true;
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.04, this.ctx.currentTime); // gentle low volume
      this.musicGain.connect(this.ctx.destination);

      // Pentatonic calming frequency progressions (C major / A minor pentatonic: C, D, E, G, A)
      const chords = [
        [261.63, 329.63, 392.00, 523.25], // C - E - G - C
        [220.00, 261.63, 329.63, 440.00], // A - C - E - A
        [174.61, 220.00, 261.63, 349.23], // F - A - C - F
        [196.00, 246.94, 293.66, 392.00], // G - B - D - G
      ];
      let chordIndex = 0;

      const playChord = () => {
        if (!this.isMusicPlaying || !this.ctx || !this.musicGain) return;
        const currentChord = chords[chordIndex % chords.length];
        chordIndex++;

        currentChord.forEach((freq, i) => {
          if (!this.ctx || !this.musicGain) return;
          const osc = this.ctx.createOscillator();
          const noteGain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

          // Gentle bell envelope
          const startTime = this.ctx.currentTime + i * 0.15;
          const duration = 3.5;

          noteGain.gain.setValueAtTime(0.0001, startTime);
          noteGain.gain.exponentialRampToValueAtTime(0.04, startTime + 0.3);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

          osc.connect(noteGain);
          noteGain.connect(this.musicGain);

          osc.start(startTime);
          osc.stop(startTime + duration);
        });
      };

      playChord();
      this.musicInterval = window.setInterval(playChord, 3800);
    } catch {
      this.isMusicPlaying = false;
    }
  }

  private stopAmbientMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this.musicGain && this.ctx) {
      try {
        this.musicGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      } catch {
        // ignore ramp error
      }
    }
  }

  // --- SOUND EFFECTS ---
  public playClick() {
    if (!this.isSfxEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {
      // audio suspended or blocked
    }
  }

  public playSuccess() {
    if (!this.isSfxEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

        const startTime = this.ctx.currentTime + idx * 0.08;
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(0.08, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.4);
      });
    } catch {
      // audio suspended or blocked
    }
  }

  public playAction() {
    if (!this.isSfxEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch {
      // audio suspended
    }
  }

  public playDelete() {
    if (!this.isSfxEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch {
      // audio suspended
    }
  }
}

export const soundManager = new SoundController();
