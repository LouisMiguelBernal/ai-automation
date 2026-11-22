// Original 60 s score for the Nexus AI film, synthesised from scratch (no samples, no third-party audio).
//   node scripts/score60.mjs   → public/score60.wav  (44.1 kHz, stereo, 16-bit)
// 124 BPM, A major (F#m – D – A – E, one bar each). 31 bars = 60 s.
// Arrangement (bars): 0–4 intro build · 4 drop · 20–22 breakdown · 22 lift + hook · 27 impact · 30 tail.
import fs from "node:fs";

const SR = 44100, BPM = 124, BEAT = 60 / BPM, BAR = BEAT * 4, DUR = 60, N = SR * DUR;
const L = new Float32Array(N), R = new Float32Array(N);
const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);
const add = (i, l, r) => { if (i >= 0 && i < N) { L[i] += l; R[i] += r; } };
const bar = (t) => t / BAR;
const lerp = (pts, x) => {
  for (let k = 0; k < pts.length - 1; k++) {
    const [a, va] = pts[k], [b, vb] = pts[k + 1];
    if (x >= a && x <= b) return va + ((vb - va) * (x - a)) / (b - a);
  }
  return pts[pts.length - 1][1];
};
let seed = 11;
const noise = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;

const CHORDS = [
  [54, 61, 64, 68], // F#m(add9)
  [50, 57, 61, 66], // Dmaj7
  [57, 61, 64, 71], // A(add9)
  [52, 59, 64, 66], // Esus2
];
const chordAt = (t) => CHORDS[Math.floor(bar(t)) % 4];

// Sidechain pump: quarter-note duck once drums are in.
const drumsOn = (b) => (b >= 4 && b < 20) || (b >= 22 && b < 30);
const pump = (t) => {
  if (!drumsOn(bar(t))) return 1;
  const p = (t % BEAT) / BEAT;
  return 0.35 + 0.65 * Math.min(1, p / 0.45);
};

// 1) Supersaw pad, filter opens through the intro and the lift.
{
  let a = 0, b = 0;
  for (let i = 0; i < N; i++) {
    const t = i / SR, x = bar(t);
    const g = lerp([[0, 0], [1, 0.6], [4, 0.75], [20, 0.75], [21, 0.9], [22, 0.85], [30, 0.85], [31, 0]], x) * 0.045;
    const ch = chordAt(t);
    let sl = 0, sr = 0;
    for (const m of ch) {
      const f = midi(m);
      for (const d of [-0.14, -0.05, 0.06, 0.15]) {
        const s = 2 * ((t * f * (1 + d / 100)) % 1) - 1;
        sl += d < 0 ? s : s * 0.55; sr += d > 0 ? s : s * 0.55;
      }
    }
    const cut = lerp([[0, 0.012], [4, 0.06], [20, 0.06], [22, 0.03], [22.01, 0.09], [31, 0.07]], x);
    a += cut * (sl - a); b += cut * (sr - b);
    const p = pump(t);
    add(i, a * g * p, b * g * p);
  }
}

// 2) Pluck arp, 16ths, chord tones up an octave, ping-pong.
for (let k = 0; k * (BEAT / 4) < DUR; k++) {
  const t0 = k * (BEAT / 4), x = bar(t0);
  const g = lerp([[0, 0.25], [4, 0.7], [20, 0.7], [20.01, 0.55], [22, 0.8], [30, 0.8], [31, 0.2]], x) * 0.07;
  const ch = chordAt(t0);
  const note = ch[[0, 1, 2, 3, 2, 1, 3, 2, 0, 2, 3, 1, 2, 3, 1, 2][k % 16]] + 12;
  const f = midi(note), len = 0.18, pan = k % 2 ? 0.75 : 0.25;
  const bright = lerp([[0, 0.15], [4, 0.45], [22, 0.6], [31, 0.5]], x);
  for (let j = 0; j < len * SR; j++) {
    const t = j / SR, e = Math.exp(-t * 22);
    const s = (Math.sin(2 * Math.PI * f * t) + bright * Math.sin(2 * Math.PI * f * 3 * t) * Math.exp(-t * 40)) * e * g;
    add(Math.floor(t0 * SR) + j, s * (1 - pan) * 2, s * pan * 2);
  }
}

// 3) Bass: off-beat 8ths (rolling, energetic), sub + filtered saw.
for (let k = 0; k * (BEAT / 2) < DUR; k++) {
  const t0 = k * (BEAT / 2), x = bar(t0);
  if (!drumsOn(x) || k % 2 === 0) continue;
  const f = midi(chordAt(t0)[0] - 12), len = BEAT * 0.45;
  for (let j = 0; j < len * SR; j++) {
    const t = j / SR, e = Math.min(1, t / 0.004) * Math.exp(-t * 6);
    const s = (Math.sin(2 * Math.PI * f * t) * 0.85 + (2 * ((f * 2 * t) % 1) - 1) * 0.12 * Math.exp(-t * 14)) * e * 0.3;
    add(Math.floor(t0 * SR) + j, s, s);
  }
}

// 4) Drums.
const kick = (t0, g) => { for (let j = 0; j < 0.3 * SR; j++) { const t = j / SR; const f = 48 + 130 * Math.exp(-t * 38); add(Math.floor(t0 * SR) + j, Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 10) * g, Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 10) * g); } };
const hat = (t0, g, pan, decay = 90) => { let hp = 0, pr = 0; for (let j = 0; j < 0.12 * SR; j++) { const t = j / SR, n = noise(); hp = 0.9 * (hp + n - pr); pr = n; const s = hp * Math.exp(-t * decay) * g; add(Math.floor(t0 * SR) + j, s * (1 - pan), s * pan); } };
const clap = (t0, g) => { for (let j = 0; j < 0.25 * SR; j++) { const t = j / SR; const bu = [0, 0.01, 0.02].some((d) => t > d && t < d + 0.005) ? 1 : 0.4; const s = noise() * Math.exp(-t * 18) * bu * g; add(Math.floor(t0 * SR) + j, s, s * 0.92); } };
for (let b = 0; b * BEAT < DUR; b++) {
  const t0 = b * BEAT, x = bar(t0);
  const lift = x >= 22;
  if (x >= 2 && x < 4) hat(t0 + BEAT / 2, 0.08 * (x - 2), 0.6);
  if (!drumsOn(x)) continue;
  kick(t0, lift ? 0.6 : 0.55);
  if (b % 2 === 1) clap(t0, 0.13);
  hat(t0 + BEAT / 2, 0.14, 0.6, 35); // open hat
  for (const q of [0.25, 0.75]) hat(t0 + BEAT * q, 0.05, 0.4);
  if (lift) for (const q of [0, 0.5]) hat(t0 + BEAT * q + 0.01, 0.04, 0.25, 140); // shaker
}
// Snare roll building into the lift.
for (let k = 0; k < 32; k++) { const t0 = 20 * BAR + (k * 2 * BAR) / 32; clap(t0, 0.03 + 0.1 * (k / 32)); }

// 5) Hook lead from the lift: short, bright, singable.
const HOOK = [[0, 76, 0.5], [0.5, 78, 0.5], [1, 80, 1], [2, 78, 0.5], [2.5, 76, 0.5], [3, 73, 1], [4, 76, 0.5], [4.5, 78, 0.5], [5, 81, 1.5], [6.5, 80, 0.5], [7, 76, 1]];
for (let rep = 0; rep < 4; rep++) {
  const start = 22 * BAR + rep * 2 * BAR;
  if (start >= 30 * BAR) break;
  for (const [beat, m, d] of HOOK) {
    const t0 = start + beat * BEAT, f = midi(m), len = d * BEAT;
    for (let j = 0; j < len * SR; j++) {
      const t = j / SR, e = Math.min(1, t / 0.01) * Math.exp(-t * 3) * (t > len - 0.03 ? (len - t) / 0.03 : 1);
      const vib = 1 + 0.004 * Math.sin(2 * Math.PI * 5.5 * t);
      const s = (Math.sin(2 * Math.PI * f * vib * t) * 0.7 + Math.sin(2 * Math.PI * f * 2 * vib * t) * 0.2 + (2 * ((f * vib * t) % 1) - 1) * 0.08) * e * 0.06;
      add(Math.floor(t0 * SR) + j, s * 0.85, s);
    }
  }
}

// 6) FX: risers, impacts, downlifter.
const riser = (tEnd, len, g) => { const t0 = tEnd - len; for (let j = 0; j < len * SR; j++) { const t = j / SR, p = t / len; const s = (noise() * 0.7 + Math.sin(2 * Math.PI * (300 + 2400 * p * p) * t) * 0.3) * p * p * g; add(Math.floor(t0 * SR) + j, s * (1 - 0.3 * p), s * (0.7 + 0.3 * p)); } };
const impact = (t0, g) => { for (let j = 0; j < 2.5 * SR; j++) { const t = j / SR; const s = (Math.sin(2 * Math.PI * (40 + 50 * Math.exp(-t * 7)) * t) * Math.exp(-t * 2.2) + noise() * Math.exp(-t * 9) * 0.35) * g; add(Math.floor(t0 * SR) + j, s, s); } };
riser(4 * BAR, 3.5, 0.06); riser(22 * BAR, 3.8, 0.07);
impact(4 * BAR, 0.32); impact(22 * BAR, 0.34); impact(27 * BAR, 0.4); riser(27 * BAR, 2.5, 0.05);

// 7) Space + master: ping-pong delay, soft clip, normalise, fade.
const D = Math.floor(BEAT * 0.75 * SR);
for (let i = D; i < N; i++) { L[i] += R[i - D] * 0.18; R[i] += L[i - D] * 0.18; }
let peak = 0;
for (let i = 0; i < N; i++) { L[i] = Math.tanh(L[i] * 1.25); R[i] = Math.tanh(R[i] * 1.25); peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i])); }
const norm = 0.89 / peak;
for (let i = N - 2 * SR; i < N; i++) { const f = (N - i) / (2 * SR); L[i] *= f; R[i] *= f; }

const buf = Buffer.alloc(44 + N * 4);
buf.write("RIFF", 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write("WAVE", 8); buf.write("fmt ", 12);
buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * norm)) * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * norm)) * 32767), 46 + i * 4);
}
fs.writeFileSync("public/score60.wav", buf);
console.log(`score60.wav: ${DUR}s, ${(DUR / BAR).toFixed(2)} bars, peak ${peak.toFixed(2)}`);
