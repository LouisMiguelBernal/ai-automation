import React from "react";
import { Img, OffthreadVideo, staticFile } from "remotion";
import { MONO } from "./theme";

/** A clip of the real recorded Nexus session (seconds into demo.mp4). */
export const DemoClip: React.FC<{ from: number; style?: React.CSSProperties; rate?: number }> = ({ from, style, rate = 1 }) => (
  <OffthreadVideo src={staticFile("demo.mp4")} startFrom={Math.round(from * 30)} playbackRate={rate} muted style={{ width: "100%", height: "100%", objectFit: "cover", ...style }} />
);

/** Studio-display style monitor bezel. Children fill the 16:9 screen. */
export const Monitor: React.FC<{ width: number; children: React.ReactNode; style?: React.CSSProperties; stand?: boolean }> = ({ width, children, style, stand = true }) => {
  const h = width * 0.5625;
  const b = width * 0.012;
  return (
    <div style={{ width, ...style }}>
      <div style={{ padding: b, borderRadius: width * 0.016, background: "linear-gradient(180deg,#2A2A2C,#141415)", boxShadow: "0 60px 140px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)" }}>
        <div style={{ position: "relative", height: h, borderRadius: width * 0.006, overflow: "hidden", background: "#000" }}>{children}</div>
      </div>
      {stand && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: width * 0.16, height: width * 0.06, background: "linear-gradient(180deg,#1C1C1E,#2C2C2E)", clipPath: "polygon(18% 0, 82% 0, 100% 100%, 0 100%)" }} />
          <div style={{ width: width * 0.28, height: width * 0.008, borderRadius: width, background: "#2C2C2E" }} />
        </div>
      )}
    </div>
  );
};

export const Laptop: React.FC<{ width: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ width, children, style }) => {
  const h = width * 0.6;
  return (
    <div style={{ width, ...style }}>
      <div style={{ margin: "0 auto", width: width * 0.86, padding: width * 0.012, borderRadius: `${width * 0.02}px ${width * 0.02}px 0 0`, background: "#161618", boxShadow: "0 0 0 1px rgba(255,255,255,0.1)" }}>
        <div style={{ position: "relative", height: h * 0.86 * 0.93, overflow: "hidden", borderRadius: width * 0.004, background: "#000" }}>{children}</div>
      </div>
      <div style={{ height: width * 0.028, borderRadius: `0 0 ${width * 0.03}px ${width * 0.03}px`, background: "linear-gradient(180deg,#3A3A3C,#1C1C1E)", boxShadow: "0 40px 100px rgba(0,0,0,0.6)" }} />
    </div>
  );
};

export const Shot: React.FC<{ src: string; zoom?: number; x?: number; y?: number }> = ({ src, zoom = 1, x = 0, y = 0 }) => (
  <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom}) translate(${x}%, ${y}%)`, transformOrigin: "center" }} />
);

export const Chip: React.FC<{ children: React.ReactNode; u: number; color?: string; style?: React.CSSProperties }> = ({ children, u, color = "#F5F5F4", style }) => (
  <div style={{ fontFamily: MONO, fontSize: 19 * u, color, border: "1px solid rgba(255,255,255,0.14)", background: "rgba(10,10,10,0.72)", backdropFilter: "blur(8px)", padding: `${10 * u}px ${18 * u}px`, borderRadius: 999, whiteSpace: "nowrap", ...style }}>{children}</div>
);
