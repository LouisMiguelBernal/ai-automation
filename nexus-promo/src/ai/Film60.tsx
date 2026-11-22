import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Enter, Finish, P, Reveal, bars } from "./kit";
import { Finbert, Gemma, Hook, Lift, Local, Logo, Outro, Stack, WhereAI } from "./Scenes60";

// Cuts sit on bar lines of the 124 BPM score: drop bar 4, breakdown bar 20, lift bar 22, final hit bar 27.
const SCENES: { C: React.FC<{ dur: number }>; from: number; to: number; enter: Enter }[] = [
  { C: Hook, from: 0, to: 4, enter: "cut" },
  { C: Logo, from: 4, to: 6, enter: "iris" },
  { C: Stack, from: 6, to: 9, enter: "shutter" },
  { C: Finbert, from: 9, to: 13, enter: "zoom" },
  { C: Gemma, from: 13, to: 17, enter: "glitch" },
  { C: WhereAI, from: 17, to: 20, enter: "wipe" },
  { C: Local, from: 20, to: 22, enter: "zoom" },
  { C: Lift, from: 22, to: 27, enter: "iris" },
  { C: Outro, from: 27, to: 31, enter: "shutter" },
];
const T = 18; // transition length (frames)
export const TOTAL60 = bars(31);

export const Film60: React.FC = () => {
  const frame = useCurrentFrame();
  const vol = interpolate(frame, [0, 8, TOTAL60 - 40, TOTAL60], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: P.bg }}>
      <Audio src={staticFile("score60.wav")} volume={vol} />
      {SCENES.map(({ C, from, to, enter }, i) => {
        const start = bars(from), dur = bars(to) - start;
        const last = i === SCENES.length - 1;
        return (
          <Sequence key={i} from={start} durationInFrames={dur + (last ? 0 : T)}>
            <Reveal kind={enter} len={T}><C dur={dur} /></Reveal>
          </Sequence>
        );
      })}
      <Finish />
    </AbsoluteFill>
  );
};
