"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, FileCheck2, Sparkles, Upload, Download, Users, Wallet, Building2, Megaphone } from "lucide-react";
import { Button, Card, StatusChip } from "@/components/ui";
import { CAMPUSES, EVIDENCE, LANGUAGES, DISTRICT, PROMO, type Status } from "@/lib/data";

type Filter = "all" | "attention";

const needsAttention = (s: Status[]) => s.some((x) => x === "at-risk" || x === "missing");

export default function DistrictDashboard() {
  const [filter, setFilter] = useState<Filter>("all");
  const [filed, setFiled] = useState<Record<string, boolean>>(() => Object.fromEntries(EVIDENCE.map((e) => [e.id, e.filed])));

  const families = CAMPUSES.reduce((a, c) => a + c.families, 0);
  const reached = CAMPUSES.reduce((a, c) => a + c.reached, 0);
  const atRisk = CAMPUSES.filter((c) => needsAttention([c.annualMeeting, c.compact, c.policy, c.conferences]));
  const rows = filter === "all" ? CAMPUSES : atRisk;
  const filedCount = Object.values(filed).filter(Boolean).length;
  const maxLang = Math.max(...LANGUAGES.map((l) => l.families));

  const kpis = [
    { label: "Families reached", value: `${Math.round((reached / families) * 100)}%`, sub: `${reached.toLocaleString()} of ${families.toLocaleString()}`, Icon: Users },
    { label: "Campuses needing attention", value: String(atRisk.length), sub: `of ${CAMPUSES.length} Title I campuses`, Icon: Building2, warn: true },
    { label: "Evidence filed this month", value: String(128 + filedCount), sub: "to Title1Crate, 0 paper", Icon: FileCheck2 },
    { label: "Engagement funds used", value: "43%", sub: "of the 1% reservation, FY27", Icon: Wallet },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-blue">{DISTRICT}, 2026–27</p>
          <h1 className="text-2xl font-bold text-navy md:text-3xl">Family engagement overview</h1>
        </div>
        <Button variant="ghost"><Download aria-hidden className="size-4" /> Board report</Button>
      </div>

      <div role="status" className="flex items-start gap-3 rounded-xl border border-warn/30 bg-warn-50 p-4">
        <AlertTriangle aria-hidden className="mt-0.5 size-5 shrink-0 text-warn" />
        <p className="text-sm text-ink">
          <strong className="text-navy">Mesa Creek Middle</strong> has not held its annual Title I meeting. Deadline: <strong>Dec 15</strong> (34 days).
          <button className="ml-2 inline-block py-1 font-semibold text-blue underline underline-offset-2">Message principal</button>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map(({ label, value, sub, Icon, warn }) => (
          <Card key={label} className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-muted">{label}</p>
              <Icon aria-hidden className={`size-5 ${warn ? "text-warn" : "text-blue"}`} />
            </div>
            <p className="mt-2 text-3xl font-bold text-navy tabular-nums">{value}</p>
            <p className="text-xs text-muted">{sub}</p>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
          <h2 className="font-bold text-navy">Requirements by campus</h2>
          <div role="radiogroup" aria-label="Filter campuses" className="flex rounded-lg bg-pale p-1 text-sm font-semibold">
            {(["all", "attention"] as Filter[]).map((f) => (
              <button
                key={f}
                role="radio"
                aria-checked={filter === f}
                onClick={() => setFilter(f)}
                className={`min-h-9 rounded-md px-3 ${filter === f ? "bg-white text-navy shadow-card" : "text-muted"}`}
              >
                {f === "all" ? `All (${CAMPUSES.length})` : `Needs attention (${atRisk.length})`}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-pale/70 text-left text-xs text-muted uppercase">
              <tr>
                <th scope="col" className="px-4 py-3">Campus</th>
                <th scope="col" className="px-4 py-3">Annual meeting</th>
                <th scope="col" className="px-4 py-3">Compact</th>
                <th scope="col" className="px-4 py-3">Policy</th>
                <th scope="col" className="px-4 py-3">Conferences</th>
                <th scope="col" className="px-4 py-3">Families reached</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => {
                const pct = Math.round((c.reached / c.families) * 100);
                return (
                  <tr key={c.id} className="border-t border-line">
                    <th scope="row" className="px-4 py-3 text-left">
                      <span className="block font-bold text-navy">{c.name}</span>
                      <span className="text-xs font-normal text-muted">Top home language: {c.topLanguage}</span>
                    </th>
                    <td className="px-4 py-3"><StatusChip status={c.annualMeeting} /></td>
                    <td className="px-4 py-3"><StatusChip status={c.compact} /></td>
                    <td className="px-4 py-3"><StatusChip status={c.policy} /></td>
                    <td className="px-4 py-3"><StatusChip status={c.conferences} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-none bg-pale" aria-hidden>
                          <div className={`h-full rounded-none ${pct < 50 ? "bg-warn" : "bg-blue"}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="font-semibold tabular-nums">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <Card>
          <div className="flex items-center justify-between border-b border-line p-4">
            <h2 className="font-bold text-navy">Incoming evidence</h2>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue"><Sparkles aria-hidden className="size-4" /> Auto-checked</span>
          </div>
          <ul>
            {EVIDENCE.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center gap-3 border-b border-line p-4 last:border-0">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-navy">{e.title}</p>
                  <p className="text-xs text-muted">{e.campus}, {e.requirement}, {e.time}</p>
                  <p className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold ${e.check.ok ? "text-ok" : "text-warn"}`}>
                    {e.check.ok ? <CheckCircle2 aria-hidden className="size-3.5" /> : <AlertTriangle aria-hidden className="size-3.5" />}
                    {e.check.note}
                  </p>
                </div>
                {filed[e.id] ? (
                  <span className="inline-flex items-center gap-1 rounded-none bg-ok-50 px-3 py-1 text-xs font-bold text-ok">
                    <FileCheck2 aria-hidden className="size-3.5" /> Filed to Title1Crate
                  </span>
                ) : (
                  <Button variant="secondary" className="min-h-9 text-xs" onClick={() => setFiled((f) => ({ ...f, [e.id]: true }))}>
                    <Upload aria-hidden className="size-3.5" /> Review & file
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-4">
          <h2 className="font-bold text-navy">Families by home language</h2>
          <p className="text-xs text-muted">Drives translation needs</p>
          <ul className="mt-4 space-y-3">
            {LANGUAGES.map((l) => (
              <li key={l.name}>
                <div className="flex justify-between text-sm">
                  <span className="text-ink">{l.name}</span>
                  <span className="font-semibold text-navy tabular-nums">{l.families.toLocaleString()}</span>
                </div>
                <div className="mt-1 h-2.5 rounded-none bg-pale" aria-hidden>
                  <div className="h-full rounded-none bg-blue" style={{ width: `${(l.families / maxLang) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-5 rounded-lg bg-pale p-3 text-xs text-ink">
            <strong className="text-navy">Insight:</strong> Mesa Creek (39%) and High Plains (51%) have the lowest reach. High Plains&apos; top language is Vietnamese, so suggest human-translated invites for its next meeting.
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
          <h2 className="flex items-center gap-2 font-bold text-navy"><Megaphone aria-hidden className="size-5 text-blue" /> Event promotion results</h2>
          <span className="text-sm text-muted">{PROMO.boostsUsed} of {PROMO.boostsTotal} boosts used this year</span>
        </div>
        <div className="grid gap-6 p-4 lg:grid-cols-[300px_1fr]">
          <div>
            <p className="text-sm font-semibold text-muted">Families who checked in</p>
            <div className="mt-3 space-y-3">
              {[
                { label: "Promoted events", v: PROMO.promotedAttendance, cls: "bg-navy" },
                { label: "Not promoted", v: PROMO.regularAttendance, cls: "bg-sky" },
              ].map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between text-sm">
                    <span className="text-ink">{b.label}</span>
                    <span className="font-bold text-navy tabular-nums">{b.v}%</span>
                  </div>
                  <div className="mt-1 h-3 bg-pale" aria-hidden>
                    <div className={`h-full ${b.cls}`} style={{ width: `${b.v * 2}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 bg-ok-50 p-3 text-sm text-ok">
              <strong>{Math.round((PROMO.promotedAttendance / PROMO.regularAttendance - 1) * 100)}% more families</strong> attend when an event is promoted.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead className="text-left text-xs text-muted uppercase">
                <tr>
                  <th scope="col" className="py-2 pr-3">Top promoted events</th>
                  <th scope="col" className="py-2 pr-3 text-right">Reached</th>
                  <th scope="col" className="py-2 pr-3 text-right">RSVPs</th>
                  <th scope="col" className="py-2 text-right">Check-ins</th>
                </tr>
              </thead>
              <tbody>
                {PROMO.top.map((r) => (
                  <tr key={r.event} className="border-t border-line">
                    <th scope="row" className="py-2 pr-3 text-left">
                      <span className="block font-bold text-navy">{r.event}</span>
                      <span className="text-xs font-normal text-muted">{r.campus}</span>
                    </th>
                    <td className="py-2 pr-3 text-right tabular-nums">{r.reach}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{r.rsvp}</td>
                    <td className="py-2 text-right font-bold text-navy tabular-nums">{r.checkIns}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}
