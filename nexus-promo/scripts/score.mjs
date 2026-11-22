// Original background score for the Nexus film, synthesised from scratch (no samples, no third-party audio).
//   node scripts/score.mjs   → public/score.wav  (90 s, 44.1 kHz, stereo, 16-bit)
// Structure (96 BPM, A minor): intro pad → pulse + bass → full groove → breakdown → lift → outro hit.
import fs from "node:fs";

const SR = 44100;
const DUR = 90;
const BPM = 96;
const BEAT = 60 / BPM;
const N = SR * DUR;
const L = new Float32Array(N);
const R = new Float32Array(N);

const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);
const env = (t, a, d, len) => (t < 0 || t > len ? 0 : t < a ? t / a : t > len - d ? Math.max(0, (len - t) / d) : 1);
const add = (i, l, r) => { if (i >= 0 && i < N) { L[i] += l; R[i] += r; } };

// Section gains over time (seconds) — the "arrangement".
const lerp = (pts, t) => {
  for (let k = 0; k < pts.length - 1; k++) {
    const [t0, v0] = pts[k], [t1, v1] = pts[k + 1];
    if (t >= t0 && t <= t1) return v0 + ((v1 - v0) * (t - t0)) / (t1 - t0);
  }
  return pts[pts.length - 1][1];
};
const padGain = (t) => lerp([[0, 0], [3, 0.9], [60, 0.9], [66, 1.1], [84, 1], [90, 0]], t);
const pulseGain = (t) => lerp([[0, 0], [5, 0], [7, 0.8], [52, 0.8], [54, 0.25], [66, 0.25], [68, 0.9], [86, 0.9], [89, 0]], t);
const drumGain = (t) => lerp([[0, 0], [12.5, 0], [12.6, 1], [52, 1], [52.1, 0], [67.4, 0], [67.5, 1.05], [86, 1], [88, 0]], t);
const bassGain = (t) => lerp([[0, 0], [10, 0], [12.5, 0.9], [52, 0.9], [53, 0.3], [66, 0.3], [67.5, 1], [86, 1], [89, 0]], t);

// Am – F – C – G (two bars each), voiced as triads + 9ths for an "institutional", cinematic colour.
const CHORDS = [
  [57, 60, 64, 71], // Am(add9)
  [53, 57, 60, 67], // Fmaj(add9)
  [48, 55, 60, 64], // C(add9-ish)
  [55, 59, 62, 69], // G6
];
const BAR = BEAT * 4;
const chordAt = (t) => CHORDS[Math.floor(t / (BAR * 2)) % CHORDS.length];

// 1) Pad: detuned saws through a soft low-pass (one-pole), slow stereo drift.
{
  let lpL = 0, lpR = 0;
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    const g = padGain(t) * 0.055;
    if (g === 0) continue;
    const ch = chordAt(t);
    let sL = 0, sR = 0;
    for (const m of ch) {
      const f = midi(m);
      for (const det of [-0.11, 0, 0.13]) {
        const ph = (t * f * (1 + det / 100)) % 1;
        const saw = 2 * ph - 1;
        sL += saw * (det <= 0 ? 1 : 0.6);
        sR += saw * (det >= 0 ? 1 : 0.6);
      }
    }
    const cutoff = 0.035 + 0.02 * Math.sin(t * 0.21) + 0.03 * (t > 66 ? 1 : 0);
    lpL += cutoff * (sL - lpL);
    lpR += cutoff * (sR - lpR);
    add(i, lpL * g, lpR * g);
  }
}

// 2) Arp pulse: 16th-note plucks over chord tones, ping-pong panned.
for (let k = 0; k * (BEAT / 4) < DUR; k++) {
  const t0 = k * (BEAT / 4);
  const g = pulseGain(t0) * 0.09;
  if (g === 0) continue;
  const ch = chordAt(t0);
  const note = ch[[0, 2, 1, 3, 2, 1, 3, 2][k % 8]] + 12;
  const f = midi(note);
  const len = 0.22;
  const pan = k % 2 ? 0.7 : 0.3;
  for (let j = 0; j < len * SR; j++) {
    const t = j / SR;
    const e = Math.exp(-t * 18);
    const s = (Math.sin(2 * Math.PI * f * t) + 0.35 * Math.sin(2 * Math.PI * f * 2 * t)) * e * g;
    add(Math.floor(t0 * SR) + j, s * (1 - pan) * 2, s * pan * 2);
  }
}

// 3) Bass: root on each beat with a sub sine + slight saw grit, sidechained by the kick.
for (let b = 0; b * BEAT < DUR; b++) {
  const t0 = b * BEAT;
  const g = bassGain(t0) * 0.32;
  if (g === 0) continue;
  const root = chordAt(t0)[0] - 12;
  const f = midi(root);
  const len = BEAT * 0.95;
  for (let j = 0; j < len * SR; j++) {
    const t = j / SR;
    const duck = Math.min(1, t / 0.09); // sidechain feel
    const e = env(t, 0.005, 0.12, len) * duck;
    const s = (Math.sin(2 * Math.PI * f * t) * 0.9 + (2 * ((f * t) % 1) - 1) * 0.08) * e * g;
    add(Math.floor(t0 * SR) + j, s, s);
  }
}

// 4) Drums: kick on 1&3 (four-on-floor in the lift), offbeat hats, clap on 2&4.
const kick = (t0, g) => {
  for (let j = 0; j < 0.35 * SR; j++) {
    const t = j / SR;
    const f = 50 + 110 * Math.exp(-t * 32);
    const s = Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 9) * g;
    add(Math.floor(t0 * SR) + j, s, s);
  }
};
let seed = 7;
const noise = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
const hat = (t0, g, pan) => {
  let hp = 0, prev = 0;
  for (let j = 0; j < 0.05 * SR; j++) {
    const t = j / SR;
    const n = noise();
    hp = 0.92 * (hp + n - prev); prev = n;
    const s = hp * Math.exp(-t * 90) * g;
    add(Math.floor(t0 * SR) + j, s * (1 - pan), s * pan);
  }
};
const clap = (t0, g) => {
  for (let j = 0; j < 0.18 * SR; j++) {
    const t = j / SR;
    const bursts = [0, 0.011, 0.022].some((d) => t > d && t < d + 0.006) ? 1 : 0.35;
    const s = noise() * Math.exp(-t * 22) * bursts * g;
    add(Math.floor(t0 * SR) + j, s * 0.9, s);
  }
};
for (let b = 0; b * BEAT < DUR; b++) {
  const t0 = b * BEAT;
  const g = drumGain(t0);
  if (g === 0) continue;
  const lift = t0 >= 67.5;
  if (b % 2 === 0 || lift) kick(t0, 0.55 * g);
  if (b % 2 === 1) clap(t0, 0.11 * g);
  hat(t0 + BEAT / 2, 0.16 * g, 0.65);
  if (lift) { hat(t0 + BEAT / 4, 0.07 * g, 0.35); hat(t0 + (3 * BEAT) / 4, 0.07 * g, 0.35); }
}

// 5) Risers into scene changes + a final impact.
const riser = (tEnd, len, g) => {
  const t0 = tEnd - len;
  for (let j = 0; j < len * SR; j++) {
    const t = j / SR, p = t / len;
    const s = noise() * p * p * g + Math.sin(2 * Math.PI * (200 + 1800 * p * p) * t) * p * p * g * 0.25;
    add(Math.floor(t0 * SR) + j, s * (0.5 + 0.5 * p), s * (1.5 - 0.5 * p) * 0.67);
  }
};
const impact = (t0, g) => {
  for (let j = 0; j < 3.5 * SR; j++) {
    const t = j / SR;
    const s = (Math.sin(2 * Math.PI * (38 + 40 * Math.exp(-t * 6)) * t) * Math.exp(-t * 1.6) + noise() * Math.exp(-t * 7) * 0.4) * g;
    add(Math.floor(t0 * SR) + j, s, s);
  }
};
riser(12.5, 4, 0.05);
riser(67.5, 3, 0.06);
impact(12.5, 0.35);
impact(67.5, 0.4);
impact(84.5, 0.45);

// 6) Stereo delay "space", then soft-clip + normalise to −1 dBFS.
const D = Math.floor(BEAT * 0.75 * SR);
for (let i = D; i < N; i++) { L[i] += R[i - D] * 0.22; R[i] += L[i - D] * 0.22; }
let peak = 0;
for (let i = 0; i < N; i++) { L[i] = Math.tanh(L[i] * 1.2); R[i] = Math.tanh(R[i] * 1.2); peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i])); }
const norm = 0.89 / peak;
// fade out last 1.5 s
for (let i = N - 1.5 * SR; i < N; i++) { const f = (N - i) / (1.5 * SR); L[i] *= f; R[i] *= f; }

const buf = Buffer.alloc(44 + N * 4);
buf.write("RIFF", 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write("WAVE", 8);
buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
buf.write("data", 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * norm)) * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * norm)) * 32767), 46 + i * 4);
}
fs.mkdirSync("public", { recursive: true });
fs.writeFileSync("public/score.wav", buf);
console.log(`score.wav written: ${DUR}s, peak normalised from ${peak.toFixed(2)}`);
