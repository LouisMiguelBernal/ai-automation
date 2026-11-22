import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { Analyse, Email, Guardrails, Hook, Intro, Outro, Price, Stats, Workflow } from "./Scenes";
import { C } from "./theme";

// ~35 s at 30 fps.
export const SCENES = [
  { C: Intro, d: 95 },
  { C: Hook, d: 90 },
  { C: Price, d: 130 },
  { C: Analyse, d: 165 },
  { C: Workflow, d: 150 },
  { C: Email, d: 170 },
  { C: Guardrails, d: 95 },
  { C: Stats, d: 80 },
  { C: Outro, d: 90 },
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
