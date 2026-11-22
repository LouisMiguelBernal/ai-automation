import React from "react";
import { Composition } from "remotion";
import { Promo, TOTAL } from "./Promo";
import { Film60, TOTAL60 } from "./ai/Film60";
import { Thumb } from "./ai/Thumb";

export const Root: React.FC = () => (
  <>
    <Composition id="Nexus60" component={Film60} durationInFrames={TOTAL60} fps={30} width={1920} height={1080} />
    <Composition id="Nexus60Square" component={Film60} durationInFrames={TOTAL60} fps={30} width={1080} height={1080} />
    <Composition id="Promo" component={Promo} durationInFrames={TOTAL} fps={30} width={1920} height={1080} />
    <Composition id="PromoSquare" component={Promo} durationInFrames={TOTAL} fps={30} width={1080} height={1080} />
    <Composition id="Thumb" component={Thumb} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="ThumbSquare" component={Thumb} durationInFrames={1} fps={30} width={1080} height={1080} />
  </>
);
