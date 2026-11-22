import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { HardCases, Hook, Intro, N8nEmail, N8nLocal, Outro, Pipeline, Product, Stats } from "./Scenes";
import { C } from "./theme";

export const SCENES = [
  { C: Intro, d: 110 },
  { C: Hook, d: 120 },
  { C: N8nLocal, d: 300 },
  { C: Pipeline, d: 220 },
  { C: Product, d: 290 },
  { C: HardCases, d: 200 },
  { C: N8nEmail, d: 260 },
  { C: Stats, d: 170 },
  { C: Outro, d: 150 },
] as const;

export const TOTAL = SCENES.reduce((s, x) => s + x.d, 0);

export const Promo: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Series>
      {SCENES.map(({ C: Scene, d }, i) => (
        <Series.Sequence key={i} durationInFrames={d}>
          <Scene dur={d} />
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);
