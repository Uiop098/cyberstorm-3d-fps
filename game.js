/* ==========================================================================
   CYBERSTORM: PROTOCOL 0 - ENHANCED 3D SCI-FI FPS ENGINE
   ========================================================================== */

/* ==========================================================================
   1. SETTINGS & CONFIGURATION SYSTEM
   ========================================================================== */
const DEFAULT_SETTINGS = {
  difficulty: 'medium',       // 'easy' | 'medium' | 'hard' | 'nightmare'
  defaultPOV: 'FPP',          // 'FPP' | 'TPP'
  defaultFireMode: 'AUTO',    // 'AUTO' | 'BURST' | 'SEMI'
  aimAssist: 50,              // 0 to 100 (%)
  sensitivityX: 1.0,          // 0.3 to 3.0
  sensitivityY: 1.0,          // 0.3 to 3.0
  invertY: false,             // boolean
  haptic: true,               // boolean
  graphicsPreset: 'high',     // 'high' | 'medium' | 'low'
  fov: 75,                    // 60 to 105
  scanlines: true,            // boolean
  particles: true,            // boolean
  damageNumbers: true,        // boolean
  audioEnabled: true,         // boolean
  musicEnabled: true,         // boolean
  musicVol: 70,               // 0 to 100
  sfxVol: 90,                 // 0 to 100
  touchLayout: 'layout-standard', // 'layout-standard' | 'layout-compact' | 'layout-wide'
  touchScale: 100,            // 70 to 140 (%)
  touchOpacity: 85,           // 30 to 100 (%)
  reticleStyle: 'style-cross',// 'style-cross' | 'style-ring' | 'style-dot' | 'style-hex'
  reticleColor: '#00f0ff'     // hex string
};

let settings = Object.assign({}, DEFAULT_SETTINGS);

function loadSettings() {
  try {
    const saved = localStorage.getItem('cyberstorm_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      settings = Object.assign({}, DEFAULT_SETTINGS, parsed);
    }
  } catch (e) {
    console.warn('Could not load saved settings, using defaults.', e);
    settings = Object.assign({}, DEFAULT_SETTINGS);
  }
}

function saveSettings() {
  try {
    localStorage.setItem('cyberstorm_settings', JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to persist settings.', e);
  }
}

function applySettings() {
  // Scanlines Overlay
  const scanlinesEl = document.getElementById('scanlines-fx');
  if (scanlinesEl) {
    if (settings.scanlines) {
      scanlinesEl.classList.remove('disabled');
    } else {
      scanlinesEl.classList.add('disabled');
    }
  }

  // CSS Custom Properties
  document.documentElement.style.setProperty('--reticle-color', settings.reticleColor);
  document.documentElement.style.setProperty('--touch-scale', (settings.touchScale / 100).toString());
  document.documentElement.style.setProperty('--touch-opacity', (settings.touchOpacity / 100).toString());

  // Reticle Style
  const reticleEl = document.getElementById('reticle-container');
  if (reticleEl) {
    reticleEl.className = settings.reticleStyle || 'style-cross';
  }

  // Camera Field of View
  if (camera) {
    camera.fov = Number(settings.fov) || 75;
    camera.updateProjectionMatrix();
  }

  // Graphics Performance Preset
  if (renderer) {
    if (settings.graphicsPreset === 'high') {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    } else if (settings.graphicsPreset === 'medium') {
      renderer.setPixelRatio(1);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.BasicShadowMap;
    } else {
      renderer.setPixelRatio(0.85);
      renderer.shadowMap.enabled = false;
    }
  }

  // Audio Engine Volumes & Music
  if (audio) {
    audio.setMasterVolume(settings.audioEnabled ? 1.0 : 0.0);
    audio.setSFXVolume(settings.sfxVol / 100);
    audio.setMusicVolume(settings.musicEnabled && settings.audioEnabled ? settings.musicVol / 100 : 0.0);
  }

  // Audio & Music HUD Icon Indicators
  const soundOn = document.getElementById('icon-sound-on');
  const soundOff = document.getElementById('icon-sound-off');
  if (soundOn && soundOff) {
    soundOn.classList.toggle('hidden', !settings.audioEnabled);
    soundOff.classList.toggle('hidden', settings.audioEnabled);
  }

  const musicOn = document.getElementById('icon-music-on');
  const musicOff = document.getElementById('icon-music-off');
  if (musicOn && musicOff) {
    musicOn.classList.toggle('hidden', !settings.musicEnabled);
    musicOff.classList.toggle('hidden', settings.musicEnabled);
  }

  // Difficulty selection UI updates in start menu
  const diffBtns = document.querySelectorAll('#start-diff-selector .diff-btn');
  diffBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.diff === settings.difficulty);
  });
}

function populateSettingsForm() {
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  };
  const setChecked = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.checked = !!val;
  };
  const setText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setVal('setting-difficulty', settings.difficulty);
  setVal('setting-default-pov', settings.defaultPOV);
  setVal('setting-default-firemode', settings.defaultFireMode);

  setVal('setting-aim-assist', settings.aimAssist);
  setText('val-aim-assist', settings.aimAssist + '%');

  setVal('setting-sensitivity-x', settings.sensitivityX);
  setText('val-sensitivity-x', parseFloat(settings.sensitivityX).toFixed(1) + 'x');

  setVal('setting-sensitivity-y', settings.sensitivityY);
  setText('val-sensitivity-y', parseFloat(settings.sensitivityY).toFixed(1) + 'x');

  setChecked('setting-invert-y', settings.invertY);
  setChecked('setting-haptic', settings.haptic);

  setVal('setting-graphics-preset', settings.graphicsPreset);
  setVal('setting-fov', settings.fov);
  setText('val-fov', settings.fov + '°');

  setChecked('setting-scanlines', settings.scanlines);
  setChecked('setting-particles', settings.particles);
  setChecked('setting-damage-nums', settings.damageNumbers);

  setChecked('setting-audio-enable', settings.audioEnabled);
  setChecked('setting-music-enable', settings.musicEnabled);

  setVal('setting-music-vol', settings.musicVol);
  setText('val-music-vol', settings.musicVol + '%');

  setVal('setting-sfx-vol', settings.sfxVol);
  setText('val-sfx-vol', settings.sfxVol + '%');

  setVal('setting-touch-layout', settings.touchLayout);
  setVal('setting-touch-scale', settings.touchScale);
  setText('val-touch-scale', settings.touchScale + '%');

  setVal('setting-touch-opacity', settings.touchOpacity);
  setText('val-touch-opacity', settings.touchOpacity + '%');

  setVal('setting-reticle-style', settings.reticleStyle);
  setVal('setting-reticle-color', settings.reticleColor);
}

function readSettingsFromForm() {
  const getVal = id => {
    const el = document.getElementById(id);
    return el ? el.value : null;
  };
  const getChecked = id => {
    const el = document.getElementById(id);
    return el ? el.checked : false;
  };

  settings.difficulty = getVal('setting-difficulty') || 'medium';
  settings.defaultPOV = getVal('setting-default-pov') || 'FPP';
  settings.defaultFireMode = getVal('setting-default-firemode') || 'AUTO';

  settings.aimAssist = Number(getVal('setting-aim-assist')) || 50;
  settings.sensitivityX = Number(getVal('setting-sensitivity-x')) || 1.0;
  settings.sensitivityY = Number(getVal('setting-sensitivity-y')) || 1.0;
  settings.invertY = getChecked('setting-invert-y');
  settings.haptic = getChecked('setting-haptic');

  settings.graphicsPreset = getVal('setting-graphics-preset') || 'high';
  settings.fov = Number(getVal('setting-fov')) || 75;
  settings.scanlines = getChecked('setting-scanlines');
  settings.particles = getChecked('setting-particles');
  settings.damageNumbers = getChecked('setting-damage-nums');

  settings.audioEnabled = getChecked('setting-audio-enable');
  settings.musicEnabled = getChecked('setting-music-enable');
  settings.musicVol = Number(getVal('setting-music-vol')) || 70;
  settings.sfxVol = Number(getVal('setting-sfx-vol')) || 90;

  settings.touchLayout = getVal('setting-touch-layout') || 'layout-standard';
  settings.touchScale = Number(getVal('setting-touch-scale')) || 100;
  settings.touchOpacity = Number(getVal('setting-touch-opacity')) || 85;

  settings.reticleStyle = getVal('setting-reticle-style') || 'style-cross';
  settings.reticleColor = getVal('setting-reticle-color') || '#00f0ff';
}

function triggerHaptic(duration = 20) {
  if (!settings.haptic) return;
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate(duration);
    } catch (e) {}
  }
}

/* ==========================================================================
   2. SYNTHESIZED WEB AUDIO API & CYBERPUNK MUSIC ENGINE
   ========================================================================== */
class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.sfxGain = null;
    this.musicGain = null;
    this.isMusicPlaying = false;
    this.musicInterval = null;
    this.musicStep = 0;
    this.inCombat = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        this.masterGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();
        this.musicGain = this.ctx.createGain();

        this.sfxGain.connect(this.masterGain);
        this.musicGain.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);

        this.setMasterVolume(settings.audioEnabled ? 1.0 : 0.0);
        this.setSFXVolume(settings.sfxVol / 100);
        this.setMusicVolume(settings.musicEnabled && settings.audioEnabled ? settings.musicVol / 100 : 0.0);

        this.startMusic();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMasterVolume(val) {
    if (!this.masterGain || !this.ctx) return;
    const clamped = Math.max(0, Math.min(1, val));
    this.masterGain.gain.setValueAtTime(clamped, this.ctx.currentTime);
  }

  setSFXVolume(val) {
    if (!this.sfxGain || !this.ctx) return;
    const clamped = Math.max(0, Math.min(1, val));
    this.sfxGain.gain.setValueAtTime(clamped, this.ctx.currentTime);
  }

  setMusicVolume(val) {
    if (!this.musicGain || !this.ctx) return;
    const clamped = Math.max(0, Math.min(1, val));
    this.musicGain.gain.setValueAtTime(clamped, this.ctx.currentTime);
  }

  startMusic() {
    if (this.isMusicPlaying || !this.ctx) return;
    this.isMusicPlaying = true;
    this.musicStep = 0;

    // 16-step Cyberpunk sequencer loop (130 BPM -> 16th note = ~115ms)
    const stepDuration = 0.115;
    const notesBass = [73.42, 73.42, 87.31, 73.42, 98.00, 73.42, 110.00, 98.00, 73.42, 73.42, 87.31, 73.42, 123.47, 110.00, 98.00, 87.31]; // D1, F1, G1, A1, B1
    const notesLead = [293.66, 329.63, 349.23, 440.00, 392.00, 349.23, 329.63, 293.66, 440.00, 523.25, 587.33, 523.25, 440.00, 392.00, 349.23, 329.63]; // D4 cyber scale

    const tick = () => {
      if (!this.isMusicPlaying || !this.ctx || !settings.musicEnabled || !settings.audioEnabled) {
        return;
      }
      const now = this.ctx.currentTime;
      const step = this.musicStep % 16;
      this.musicStep++;

      // In Combat: Play driving 16th bassline and drums
      if (this.inCombat) {
        // Bass synth note
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        const bassFilter = this.ctx.createBiquadFilter();

        bassOsc.type = 'sawtooth';
        bassOsc.frequency.setValueAtTime(notesBass[step], now);

        bassFilter.type = 'lowpass';
        bassFilter.frequency.setValueAtTime(step % 4 === 0 ? 900 : 450, now);
        bassFilter.frequency.exponentialRampToValueAtTime(100, now + stepDuration * 0.9);

        bassGain.gain.setValueAtTime(0.22, now);
        bassGain.gain.exponentialRampToValueAtTime(0.01, now + stepDuration * 0.95);

        bassOsc.connect(bassFilter);
        bassFilter.connect(bassGain);
        bassGain.connect(this.musicGain);

        bassOsc.start(now);
        bassOsc.stop(now + stepDuration);

        // Kick Drum on quarter notes (steps 0, 4, 8, 12)
        if (step % 4 === 0) {
          const kickOsc = this.ctx.createOscillator();
          const kickGain = this.ctx.createGain();
          kickOsc.type = 'sine';
          kickOsc.frequency.setValueAtTime(130, now);
          kickOsc.frequency.exponentialRampToValueAtTime(35, now + 0.12);

          kickGain.gain.setValueAtTime(0.4, now);
          kickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

          kickOsc.connect(kickGain);
          kickGain.connect(this.musicGain);

          kickOsc.start(now);
          kickOsc.stop(now + 0.12);
        }

        // Hi-Hat / Synth Percussion on offbeats (steps 2, 6, 10, 14)
        if (step % 2 === 1) {
          const hhSize = Math.floor(this.ctx.sampleRate * 0.03);
          const hhBuf = this.ctx.createBuffer(1, hhSize, this.ctx.sampleRate);
          const hhData = hhBuf.getChannelData(0);
          for (let i = 0; i < hhSize; i++) hhData[i] = Math.random() * 2 - 1;
          const hhSource = this.ctx.createBufferSource();
          hhSource.buffer = hhBuf;

          const hhFilter = this.ctx.createBiquadFilter();
          hhFilter.type = 'highpass';
          hhFilter.frequency.setValueAtTime(7000, now);

          const hhGain = this.ctx.createGain();
          hhGain.gain.setValueAtTime(0.09, now);
          hhGain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);

          hhSource.connect(hhFilter);
          hhFilter.connect(hhGain);
          hhGain.connect(this.musicGain);

          hhSource.start(now);
          hhSource.stop(now + 0.03);
        }

        // Cyber Arp Lead on specific steps
        if (step % 2 === 0 && Math.random() > 0.25) {
          const leadOsc = this.ctx.createOscillator();
          const leadGain = this.ctx.createGain();
          leadOsc.type = 'square';
          leadOsc.frequency.setValueAtTime(notesLead[step], now);

          leadGain.gain.setValueAtTime(0.07, now);
          leadGain.gain.exponentialRampToValueAtTime(0.01, now + stepDuration * 0.8);

          leadOsc.connect(leadGain);
          leadGain.connect(this.musicGain);

          leadOsc.start(now);
          leadOsc.stop(now + stepDuration);
        }
      } else {
        // Ambient / Prep Drone & Chord Pad on whole bars
        if (step === 0 || step === 8) {
          const padOsc1 = this.ctx.createOscillator();
          const padOsc2 = this.ctx.createOscillator();
          const padGain = this.ctx.createGain();
          const padFilter = this.ctx.createBiquadFilter();

          padOsc1.type = 'sawtooth';
          padOsc2.type = 'triangle';

          const chordRoot = step === 0 ? 146.83 : 110.00; // D3 / A2
          padOsc1.frequency.setValueAtTime(chordRoot, now);
          padOsc2.frequency.setValueAtTime(chordRoot * 1.498, now); // Fifth

          padFilter.type = 'lowpass';
          padFilter.frequency.setValueAtTime(320, now);

          padGain.gain.setValueAtTime(0.16, now);
          padGain.gain.exponentialRampToValueAtTime(0.01, now + stepDuration * 7.5);

          padOsc1.connect(padFilter);
          padOsc2.connect(padFilter);
          padFilter.connect(padGain);
          padGain.connect(this.musicGain);

          padOsc1.start(now);
          padOsc2.start(now);
          padOsc1.stop(now + stepDuration * 8);
          padOsc2.stop(now + stepDuration * 8);
        }
      }
    };

    this.musicInterval = setInterval(tick, stepDuration * 1000);
  }

  stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  setCombatMode(active) {
    this.inCombat = active;
  }

  toggleMusic() {
    settings.musicEnabled = !settings.musicEnabled;
    this.setMusicVolume(settings.musicEnabled && settings.audioEnabled ? settings.musicVol / 100 : 0.0);
    applySettings();
    saveSettings();
  }

  toggleAudio() {
    settings.audioEnabled = !settings.audioEnabled;
    this.setMasterVolume(settings.audioEnabled ? 1.0 : 0.0);
    this.setMusicVolume(settings.musicEnabled && settings.audioEnabled ? settings.musicVol / 100 : 0.0);
    applySettings();
    saveSettings();
  }

  playPlasmaShot() {
    if (!this.ctx || !settings.audioEnabled) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.11);
    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.11);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.11);
  }

  playShotgunShot() {
    if (!this.ctx || !settings.audioEnabled) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.18);
    oscGain.gain.setValueAtTime(0.4, now);
    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
    osc.connect(oscGain);
    oscGain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.18);

    const bufferSize = Math.floor(this.ctx.sampleRate * 0.16);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(750, now);
    filter.Q.setValueAtTime(1.5, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.sfxGain);
    noise.start(now);
    noise.stop(now + 0.16);
  }

  playRailgunShot() {
    if (!this.ctx || !settings.audioEnabled) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2100, now);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.38);
    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.38);

    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(1400, now);
    osc2.frequency.exponentialRampToValueAtTime(120, now + 0.22);
    gain2.gain.setValueAtTime(0.2, now);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
    osc2.connect(gain2);
    gain2.connect(this.sfxGain);
    osc2.start(now);
    osc2.stop(now + 0.22);
  }

  playRocketLaunch() {
    if (!this.ctx || !settings.audioEnabled) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(450, now + 0.22);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  playHit(isCrit = false) {
    if (!this.ctx || !settings.audioEnabled) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    const freq = isCrit ? 720 : 340;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.09);
    gain.gain.setValueAtTime(isCrit ? 0.38 : 0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  playExplosion(isLarge = false) {
    if (!this.ctx || !settings.audioEnabled) return;
    const now = this.ctx.currentTime;
    const duration = isLarge ? 0.95 : 0.6;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isLarge ? 650 : 850, now);
    filter.frequency.exponentialRampToValueAtTime(30, now + duration * 0.9);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(isLarge ? 0.65 : 0.48, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    noise.start(now);
    noise.stop(now + duration);

    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(isLarge ? 95 : 120, now);
    subOsc.frequency.exponentialRampToValueAtTime(25, now + 0.3);
    subGain.gain.setValueAtTime(isLarge ? 0.55 : 0.35, now);
    subGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    subOsc.connect(subGain);
    subGain.connect(this.sfxGain);
    subOsc.start(now);
    subOsc.stop(now + 0.3);
  }

  playHurt() {
    if (!this.ctx || !settings.audioEnabled) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.22);
    gain.gain.setValueAtTime(0.55, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  playReload() {
    if (!this.ctx || !settings.audioEnabled) return;
    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(480, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.09);
    osc1.connect(gain1);
    gain1.connect(this.sfxGain);
    osc1.start(now);
    osc1.stop(now + 0.09);

    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(720, now + 0.28);
    gain2.gain.setValueAtTime(0.22, now + 0.28);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.38);
    osc2.connect(gain2);
    gain2.connect(this.sfxGain);
    osc2.start(now + 0.28);
    osc2.stop(now + 0.38);
  }

  playWaveClear() {
    if (!this.ctx || !settings.audioEnabled) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const startT = now + idx * 0.08;
      osc.frequency.setValueAtTime(freq, startT);
      gain.gain.setValueAtTime(0.24, startT);
      gain.gain.exponentialRampToValueAtTime(0.01, startT + 0.28);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(startT);
      osc.stop(startT + 0.28);
    });
  }

  playPowerup() {
    if (!this.ctx || !settings.audioEnabled) return;
    const now = this.ctx.currentTime;
    const freqs = [440, 659.25, 880, 1318.5];
    freqs.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const st = now + i * 0.06;
      osc.frequency.setValueAtTime(f, st);
      gain.gain.setValueAtTime(0.22, st);
      gain.gain.exponentialRampToValueAtTime(0.01, st + 0.32);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(st);
      osc.stop(st + 0.32);
    });
  }

  playDroneLaser() {
    if (!this.ctx || !settings.audioEnabled) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.14);
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  playDash() {
    if (!this.ctx || !settings.audioEnabled) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.15);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  playBossSpawn() {
    if (!this.ctx || !settings.audioEnabled) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(75, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 1.2);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, now);
    filter.frequency.exponentialRampToValueAtTime(50, now + 1.2);

    gain.gain.setValueAtTime(0.55, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 1.2);
  }

  playStim() {
    if (!this.ctx || !settings.audioEnabled) return;
    const now = this.ctx.currentTime;

    // Pneumatic hiss
    const bufSize = Math.floor(this.ctx.sampleRate * 0.12);
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2200, now);
    filter.Q.setValueAtTime(2.0, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.25, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.sfxGain);
    noise.start(now);
    noise.stop(now + 0.12);

    // Soothing medical chime chord
    const freqs = [587.33, 739.99, 880.00];
    freqs.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const st = now + 0.05 + i * 0.04;
      osc.frequency.setValueAtTime(f, st);
      gain.gain.setValueAtTime(0.18, st);
      gain.gain.exponentialRampToValueAtTime(0.01, st + 0.35);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(st);
      osc.stop(st + 0.35);
    });
  }

  playFireModeSwitch() {
    if (!this.ctx || !settings.audioEnabled) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1100, now);
    osc.frequency.exponentialRampToValueAtTime(450, now + 0.04);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  playPerspectiveSwitch() {
    if (!this.ctx || !settings.audioEnabled) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.exponentialRampToValueAtTime(1600, now + 0.08);
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.08);
  }
}

const audio = new AudioEngine();

/* ==========================================================================
   3. SECTORS & LEVEL THEMES (4 THEMED SECTORS)
   ========================================================================== */
const SECTORS = [
  {
    id: 0,
    tag: 'SECTOR 01',
    name: 'SECTOR 01: NEON METROPOLIS',
    wavesCount: 3,
    fogColor: 0x030a14,
    ambientColor: 0x0c1a2c,
    mainLightColor: 0x00f0ff,
    pillarColor: 0x121b2d,
    accentColor: 0x00f0ff,
    wallColor: 0x09121d,
    floorTheme: 'grid_cyan'
  },
  {
    id: 1,
    tag: 'SECTOR 02',
    name: 'SECTOR 02: REACTOR SUB-CORE',
    wavesCount: 3,
    fogColor: 0x140b02,
    ambientColor: 0x221505,
    mainLightColor: 0xffb700,
    pillarColor: 0x24170c,
    accentColor: 0xff7700,
    wallColor: 0x1a0f05,
    floorTheme: 'hazard_orange'
  },
  {
    id: 2,
    tag: 'SECTOR 03',
    name: 'SECTOR 03: ORBITAL VOID HANGAR',
    wavesCount: 3,
    fogColor: 0x020610,
    ambientColor: 0x081220,
    mainLightColor: 0x66ccff,
    pillarColor: 0x0c182a,
    accentColor: 0x0088ff,
    wallColor: 0x060f1b,
    floorTheme: 'titanium_deck'
  },
  {
    id: 3,
    tag: 'SECTOR 04',
    name: 'SECTOR 04: APEX QUANTUM CORE',
    wavesCount: 3,
    fogColor: 0x0d0212,
    ambientColor: 0x1a0522,
    mainLightColor: 0xff0077,
    pillarColor: 0x24082d,
    accentColor: 0xff0077,
    wallColor: 0x18031e,
    floorTheme: 'quantum_matrix'
  }
];

/* ==========================================================================
   4. WEAPON ARSENAL DEFINITIONS (4 WEAPONS)
   ========================================================================== */
const WEAPONS = [
  {
    name: 'PLASMA CARBINE V4',
    shortName: 'PLASMA',
    type: 'PLASMA',
    damage: 18,
    fireRate: 0.11,     // seconds between shots
    clipSize: 30,
    maxAmmo: Infinity,
    reloadTime: 1.2,
    spread: 0.018,
    range: 100,
    color: 0x00f0ff,
    tracerSpeed: 160,
    recoilKick: 0.04
  },
  {
    name: 'SCATTERGUN ST-8',
    shortName: 'SHOTGUN',
    type: 'SHOTGUN',
    damage: 12,         // per pellet
    pellets: 8,
    fireRate: 0.65,
    clipSize: 8,
    maxAmmo: Infinity,
    reloadTime: 1.8,
    spread: 0.085,
    range: 45,
    color: 0xffb700,
    tracerSpeed: 130,
    recoilKick: 0.14
  },
  {
    name: 'HYPER-RAILGUN X',
    shortName: 'RAILGUN',
    type: 'RAILGUN',
    damage: 125,
    fireRate: 1.1,
    clipSize: 4,
    maxAmmo: Infinity,
    reloadTime: 2.2,
    spread: 0.001,
    range: 200,
    color: 0x00ffea,
    isBeam: true,
    recoilKick: 0.22
  },
  {
    name: 'VOID ROCKET LAUNCHER',
    shortName: 'ROCKET',
    type: 'ROCKET',
    damage: 150,
    radius: 8.5,
    fireRate: 0.9,
    clipSize: 4,
    maxAmmo: Infinity,
    reloadTime: 2.4,
    spread: 0.005,
    range: 120,
    color: 0xff0055,
    isProjectile: true,
    projectileSpeed: 48,
    recoilKick: 0.18
  }
];

/* ==========================================================================
   5. DIFFICULTY SYSTEM
   ========================================================================== */
const DIFFICULTY_CONFIG = {
  easy: {
    name: 'RECRUIT',
    playerHp: 150,
    playerShield: 150,
    enemyHpMult: 0.75,
    enemyDmgMult: 0.65,
    shieldRegenDelay: 2.0,
    shieldRegenRate: 35
  },
  medium: {
    name: 'SOLDIER',
    playerHp: 100,
    playerShield: 100,
    enemyHpMult: 1.0,
    enemyDmgMult: 1.0,
    shieldRegenDelay: 3.0,
    shieldRegenRate: 25
  },
  hard: {
    name: 'VETERAN',
    playerHp: 80,
    playerShield: 80,
    enemyHpMult: 1.35,
    enemyDmgMult: 1.45,
    shieldRegenDelay: 4.0,
    shieldRegenRate: 18
  },
  nightmare: {
    name: 'NIGHTMARE',
    playerHp: 60,
    playerShield: 60,
    enemyHpMult: 1.7,
    enemyDmgMult: 2.0,
    shieldRegenDelay: 5.0,
    shieldRegenRate: 12
  }
};

/* ==========================================================================
   6. PROCEDURAL CANVAS TEXTURE GENERATORS
   ========================================================================== */
function createGridFloorTexture(themeKey) {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  let bg = '#030810';
  let line = 'rgba(0, 240, 255, 0.45)';
  let sub = 'rgba(0, 240, 255, 0.12)';

  if (themeKey === 'hazard_orange') {
    bg = '#0e0802';
    line = 'rgba(255, 183, 0, 0.5)';
    sub = 'rgba(255, 120, 0, 0.15)';
  } else if (themeKey === 'titanium_deck') {
    bg = '#040914';
    line = 'rgba(102, 204, 255, 0.5)';
    sub = 'rgba(0, 136, 255, 0.15)';
  } else if (themeKey === 'quantum_matrix') {
    bg = '#09010f';
    line = 'rgba(255, 0, 119, 0.55)';
    sub = 'rgba(255, 215, 0, 0.18)';
  }

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 512, 512);

  // Subgrid
  ctx.strokeStyle = sub;
  ctx.lineWidth = 1;
  const step = 32;
  for (let x = 0; x <= 512; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = 0; y <= 512; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  // Main bold grid
  ctx.strokeStyle = line;
  ctx.lineWidth = 3;
  for (let x = 0; x <= 512; x += 128) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = 0; y <= 512; y += 128) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  // Crosshairs in tile corners
  ctx.fillStyle = line;
  for (let x = 0; x <= 512; x += 128) {
    for (let y = 0; y <= 512; y += 128) {
      ctx.fillRect(x - 3, y - 3, 6, 6);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  return texture;
}

function createWallTexture(themeKey) {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  let bg = '#07101b';
  let border = 'rgba(0, 240, 255, 0.4)';
  let glow = '#00f0ff';

  if (themeKey === 'hazard_orange') {
    bg = '#140c04';
    border = 'rgba(255, 183, 0, 0.45)';
    glow = '#ffb700';
  } else if (themeKey === 'titanium_deck') {
    bg = '#081324';
    border = 'rgba(102, 204, 255, 0.45)';
    glow = '#66ccff';
  } else if (themeKey === 'quantum_matrix') {
    bg = '#14031a';
    border = 'rgba(255, 0, 119, 0.5)';
    glow = '#ff0077';
  }

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 512, 512);

  // Sci-fi panel bevels
  ctx.strokeStyle = border;
  ctx.lineWidth = 4;
  ctx.strokeRect(16, 16, 480, 480);
  ctx.strokeRect(40, 40, 432, 432);

  // Center horizontal emissive strip
  ctx.fillStyle = glow;
  ctx.fillRect(40, 250, 432, 12);

  // Corner rivets
  ctx.fillStyle = '#fff';
  const rivets = [28, 484];
  rivets.forEach(rx => {
    rivets.forEach(ry => {
      ctx.beginPath();
      ctx.arc(rx, ry, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 2);
  return texture;
}

/* ==========================================================================
   7. ENGINE GLOBALS & STATE
   ========================================================================== */
let scene, camera, renderer, cameraRig;
let ambientLight, mainLight, secondaryLight;
let currentSectorIndex = 0;
let currentWave = 1;
let currentWeaponIndex = 0;
let gameState = 'INIT'; // 'INIT' | 'LOADING' | 'START_MENU' | 'PLAYING' | 'PAUSED' | 'LEVEL_CLEAR' | 'GAME_OVER'

let perspectiveMode = 'FPP'; // 'FPP' | 'TPP'
let currentFireMode = 'AUTO'; // 'AUTO' | 'BURST' | 'SEMI'
let burstRemaining = 0;
let burstTimer = 0;
let isTriggerHeld = false;
let isTriggerJustPressed = false;

const player = {
  position: new THREE.Vector3(0, 1.7, 0),
  velocity: new THREE.Vector3(0, 0, 0),
  yaw: 0,
  pitch: 0,
  speed: 13.5,
  dashSpeed: 24.0,
  jumpImpulse: 10.5,
  isGrounded: true,
  isDashing: false,
  dashCooldown: 0,
  radius: 0.65,
  height: 1.8,
  health: 100,
  maxHealth: 100,
  shield: 100,
  maxShield: 100,
  stims: 3,
  maxStims: 3,
  lastDamageTime: 0,
  healRemaining: 0,
  healTimer: 0,
  clips: [30, 8, 4, 4],
  isReloading: false,
  reloadTimer: 0,
  lastShotTime: 0,
  walkTime: 0
};

const stats = {
  score: 0,
  highScore: 0,
  kills: 0,
  shotsFired: 0,
  shotsHit: 0,
  wavesSurvived: 0,
  sectorsCleared: 0,
  comboCount: 0,
  comboMultiplier: 1,
  comboTimer: 0,
  startTime: 0,
  elapsedSeconds: 0
};

const activeBuffs = {
  quad: 0,
  overdrive: 0,
  overshield: 0
};

const keys = {};
const touchState = {
  joystickActive: false,
  touchId: null,
  startX: 0,
  startY: 0,
  moveX: 0,
  moveY: 0,
  lookTouchId: null,
  lastLookX: 0,
  lastLookY: 0
};

let colliders = [];
let arenaMeshes = [];
let enemies = [];
let powerups = [];
let tracers = [];
let enemyProjectiles = [];
let playerRockets = [];
let ambientSparks = [];
let particles = [];
let floatingDmgPool = [];

let weaponContainer = null;
let weaponMeshes = [];
let characterMesh = null; // 3D Cyborg player character for TPP
let charLegLeft = null;
let charLegRight = null;
let charArmLeft = null;
let charArmRight = null;
let charJetpackThrust = null;

let waveEnemiesTotal = 0;
let waveEnemiesSpawned = 0;
let waveSpawnTimer = 0;
let isWaveActive = false;
let bossInstance = null;

/* ==========================================================================
   8. SCENE INITIALIZATION & LIGHTING
   ========================================================================== */
function initScene() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  scene = new THREE.Scene();
  const theme = SECTORS[currentSectorIndex];
  scene.background = new THREE.Color(theme.fogColor);
  scene.fog = new THREE.FogExp2(theme.fogColor, 0.015);

  cameraRig = new THREE.Object3D();
  cameraRig.position.copy(player.position);
  scene.add(cameraRig);

  camera = new THREE.PerspectiveCamera(settings.fov, window.innerWidth / window.innerHeight, 0.1, 350);
  cameraRig.add(camera);

  // Lighting
  ambientLight = new THREE.AmbientLight(theme.ambientColor, 0.9);
  scene.add(ambientLight);

  mainLight = new THREE.DirectionalLight(theme.mainLightColor, 1.3);
  mainLight.position.set(35, 50, 25);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 2048;
  mainLight.shadow.mapSize.height = 2048;
  mainLight.shadow.camera.near = 0.5;
  mainLight.shadow.camera.far = 160;
  const d = 55;
  mainLight.shadow.camera.left = -d;
  mainLight.shadow.camera.right = d;
  mainLight.shadow.camera.top = d;
  mainLight.shadow.camera.bottom = -d;
  scene.add(mainLight);

  secondaryLight = new THREE.DirectionalLight(0xff0055, 0.55);
  secondaryLight.position.set(-35, 25, -35);
  scene.add(secondaryLight);

  buildArena();
  buildWeaponModel();
  buildCharacterMesh();
  initAmbientSparks();

  // Apply initial perspective mode
  perspectiveMode = settings.defaultPOV || 'FPP';
  currentFireMode = settings.defaultFireMode || 'AUTO';
  updatePOVVisuals();
  updateFireModeVisuals();

  applySettings();
  setupEventListeners();
  setupUI();
}

function initAmbientSparks() {
  if (ambientSparks.length > 0) return;
  const sparkGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
  const sparkMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.6 });
  for (let i = 0; i < 45; i++) {
    const spark = new THREE.Mesh(sparkGeo, sparkMat);
    spark.position.set(
      (Math.random() - 0.5) * 75,
      Math.random() * 8 + 0.5,
      (Math.random() - 0.5) * 75
    );
    spark.userData = {
      speedY: Math.random() * 0.8 + 0.2,
      rotSpeed: Math.random() * 2 - 1
    };
    scene.add(spark);
    ambientSparks.push(spark);
  }
}

/* ==========================================================================
   9. ARENA CONSTRUCTION & SECTOR ENVIRONMENT UPDATES
   ========================================================================== */
function buildArena() {
  // Clear old arena objects
  arenaMeshes.forEach(mesh => scene.remove(mesh));
  arenaMeshes = [];
  colliders = [];

  const theme = SECTORS[currentSectorIndex];

  // 1. Floor (100x100 units)
  const floorGeo = new THREE.PlaneGeometry(100, 100);
  const floorTex = createGridFloorTexture(theme.floorTheme);
  const floorMat = new THREE.MeshStandardMaterial({
    map: floorTex,
    roughness: 0.35,
    metalness: 0.65
  });
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  scene.add(floorMesh);
  arenaMeshes.push(floorMesh);

  // Floor Collider
  colliders.push(new THREE.Box3(new THREE.Vector3(-50, -10, -50), new THREE.Vector3(50, 0, 50)));

  // 2. Outer Boundary Walls (4 walls: N, S, E, W)
  const wallMat = new THREE.MeshStandardMaterial({
    map: createWallTexture(theme.floorTheme),
    roughness: 0.45,
    metalness: 0.55
  });

  const wallH = 10;
  const wallConfigs = [
    { pos: [0, wallH / 2, -50], size: [100, wallH, 2] },  // North
    { pos: [0, wallH / 2, 50], size: [100, wallH, 2] },   // South
    { pos: [-50, wallH / 2, 0], size: [2, wallH, 100] },  // West
    { pos: [50, wallH / 2, 0], size: [2, wallH, 100] }    // East
  ];

  wallConfigs.forEach(cfg => {
    const geo = new THREE.BoxGeometry(...cfg.size);
    const wall = new THREE.Mesh(geo, wallMat);
    wall.position.set(...cfg.pos);
    wall.receiveShadow = true;
    wall.castShadow = true;
    scene.add(wall);
    arenaMeshes.push(wall);

    const halfX = cfg.size[0] / 2;
    const halfY = cfg.size[1] / 2;
    const halfZ = cfg.size[2] / 2;
    colliders.push(new THREE.Box3(
      new THREE.Vector3(cfg.pos[0] - halfX, cfg.pos[1] - halfY, cfg.pos[2] - halfZ),
      new THREE.Vector3(cfg.pos[0] + halfX, cfg.pos[1] + halfY, cfg.pos[2] + halfZ)
    ));
  });

  // 3. Interior Monolithic Cover Pillars (8 tactical pillars)
  const pillarConfigs = [
    { x: -18, z: -18, w: 4, h: 8, d: 4 },
    { x: 18, z: -18, w: 4, h: 8, d: 4 },
    { x: -18, z: 18, w: 4, h: 8, d: 4 },
    { x: 18, z: 18, w: 4, h: 8, d: 4 },
    { x: 0, z: -28, w: 8, h: 6, d: 3 },
    { x: 0, z: 28, w: 8, h: 6, d: 3 },
    { x: -28, z: 0, w: 3, h: 6, d: 8 },
    { x: 28, z: 0, w: 3, h: 6, d: 8 }
  ];

  const pillarMat = new THREE.MeshStandardMaterial({
    color: theme.pillarColor,
    roughness: 0.3,
    metalness: 0.75
  });

  const neonStripeMat = new THREE.MeshBasicMaterial({
    color: theme.accentColor
  });

  pillarConfigs.forEach(p => {
    const pGroup = new THREE.Group();
    pGroup.position.set(p.x, p.h / 2, p.z);

    const pMesh = new THREE.Mesh(new THREE.BoxGeometry(p.w, p.h, p.d), pillarMat);
    pMesh.castShadow = true;
    pMesh.receiveShadow = true;
    pGroup.add(pMesh);

    // Glowing vertical neon conduit stripes
    const stripGeo = new THREE.BoxGeometry(0.2, p.h * 0.9, p.d + 0.1);
    const strip = new THREE.Mesh(stripGeo, neonStripeMat);
    pGroup.add(strip);

    scene.add(pGroup);
    arenaMeshes.push(pGroup);

    colliders.push(new THREE.Box3(
      new THREE.Vector3(p.x - p.w / 2, 0, p.z - p.d / 2),
      new THREE.Vector3(p.x + p.w / 2, p.h, p.z + p.d / 2)
    ));
  });
}

function updateSectorEnvironment() {
  const theme = SECTORS[currentSectorIndex];

  if (scene) {
    scene.background.setHex(theme.fogColor);
    scene.fog.color.setHex(theme.fogColor);
  }

  if (ambientLight) ambientLight.color.setHex(theme.ambientColor);
  if (mainLight) mainLight.color.setHex(theme.mainLightColor);

  buildArena();

  // Sector HUD tag
  const sectorTag = document.getElementById('hud-sector');
  if (sectorTag) sectorTag.textContent = theme.tag;
}

/* ==========================================================================
   10. PROCEDURAL 3D CYBORG CHARACTER (TPP) & WEAPON VIEWMODELS (FPP)
   ========================================================================== */
function buildCharacterMesh() {
  if (characterMesh) {
    scene.remove(characterMesh);
  }

  characterMesh = new THREE.Group();

  const armorMat = new THREE.MeshStandardMaterial({
    color: 0x111c2a,
    roughness: 0.3,
    metalness: 0.8
  });

  const darkPlateMat = new THREE.MeshStandardMaterial({
    color: 0x070d14,
    roughness: 0.5,
    metalness: 0.6
  });

  const visorMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff
  });

  const thrusterGlowMat = new THREE.MeshBasicMaterial({
    color: 0x00e1ff
  });

  // 1. Torso & Chest Armor (Centered at y=1.1 relative to feet)
  const torsoGroup = new THREE.Group();
  torsoGroup.position.set(0, 1.1, 0);

  const chestGeo = new THREE.BoxGeometry(0.65, 0.7, 0.4);
  const chestMesh = new THREE.Mesh(chestGeo, armorMat);
  chestMesh.castShadow = true;
  torsoGroup.add(chestMesh);

  // Chest glowing reactor core
  const coreGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.08, 16);
  const coreMesh = new THREE.Mesh(coreGeo, visorMat);
  coreMesh.rotation.x = Math.PI / 2;
  coreMesh.position.set(0, 0.08, 0.21);
  torsoGroup.add(coreMesh);

  // 2. Jetpack / Thruster Pack on Back
  const jetpackGeo = new THREE.BoxGeometry(0.42, 0.55, 0.22);
  const jetpack = new THREE.Mesh(jetpackGeo, darkPlateMat);
  jetpack.position.set(0, 0.05, -0.26);
  jetpack.castShadow = true;
  torsoGroup.add(jetpack);

  // Dual thruster nozzles
  [-0.12, 0.12].forEach(tx => {
    const nozzleGeo = new THREE.CylinderGeometry(0.06, 0.09, 0.18, 12);
    const nozzle = new THREE.Mesh(nozzleGeo, armorMat);
    nozzle.position.set(tx, -0.28, -0.26);
    torsoGroup.add(nozzle);

    const glowGeo = new THREE.ConeGeometry(0.06, 0.25, 12);
    const glow = new THREE.Mesh(glowGeo, thrusterGlowMat);
    glow.rotation.x = Math.PI;
    glow.position.set(tx, -0.42, -0.26);
    torsoGroup.add(glow);
    charJetpackThrust = glow;
  });

  characterMesh.add(torsoGroup);

  // 3. Head & Helmet (y=1.65)
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.62, 0);

  const helmetGeo = new THREE.BoxGeometry(0.36, 0.38, 0.38);
  const helmet = new THREE.Mesh(helmetGeo, armorMat);
  helmet.castShadow = true;
  headGroup.add(helmet);

  // Glowing Visor
  const visorGeo = new THREE.BoxGeometry(0.32, 0.12, 0.12);
  const visor = new THREE.Mesh(visorGeo, visorMat);
  visor.position.set(0, 0.02, 0.18);
  headGroup.add(visor);

  characterMesh.add(headGroup);

  // 4. Arms (Pivoting at shoulders y=1.35)
  // Left Arm
  charArmLeft = new THREE.Group();
  charArmLeft.position.set(-0.45, 1.35, 0);
  const armLGeo = new THREE.BoxGeometry(0.18, 0.65, 0.18);
  const armL = new THREE.Mesh(armLGeo, armorMat);
  armL.position.set(0, -0.28, 0);
  armL.castShadow = true;
  charArmLeft.add(armL);
  characterMesh.add(charArmLeft);

  // Right Arm (Weapon holding arm)
  charArmRight = new THREE.Group();
  charArmRight.position.set(0.45, 1.35, 0);
  const armRGeo = new THREE.BoxGeometry(0.18, 0.65, 0.18);
  const armR = new THREE.Mesh(armRGeo, armorMat);
  armR.position.set(0, -0.28, 0);
  armR.castShadow = true;
  charArmRight.add(armR);

  // Cyborg Weapon Model in Hand
  const gunGroup = new THREE.Group();
  gunGroup.position.set(0, -0.5, 0.25);
  const gunBodyGeo = new THREE.BoxGeometry(0.12, 0.16, 0.65);
  const gunBody = new THREE.Mesh(gunBodyGeo, darkPlateMat);
  gunGroup.add(gunBody);

  const gunBarrelGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.45, 10);
  const gunBarrel = new THREE.Mesh(gunBarrelGeo, armorMat);
  gunBarrel.rotation.x = Math.PI / 2;
  gunBarrel.position.set(0, 0.02, 0.45);
  gunGroup.add(gunBarrel);

  const gunEmitterGeo = new THREE.BoxGeometry(0.08, 0.04, 0.35);
  const gunEmitter = new THREE.Mesh(gunEmitterGeo, visorMat);
  gunEmitter.position.set(0, 0.08, 0.2);
  gunGroup.add(gunEmitter);

  charArmRight.add(gunGroup);
  characterMesh.add(charArmRight);

  // 5. Legs (Pivoting at hips y=0.75)
  // Left Leg
  charLegLeft = new THREE.Group();
  charLegLeft.position.set(-0.2, 0.75, 0);
  const legLGeo = new THREE.BoxGeometry(0.2, 0.75, 0.22);
  const legL = new THREE.Mesh(legLGeo, armorMat);
  legL.position.set(0, -0.37, 0);
  legL.castShadow = true;
  charLegLeft.add(legL);
  characterMesh.add(charLegLeft);

  // Right Leg
  charLegRight = new THREE.Group();
  charLegRight.position.set(0.2, 0.75, 0);
  const legRGeo = new THREE.BoxGeometry(0.2, 0.75, 0.22);
  const legR = new THREE.Mesh(legRGeo, armorMat);
  legR.position.set(0, -0.37, 0);
  legR.castShadow = true;
  charLegRight.add(legR);
  characterMesh.add(charLegRight);

  scene.add(characterMesh);
  characterMesh.visible = (perspectiveMode === 'TPP');
}

function buildWeaponModel() {
  if (weaponContainer) {
    camera.remove(weaponContainer);
  }

  weaponContainer = new THREE.Group();
  weaponContainer.position.set(0.34, -0.28, -0.6);
  camera.add(weaponContainer);

  weaponMeshes = [];

  const baseMat = new THREE.MeshStandardMaterial({ color: 0x121722, roughness: 0.3, metalness: 0.8 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x05080e, roughness: 0.5, metalness: 0.6 });

  // 1. Plasma Carbine
  const plasmaGroup = new THREE.Group();
  const pBody = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 0.62), baseMat);
  const pBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.45, 12), darkMat);
  pBarrel.rotation.x = Math.PI / 2;
  pBarrel.position.set(0, 0.02, -0.4);
  const pGlow = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.3), new THREE.MeshBasicMaterial({ color: 0x00f0ff }));
  pGlow.position.set(0, 0.08, -0.05);
  plasmaGroup.add(pBody, pBarrel, pGlow);
  weaponContainer.add(plasmaGroup);
  weaponMeshes.push(plasmaGroup);

  // 2. Scattergun ST-8
  const shotGroup = new THREE.Group();
  const sBody = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.18, 0.55), baseMat);
  const sB1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 12), darkMat);
  const sB2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 12), darkMat);
  sB1.rotation.x = Math.PI / 2;
  sB2.rotation.x = Math.PI / 2;
  sB1.position.set(-0.035, 0.03, -0.38);
  sB2.position.set(0.035, 0.03, -0.38);
  const sGlow = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 0.22), new THREE.MeshBasicMaterial({ color: 0xffb700 }));
  sGlow.position.set(0, 0.09, -0.05);
  shotGroup.add(sBody, sB1, sB2, sGlow);
  weaponContainer.add(shotGroup);
  weaponMeshes.push(shotGroup);

  // 3. Hyper-Railgun X
  const railGroup = new THREE.Group();
  const rBody = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.16, 0.78), baseMat);
  const rRails = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.03, 0.55), darkMat);
  rRails.position.set(0, 0.04, -0.35);
  const rCore = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 12), new THREE.MeshBasicMaterial({ color: 0x00ffea }));
  rCore.rotation.x = Math.PI / 2;
  rCore.position.set(0, 0.04, -0.35);
  railGroup.add(rBody, rRails, rCore);
  weaponContainer.add(railGroup);
  weaponMeshes.push(railGroup);

  // 4. Void Rocket Launcher
  const rktGroup = new THREE.Group();
  const rktTube = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.72, 16), baseMat);
  rktTube.rotation.x = Math.PI / 2;
  const rktSight = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.14), new THREE.MeshBasicMaterial({ color: 0xff0055 }));
  rktSight.position.set(0, 0.12, -0.1);
  rktGroup.add(rktTube, rktSight);
  weaponContainer.add(rktGroup);
  weaponMeshes.push(rktGroup);

  switchWeapon(currentWeaponIndex);
}

function switchWeapon(index) {
  if (index < 0 || index >= WEAPONS.length) return;
  currentWeaponIndex = index;

  weaponMeshes.forEach((mesh, i) => {
    mesh.visible = (i === currentWeaponIndex);
  });

  player.isReloading = false;
  player.reloadTimer = 0;

  // Arsenal HUD tabs update
  for (let i = 0; i < 4; i++) {
    const tab = document.getElementById(`wep-tab-${i}`);
    if (tab) {
      tab.classList.toggle('active', i === currentWeaponIndex);
    }
  }

  // Weapon display name update
  const nameEl = document.getElementById('weapon-name-display');
  if (nameEl) nameEl.textContent = WEAPONS[currentWeaponIndex].name;

  updateAmmoHUD();
  audio.playReload();
}

function togglePOV(forcedMode = null) {
  if (forcedMode) {
    perspectiveMode = forcedMode;
  } else {
    perspectiveMode = (perspectiveMode === 'FPP') ? 'TPP' : 'FPP';
  }

  updatePOVVisuals();
  audio.playPerspectiveSwitch();
  triggerHaptic(15);
}

function updatePOVVisuals() {
  const povHud = document.getElementById('pov-indicator-text');
  if (povHud) povHud.textContent = perspectiveMode;

  const povTouch = document.getElementById('btn-touch-pov');
  if (povTouch) povTouch.textContent = `POV: ${perspectiveMode}`;

  if (characterMesh) {
    characterMesh.visible = (perspectiveMode === 'TPP');
  }
  if (weaponContainer) {
    weaponContainer.visible = (perspectiveMode === 'FPP');
  }
}

function cycleFireMode() {
  const modes = ['AUTO', 'BURST', 'SEMI'];
  const idx = (modes.indexOf(currentFireMode) + 1) % modes.length;
  currentFireMode = modes[idx];

  updateFireModeVisuals();
  audio.playFireModeSwitch();
  triggerHaptic(15);
}

function updateFireModeVisuals() {
  const fmHud = document.getElementById('hud-firemode-text');
  if (fmHud) fmHud.textContent = currentFireMode;

  const fmTouch = document.getElementById('btn-touch-mode');
  if (fmTouch) fmTouch.textContent = currentFireMode;
}

function useStim() {
  if (player.stims <= 0 || player.health >= player.maxHealth || gameState !== 'PLAYING') {
    return;
  }

  player.stims--;
  player.health = Math.min(player.maxHealth, player.health + 40);

  audio.playStim();
  triggerHaptic(35);

  const healOverlay = document.getElementById('heal-overlay');
  if (healOverlay) {
    healOverlay.classList.add('healing');
    setTimeout(() => healOverlay.classList.remove('healing'), 1200);
  }

  updateStimHUD();
  updateStatusHUD();
}

function updateStimHUD() {
  const stimCountEl = document.getElementById('hud-stim-count');
  if (stimCountEl) stimCountEl.textContent = player.stims;

  const stimTouchEl = document.getElementById('btn-touch-stim');
  if (stimTouchEl) stimTouchEl.textContent = `💉 STIM (${player.stims})`;
}

/* ==========================================================================
   11. ENEMY AI ARCHETYPES & BOSS SYSTEM (4 ENEMIES + 1 APEX BOSS)
   ========================================================================== */
class Enemy {
  constructor(type, position) {
    this.type = type; // 'DRONE' | 'BRUISER' | 'SWARM' | 'PHANTOM' | 'BOSS'
    this.isDead = false;
    this.mesh = new THREE.Group();
    this.mesh.position.copy(position);

    const diff = DIFFICULTY_CONFIG[settings.difficulty] || DIFFICULTY_CONFIG.medium;
    const hpMult = diff.enemyHpMult;

    if (type === 'DRONE') {
      this.maxHp = 45 * hpMult;
      this.speed = 8.5;
      this.radius = 0.8;
      this.height = 1.6;
      this.scoreValue = 150;
      this.attackCooldown = 1.6;
      this.attackTimer = Math.random() * 1.5;
      this.strafeAngle = Math.random() * Math.PI * 2;
      this.buildDroneMesh();
    } else if (type === 'BRUISER') {
      this.maxHp = 150 * hpMult;
      this.speed = 4.2;
      this.radius = 1.4;
      this.height = 2.8;
      this.scoreValue = 350;
      this.attackCooldown = 2.4;
      this.attackTimer = 1.0;
      this.buildBruiserMesh();
    } else if (type === 'SWARM') {
      this.maxHp = 28 * hpMult;
      this.speed = 12.0;
      this.radius = 0.55;
      this.height = 0.8;
      this.scoreValue = 80;
      this.attackCooldown = 0.8;
      this.attackTimer = 0.4;
      this.leapCooldown = 0;
      this.buildSwarmMesh();
    } else if (type === 'PHANTOM') {
      this.maxHp = 70 * hpMult;
      this.speed = 6.0;
      this.radius = 0.75;
      this.height = 1.9;
      this.scoreValue = 280;
      this.attackCooldown = 3.2;
      this.attackTimer = 1.5;
      this.teleportCooldown = 4.0;
      this.isCharging = false;
      this.chargeTimer = 0;
      this.buildPhantomMesh();
    } else if (type === 'BOSS') {
      this.maxHp = 950 * hpMult;
      this.speed = 3.6;
      this.radius = 3.2;
      this.height = 5.2;
      this.scoreValue = 5000;
      this.attackCooldown = 1.8;
      this.attackTimer = 0;
      this.phase = 1;
      this.shieldHp = 300 * hpMult;
      this.maxShieldHp = 300 * hpMult;
      this.hasShield = true;
      this.buildBossMesh();
      showBossHUD(this);
    }

    this.hp = this.maxHp;
    this.createHealthBar();
    scene.add(this.mesh);
  }

  buildDroneMesh() {
    this.coreMat = new THREE.MeshStandardMaterial({ color: 0x1a2638, roughness: 0.3, metalness: 0.85 });
    this.glowMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });

    const discGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.2, 16);
    const disc = new THREE.Mesh(discGeo, this.coreMat);
    disc.castShadow = true;
    this.mesh.add(disc);

    this.rotor = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.04, 8, 24), this.glowMat);
    this.rotor.rotation.x = Math.PI / 2;
    this.mesh.add(this.rotor);

    const eyeGeo = new THREE.SphereGeometry(0.18, 12, 12);
    const eye = new THREE.Mesh(eyeGeo, new THREE.MeshBasicMaterial({ color: 0xff0055 }));
    eye.position.set(0, 0, 0.6);
    this.mesh.add(eye);
  }

  buildBruiserMesh() {
    this.coreMat = new THREE.MeshStandardMaterial({ color: 0x221319, roughness: 0.4, metalness: 0.8 });
    this.glowMat = new THREE.MeshBasicMaterial({ color: 0xff0055 });

    const torsoGeo = new THREE.BoxGeometry(1.4, 1.8, 1.1);
    const torso = new THREE.Mesh(torsoGeo, this.coreMat);
    torso.position.y = 1.4;
    torso.castShadow = true;
    this.mesh.add(torso);

    [-0.85, 0.85].forEach(cx => {
      const cannonGeo = new THREE.CylinderGeometry(0.18, 0.22, 1.4, 12);
      const cannon = new THREE.Mesh(cannonGeo, this.coreMat);
      cannon.rotation.x = Math.PI / 2;
      cannon.position.set(cx, 1.8, 0.2);
      cannon.castShadow = true;
      this.mesh.add(cannon);

      const mGlow = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.1, 12), this.glowMat);
      mGlow.rotation.x = Math.PI / 2;
      mGlow.position.set(cx, 1.8, 0.95);
      this.mesh.add(mGlow);
    });

    const core = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.2), this.glowMat);
    core.position.set(0, 1.4, 0.58);
    this.mesh.add(core);
  }

  buildSwarmMesh() {
    this.coreMat = new THREE.MeshStandardMaterial({ color: 0x241804, roughness: 0.5, metalness: 0.7 });
    this.glowMat = new THREE.MeshBasicMaterial({ color: 0xffb700 });

    const bodyGeo = new THREE.SphereGeometry(0.38, 10, 10);
    const body = new THREE.Mesh(bodyGeo, this.coreMat);
    body.position.y = 0.35;
    body.scale.set(1, 0.7, 1.3);
    body.castShadow = true;
    this.mesh.add(body);

    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), this.glowMat);
    eye.position.set(0, 0.4, 0.4);
    this.mesh.add(eye);

    // Spider Leg Stubs
    for (let i = 0; i < 4; i++) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.08), this.coreMat);
      const ang = (i / 4) * Math.PI * 2;
      leg.position.set(Math.cos(ang) * 0.4, 0.18, Math.sin(ang) * 0.4);
      leg.rotation.z = Math.cos(ang) * 0.4;
      this.mesh.add(leg);
    }
  }

  buildPhantomMesh() {
    this.coreMat = new THREE.MeshStandardMaterial({
      color: 0x1a0624,
      roughness: 0.2,
      metalness: 0.9,
      transparent: true,
      opacity: 0.85
    });
    this.glowMat = new THREE.MeshBasicMaterial({ color: 0xff00cc, transparent: true, opacity: 0.9 });

    const hoodGeo = new THREE.ConeGeometry(0.45, 1.4, 4);
    const hood = new THREE.Mesh(hoodGeo, this.coreMat);
    hood.position.y = 1.0;
    hood.castShadow = true;
    this.mesh.add(hood);

    const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.22), this.glowMat);
    core.position.set(0, 1.0, 0.2);
    this.mesh.add(core);

    // Floating stabilizer mantles
    [-0.55, 0.55].forEach(mx => {
      const mantle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.7, 0.3), this.coreMat);
      mantle.position.set(mx, 0.9, -0.1);
      this.mesh.add(mantle);
    });
  }

  buildBossMesh() {
    this.coreMat = new THREE.MeshStandardMaterial({ color: 0x1f082b, roughness: 0.25, metalness: 0.85 });
    this.glowMat = new THREE.MeshBasicMaterial({ color: 0xff0055 });

    // Massive Chassis
    const bodyGeo = new THREE.BoxGeometry(3.6, 2.6, 3.2);
    const body = new THREE.Mesh(bodyGeo, this.coreMat);
    body.position.y = 2.8;
    body.castShadow = true;
    this.mesh.add(body);

    // Central Reactor Sphere
    const reactorGeo = new THREE.SphereGeometry(0.9, 20, 20);
    const reactor = new THREE.Mesh(reactorGeo, this.glowMat);
    reactor.position.set(0, 2.8, 1.5);
    this.mesh.add(reactor);

    // Dual Heavy Rotary Miniguns
    [-2.2, 2.2].forEach(gx => {
      const armGeo = new THREE.BoxGeometry(0.6, 0.6, 2.2);
      const arm = new THREE.Mesh(armGeo, this.coreMat);
      arm.position.set(gx, 2.6, 0.8);
      arm.castShadow = true;
      this.mesh.add(arm);

      const barrelGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.8, 12);
      const barrels = new THREE.Mesh(barrelGeo, new THREE.MeshStandardMaterial({ color: 0x0b0d13 }));
      barrels.rotation.x = Math.PI / 2;
      barrels.position.set(gx, 2.6, 2.4);
      barrels.castShadow = true;
      this.mesh.add(barrels);
    });

    // 4 Quad Mechanical Stomp Legs
    const legConfigs = [
      { x: -2.0, z: -1.6 },
      { x: 2.0, z: -1.6 },
      { x: -2.0, z: 1.6 },
      { x: 2.0, z: 1.6 }
    ];
    legConfigs.forEach(lc => {
      const legGeo = new THREE.BoxGeometry(0.7, 2.6, 0.7);
      const leg = new THREE.Mesh(legGeo, this.coreMat);
      leg.position.set(lc.x, 1.3, lc.z);
      leg.castShadow = true;
      this.mesh.add(leg);
    });

    // Energy Barrier Shield Mesh
    const shieldGeo = new THREE.SphereGeometry(4.2, 24, 24);
    this.shieldMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.3,
      wireframe: true
    });
    this.shieldMesh = new THREE.Mesh(shieldGeo, this.shieldMat);
    this.shieldMesh.position.y = 2.8;
    this.mesh.add(this.shieldMesh);
  }

  createHealthBar() {
    if (this.type === 'BOSS') return; // Boss uses full top HUD gauge

    const barGroup = new THREE.Group();
    barGroup.position.y = this.type === 'DRONE' ? 1.1 : (this.type === 'SWARM' ? 0.75 : 2.4);

    const bgGeo = new THREE.PlaneGeometry(1.2, 0.12);
    const bgMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
    const bg = new THREE.Mesh(bgGeo, bgMat);
    barGroup.add(bg);

    const fgGeo = new THREE.PlaneGeometry(1.16, 0.09);
    let barColor = 0x00f0ff;
    if (this.type === 'BRUISER') barColor = 0xff0055;
    if (this.type === 'SWARM') barColor = 0xffb700;
    if (this.type === 'PHANTOM') barColor = 0xff00cc;

    this.healthBarMat = new THREE.MeshBasicMaterial({ color: barColor, side: THREE.DoubleSide });
    this.healthBarMesh = new THREE.Mesh(fgGeo, this.healthBarMat);
    this.healthBarMesh.position.z = 0.01;
    barGroup.add(this.healthBarMesh);

    this.healthBarGroup = barGroup;
    this.mesh.add(barGroup);
  }

  update(dt) {
    if (this.isDead) return;

    // Rotate rotor for drone
    if (this.type === 'DRONE' && this.rotor) {
      this.rotor.rotation.z += dt * 14;
    }

    // Orient health bar billboard towards active camera
    if (this.healthBarGroup && camera) {
      this.healthBarGroup.lookAt(camera.position);
    }

    const toPlayer = new THREE.Vector3().subVectors(player.position, this.mesh.position);
    const distToPlayer = toPlayer.length();
    toPlayer.y = 0;
    const planarDir = toPlayer.clone().normalize();

    // Look at player horizontally
    if (toPlayer.lengthSq() > 0.01) {
      this.mesh.rotation.y = Math.atan2(toPlayer.x, toPlayer.z);
    }

    const diff = DIFFICULTY_CONFIG[settings.difficulty] || DIFFICULTY_CONFIG.medium;
    const dmgMult = diff.enemyDmgMult;

    // Behavior state machine
    if (this.type === 'DRONE') {
      this.strafeAngle += dt * 1.5;
      const strafeOffset = new THREE.Vector3(Math.cos(this.strafeAngle) * 6, 0, Math.sin(this.strafeAngle) * 6);
      const targetPos = player.position.clone().add(strafeOffset);
      targetPos.y = 2.5 + Math.sin(this.strafeAngle * 2) * 0.5;

      this.mesh.position.lerp(targetPos, dt * 1.8);

      this.attackTimer += dt;
      if (this.attackTimer >= this.attackCooldown && distToPlayer < 40) {
        this.attackTimer = 0;
        spawnEnemyLaser(this.mesh.position.clone().add(new THREE.Vector3(0, 0, 0.4)), player.position, 12 * dmgMult, 0x00f0ff);
        audio.playDroneLaser();
      }
    } else if (this.type === 'BRUISER') {
      if (distToPlayer > 5.0) {
        this.mesh.position.addScaledVector(planarDir, this.speed * dt);
      }
      this.mesh.position.y = 0;

      this.attackTimer += dt;
      if (this.attackTimer >= this.attackCooldown && distToPlayer < 35) {
        this.attackTimer = 0;
        [-0.85, 0.85].forEach(cx => {
          const spawnP = this.mesh.position.clone().add(new THREE.Vector3(cx, 1.8, 0.5));
          spawnEnemyLaser(spawnP, player.position, 22 * dmgMult, 0xff0055, 32);
        });
        audio.playShotgunShot();
      }
    } else if (this.type === 'SWARM') {
      this.leapCooldown = Math.max(0, this.leapCooldown - dt);

      if (distToPlayer < 6.0 && this.leapCooldown <= 0) {
        // Leap attack
        this.mesh.position.addScaledVector(planarDir, this.speed * 2.2 * dt);
        this.mesh.position.y = Math.sin(this.attackTimer * 8) * 1.2;
        if (distToPlayer < 1.4) {
          damagePlayer(18 * dmgMult);
          this.leapCooldown = 1.2;
        }
      } else {
        this.mesh.position.addScaledVector(planarDir, this.speed * dt);
        this.mesh.position.y = 0;
      }
    } else if (this.type === 'PHANTOM') {
      this.teleportCooldown -= dt;
      if (this.teleportCooldown <= 0) {
        this.teleportCooldown = 4.5 + Math.random() * 2;
        createExplosion(this.mesh.position, 0xff00cc, false);
        // Teleport to random spot around arena
        this.mesh.position.set((Math.random() - 0.5) * 60, 1.5, (Math.random() - 0.5) * 60);
        createExplosion(this.mesh.position, 0xff00cc, false);
      }

      this.attackTimer += dt;
      if (this.attackTimer >= this.attackCooldown) {
        this.attackTimer = 0;
        // Sniper beam shot
        spawnEnemyLaser(this.mesh.position.clone().add(new THREE.Vector3(0, 1.0, 0)), player.position, 35 * dmgMult, 0xff00cc, 80);
        audio.playRailgunShot();
      }
    } else if (this.type === 'BOSS') {
      this.mesh.position.y = 0;
      if (distToPlayer > 8.0) {
        this.mesh.position.addScaledVector(planarDir, this.speed * dt);
      }

      // Rotate and animate shield
      if (this.shieldMesh) {
        this.shieldMesh.rotation.y += dt * 0.8;
        this.shieldMesh.visible = this.hasShield;
      }

      this.attackTimer += dt;
      if (this.attackTimer >= this.attackCooldown) {
        this.attackTimer = 0;

        if (this.phase === 1) {
          // Rapid gatling burst
          for (let i = 0; i < 4; i++) {
            setTimeout(() => {
              if (this.isDead || !this.mesh) return;
              const sp = this.mesh.position.clone().add(new THREE.Vector3((Math.random() - 0.5) * 4, 2.6, 2.0));
              spawnEnemyLaser(sp, player.position, 14 * dmgMult, 0xff0055, 45);
              audio.playPlasmaShot();
            }, i * 90);
          }
        } else if (this.phase === 2) {
          // Missile Barrage
          for (let i = 0; i < 3; i++) {
            setTimeout(() => {
              if (this.isDead || !this.mesh) return;
              const sp = this.mesh.position.clone().add(new THREE.Vector3((i - 1) * 1.8, 3.8, 0));
              spawnEnemyLaser(sp, player.position, 28 * dmgMult, 0xffb700, 24);
              audio.playRocketLaunch();
            }, i * 180);
          }
        } else {
          // Rage Overdrive Phase: Laser Sweep + Minion Drone spawn
          for (let i = 0; i < 6; i++) {
            setTimeout(() => {
              if (this.isDead || !this.mesh) return;
              const sp = this.mesh.position.clone().add(new THREE.Vector3((Math.random() - 0.5) * 3, 2.6, 2.0));
              spawnEnemyLaser(sp, player.position, 18 * dmgMult, 0xff0077, 50);
              audio.playPlasmaShot();
            }, i * 80);
          }
        }
      }

      updateBossHUD(this);
    }
  }

  takeDamage(amount, isCrit = false) {
    if (this.isDead) return;

    if (this.type === 'BOSS' && this.hasShield) {
      this.shieldHp -= amount;
      if (this.shieldHp <= 0) {
        this.hasShield = false;
        createExplosion(this.mesh.position.clone().add(new THREE.Vector3(0, 2.8, 0)), 0x00f0ff, true);
        audio.playExplosion(true);
      }
    } else {
      this.hp -= amount;
    }

    stats.shotsHit++;
    const hm = document.getElementById('hitmarker');
    if (hm) {
      hm.className = isCrit ? 'hit crit' : 'hit';
      setTimeout(() => { if (hm) hm.className = ''; }, 100);
    }
    spawnFloatingDamage(amount, this.mesh.position.clone().add(new THREE.Vector3(0, this.height * 0.8, 0)), isCrit);
    audio.playHit(isCrit);
    triggerHaptic(isCrit ? 30 : 15);

    // Update 3D Health Bar Billboard
    if (this.healthBarMesh) {
      const pct = Math.max(0, this.hp / this.maxHp);
      this.healthBarMesh.scale.x = pct;
      this.healthBarMesh.position.x = -0.58 * (1 - pct);
    }

    if (this.type === 'BOSS') {
      const pct = this.hp / this.maxHp;
      if (pct <= 0.35) this.phase = 3;
      else if (pct <= 0.65) this.phase = 2;
    }

    // Hit Flash
    if (this.coreMat) {
      this.coreMat.color.setHex(0xffffff);
      setTimeout(() => {
        if (!this.mesh) return;
        if (this.type === 'DRONE') this.coreMat.color.setHex(0x1a2638);
        else if (this.type === 'BRUISER') this.coreMat.color.setHex(0x221319);
        else if (this.type === 'SWARM') this.coreMat.color.setHex(0x241804);
        else if (this.type === 'PHANTOM') this.coreMat.color.setHex(0x1a0624);
        else if (this.type === 'BOSS') this.coreMat.color.setHex(0x1f082b);
      }, 70);
    }

    if (this.hp <= 0) {
      this.die();
    }
  }

  die() {
    this.isDead = true;
    stats.kills++;
    addScore(this.scoreValue);

    audio.playExplosion(this.type === 'BOSS');

    let explColor = 0x00f0ff;
    if (this.type === 'BRUISER') explColor = 0xff0055;
    if (this.type === 'SWARM') explColor = 0xffb700;
    if (this.type === 'PHANTOM') explColor = 0xff00cc;
    if (this.type === 'BOSS') explColor = 0xff0077;

    createExplosion(this.mesh.position, explColor, this.type === 'BOSS');

    // Powerup / Stim drop chance
    const dropChance = this.type === 'BOSS' ? 1.0 : 0.32;
    if (Math.random() < dropChance) {
      const pTypes = ['MEDKIT', 'SHIELD', 'QUAD', 'SPEED'];
      const chosen = pTypes[Math.floor(Math.random() * pTypes.length)];
      spawnPowerup(this.mesh.position.clone(), chosen);
    }

    if (this.type === 'BOSS') {
      hideBossHUD();
      bossInstance = null;
    }

    scene.remove(this.mesh);
    updateEnemiesCounter();
  }
}

/* ==========================================================================
   12. BOSS HUD MANAGEMENT
   ========================================================================== */
function showBossHUD(boss) {
  const container = document.getElementById('boss-hud-container');
  if (container) container.classList.remove('hidden');

  const nameEl = document.getElementById('boss-name-label');
  if (nameEl) nameEl.textContent = 'CYBER TITAN: MECH-X';
  updateBossHUD(boss);
}

function updateBossHUD(boss) {
  if (!boss) return;
  const pct = Math.max(0, Math.min(100, Math.round((boss.hp / boss.maxHp) * 100)));

  const pctEl = document.getElementById('boss-pct-label');
  if (pctEl) pctEl.textContent = `${pct}%`;

  const fill = document.getElementById('boss-gauge-fill');
  if (fill) fill.style.width = `${pct}%`;

  const ghost = document.getElementById('boss-gauge-ghost');
  if (ghost) {
    setTimeout(() => {
      ghost.style.width = `${pct}%`;
    }, 250);
  }
}

function hideBossHUD() {
  const container = document.getElementById('boss-hud-container');
  if (container) container.classList.add('hidden');
}

/* ==========================================================================
   13. POWER-UP DROPS & ACTIVE BUFF SYSTEM
   ========================================================================== */
function spawnPowerup(pos, type) {
  const pGroup = new THREE.Group();
  pGroup.position.set(pos.x, 0.8, pos.z);

  let color = 0x00ff88;
  if (type === 'SHIELD') color = 0x00f0ff;
  if (type === 'QUAD') color = 0xffb700;
  if (type === 'SPEED') color = 0x00ffff;

  const coreGeo = new THREE.OctahedronGeometry(0.35);
  const coreMat = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.8,
    roughness: 0.2
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  pGroup.add(core);

  const ringGeo = new THREE.TorusGeometry(0.5, 0.03, 8, 16);
  const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color }));
  ring.rotation.x = Math.PI / 2;
  pGroup.add(ring);

  scene.add(pGroup);

  powerups.push({
    mesh: pGroup,
    type,
    spawnTime: performance.now() / 1000,
    bobOffset: Math.random() * Math.PI * 2
  });
}

function applyPowerup(type) {
  audio.playPowerup();
  triggerHaptic(30);

  if (type === 'MEDKIT') {
    player.health = Math.min(player.maxHealth, player.health + 50);
    player.stims = Math.min(player.maxStims, player.stims + 1);
    updateStimHUD();
    updateStatusHUD();

    const healOverlay = document.getElementById('heal-overlay');
    if (healOverlay) {
      healOverlay.classList.add('healing');
      setTimeout(() => healOverlay.classList.remove('healing'), 800);
    }
  } else if (type === 'SHIELD') {
    player.shield = Math.min(player.maxShield * 1.5, player.shield + 60);
    activeBuffs.overshield = 12.0;
    updateStatusHUD();
  } else if (type === 'QUAD') {
    activeBuffs.quad = 12.0;
  } else if (type === 'SPEED') {
    activeBuffs.overdrive = 12.0;
  }
}

function updatePowerups(dt) {
  const now = performance.now() / 1000;
  const pPos = player.position;

  for (let i = powerups.length - 1; i >= 0; i--) {
    const p = powerups[i];
    p.mesh.rotation.y += dt * 2.2;
    p.mesh.position.y = 0.8 + Math.sin(now * 3 + p.bobOffset) * 0.18;

    // Check Player Proximity Pickup
    const dist = p.mesh.position.distanceTo(pPos);
    if (dist < player.radius + 0.8) {
      applyPowerup(p.type);
      scene.remove(p.mesh);
      powerups.splice(i, 1);
      continue;
    }

    // Expire after 30 seconds
    if (now - p.spawnTime > 30) {
      scene.remove(p.mesh);
      powerups.splice(i, 1);
    }
  }

  // Update Active Buff Chips HUD
  ['quad', 'overdrive', 'overshield'].forEach(buffKey => {
    if (activeBuffs[buffKey] > 0) {
      activeBuffs[buffKey] = Math.max(0, activeBuffs[buffKey] - dt);
    }

    let chipId = 'buff-quad';
    let timerId = 'buff-quad-timer';
    if (buffKey === 'overdrive') { chipId = 'buff-speed'; timerId = 'buff-speed-timer'; }
    if (buffKey === 'overshield') { chipId = 'buff-shield'; timerId = 'buff-shield-timer'; }

    const chip = document.getElementById(chipId);
    const timer = document.getElementById(timerId);

    const pOverlay = document.getElementById('powerup-overlay');
    if (pOverlay) {
      if (activeBuffs.quad > 0) pOverlay.className = 'quad';
      else if (activeBuffs.overdrive > 0) pOverlay.className = 'speed';
      else pOverlay.className = '';
    }

    if (chip && timer) {
      if (activeBuffs[buffKey] > 0) {
        chip.classList.remove('hidden');
        timer.textContent = `${Math.ceil(activeBuffs[buffKey])}s`;
      } else {
        chip.classList.add('hidden');
      }
    }
  });
}

/* ==========================================================================
   14. FX: FLOATING DAMAGE NUMBERS, PARTICLES & PROJECTILES
   ========================================================================== */
function spawnFloatingDamage(amount, worldPos, isCrit = false) {
  if (!settings.damageNumbers || !camera) return;

  const container = document.getElementById('damage-numbers-layer');
  if (!container) return;

  const screenPos = worldPos.clone().project(camera);
  if (screenPos.z > 1) return; // Behind camera

  const x = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
  const y = (-screenPos.y * 0.5 + 0.5) * window.innerHeight;

  const el = document.createElement('div');
  el.className = `floating-dmg ${isCrit ? 'crit' : ''}`;
  el.textContent = Math.round(amount);
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;

  container.appendChild(el);
  setTimeout(() => {
    if (el.parentNode) el.parentNode.removeChild(el);
  }, 700);
}

function createExplosion(pos, color = 0x00f0ff, isLarge = false) {
  const count = isLarge ? 45 : 22;
  const geo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
  const mat = new THREE.MeshBasicMaterial({ color });

  for (let i = 0; i < count; i++) {
    const p = new THREE.Mesh(geo, mat);
    p.position.copy(pos);
    const speed = (isLarge ? 14 : 9) * (Math.random() * 0.8 + 0.4);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;

    p.userData = {
      vx: Math.sin(phi) * Math.cos(theta) * speed,
      vy: Math.cos(phi) * speed + 2.0,
      vz: Math.sin(phi) * Math.sin(theta) * speed,
      life: 0.6 + Math.random() * 0.4
    };
    scene.add(p);
    particles.push(p);
  }
}

function spawnBulletTracer(start, end, color = 0x00f0ff) {
  const lineGeo = new THREE.BufferGeometry().setFromPoints([start, end]);
  const lineMat = new THREE.LineBasicMaterial({ color, linewidth: 2 });
  const line = new THREE.Line(lineGeo, lineMat);
  line.userData = { life: 0.08 };
  scene.add(line);
  tracers.push(line);
}

function spawnEnemyLaser(start, target, dmg, color = 0x00f0ff, speed = 38) {
  const dir = new THREE.Vector3().subVectors(target, start).normalize();
  const geo = new THREE.CylinderGeometry(0.06, 0.06, 0.9, 8);
  const mat = new THREE.MeshBasicMaterial({ color });
  const laser = new THREE.Mesh(geo, mat);
  laser.position.copy(start);
  laser.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);

  laser.userData = {
    dir,
    dmg,
    speed,
    life: 3.5
  };
  scene.add(laser);
  enemyProjectiles.push(laser);
}

function spawnPlayerRocket(start, dir) {
  const geo = new THREE.ConeGeometry(0.12, 0.6, 8);
  const mat = new THREE.MeshBasicMaterial({ color: 0xff0055 });
  const rocket = new THREE.Mesh(geo, mat);
  rocket.position.copy(start);
  rocket.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);

  rocket.userData = {
    dir,
    speed: 48,
    dmg: 150 * (activeBuffs.quad > 0 ? 4 : 1),
    radius: 8.5,
    life: 4.0
  };
  scene.add(rocket);
  playerRockets.push(rocket);
  audio.playRocketLaunch();
}

/* ==========================================================================
   15. SMART 50% AUTO-AIM ASSIST & RETICLE LOCK-ON
   ========================================================================== */
function updateAimAssist(dt) {
  const lockRing = document.getElementById('reticle-aim-lock');
  if (!lockRing || !camera) return;

  if (settings.aimAssist <= 0 || enemies.length === 0 || gameState !== 'PLAYING') {
    lockRing.classList.remove('locked');
    return;
  }

  const camForward = new THREE.Vector3();
  camera.getWorldDirection(camForward);

  const camPos = new THREE.Vector3();
  camera.getWorldPosition(camPos);

  let bestTarget = null;
  let bestAngle = Infinity;
  const maxAngle = THREE.MathUtils.degToRad(24); // Cone radius

  for (const enemy of enemies) {
    if (enemy.isDead || !enemy.mesh) continue;

    const toEnemy = new THREE.Vector3().subVectors(
      enemy.mesh.position.clone().add(new THREE.Vector3(0, enemy.height * 0.5, 0)),
      camPos
    );
    const dist = toEnemy.length();
    if (dist < 1.0 || dist > 60.0) continue;

    toEnemy.normalize();
    const dot = camForward.dot(toEnemy);
    const angle = Math.acos(Math.max(-1, Math.min(1, dot)));

    if (angle < maxAngle && angle < bestAngle) {
      bestAngle = angle;
      bestTarget = enemy;
    }
  }

  if (bestTarget) {
    lockRing.classList.add('locked');

    // Apply smooth magnetic pull towards target
    const targetPos = bestTarget.mesh.position.clone().add(new THREE.Vector3(0, bestTarget.height * 0.5, 0));
    const targetDir = targetPos.sub(camPos).normalize();

    const targetYaw = Math.atan2(-targetDir.x, -targetDir.z);
    const targetPitch = Math.asin(targetDir.y);

    const strength = (settings.aimAssist / 100) * 0.45;
    const lerpRate = Math.min(dt * 7.5 * strength, 0.4);

    let yawDiff = targetYaw - player.yaw;
    while (yawDiff > Math.PI) yawDiff -= Math.PI * 2;
    while (yawDiff < -Math.PI) yawDiff += Math.PI * 2;

    player.yaw += yawDiff * lerpRate;
    player.pitch += (targetPitch - player.pitch) * lerpRate;
  } else {
    lockRing.classList.remove('locked');
  }
}

/* ==========================================================================
   16. COMBAT ACTIONS, SHOOTING & PLAYER DAMAGE
   ========================================================================== */
function shootWeapon(isBurstShot = false) {
  if (gameState !== 'PLAYING' || player.isReloading) return;

  const wep = WEAPONS[currentWeaponIndex];
  const now = performance.now() / 1000;

  if (player.clips[currentWeaponIndex] <= 0) {
    startReload();
    return;
  }

  if (!isBurstShot && now - player.lastShotTime < wep.fireRate) {
    return;
  }

  player.lastShotTime = now;
  player.clips[currentWeaponIndex]--;
  stats.shotsFired++;
  updateAmmoHUD();

  // Fire Haptic Feedback
  triggerHaptic(12);

  // Weapon Recoil Animation Kick
  if (weaponContainer) {
    weaponContainer.position.z += wep.recoilKick;
    weaponContainer.position.y += wep.recoilKick * 0.3;
  }

  // Audio Dispatch
  if (wep.type === 'PLASMA') audio.playPlasmaShot();
  else if (wep.type === 'SHOTGUN') audio.playShotgunShot();
  else if (wep.type === 'RAILGUN') audio.playRailgunShot();
  else if (wep.type === 'ROCKET') audio.playRocketLaunch();

  // Camera Raycast Direction
  const camPos = new THREE.Vector3();
  camera.getWorldPosition(camPos);

  const baseDir = new THREE.Vector3();
  camera.getWorldDirection(baseDir);

  const dmgMult = activeBuffs.quad > 0 ? 4.0 : 1.0;

  if (wep.isProjectile) {
    // Void Rocket Launcher
    spawnPlayerRocket(camPos.clone().add(baseDir.clone().multiplyScalar(0.8)), baseDir);
  } else if (wep.isBeam) {
    // Hyper-Railgun Piercing Beam
    const beamEnd = camPos.clone().add(baseDir.clone().multiplyScalar(wep.range));
    spawnBulletTracer(camPos, beamEnd, wep.color);

    // Instant Piercing Hit Scan
    enemies.forEach(enemy => {
      if (enemy.isDead || !enemy.mesh) return;
      const toE = enemy.mesh.position.clone().add(new THREE.Vector3(0, enemy.height * 0.5, 0)).sub(camPos);
      const proj = toE.dot(baseDir);
      if (proj > 0 && proj < wep.range) {
        const perpDist = toE.sub(baseDir.clone().multiplyScalar(proj)).length();
        if (perpDist < enemy.radius + 0.4) {
          enemy.takeDamage(wep.damage * dmgMult, true);
        }
      }
    });
  } else {
    // Hitscan & Scatter Pellets
    const pelletCount = wep.pellets || 1;

    for (let p = 0; p < pelletCount; p++) {
      const spreadX = (Math.random() - 0.5) * wep.spread;
      const spreadY = (Math.random() - 0.5) * wep.spread;
      const shootDir = baseDir.clone().add(new THREE.Vector3(spreadX, spreadY, 0)).normalize();

      const raycaster = new THREE.Raycaster(camPos, shootDir, 0.1, wep.range);
      let closestHit = null;
      let closestDist = Infinity;
      let hitEnemy = null;

      enemies.forEach(enemy => {
        if (enemy.isDead || !enemy.mesh) return;
        const eCenter = enemy.mesh.position.clone().add(new THREE.Vector3(0, enemy.height * 0.5, 0));
        const sphere = new THREE.Sphere(eCenter, enemy.radius);
        const hitPoint = new THREE.Vector3();
        if (raycaster.ray.intersectSphere(sphere, hitPoint)) {
          const d = camPos.distanceTo(hitPoint);
          if (d < closestDist) {
            closestDist = d;
            closestHit = hitPoint;
            hitEnemy = enemy;
          }
        }
      });

      if (hitEnemy && closestHit) {
        const isCrit = Math.random() < 0.25;
        hitEnemy.takeDamage(wep.damage * dmgMult * (isCrit ? 1.5 : 1.0), isCrit);
        spawnBulletTracer(camPos, closestHit, wep.color);
      } else {
        const endPos = camPos.clone().add(shootDir.multiplyScalar(wep.range));
        spawnBulletTracer(camPos, endPos, wep.color);
      }
    }
  }

  // Auto reload when out of ammo
  if (player.clips[currentWeaponIndex] <= 0) {
    startReload();
  }
}

function startReload() {
  const wep = WEAPONS[currentWeaponIndex];
  if (player.isReloading || player.clips[currentWeaponIndex] === wep.clipSize) return;

  player.isReloading = true;
  player.reloadTimer = 0;
  audio.playReload();

  const prompt = document.getElementById('reload-prompt');
  if (prompt) prompt.classList.add('active');

  const bar = document.getElementById('reload-bar');
  if (bar) bar.style.opacity = '1';
}

function damagePlayer(amount) {
  if (gameState !== 'PLAYING') return;

  const nowSec = performance.now() / 1000;
  player.lastDamageTime = nowSec;

  // Absorbed by shields first
  if (player.shield > 0) {
    if (player.shield >= amount) {
      player.shield -= amount;
      amount = 0;
    } else {
      amount -= player.shield;
      player.shield = 0;
    }
  }

  if (amount > 0) {
    player.health = Math.max(0, player.health - amount);
  }

  // Red vignette flash & critical pulse
  const dmgOverlay = document.getElementById('damage-overlay');
  if (dmgOverlay) {
    dmgOverlay.classList.add('damaged');
    setTimeout(() => dmgOverlay.classList.remove('damaged'), 180);

    if (player.health < 30) {
      dmgOverlay.classList.add('critical');
    } else {
      dmgOverlay.classList.remove('critical');
    }
  }

  audio.playHurt();
  triggerHaptic(70);
  updateStatusHUD();

  if (player.health <= 0) {
    triggerGameOver();
  }
}

/* ==========================================================================
   17. WAVE SPAWNER, SECTOR ADVANCEMENT & LEVEL PROGRESSION
   ========================================================================== */
function startNextWave() {
  isWaveActive = true;
  waveSpawnTimer = 0;
  waveEnemiesSpawned = 0;

  const sector = SECTORS[currentSectorIndex];
  const isBossWave = (currentSectorIndex === 3 && currentWave === 3) || (currentWave % 3 === 0);

  if (isBossWave) {
    waveEnemiesTotal = 1;
  } else {
    waveEnemiesTotal = 4 + currentWave * 3 + currentSectorIndex * 2;
  }

  // Wave Announcement Banner
  const banner = document.getElementById('wave-banner');
  if (banner) {
    banner.textContent = isBossWave ? '⚠️ APEX TITAN ENGAGED ⚠️' : `WAVE 0${currentWave} INCOMING`;
    banner.classList.add('active');
    setTimeout(() => banner.classList.remove('active'), 2200);
  }

  const waveTag = document.getElementById('hud-wave');
  if (waveTag) waveTag.textContent = `WAVE 0${currentWave}`;

  updateEnemiesCounter();
  audio.setCombatMode(true);
}

function spawnNextEnemy() {
  if (waveEnemiesSpawned >= waveEnemiesTotal) return;

  const sector = SECTORS[currentSectorIndex];
  const isBossWave = (currentSectorIndex === 3 && currentWave === 3) || (currentWave % 3 === 0);

  const angle = Math.random() * Math.PI * 2;
  const dist = Math.random() * 22 + 18;
  const spawnPos = new THREE.Vector3(
    Math.cos(angle) * dist,
    1.5,
    Math.sin(angle) * dist
  );

  let type = 'DRONE';
  if (isBossWave && !bossInstance) {
    type = 'BOSS';
    spawnPos.set(0, 0, -25);
    audio.playBossSpawn();
  } else {
    const roll = Math.random();
    if (currentSectorIndex >= 2 && roll > 0.75) {
      type = 'PHANTOM';
    } else if (roll > 0.55) {
      type = 'BRUISER';
    } else if (roll > 0.25) {
      type = 'SWARM';
    } else {
      type = 'DRONE';
    }
  }

  const enemy = new Enemy(type, spawnPos);
  if (type === 'BOSS') bossInstance = enemy;
  enemies.push(enemy);

  waveEnemiesSpawned++;
  updateEnemiesCounter();
}

function updateEnemiesCounter() {
  const activeCount = enemies.filter(e => !e.isDead).length + (waveEnemiesTotal - waveEnemiesSpawned);
  const el = document.getElementById('hud-enemies');
  if (el) el.textContent = activeCount;

  // Check wave completion
  if (waveEnemiesSpawned >= waveEnemiesTotal && enemies.every(e => e.isDead)) {
    isWaveActive = false;
    audio.playWaveClear();
    audio.setCombatMode(false);
    triggerHaptic(100);
    stats.wavesSurvived++;

    // Sector completion check (every 3 waves)
    if (currentWave % 3 === 0) {
      triggerLevelClearModal();
    } else {
      currentWave++;
      setTimeout(startNextWave, 2400);
    }
  }
}

function addScore(basePts) {
  stats.comboCount++;
  stats.comboTimer = 3.5;
  stats.comboMultiplier = Math.min(8, 1 + Math.floor(stats.comboCount / 3));

  const total = basePts * stats.comboMultiplier;
  stats.score += total;
  updateScoreHUD();
}

function triggerLevelClearModal() {
  gameState = 'LEVEL_CLEAR';
  if (document.exitPointerLock) document.exitPointerLock();

  const modal = document.getElementById('level-clear-modal');
  if (modal) modal.classList.remove('hidden');

  const sector = SECTORS[currentSectorIndex];
  const sectorLbl = document.getElementById('lvl-stat-sector');
  if (sectorLbl) sectorLbl.textContent = sector.name;

  const bonusLbl = document.getElementById('lvl-stat-bonus');
  if (bonusLbl) bonusLbl.textContent = '+5,000 PTS';

  const subLbl = document.getElementById('level-clear-subtitle');
  if (subLbl) subLbl.textContent = `// ADVANCING TO ${SECTORS[(currentSectorIndex + 1) % SECTORS.length].name} //`;

  const scoreLbl = document.getElementById('lvl-stat-score');
  if (scoreLbl) scoreLbl.textContent = stats.score.toString().padStart(6, '0');

  const hullLbl = document.getElementById('lvl-stat-hull');
  if (hullLbl) hullLbl.textContent = `${Math.round(player.health)}%`;
}

function advanceToNextSector() {
  const modal = document.getElementById('level-clear-modal');
  if (modal) modal.classList.add('hidden');

  stats.sectorsCleared++;
  stats.score += 5000; // Clearance bonus

  currentSectorIndex = (currentSectorIndex + 1) % SECTORS.length;
  currentWave = 1;

  updateSectorEnvironment();

  // Reset player position and refresh health/stims
  player.position.set(0, 1.7, 0);
  player.health = player.maxHealth;
  player.shield = player.maxShield;
  player.stims = Math.min(player.maxStims, player.stims + 1);

  updateStatusHUD();
  updateStimHUD();
  updateScoreHUD();

  gameState = 'PLAYING';
  startNextWave();
}

/* ==========================================================================
   18. HUD, RADAR MINIMAP & STATUS GAUGES
   ========================================================================== */
function updateScoreHUD() {
  const scoreEl = document.getElementById('hud-score');
  if (scoreEl) scoreEl.textContent = stats.score.toString().padStart(6, '0');

  const comboBadge = document.getElementById('hud-combo');
  const comboText = document.getElementById('combo-text');
  const comboFill = document.getElementById('combo-fill');

  if (comboBadge && comboText && comboFill) {
    if (stats.comboMultiplier > 1) {
      comboBadge.classList.add('active');
      comboText.textContent = `${stats.comboMultiplier}X STREAK`;
      comboFill.style.width = `${(stats.comboTimer / 3.5) * 100}%`;
    } else {
      comboBadge.classList.remove('active');
    }
  }
}

function updateStatusHUD() {
  // Shield gauge
  const sPct = Math.max(0, Math.min(100, Math.round((player.shield / player.maxShield) * 100)));
  const sVal = document.getElementById('shield-val');
  const sFill = document.getElementById('shield-fill');
  const sGhost = document.getElementById('shield-ghost');
  if (sVal) sVal.textContent = `${sPct}%`;
  if (sFill) sFill.style.width = `${sPct}%`;
  if (sGhost) setTimeout(() => { sGhost.style.width = `${sPct}%`; }, 200);

  // Health gauge
  const hPct = Math.max(0, Math.min(100, Math.round((player.health / player.maxHealth) * 100)));
  const hVal = document.getElementById('health-val');
  const hFill = document.getElementById('health-fill');
  const hGhost = document.getElementById('health-ghost');
  if (hVal) hVal.textContent = `${hPct}%`;
  if (hFill) hFill.style.width = `${hPct}%`;
  if (hGhost) setTimeout(() => { hGhost.style.width = `${hPct}%`; }, 200);
}

function updateAmmoHUD() {
  const wep = WEAPONS[currentWeaponIndex];
  const clipEl = document.getElementById('ammo-clip');
  const resEl = document.getElementById('ammo-reserve');

  if (clipEl) clipEl.textContent = player.clips[currentWeaponIndex];
  if (resEl) resEl.innerHTML = '&infin;';

  const prompt = document.getElementById('reload-prompt');
  if (prompt) {
    if (player.clips[currentWeaponIndex] === 0) {
      prompt.classList.add('active');
    } else if (!player.isReloading) {
      prompt.classList.remove('active');
    }
  }
}

function renderRadar() {
  const canvas = document.getElementById('radar-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const range = 45; // Radar radius in world units

  ctx.clearRect(0, 0, w, h);

  // Radar Grid Circles
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
  ctx.lineWidth = 1;
  [15, 30, 45].forEach(r => {
    ctx.beginPath();
    ctx.arc(cx, cy, (r / range) * (w / 2), 0, Math.PI * 2);
    ctx.stroke();
  });

  // Radar Sweep Line
  const now = performance.now() / 1000;
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(now * 3) * (w / 2), cy + Math.sin(now * 3) * (h / 2));
  ctx.stroke();

  // Draw Enemies on Radar
  enemies.forEach(enemy => {
    if (enemy.isDead || !enemy.mesh) return;
    const dx = enemy.mesh.position.x - player.position.x;
    const dz = enemy.mesh.position.z - player.position.z;

    // Rotate relative to player yaw
    const cosYaw = Math.cos(player.yaw);
    const sinYaw = Math.sin(player.yaw);
    const rx = dx * cosYaw - dz * sinYaw;
    const ry = dx * sinYaw + dz * cosYaw;

    const plotX = cx + (rx / range) * (w / 2);
    const plotY = cy + (ry / range) * (h / 2);

    if (plotX >= 4 && plotX <= w - 4 && plotY >= 4 && plotY <= h - 4) {
      ctx.fillStyle = enemy.type === 'BOSS' ? '#ff0077' : '#ff0055';
      ctx.beginPath();
      ctx.arc(plotX, plotY, enemy.type === 'BOSS' ? 4.5 : 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Draw Powerups
  powerups.forEach(p => {
    const dx = p.mesh.position.x - player.position.x;
    const dz = p.mesh.position.z - player.position.z;
    const cosYaw = Math.cos(player.yaw);
    const sinYaw = Math.sin(player.yaw);
    const rx = dx * cosYaw - dz * sinYaw;
    const ry = dx * sinYaw + dz * cosYaw;

    const plotX = cx + (rx / range) * (w / 2);
    const plotY = cy + (ry / range) * (h / 2);

    if (plotX >= 4 && plotX <= w - 4 && plotY >= 4 && plotY <= h - 4) {
      ctx.fillStyle = '#00ff88';
      ctx.beginPath();
      ctx.arc(plotX, plotY, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Player Marker (Center Arrow pointing UP)
  ctx.fillStyle = '#00f0ff';
  ctx.beginPath();
  ctx.moveTo(cx, cy - 4);
  ctx.lineTo(cx - 3, cy + 4);
  ctx.lineTo(cx + 3, cy + 4);
  ctx.closePath();
  ctx.fill();
}

/* ==========================================================================
   19. PAUSE MENU & FULLSCREEN MANAGEMENT
   ========================================================================== */
function togglePauseMenu() {
  if (gameState === 'PLAYING') {
    gameState = 'PAUSED';
    if (document.exitPointerLock) document.exitPointerLock();
    const modal = document.getElementById('pause-modal');
    if (modal) modal.classList.remove('hidden');
    audio.setCombatMode(false);
  } else if (gameState === 'PAUSED') {
    gameState = 'PLAYING';
    const modal = document.getElementById('pause-modal');
    if (modal) modal.classList.add('hidden');
    const canvas = document.getElementById('webgl-canvas');
    if (canvas && canvas.requestPointerLock) canvas.requestPointerLock();
    if (isWaveActive) audio.setCombatMode(true);
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
  }
}

/* ==========================================================================
   20. UI BINDING & EVENT LISTENERS
   ========================================================================== */
function setupUI() {
  // HUD Buttons
  const btnPOV = document.getElementById('hud-btn-pov');
  if (btnPOV) btnPOV.onclick = () => togglePOV();

  const btnFS = document.getElementById('hud-btn-fullscreen');
  if (btnFS) btnFS.onclick = () => toggleFullscreen();

  const btnMusic = document.getElementById('hud-btn-music');
  if (btnMusic) btnMusic.onclick = () => audio.toggleMusic();

  const btnAudio = document.getElementById('hud-btn-audio');
  if (btnAudio) btnAudio.onclick = () => audio.toggleAudio();

  const btnPause = document.getElementById('hud-btn-pause');
  if (btnPause) btnPause.onclick = () => togglePauseMenu();

  const btnStim = document.getElementById('hud-btn-stim');
  if (btnStim) btnStim.onclick = () => useStim();

  const btnFireMode = document.getElementById('hud-btn-firemode');
  if (btnFireMode) btnFireMode.onclick = () => cycleFireMode();

  // Weapon tabs
  for (let i = 0; i < 4; i++) {
    const tab = document.getElementById(`wep-tab-${i}`);
    if (tab) {
      tab.onclick = () => switchWeapon(i);
    }
  }

  // Start Screen buttons
  const btnStart = document.getElementById('btn-start');
  if (btnStart) {
    btnStart.onclick = () => {
      audio.init();
      startGame();
    };
  }

  const btnOpenSettings = document.getElementById('btn-open-settings-main');
  if (btnOpenSettings) {
    btnOpenSettings.onclick = () => {
      populateSettingsForm();
      const m = document.getElementById('settings-modal');
      if (m) m.classList.remove('hidden');
    };
  }

  // Difficulty selector buttons on start screen
  const diffBtns = document.querySelectorAll('#start-diff-selector .diff-btn');
  diffBtns.forEach(btn => {
    btn.onclick = () => {
      diffBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      settings.difficulty = btn.dataset.diff || 'medium';
      saveSettings();
    };
  });

  // Settings Modal Tabs
  const tabBtns = document.querySelectorAll('.settings-tabs-nav .tab-btn');
  tabBtns.forEach(btn => {
    btn.onclick = () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.dataset.tab;
      document.querySelectorAll('.settings-dialog .tab-page').forEach(page => {
        page.classList.toggle('active', page.id === targetTab);
      });
    };
  });

  // Settings live slider labels
  const bindSliderLabel = (sliderId, labelId, suffix = '') => {
    const s = document.getElementById(sliderId);
    const l = document.getElementById(labelId);
    if (s && l) {
      s.oninput = () => {
        let val = s.value;
        if (suffix === 'x') val = parseFloat(val).toFixed(1);
        l.textContent = `${val}${suffix}`;
      };
    }
  };

  bindSliderLabel('setting-aim-assist', 'val-aim-assist', '%');
  bindSliderLabel('setting-sensitivity-x', 'val-sensitivity-x', 'x');
  bindSliderLabel('setting-sensitivity-y', 'val-sensitivity-y', 'x');
  bindSliderLabel('setting-fov', 'val-fov', '°');
  bindSliderLabel('setting-music-vol', 'val-music-vol', '%');
  bindSliderLabel('setting-sfx-vol', 'val-sfx-vol', '%');
  bindSliderLabel('setting-touch-scale', 'val-touch-scale', '%');
  bindSliderLabel('setting-touch-opacity', 'val-touch-opacity', '%');

  // Settings Action buttons
  const btnSaveSettings = document.getElementById('btn-save-settings');
  if (btnSaveSettings) {
    btnSaveSettings.onclick = () => {
      readSettingsFromForm();
      saveSettings();
      applySettings();
      const m = document.getElementById('settings-modal');
      if (m) m.classList.add('hidden');
    };
  }

  const btnResetSettings = document.getElementById('btn-reset-settings');
  if (btnResetSettings) {
    btnResetSettings.onclick = () => {
      settings = Object.assign({}, DEFAULT_SETTINGS);
      saveSettings();
      populateSettingsForm();
      applySettings();
    };
  }

  const btnCloseSettings = document.getElementById('btn-close-settings');
  if (btnCloseSettings) {
    btnCloseSettings.onclick = () => {
      const m = document.getElementById('settings-modal');
      if (m) m.classList.add('hidden');
    };
  }

  // Pause Modal actions
  const btnPauseResume = document.getElementById('btn-pause-resume');
  if (btnPauseResume) btnPauseResume.onclick = () => togglePauseMenu();

  const btnPauseSettings = document.getElementById('btn-pause-settings');
  if (btnPauseSettings) {
    btnPauseSettings.onclick = () => {
      populateSettingsForm();
      const m = document.getElementById('settings-modal');
      if (m) m.classList.remove('hidden');
    };
  }

  const btnPauseRestart = document.getElementById('btn-pause-restart');
  if (btnPauseRestart) {
    btnPauseRestart.onclick = () => {
      const modal = document.getElementById('pause-modal');
      if (modal) modal.classList.add('hidden');
      startGame();
    };
  }

  const btnPauseMainMenu = document.getElementById('btn-pause-mainmenu');
  if (btnPauseMainMenu) {
    btnPauseMainMenu.onclick = () => {
      const modal = document.getElementById('pause-modal');
      if (modal) modal.classList.add('hidden');
      const hud = document.getElementById('hud');
      if (hud) hud.style.display = 'none';
      const startScreen = document.getElementById('start-screen');
      if (startScreen) startScreen.classList.remove('hidden');
      gameState = 'START_MENU';
      audio.setCombatMode(false);
    };
  }

  // Next Level modal action
  const btnNextLevel = document.getElementById('btn-next-level');
  if (btnNextLevel) btnNextLevel.onclick = () => advanceToNextSector();

  // Game Over modal actions
  const btnRestart = document.getElementById('btn-restart');
  if (btnRestart) {
    btnRestart.onclick = () => {
      const m = document.getElementById('game-over-screen');
      if (m) m.classList.add('hidden');
      startGame();
    };
  }

  const btnGameOverMenu = document.getElementById('btn-gameover-menu');
  if (btnGameOverMenu) {
    btnGameOverMenu.onclick = () => {
      const m = document.getElementById('game-over-screen');
      if (m) m.classList.add('hidden');
      const hud = document.getElementById('hud');
      if (hud) hud.style.display = 'none';
      const startScreen = document.getElementById('start-screen');
      if (startScreen) startScreen.classList.remove('hidden');
      gameState = 'START_MENU';
      audio.setCombatMode(false);
    };
  }
}

function setupEventListeners() {
  window.addEventListener('resize', onWindowResize);

  // Keyboard Input
  window.addEventListener('keydown', e => {
    keys[e.code] = true;

    if (e.code === 'KeyV') {
      togglePOV();
    } else if (e.code === 'KeyB') {
      cycleFireMode();
    } else if (e.code === 'KeyH' || e.code === 'KeyQ') {
      useStim();
    } else if (e.code === 'KeyR') {
      startReload();
    } else if (e.code === 'Digit1') {
      switchWeapon(0);
    } else if (e.code === 'Digit2') {
      switchWeapon(1);
    } else if (e.code === 'Digit3') {
      switchWeapon(2);
    } else if (e.code === 'Digit4') {
      switchWeapon(3);
    } else if (e.code === 'Escape' || e.code === 'KeyP') {
      togglePauseMenu();
    }
  });

  window.addEventListener('keyup', e => {
    keys[e.code] = false;
  });

  // Pointer Lock & Mouse Look
  const canvas = document.getElementById('webgl-canvas');
  if (canvas) {
    canvas.addEventListener('click', () => {
      if (gameState === 'PLAYING' && !document.pointerLockElement) {
        canvas.requestPointerLock();
      }
    });
  }

  document.addEventListener('mousemove', e => {
    if (document.pointerLockElement && gameState === 'PLAYING') {
      const sensX = (settings.sensitivityX || 1.0) * 0.0022;
      const sensY = (settings.sensitivityY || 1.0) * 0.0022;
      const invert = settings.invertY ? -1 : 1;

      player.yaw -= e.movementX * sensX;
      player.pitch -= e.movementY * sensY * invert;
      player.pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, player.pitch));
    }
  });

  // Mouse Fire & Wheel
  window.addEventListener('mousedown', e => {
    if (e.button === 0 && gameState === 'PLAYING') {
      isTriggerHeld = true;
      isTriggerJustPressed = true;
      audio.init();

      if (currentFireMode === 'BURST') {
        burstRemaining = 3;
        burstTimer = 0;
      } else if (currentFireMode === 'SEMI') {
        shootWeapon();
      }
    }
  });

  window.addEventListener('mouseup', e => {
    if (e.button === 0) {
      isTriggerHeld = false;
      isTriggerJustPressed = false;
    }
  });

  window.addEventListener('wheel', e => {
    if (gameState === 'PLAYING') {
      if (e.deltaY > 0) {
        switchWeapon((currentWeaponIndex + 1) % WEAPONS.length);
      } else if (e.deltaY < 0) {
        switchWeapon((currentWeaponIndex - 1 + WEAPONS.length) % WEAPONS.length);
      }
    }
  });

  setupMobileTouchControls();
}

function setupMobileTouchControls() {
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  const mobileHUD = document.getElementById('mobile-controls');
  if (mobileHUD && isTouchDevice) {
    mobileHUD.style.display = 'block';
  }

  // Touch POV / Mode / Stim buttons
  const touchPOV = document.getElementById('btn-touch-pov');
  if (touchPOV) touchPOV.onclick = () => togglePOV();

  const touchMode = document.getElementById('btn-touch-mode');
  if (touchMode) touchMode.onclick = () => cycleFireMode();

  const touchStim = document.getElementById('btn-touch-stim');
  if (touchStim) touchStim.onclick = () => useStim();

  const touchPrev = document.getElementById('btn-touch-wep-prev');
  if (touchPrev) {
    touchPrev.onclick = () => switchWeapon((currentWeaponIndex - 1 + WEAPONS.length) % WEAPONS.length);
  }

  const touchNext = document.getElementById('btn-touch-wep-next');
  if (touchNext) {
    touchNext.onclick = () => switchWeapon((currentWeaponIndex + 1) % WEAPONS.length);
  }

  const touchReload = document.getElementById('btn-touch-reload');
  if (touchReload) touchReload.onclick = () => startReload();

  const touchJump = document.getElementById('btn-touch-jump');
  if (touchJump) {
    touchJump.ontouchstart = e => {
      e.preventDefault();
      if (player.isGrounded) {
        player.velocity.y = player.jumpImpulse;
        player.isGrounded = false;
        audio.playDash();
      }
    };
  }

  const touchDash = document.getElementById('btn-touch-dash');
  if (touchDash) {
    touchDash.ontouchstart = e => {
      e.preventDefault();
      player.isDashing = true;
      audio.playDash();
      triggerHaptic(20);
    };
    touchDash.ontouchend = () => {
      player.isDashing = false;
    };
  }

  const touchFire = document.getElementById('btn-touch-fire');
  if (touchFire) {
    touchFire.ontouchstart = e => {
      e.preventDefault();
      isTriggerHeld = true;
      isTriggerJustPressed = true;
      audio.init();

      if (currentFireMode === 'BURST') {
        burstRemaining = 3;
        burstTimer = 0;
      } else if (currentFireMode === 'SEMI') {
        shootWeapon();
      }
    };
    touchFire.ontouchend = e => {
      e.preventDefault();
      isTriggerHeld = false;
      isTriggerJustPressed = false;
    };
  }

  // Virtual Joystick (Left zone)
  const joyZone = document.getElementById('touch-joystick-zone');
  const joyKnob = document.getElementById('joystick-knob');

  if (joyZone && joyKnob) {
    joyZone.ontouchstart = e => {
      e.preventDefault();
      const t = e.changedTouches[0];
      touchState.joystickActive = true;
      touchState.touchId = t.identifier;
      const rect = joyZone.getBoundingClientRect();
      touchState.startX = rect.left + rect.width / 2;
      touchState.startY = rect.top + rect.height / 2;
    };

    joyZone.ontouchmove = e => {
      e.preventDefault();
      if (!touchState.joystickActive) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === touchState.touchId) {
          const dx = t.clientX - touchState.startX;
          const dy = t.clientY - touchState.startY;
          const maxDist = 45 * (settings.touchScale / 100);
          const dist = Math.min(maxDist, Math.hypot(dx, dy));
          const angle = Math.atan2(dy, dx);

          const knobX = Math.cos(angle) * dist;
          const knobY = Math.sin(angle) * dist;
          joyKnob.style.transform = `translate(calc(-50% + ${knobX}px), calc(-50% + ${knobY}px))`;

          touchState.moveX = knobX / maxDist;
          touchState.moveY = knobY / maxDist;
        }
      }
    };

    const resetJoy = e => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchState.touchId) {
          touchState.joystickActive = false;
          touchState.touchId = null;
          touchState.moveX = 0;
          touchState.moveY = 0;
          joyKnob.style.transform = 'translate(-50%, -50%)';
        }
      }
    };
    joyZone.ontouchend = resetJoy;
    joyZone.ontouchcancel = resetJoy;
  }

  // Touch Look Drag (Right side of screen)
  window.addEventListener('touchstart', e => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.target && (t.target.tagName === 'BUTTON' || t.target.closest('button, #mobile-controls, .hud-quick-actions, #settings-modal, #pause-modal, .stim-launcher-row, .weapon-arsenal-dock'))) {
        continue;
      }
      if (t.clientX > window.innerWidth / 2 && touchState.lookTouchId === null) {
        touchState.lookTouchId = t.identifier;
        touchState.lastLookX = t.clientX;
        touchState.lastLookY = t.clientY;
      }
    }
  }, { passive: true });

  window.addEventListener('touchmove', e => {
    if (touchState.lookTouchId === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier === touchState.lookTouchId) {
        const dx = t.clientX - touchState.lastLookX;
        const dy = t.clientY - touchState.lastLookY;
        touchState.lastLookX = t.clientX;
        touchState.lastLookY = t.clientY;

        const sensX = (settings.sensitivityX || 1.0) * 0.0035;
        const sensY = (settings.sensitivityY || 1.0) * 0.0035;
        const invert = settings.invertY ? -1 : 1;

        player.yaw -= dx * sensX;
        player.pitch -= dy * sensY * invert;
        player.pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, player.pitch));
      }
    }
  }, { passive: true });

  const endLook = e => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchState.lookTouchId) {
        touchState.lookTouchId = null;
      }
    }
  };
  window.addEventListener('touchend', endLook, { passive: true });
  window.addEventListener('touchcancel', endLook, { passive: true });
}

function onWindowResize() {
  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

/* ==========================================================================
   21. GAME LIFECYCLE & STATE MANAGEMENT
   ========================================================================== */
function startGame() {
  const startScreen = document.getElementById('start-screen');
  if (startScreen) startScreen.classList.add('hidden');

  const hud = document.getElementById('hud');
  if (hud) hud.style.display = 'block';

  // Apply difficulty stats
  const diff = DIFFICULTY_CONFIG[settings.difficulty] || DIFFICULTY_CONFIG.medium;
  player.maxHealth = diff.playerHp;
  player.health = diff.playerHp;
  player.maxShield = diff.playerShield;
  player.shield = diff.playerShield;
  player.stims = 3;
  player.clips = [30, 8, 4, 4];
  player.isReloading = false;
  player.position.set(0, 1.7, 0);
  player.velocity.set(0, 0, 0);

  // Clear entities
  enemies.forEach(e => { if (e.mesh) scene.remove(e.mesh); });
  enemies = [];
  powerups.forEach(p => { if (p.mesh) scene.remove(p.mesh); });
  powerups = [];
  enemyProjectiles.forEach(p => scene.remove(p));
  enemyProjectiles = [];
  playerRockets.forEach(r => scene.remove(r));
  playerRockets = [];
  bossInstance = null;

  stats.score = 0;
  stats.kills = 0;
  stats.shotsFired = 0;
  stats.shotsHit = 0;
  stats.wavesSurvived = 0;
  stats.sectorsCleared = 0;
  stats.comboCount = 0;
  stats.comboMultiplier = 1;
  stats.startTime = performance.now() / 1000;

  try {
    const savedHi = localStorage.getItem('cyberstorm_highscore');
    stats.highScore = savedHi ? parseInt(savedHi, 10) : 0;
  } catch (e) {
    stats.highScore = 0;
  }

  currentSectorIndex = 0;
  currentWave = 1;
  updateSectorEnvironment();

  updateScoreHUD();
  updateStatusHUD();
  updateAmmoHUD();
  updateStimHUD();
  updatePOVVisuals();
  updateFireModeVisuals();

  gameState = 'PLAYING';
  startNextWave();

  // Pointer lock on canvas
  const canvas = document.getElementById('webgl-canvas');
  if (canvas && canvas.requestPointerLock) {
    canvas.requestPointerLock();
  }
}

function triggerGameOver() {
  gameState = 'GAME_OVER';
  if (document.exitPointerLock) document.exitPointerLock();

  audio.setCombatMode(false);
  triggerHaptic([100, 50, 200]);

  // High score persistence
  if (stats.score > stats.highScore) {
    stats.highScore = stats.score;
    try {
      localStorage.setItem('cyberstorm_highscore', stats.highScore.toString());
    } catch (e) {}
  }

  // Populate debrief modal
  const finalScoreEl = document.getElementById('stat-final-score');
  if (finalScoreEl) finalScoreEl.textContent = stats.score;

  const hiScoreEl = document.getElementById('stat-high-score');
  if (hiScoreEl) hiScoreEl.textContent = stats.highScore;

  const sectorsEl = document.getElementById('stat-sectors');
  if (sectorsEl) sectorsEl.textContent = stats.sectorsCleared;

  const wavesEl = document.getElementById('stat-waves');
  if (wavesEl) wavesEl.textContent = stats.wavesSurvived;

  const killsEl = document.getElementById('stat-kills');
  if (killsEl) killsEl.textContent = stats.kills;

  const acc = stats.shotsFired > 0 ? Math.round((stats.shotsHit / stats.shotsFired) * 100) : 0;
  const accEl = document.getElementById('stat-accuracy');
  if (accEl) accEl.textContent = `${acc}%`;

  const duration = Math.floor((performance.now() / 1000) - stats.startTime);
  const mins = Math.floor(duration / 60).toString().padStart(2, '0');
  const secs = (duration % 60).toString().padStart(2, '0');
  const timeEl = document.getElementById('stat-time');
  if (timeEl) timeEl.textContent = `${mins}:${secs}`;

  const diffEl = document.getElementById('stat-difficulty');
  if (diffEl) {
    const diff = DIFFICULTY_CONFIG[settings.difficulty] || DIFFICULTY_CONFIG.medium;
    diffEl.textContent = diff.name;
  }

  const goModal = document.getElementById('game-over-screen');
  if (goModal) goModal.classList.remove('hidden');
}

/* ==========================================================================
   22. MAIN GAME LOOP & KINEMATICS
   ========================================================================== */
let lastFrameTime = performance.now();

function animate() {
  requestAnimationFrame(animate);

  const now = performance.now();
  const dt = Math.min((now - lastFrameTime) / 1000, 0.1);
  lastFrameTime = now;

  if (gameState === 'PLAYING') {
    updatePlayerPhysics(dt);
    updateAimAssist(dt);
    updateWeaponAnimation(dt);
    updateCombatLifecycle(dt);
    updateEnemies(dt);
    updatePowerups(dt);
    updateProjectilesAndParticles(dt);
    renderRadar();
  }

  // Ambient Sparks Animation
  if (settings.particles && ambientSparks.length > 0) {
    ambientSparks.forEach(spark => {
      spark.position.y += dt * spark.userData.speedY;
      spark.rotation.y += dt * spark.userData.rotSpeed;
      if (spark.position.y > 10.5) spark.position.y = 0.5;
    });
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

function updatePlayerPhysics(dt) {
  const diff = DIFFICULTY_CONFIG[settings.difficulty] || DIFFICULTY_CONFIG.medium;
  const nowSec = performance.now() / 1000;

  // Shield Regeneration
  if (nowSec - player.lastDamageTime > diff.shieldRegenDelay && player.shield < player.maxShield) {
    player.shield = Math.min(player.maxShield, player.shield + diff.shieldRegenRate * dt);
    updateStatusHUD();
  }

  // Directional Movement Vector
  const moveDir = new THREE.Vector3();
  if (keys['KeyW']) moveDir.z -= 1;
  if (keys['KeyS']) moveDir.z += 1;
  if (keys['KeyA']) moveDir.x -= 1;
  if (keys['KeyD']) moveDir.x += 1;

  if (touchState.joystickActive) {
    moveDir.x += touchState.moveX;
    moveDir.z += touchState.moveY;
  }

  const isMoving = (moveDir.lengthSq() > 0.01);
  if (isMoving) {
    moveDir.normalize();
    moveDir.applyEuler(new THREE.Euler(0, player.yaw, 0));
  }

  const isSprinting = keys['ShiftLeft'] || keys['ShiftRight'] || player.isDashing;
  const speedBoost = activeBuffs.overdrive > 0 ? 1.6 : 1.0;
  const currentSpeed = (isSprinting ? player.dashSpeed : player.speed) * speedBoost;

  player.velocity.x = moveDir.x * currentSpeed;
  player.velocity.z = moveDir.z * currentSpeed;

  if (keys['Space'] && player.isGrounded) {
    player.velocity.y = player.jumpImpulse;
    player.isGrounded = false;
    audio.playDash();
  }

  player.velocity.y -= 28 * dt; // Gravity

  // Swept Collisions
  const newPos = player.position.clone().addScaledVector(player.velocity, dt);
  const playerBox = new THREE.Box3();
  const pRad = player.radius;

  // X Resolution
  playerBox.min.set(newPos.x - pRad, player.position.y - 1.6, player.position.z - pRad);
  playerBox.max.set(newPos.x + pRad, player.position.y + 0.2, player.position.z + pRad);

  let collideX = false;
  for (const box of colliders) {
    if (playerBox.intersectsBox(box)) {
      collideX = true;
      break;
    }
  }
  if (!collideX) player.position.x = newPos.x;

  // Z Resolution
  playerBox.min.set(player.position.x - pRad, player.position.y - 1.6, newPos.z - pRad);
  playerBox.max.set(player.position.x + pRad, player.position.y + 0.2, newPos.z + pRad);

  let collideZ = false;
  for (const box of colliders) {
    if (playerBox.intersectsBox(box)) {
      collideZ = true;
      break;
    }
  }
  if (!collideZ) player.position.z = newPos.z;

  // Y Ground Check
  player.position.y += player.velocity.y * dt;
  if (player.position.y <= 1.7) {
    player.position.y = 1.7;
    player.velocity.y = 0;
    player.isGrounded = true;
  }

  // Update Camera Rig & Perspective
  cameraRig.position.copy(player.position);
  cameraRig.rotation.y = player.yaw;

  if (perspectiveMode === 'FPP') {
    camera.position.set(0, 0, 0);
    camera.rotation.set(player.pitch, 0, 0);
  } else {
    // TPP: Over-the-shoulder third person camera with anti-clipping raycast
    const targetDist = 3.4;
    const shoulderX = 0.65;
    const shoulderY = 0.35;

    // Local offset behind player
    const camOffset = new THREE.Vector3(shoulderX, shoulderY, targetDist);
    camOffset.applyEuler(new THREE.Euler(player.pitch, player.yaw, 0, 'YXZ'));

    const idealCamPos = player.position.clone().add(camOffset);

    // Wall collision raycast
    const rayOrigin = player.position.clone().add(new THREE.Vector3(0, 0.4, 0));
    const rayDir = idealCamPos.clone().sub(rayOrigin).normalize();
    const ray = new THREE.Ray(rayOrigin, rayDir);

    let finalDist = targetDist;
    for (const box of colliders) {
      const hitPoint = new THREE.Vector3();
      if (ray.intersectBox(box, hitPoint)) {
        const d = rayOrigin.distanceTo(hitPoint);
        if (d < finalDist + 0.5) {
          finalDist = Math.max(0.6, d - 0.3);
        }
      }
    }

    const safeCamOffset = new THREE.Vector3(shoulderX * (finalDist / targetDist), shoulderY, finalDist);
    safeCamOffset.applyEuler(new THREE.Euler(player.pitch, 0, 0));
    camera.position.copy(safeCamOffset);
    camera.rotation.set(player.pitch * 0.9, 0, 0);
  }

  // Animate TPP Cyborg Character Mesh
  if (characterMesh && perspectiveMode === 'TPP') {
    characterMesh.position.set(player.position.x, player.position.y - 1.7, player.position.z);
    characterMesh.rotation.y = player.yaw + Math.PI;

    if (isMoving) {
      player.walkTime += dt * currentSpeed * 1.8;
      if (charLegLeft) charLegLeft.rotation.x = Math.sin(player.walkTime) * 0.6;
      if (charLegRight) charLegRight.rotation.x = -Math.sin(player.walkTime) * 0.6;
      if (charArmLeft) charArmLeft.rotation.x = -Math.sin(player.walkTime) * 0.5;
    } else {
      if (charLegLeft) charLegLeft.rotation.x *= 0.85;
      if (charLegRight) charLegRight.rotation.x *= 0.85;
      if (charArmLeft) charArmLeft.rotation.x *= 0.85;
    }

    // Right arm pitch aiming with weapon
    if (charArmRight) {
      charArmRight.rotation.x = player.pitch;
    }
  }
}

function updateWeaponAnimation(dt) {
  if (!weaponContainer) return;

  // Spring recoil back to rest position
  const restZ = -0.6;
  const restY = -0.28;

  weaponContainer.position.z += (restZ - weaponContainer.position.z) * dt * 12;
  weaponContainer.position.y += (restY - weaponContainer.position.y) * dt * 12;

  // Reload progress animation
  if (player.isReloading) {
    const wep = WEAPONS[currentWeaponIndex];
    player.reloadTimer += dt;
    const progress = Math.min(1.0, player.reloadTimer / wep.reloadTime);

    // Dip weapon down and bring up
    weaponContainer.position.y = restY - Math.sin(progress * Math.PI) * 0.25;

    const reloadFill = document.getElementById('reload-fill');
    if (reloadFill) reloadFill.style.width = `${progress * 100}%`;

    if (player.reloadTimer >= wep.reloadTime) {
      player.isReloading = false;
      player.clips[currentWeaponIndex] = wep.clipSize;
      updateAmmoHUD();

      const prompt = document.getElementById('reload-prompt');
      if (prompt) prompt.classList.remove('active');

      const bar = document.getElementById('reload-bar');
      if (bar) bar.style.opacity = '0';
    }
  }
}

function updateCombatLifecycle(dt) {
  // Continuous Auto-Fire
  if (isTriggerHeld && currentFireMode === 'AUTO') {
    shootWeapon();
  }

  // Burst Fire Queue
  if (burstRemaining > 0) {
    burstTimer += dt;
    if (burstTimer >= 0.08) {
      burstTimer = 0;
      burstRemaining--;
      shootWeapon(true);
    }
  }

  // Combo Streak Timer
  if (stats.comboTimer > 0) {
    stats.comboTimer -= dt;
    if (stats.comboTimer <= 0) {
      stats.comboCount = 0;
      stats.comboMultiplier = 1;
      updateScoreHUD();
    } else {
      updateScoreHUD();
    }
  }

  // Wave Spawner Loop
  if (isWaveActive && waveEnemiesSpawned < waveEnemiesTotal) {
    waveSpawnTimer += dt;
    const spawnDelay = currentSectorIndex === 3 ? 1.0 : 1.6;
    if (waveSpawnTimer >= spawnDelay) {
      waveSpawnTimer = 0;
      spawnNextEnemy();
    }
  }
}

function updateEnemies(dt) {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    if (enemy.isDead) {
      enemies.splice(i, 1);
      continue;
    }
    enemy.update(dt);
  }
}

function updateProjectilesAndParticles(dt) {
  // Tracers Decay
  for (let i = tracers.length - 1; i >= 0; i--) {
    const t = tracers[i];
    t.userData.life -= dt;
    if (t.userData.life <= 0) {
      scene.remove(t);
      tracers.splice(i, 1);
    }
  }

  // Enemy Lasers & Projectiles
  for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
    const proj = enemyProjectiles[i];
    proj.userData.life -= dt;
    proj.position.addScaledVector(proj.userData.dir, proj.userData.speed * dt);

    // Collision with Player
    const distToP = proj.position.distanceTo(player.position);
    if (distToP < player.radius + 0.5) {
      damagePlayer(proj.userData.dmg);
      scene.remove(proj);
      enemyProjectiles.splice(i, 1);
      continue;
    }

    if (proj.userData.life <= 0) {
      scene.remove(proj);
      enemyProjectiles.splice(i, 1);
    }
  }

  // Player Rockets
  for (let i = playerRockets.length - 1; i >= 0; i--) {
    const rkt = playerRockets[i];
    rkt.userData.life -= dt;
    rkt.position.addScaledVector(rkt.userData.dir, rkt.userData.speed * dt);

    // Rocket collision check against enemies
    let detonated = false;
    for (const enemy of enemies) {
      if (enemy.isDead || !enemy.mesh) continue;
      const d = rkt.position.distanceTo(enemy.mesh.position);
      if (d < enemy.radius + 0.6) {
        detonated = true;
        break;
      }
    }

    if (rkt.position.y <= 0.2 || rkt.userData.life <= 0 || detonated) {
      // AoE Detonation
      createExplosion(rkt.position, 0xff0055, true);
      audio.playExplosion(true);

      enemies.forEach(enemy => {
        if (enemy.isDead || !enemy.mesh) return;
        const d = rkt.position.distanceTo(enemy.mesh.position);
        if (d < rkt.userData.radius) {
          const falloff = 1 - (d / rkt.userData.radius);
          enemy.takeDamage(rkt.userData.dmg * falloff, true);
        }
      });

      scene.remove(rkt);
      playerRockets.splice(i, 1);
    }
  }

  // Particle Bursts
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.userData.life -= dt;
    p.position.x += p.userData.vx * dt;
    p.position.y += p.userData.vy * dt;
    p.position.z += p.userData.vz * dt;
    p.userData.vy -= 16 * dt; // Gravity

    if (p.userData.life <= 0) {
      scene.remove(p);
      particles.splice(i, 1);
    }
  }
}

/* ==========================================================================
   23. INITIALIZATION & INTERACTIVE LOADING SCREEN SIMULATION
   ========================================================================== */
window.addEventListener('DOMContentLoaded', () => {
  loadSettings();

  const fill = document.getElementById('loading-progress-fill');
  const statusMsg = document.getElementById('loading-status-msg');
  const tipMsg = document.getElementById('loading-tip-msg');
  const enterBtn = document.getElementById('btn-enter-game');
  const loadingScreen = document.getElementById('loading-screen');

  const tips = [
    'TIP: Switch between First-Person (FPP) and Third-Person (TPP) using [V] or the POV button!',
    'TIP: Use [B] or MODE button to cycle Full-Auto, 3-Round Burst, and Semi-Auto firing modes!',
    'TIP: Press [H] / [Q] or tap STIM to consume a Nano-Medkit and restore 40 HP!',
    'TIP: Smart 50% Auto-Aim assist locks onto hostile cores inside the reticle cone!',
    'TIP: Eliminating threats within 3.5s builds up to an 8X Combat Score Multiplier!'
  ];

  let progress = 0;
  const loadInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 14) + 8;

    if (progress < 25) {
      if (statusMsg) statusMsg.textContent = 'INITIALIZING QUANTUM SHADERS...';
    } else if (progress < 50) {
      if (statusMsg) statusMsg.textContent = 'COMPILING CYBER-MESHES & MATERIALS...';
    } else if (progress < 75) {
      if (statusMsg) statusMsg.textContent = 'GENERATING SECTOR MATRIX ARCHITECTURE...';
    } else if (progress < 95) {
      if (statusMsg) statusMsg.textContent = 'CALIBRATING SYNTHESIZER & SENSORS...';
    } else {
      progress = 100;
      clearInterval(loadInterval);

      if (statusMsg) statusMsg.textContent = 'WARZONE READY // PROTOCOL 0 LOADED';
      if (enterBtn) enterBtn.classList.remove('hidden');
    }

    if (fill) fill.style.width = `${progress}%`;
  }, 100);

  // Tip cycle
  let tipIdx = 0;
  setInterval(() => {
    tipIdx = (tipIdx + 1) % tips.length;
    if (tipMsg) tipMsg.textContent = tips[tipIdx];
  }, 3500);

  if (enterBtn) {
    enterBtn.onclick = () => {
      if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.4s ease';
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 400);
      }
      audio.init();
      initScene();
      animate();
    };
  }
});
