import React from "react";
import { Img, staticFile } from "remotion";
import { MONO } from "./theme";

/** Browser window with a URL bar; the screenshot can pan vertically (0..1). */
export const Browser: React.FC<{ src: string; url: string; width: number; aspect?: number; pan?: number; style?: React.CSSProperties; overlay?: React.ReactNode }> = ({ src, url, width, aspect = 0.62, pan = 0, style, overlay }) => {
  const bar = width * 0.034;
  return (
    <div style={{ width, borderRadius: width * 0.006, overflow: "hidden", background: "#FBF9F4", boxShadow: "0 40px 120px rgba(0,0,0,0.55), 0 0 0 1px rgba(244,241,234,0.25)", ...style }}>
      <div style={{ height: bar, background: "#ECE7DC", borderBottom: "1px solid rgba(26,26,26,0.14)", display: "flex", alignItems: "center", gap: bar * 0.25, padding: `0 ${bar * 0.5}px` }}>
        {["#C8372D", "#CFC7B8", "#CFC7B8"].map((c, i) => (
          <div key={i} style={{ width: bar * 0.32, height: bar * 0.32, borderRadius: "50%", background: c }} />
        ))}
        <div style={{ marginLeft: bar * 0.6, flex: 1, maxWidth: width * 0.45, height: bar * 0.62, borderRadius: bar, background: "#F4F1EA", border: "1px solid rgba(26,26,26,0.12)", color: "#625C52", fontFamily: MONO, fontSize: bar * 0.36, display: "flex", alignItems: "center", paddingLeft: bar * 0.5 }}>
          {url}
        </div>
      </div>
      <div style={{ position: "relative", height: width * aspect, overflow: "hidden" }}>
        <Img src={staticFile(src)} style={{ width: "100%", position: "absolute", top: 0, transform: `translateY(${-pan * 100}%)` }} />
        {overlay}
      </div>
    </div>
  );
};

export const Phone: React.FC<{ src: string; width: number; pan?: number; style?: React.CSSProperties }> = ({ src, width, pan = 0, style }) => {
  const h = width * 2.05;
  return (
    <div style={{ width, height: h, borderRadius: width * 0.16, padding: width * 0.035, background: "#0B0B0C", boxShadow: "0 40px 120px rgba(0,0,0,0.55), 0 0 0 2px rgba(255,255,255,0.18)", ...style }}>
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: width * 0.13, overflow: "hidden", background: "#111" }}>
        <Img src={staticFile(src)} style={{ width: "100%", position: "absolute", top: 0, transform: `translateY(${-pan * 100}%)` }} />
        <div style={{ position: "absolute", top: width * 0.03, left: "50%", transform: "translateX(-50%)", width: width * 0.32, height: width * 0.085, borderRadius: width, background: "#000" }} />
      </div>
    </div>
  );
};
