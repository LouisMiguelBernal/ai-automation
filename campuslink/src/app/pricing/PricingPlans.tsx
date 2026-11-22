"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Minus } from "lucide-react";
import { DISTRICT_LICENSE, MULTI_YEAR_PCT, TIERS, usd, type TierId } from "@/lib/pricing";

const IDS: TierId[] = ["essential", "standard", "professional"];

const COMPARE: { group: string; rows: { f: string; v: [boolean | string, boolean | string, boolean | string] }[] }[] = [
  {
    group: "Events",
    rows: [
      { f: "Event pages with RSVP", v: [true, true, true] },
      { f: "QR check-in", v: [true, true, true] },
      { f: "Attendance filed to Title1Crate", v: [true, true, true] },
      { f: "Featured events on family home screen", v: [false, false, true] },
      { f: "Event boosts per school each year", v: [false, false, "10"] },
    ],
  },
  {
    group: "Families",
    rows: [
      { f: "Languages", v: ["2", "100+", "100+"] },
      { f: "Two-way messaging", v: [false, true, true] },
      { f: "Conference booking", v: [false, true, true] },
      { f: "E-sign school-parent compact", v: [false, true, true] },
      { f: "Family surveys", v: [false, true, true] },
      { f: "Texts included per school", v: ["500", "2,000", "5,000"] },
    ],
  },
  {
    group: "District",
    rows: [
      { f: "Engagement dashboard", v: [true, true, true] },
      { f: "Promotion and attendance analytics", v: [false, false, true] },
      { f: "AI evidence check", v: [false, false, true] },
      { f: "Board-ready reports", v: [false, false, true] },
      { f: "SSO and roster sync", v: [true, true, true] },
    ],
  },
];

function Cell({ v }: { v: boolean | string }) {
  if (v === true) return <Check aria-label="Included" className="mx-auto size-5 text-ok" />;
  if (v === false) return <Minus aria-label="Not included" className="mx-auto size-5 text-line" />;
  return <span className="font-semibold text-navy">{v}</span>;
}

export default function PricingPlans() {
  const [term, setTerm] = useState<"annual" | "multi">("annual");
  const price = (n: number) => (term === "multi" ? Math.round(n * (1 - MULTI_YEAR_PCT)) : n);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy md:text-4xl">Plans and pricing</h1>
          <p className="mt-2 text-muted">Prices per Title I school, billed annually in USD. 30 days free, no credit card needed.</p>
        </div>
        <div role="radiogroup" aria-label="Contract length" className="flex border border-line bg-pale p-1 text-sm font-semibold">
          {[
            { id: "annual" as const, label: "1-year" },
            { id: "multi" as const, label: `3-year, save ${MULTI_YEAR_PCT * 100}%` },
          ].map((o) => (
            <button
              key={o.id}
              role="radio"
              aria-checked={term === o.id}
              onClick={() => setTerm(o.id)}
              className={`min-h-10 px-4 ${term === o.id ? "bg-navy text-white" : "text-navy"}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {IDS.map((id) => {
          const t = TIERS[id];
          const popular = id === "standard";
          const p = price(t.perSchool);
          return (
            <div key={id} className={`relative flex flex-col bg-white p-6 shadow-card ${popular ? "border-2 border-navy" : "border border-line"}`}>
              {popular && (
                <span className="absolute -top-3 left-6 bg-green px-2 py-0.5 text-xs font-bold text-navy-900 uppercase">Most popular</span>
              )}
              <p className="text-xl font-bold text-navy">{t.name}</p>
              <p className="text-sm text-muted">{t.tagline}</p>
              <p className="mt-5 flex items-baseline gap-1">
                <span className="text-5xl font-bold text-navy tabular-nums">{usd(p)}</span>
                <span className="text-sm text-muted">/ school / year</span>
              </p>
              <p className="mt-1 h-5 text-sm text-muted">
                {term === "multi" ? <><s>{usd(t.perSchool)}</s> price locked for 3 years</> : "Billed once a year"}
              </p>
              <p className="mt-3 border-t border-line pt-3 text-sm text-ink">
                Example: 10 schools = <strong className="text-navy">{usd(p * 10 + DISTRICT_LICENSE)}</strong> / year
                <span className="block text-xs text-muted">Includes the {usd(DISTRICT_LICENSE)} district license</span>
              </p>
              <ul className="mt-5 flex-1 space-y-2 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-ok" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={`/estimate?plan=${id}${term === "multi" ? "&term=3y" : ""}`}
                className={`mt-6 inline-flex min-h-11 items-center justify-center text-sm font-semibold uppercase ${
                  popular ? "bg-green text-navy-900 hover:brightness-95" : "border-2 border-navy text-navy hover:bg-pale"
                }`}
              >
                {id === "professional" ? "Talk to sales" : "Start free trial"}
              </Link>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-muted">
        Every plan adds a {usd(DISTRICT_LICENSE)} district license per year, waived for districts on Title1Crate. School districts are tax-exempt; upload your certificate at checkout.
      </p>

      <details className="group mt-8 border border-line bg-white">
        <summary className="flex min-h-12 cursor-pointer items-center justify-between px-4 font-bold text-navy">
          Compare all features
          <span className="text-sm font-semibold text-blue group-open:hidden">Show</span>
          <span className="hidden text-sm font-semibold text-blue group-open:inline">Hide</span>
        </summary>
        <div className="overflow-x-auto border-t border-line">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-navy text-white">
              <tr>
                <th scope="col" className="px-4 py-3 text-left">Feature</th>
                {IDS.map((id) => (
                  <th key={id} scope="col" className="w-32 px-4 py-3 text-center">{TIERS[id].name}</th>
                ))}
              </tr>
            </thead>
            {COMPARE.map((g) => (
              <tbody key={g.group}>
                <tr className="bg-pale">
                  <th scope="rowgroup" colSpan={4} className="px-4 py-2 text-left text-xs font-bold text-muted uppercase">{g.group}</th>
                </tr>
                {g.rows.map((r) => (
                  <tr key={r.f} className="border-t border-line">
                    <th scope="row" className="px-4 py-2.5 text-left font-normal text-ink">{r.f}</th>
                    {r.v.map((v, i) => (
                      <td key={i} className="px-4 py-2.5 text-center"><Cell v={v} /></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </details>
    </div>
  );
}
