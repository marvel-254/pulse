/**
 * Pulse Soundtrack — background music, synthesised live in the browser.
 *
 * Why synthesised? Pulse ships no audio files: bundling commercial tracks would
 * be copyright infringement and would add megabytes to a static site. Instead
 * this module builds the music from oscillators and noise with the Web Audio
 * API, in two moods:
 *
 *   • cinematic — a piano/string ostinato that builds over a Dm–Bb–F–C
 *     progression (in the spirit of modern minimal piano composers).
 *   • phonk     — half-time drums, 808 glides, a cowbell melody and vinyl
 *     crackle, in the spirit of dark Memphis-style phonk.
 *
 * Prefer your own licensed track? Set `audio.track` in js/config.js to any
 * audio file you own the rights to and it plays instead (looped).
 *
 * Rules it follows:
 *   • Never autoplays — audio only starts from a real user gesture.
 *   • Off by default; the choice and volume persist in localStorage.
 *   • Fades in/out, pauses when the tab is hidden, respects "save data".
 */
(() => {
  "use strict";

  const STORE = "pulse-audio";
  const MOODS = ["cinematic", "phonk"];

  const audioConfig = () => (window.PULSE_CONFIG && window.PULSE_CONFIG.audio) || {};

  const readState = () => {
    const defaults = {
      enabled: !!audioConfig().enabled,
      mood: MOODS.includes(audioConfig().mood) ? audioConfig().mood : "cinematic",
      volume: typeof audioConfig().volume === "number" ? audioConfig().volume : 0.35,
      hintDismissed: false,
      triedMoods: [],
    };
    try {
      const raw = localStorage.getItem(STORE);
      return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
    } catch {
      return defaults;
    }
  };

  let state = readState();
  const save = () => {
    try {
      localStorage.setItem(STORE, JSON.stringify(state));
    } catch {}
  };

  /* ---------- audio graph ---------- */
  let ctx = null;
  let master = null;
  let bus = null;
  let filter = null;
  let convolver = null;
  let wet = null;
  let dry = null;
  let fileEl = null; // optional user-supplied track
  let noiseBuf = null;
  let vinylNode = null;
  let playing = false;
  let timer = null;
  let step = 0;
  let nextTime = 0;
  let startedAt = 0;

  const trackUrl = () => (audioConfig().track || "").trim();
  const isFileMode = () => !!trackUrl();

  function makeNoise(seconds = 2) {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  function makeImpulse(seconds = 2.8, decay = 2.6) {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const data = buf.getChannelData(c);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    return buf;
  }

  function ensureGraph() {
    if (ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try {
      ctx = new AC();
    } catch {
      return false;
    }

    master = ctx.createGain();
    master.gain.value = 0;
    filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 11500;
    filter.Q.value = 0.4;

    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.knee.value = 22;
    comp.ratio.value = 3.4;
    comp.attack.value = 0.006;
    comp.release.value = 0.24;

    bus = ctx.createGain();
    bus.gain.value = 0.9;

    convolver = ctx.createConvolver();
    convolver.buffer = makeImpulse();
    wet = ctx.createGain();
    wet.gain.value = 0.34;
    dry = ctx.createGain();
    dry.gain.value = 0.86;

    bus.connect(filter);
    filter.connect(dry);
    filter.connect(wet);
    wet.connect(convolver);
    convolver.connect(comp);
    dry.connect(comp);
    comp.connect(master);
    master.connect(ctx.destination);

    noiseBuf = makeNoise(2);
    return true;
  }

  function fade(to, seconds = 1.2) {
    if (!master) return;
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), now);
    master.gain.linearRampToValueAtTime(Math.max(0.0001, to), now + seconds);
  }

  /* ---------- voices ---------- */
  function piano(freq, t, dur, vel = 0.5) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vel, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    const parts = [
      [1, 1, "sine"],
      [2, 0.34, "triangle"],
      [3, 0.12, "sine"],
      [4.2, 0.05, "sine"],
    ];
    for (const [mult, amp, type] of parts) {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = freq * mult;
      const og = ctx.createGain();
      og.gain.value = amp;
      o.connect(og);
      og.connect(g);
      o.start(t);
      o.stop(t + dur + 0.05);
    }
    g.connect(bus);
  }

  function strings(freq, t, dur, vel = 0.14) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vel, t + 0.9);
    g.gain.setValueAtTime(vel, t + dur * 0.6);
    g.gain.linearRampToValueAtTime(0.0001, t + dur);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1700;
    for (const detune of [-7, 6]) {
      const o = ctx.createOscillator();
      o.type = "sawtooth";
      o.frequency.value = freq;
      o.detune.value = detune;
      o.connect(lp);
      o.start(t);
      o.stop(t + dur + 0.1);
    }
    lp.connect(g);
    g.connect(bus);
  }

  function kick(t, vel = 0.9) {
    const o = ctx.createOscillator();
    o.type = "sine";
    const g = ctx.createGain();
    o.frequency.setValueAtTime(128, t);
    o.frequency.exponentialRampToValueAtTime(44, t + 0.14);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vel, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);
    o.connect(g);
    g.connect(bus);
    o.start(t);
    o.stop(t + 0.5);
  }

  function noiseHit(t, { type = "highpass", freq = 7000, dur = 0.05, vel = 0.2, q = 1 } = {}) {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    src.playbackRate.value = 1;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vel, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f);
    f.connect(g);
    g.connect(bus);
    src.start(t);
    src.stop(t + dur + 0.05);
  }

  const hat = (t, open = false, vel = 0.11) =>
    noiseHit(t, { type: "highpass", freq: open ? 6200 : 8200, dur: open ? 0.2 : 0.045, vel });

  function clap(t, vel = 0.32) {
    for (let i = 0; i < 3; i++) {
      noiseHit(t + i * 0.011, { type: "bandpass", freq: 1750, q: 1.2, dur: 0.09, vel: vel * (1 - i * 0.22) });
    }
    noiseHit(t + 0.03, { type: "bandpass", freq: 2400, q: 0.9, dur: 0.16, vel: vel * 0.5 });
  }

  function cowbell(t, freq = 540, vel = 0.16, dur = 0.26) {
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 2640;
    bp.Q.value = 0.7;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vel, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    for (const f of [freq, freq * 1.48]) {
      const o = ctx.createOscillator();
      o.type = "square";
      o.frequency.value = f;
      const og = ctx.createGain();
      og.gain.value = 0.5;
      o.connect(og);
      og.connect(bp);
      o.start(t);
      o.stop(t + dur + 0.05);
    }
    bp.connect(g);
    g.connect(bus);
  }

  function bass808(t, freq, dur = 0.9, glideTo = null, vel = 0.5) {
    const o = ctx.createOscillator();
    o.type = "sine";
    const g = ctx.createGain();
    const shaper = ctx.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i / 255) * 2 - 1;
      curve[i] = Math.tanh(x * 1.8);
    }
    shaper.curve = curve;

    o.frequency.setValueAtTime(freq, t);
    if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t + dur * 0.7);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vel, t + 0.012);
    g.gain.setValueAtTime(vel, t + dur * 0.7);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.12);
    o.connect(shaper);
    shaper.connect(g);
    g.connect(bus);
    o.start(t);
    o.stop(t + dur + 0.2);
  }

  function startVinyl() {
    if (!noiseBuf || vinylNode) return;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    src.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = 1900;
    f.Q.value = 0.5;
    const g = ctx.createGain();
    g.gain.value = 0.02;
    src.connect(f);
    f.connect(g);
    g.connect(master);
    src.start();
    vinylNode = src;
  }

  function stopVinyl() {
    try {
      vinylNode?.stop();
    } catch {}
    vinylNode = null;
  }

  /* ---------- note helpers ---------- */
  const A4 = 440;
  const semi = (n) => A4 * Math.pow(2, n / 12);
  // note numbers relative to A4 (A=0): C=-9, D=-7, E=-5, F=-4, G=-2 …
  const N = {
    C2: -33, D2: -31, E2: -29, F2: -28, G2: -26, A2: -24, Bb2: -22, B2: -21,
    C3: -21, D3: -19, E3: -17, F3: -16, G3: -14, A3: -12, Bb3: -10, B3: -9,
    C4: -9, D4: -7, E4: -5, F4: -4, G4: -2, A4: 0, Bb4: 2, B4: 3,
    C5: 3, D5: 5, E5: 7, F5: 8, G5: 10, A5: 12, Bb5: 14, B5: 15, C6: 15,
  };
  const f = (note) => semi(N[note] ?? 0);
  const midi = (note) => f(note);

  /* ---------- moods ---------- */
  const MOOD_DEFS = {
    cinematic: {
      bpm: 84,
      steps: 16, // 16th notes, one bar per chord
      progression: ["D", "Bb", "F", "C"],
      chords: {
        D: ["D3", "F3", "A3", "D4", "F4", "A4"],
        Bb: ["Bb2", "D3", "F3", "Bb3", "D4", "F4"],
        F: ["F2", "A2", "C3", "F3", "A3", "C4"],
        C: ["C3", "E3", "G3", "C4", "E4", "G4"],
      },
      reverb: 0.42,
      filter: 11000,
      scheduleStep(s, t) {
        const bar = Math.floor(s / 16);
        const i = s % 16;
        const chord = this.chords[this.progression[bar % this.progression.length]];
        const build = 0.55 + 0.45 * ((bar % 4) / 3); // dynamics rise over 4 bars

        // Broken-chord arpeggio, up and back down
        const pattern = [0, 2, 4, 5, 4, 2, 3, 5, 4, 2, 0, 2, 1, 3, 4, 2];
        const note = chord[pattern[i] % chord.length];
        piano(midi(note) * (i >= 8 ? 1 : 1), t, 1.1, 0.26 * build);
        if (i % 8 === 0) piano(midi(chord[0]) / 2, t, 1.8, 0.3 * build);

        if (i === 0) {
          strings(midi(chord[0]) / 2, t, (60 / this.bpm) * 4, 0.1 * build);
          strings(midi(chord[2]), t, (60 / this.bpm) * 4, 0.07 * build);
        }
        if (i === 0 && bar % 2 === 0) kick(t, 0.28);
      },
    },
    phonk: {
      bpm: 132,
      steps: 16,
      progression: ["Am", "F", "C", "G"],
      roots: { Am: "A2", F: "F2", C: "C3", G: "G2" },
      // 16-step cowbell melody per bar (null = rest), A minor pentatonic
      bells: [
        ["A4", null, "C5", null, "E5", null, "C5", "A4", null, "G4", null, "E4", "G4", null, "A4", null],
        ["F4", null, "A4", null, "C5", null, "A4", "F4", null, "G4", null, "A4", "C5", null, "A4", null],
      ],
      reverb: 0.2,
      filter: 8600,
      scheduleStep(s, t) {
        const bar = Math.floor(s / 16);
        const i = s % 16;
        const root = this.roots[this.progression[bar % this.progression.length]];

        if ([0, 6, 10].includes(i)) kick(t, i === 0 ? 0.95 : 0.75);
        if ([4, 12].includes(i)) clap(t, 0.3);
        if (i % 2 === 0) hat(t, i === 14, 0.085);
        if (i === 0 || i === 8) bass808(t, midi(root) / 2, 1.1, i === 8 ? midi(root) / 2 * 1.5 : null, 0.55);
        if (i === 11) bass808(t, midi(root) / 2 * 0.75, 0.4, null, 0.4);

        const bells = this.bells[bar % this.bells.length];
        const b = bells[i];
        if (b) cowbell(t, midi(b) / 2, 0.13, 0.24);
        if (i === 0 && bar % 4 === 0) cowbell(t, midi(this.roots[this.progression[bar % 4]]) / 4, 0.09, 1.4);
      },
    },
  };

  /* ---------- transport ---------- */
  function stepDuration() {
    const def = MOOD_DEFS[state.mood] || MOOD_DEFS.cinematic;
    return 60 / def.bpm / 4;
  }

  function schedule() {
    const def = MOOD_DEFS[state.mood] || MOOD_DEFS.cinematic;
    const lookahead = 0.14;
    while (nextTime < ctx.currentTime + lookahead) {
      try {
        def.scheduleStep(step, nextTime);
      } catch {}
      step = (step + 1) % (def.steps * 8); // 8-bar loop
      nextTime += stepDuration();
    }
  }

  function applyMood() {
    const def = MOOD_DEFS[state.mood] || MOOD_DEFS.cinematic;
    if (filter) filter.frequency.value = def.filter;
    if (wet) wet.gain.value = def.reverb;
    if (state.mood === "phonk") startVinyl();
    else stopVinyl();
  }

  /* ---------- public transport ---------- */
  function play({ silent = false } = {}) {
    if (isFileMode()) return playFile({ silent });
    if (!ensureGraph()) return false;
    if (ctx.state === "suspended") ctx.resume();
    if (playing) return true;

    applyMood();
    playing = true;
    step = 0;
    nextTime = ctx.currentTime + 0.08;
    startedAt = Date.now();
    fade(state.volume, 1.6);
    if (timer) clearInterval(timer);
    timer = setInterval(schedule, 25);
    schedule();
    state.enabled = true;
    save();
    document.dispatchEvent(new CustomEvent("pulse:music", { detail: { playing: true, mood: state.mood } }));
    if (!silent) return true;
    return true;
  }

  function playFile({ silent = false } = {}) {
    const url = trackUrl();
    if (!url) return false;
    if (!fileEl) {
      fileEl = new Audio(url);
      fileEl.loop = true;
      fileEl.preload = "none";
      fileEl.crossOrigin = "anonymous";
    }
    fileEl.volume = state.volume;
    const p = fileEl.play();
    playing = true;
    state.enabled = true;
    save();
    document.dispatchEvent(new CustomEvent("pulse:music", { detail: { playing: true, mood: "custom" } }));
    if (p?.catch) p.catch(() => {});
    return true;
  }

  function pause() {
    playing = false;
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    stopVinyl();
    if (fileEl) {
      fileEl.pause();
    } else if (ctx) {
      fade(0.0001, 0.7);
      setTimeout(() => {
        if (!playing && ctx && ctx.state === "running") ctx.suspend().catch(() => {});
      }, 800);
    }
    state.enabled = false;
    save();
    document.dispatchEvent(new CustomEvent("pulse:music", { detail: { playing: false } }));
  }

  const toggle = () => (playing ? (pause(), false) : (play(), true));

  function setMood(mood) {
    if (!MOODS.includes(mood) || mood === state.mood) return state.mood;
    if (!state.triedMoods.includes(mood)) state.triedMoods.push(mood);
    state.mood = mood;
    save();
    if (playing) {
      // Restart the sequencer on the new mood with a short crossfade
      playing = false;
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      stopVinyl();
      step = 0;
      nextTime = ctx.currentTime + 0.1;
      applyMood();
      playing = true;
      timer = setInterval(schedule, 25);
      schedule();
    }
    document.dispatchEvent(new CustomEvent("pulse:mood", { detail: { mood } }));
    return mood;
  }

  function setVolume(v) {
    state.volume = Math.min(1, Math.max(0, Number(v) || 0));
    save();
    if (fileEl) fileEl.volume = state.volume;
    if (playing && master) fade(state.volume, 0.25);
    return state.volume;
  }

  /* ---------- lifecycle ---------- */
  function init() {
    document.addEventListener("visibilitychange", () => {
      if (!playing) return;
      if (document.hidden) {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
        if (fileEl) fileEl.pause();
        else if (ctx) ctx.suspend().catch(() => {});
      } else if (!timer && !isFileMode()) {
        if (ctx) ctx.resume().catch(() => {});
        timer = setInterval(schedule, 25);
        nextTime = Math.max(nextTime, ctx.currentTime + 0.08);
        schedule();
      } else if (isFileMode() && fileEl) {
        fileEl.play().catch(() => {});
      }
    });

    // Never start by itself: if the visitor previously enabled audio, wait for
    // the first interaction (browser autoplay rules) and then resume.
    if (state.enabled) {
      const resumeOnce = () => {
        document.removeEventListener("pointerdown", resumeOnce);
        document.removeEventListener("keydown", resumeOnce);
        play({ silent: true });
      };
      document.addEventListener("pointerdown", resumeOnce, { once: true });
      document.addEventListener("keydown", resumeOnce, { once: true });
    }
  }

  window.PulseMusic = {
    init,
    play,
    pause,
    toggle,
    setMood,
    setVolume,
    isPlaying: () => playing,
    mood: () => (isFileMode() ? "custom" : state.mood),
    moods: () => (isFileMode() ? ["custom"] : [...MOODS]),
    volume: () => state.volume,
    hasCustomTrack: isFileMode,
    triedMoods: () => [...state.triedMoods],
    state: () => ({ playing, ...state }),
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
