import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, MONO, SANS } from "./theme";

type WfNode = { name: string; type: string; position: [number, number] };
type Wf = { nodes: WfNode[]; connections: Record<string, { main: { node: string }[][] }> };

const KIND: [RegExp, string, string][] = [
  [/Trigger|localFileTrigger|scheduleTrigger|.webhook$/i, "#FF6D5A", "▶"],
  [/postgres/, "#60A5FA", "⛁"],
  [/respondToWebhook/, "#64748B", "↩"],
  [/\.code$/, "#F5A623", "{ }"],
  [/httpRequest/, "#8B7BFF", "⇄"],
  [/gmail/, "#EA4335", "✉"],
  [/googleDrive/, "#1FA463", "▲"],
  [/googleSheets/, "#0F9D58", "▦"],
  [/readWriteFile/, "#2DB67C", "⎘"],
  [/\.if$|\.switch$/, "#2DD4BF", "◇"],
  [/splitInBatches/, "#60A5FA", "↻"],
  [/executeWorkflow/, "#A855F7", "⤷"],
  [/noOp/, "#64748B", "○"],
];
const kind = (t: string) => KIND.find(([re]) => re.test(t)) ?? [null, "#94A3B8", "•"];

/** Order in which an execution "pulse" visits nodes: breadth-first from triggers, forward edges only. */
export function executionOrder(wf: Wf): string[] {
  const pos = Object.fromEntries(wf.nodes.map((n) => [n.name, n.position]));
  const triggers = wf.nodes.filter((n) => /Trigger|.webhook$/i.test(n.type)).sort((a, b) => a.position[1] - b.position[1]);
  const seen = new Set<string>();
  const order: string[] = [];
  const queue = triggers.map((t) => t.name);
  while (queue.length) {
    const n = queue.shift()!;
    if (seen.has(n)) continue;
    seen.add(n);
    order.push(n);
    for (const outs of wf.connections[n]?.main ?? []) {
      for (const t of outs) if (pos[t.node][0] > pos[n][0] && !seen.has(t.node)) queue.push(t.node);
    }
  }
  for (const n of wf.nodes) if (!seen.has(n.name)) order.push(n.name);
  // A loop's "done" branch fires after the loop body, so it lights last.
  const doneTargets = wf.nodes.filter((n) => /splitInBatches/.test(n.type)).flatMap((n) => (wf.connections[n.name]?.main?.[0] ?? []).map((t) => t.node));
  return [...order.filter((n) => !doneTargets.includes(n)), ...order.filter((n) => doneTargets.includes(n))];
}

/**
 * n8n-style canvas rendered from a real workflow JSON. Nodes appear left→right, then a pulse
 * lights each node in execution order. `start` is the frame the canvas begins animating.
 */
export const WorkflowCanvas: React.FC<{ wf: Wf; width: number; height: number; start?: number; nodeSize?: number; showLabels?: boolean; stepFrames?: number }> = ({
  wf, width, height, start = 0, nodeSize = 70, showLabels = true, stepFrames = 9,
}) => {
  const frame = useCurrentFrame() - start;
  const xs = wf.nodes.map((n) => n.position[0]);
  const ys = wf.nodes.map((n) => n.position[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs) + nodeSize;
  const minY = Math.min(...ys), maxY = Math.max(...ys) + nodeSize + (showLabels ? 40 : 0);
  const pad = 40;
  const s = Math.min((width - pad * 2) / (maxX - minX), (height - pad * 2) / (maxY - minY));
  const ox = (width - (maxX - minX) * s) / 2 - minX * s;
  const oy = (height - (maxY - minY) * s) / 2 - minY * s;
  const at = (n: string) => {
    const p = wf.nodes.find((x) => x.name === n)!.position;
    return { x: p[0] * s + ox, y: p[1] * s + oy };
  };
  const N = nodeSize * s;
  const order = executionOrder(wf);
  const appearAt = (n: string) => order.indexOf(n) * 2;
  const litAt = (n: string) => 40 + order.indexOf(n) * stepFrames;

  const edges: React.ReactNode[] = [];
  for (const [from, c] of Object.entries(wf.connections)) {
    c.main.forEach((targets, oi) =>
      targets.forEach((t, ti) => {
        const a = at(from), b = at(t.node);
        const x1 = a.x + N, y1 = a.y + N / 2 + (c.main.length > 1 ? (oi - (c.main.length - 1) / 2) * N * 0.22 : 0);
        const x2 = b.x, y2 = b.y + N / 2;
        const back = x2 <= x1;
        const drop = Math.max(y1, y2) + N * 1.6;
        const d = back
          ? `M${x1},${y1} C${x1 + N},${y1} ${x1 + N},${drop} ${(x1 + x2) / 2},${drop} S${x2 - N},${y2} ${x2},${y2}`
          : `M${x1},${y1} C${(x1 + x2) / 2},${y1} ${(x1 + x2) / 2},${y2} ${x2},${y2}`;
        const drawn = interpolate(frame, [appearAt(t.node), appearAt(t.node) + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const lit = frame >= litAt(t.node) && frame >= litAt(from);
        edges.push(
          <path key={`${from}-${oi}-${ti}-${t.node}`} d={d} fill="none" pathLength={1} strokeDasharray={back ? "0.02 0.015" : "1"} strokeDashoffset={back ? 0 : 1 - drawn}
            stroke={lit ? C.accent : "#3F4652"} strokeWidth={Math.max(1.5, 2.2 * s)} opacity={back ? drawn * 0.7 : 1} />,
        );
      }),
    );
  }

  return (
    <div style={{ position: "relative", width, height }}>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>{edges}</svg>
      {wf.nodes.map((n) => {
        const { x, y } = at(n.name);
        const [, color, glyph] = kind(n.type);
        const appear = interpolate(frame, [appearAt(n.name), appearAt(n.name) + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const lit = interpolate(frame, [litAt(n.name), litAt(n.name) + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const trig = /Trigger|.webhook$/i.test(n.type);
        return (
          <div key={n.name} style={{ position: "absolute", left: x, top: y, width: N, opacity: appear, transform: `scale(${0.7 + 0.3 * appear})` }}>
            <div style={{
              width: N, height: N, borderRadius: trig ? N * 0.42 : N * 0.16, background: "#22262D",
              border: `${Math.max(1.5, 2.4 * s)}px solid ${lit > 0.5 ? C.accent : color}`,
              boxShadow: lit > 0 ? `0 0 ${28 * s * lit}px rgba(139,156,255,${0.55 * lit})` : "none",
              display: "flex", alignItems: "center", justifyContent: "center", color, fontFamily: SANS, fontWeight: 700, fontSize: N * 0.34,
            }}>
              {glyph}
              {lit > 0.5 && (
                <div style={{ position: "absolute", right: -N * 0.12, top: -N * 0.12, width: N * 0.3, height: N * 0.3, borderRadius: "50%", background: C.emerald, color: "#04130F", fontSize: N * 0.2, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</div>
              )}
            </div>
            {showLabels && (
              <div style={{ position: "absolute", top: N + 8 * s, left: -N * 0.6, width: N * 2.2, textAlign: "center", fontFamily: MONO, fontSize: Math.max(10, 12.5 * s), color: lit > 0.5 ? C.ink : C.muted, lineHeight: 1.2 }}>
                {n.name}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
