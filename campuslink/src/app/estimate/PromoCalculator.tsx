"use client";

import { useState } from "react";
import { FileText, Lock, Mail, Minus, Plus } from "lucide-react";
import { siAmericanexpress, siApplepay, siMastercard, siPaypal, siStripe, siVisa } from "simple-icons";
import { ADDONS, DISTRICT_LICENSE, MULTI_YEAR_PCT, TIERS, estimate, usd, type QuoteInput, type TierId } from "@/lib/pricing";

type PayId = "card" | "paypal" | "po";
const PAY: { id: PayId; label: string; icon?: { path: string; hex: string } }[] = [
  { id: "card", label: "Card", icon: siStripe },
  { id: "paypal", label: "PayPal", icon: siPaypal },
  { id: "po", label: "PO / ACH" },
];
const ACTION: Record<PayId, string> = {
  card: "Checkout with Stripe",
  paypal: "Pay with PayPal",
  po: "Download quote for PO",
};
const CONFIRM: Record<PayId, string> = {
  card: "Opening secure checkout",
  paypal: "Opening PayPal",
  po: "Quote PDF ready",
};

export default function PromoCalculator({ initialTier = "standard", initialMultiYear = false }: { initialTier?: TierId; initialMultiYear?: boolean }) {
  const [q, setQ] = useState<QuoteInput>({ tier: initialTier, schools: 12, title1Crate: true, multiYear: initialMultiYear, boostPacks: 0 });
  const set = <K extends keyof QuoteInput>(k: K, v: QuoteInput[K]) => setQ((p) => ({ ...p, [k]: v }));
  const e = estimate(q);
  const [sent, setSent] = useState(false);
  const [emailed, setEmailed] = useState(false);
  const [pay, setPay] = useState<PayId>("card");

  return (
    <div className="grid border border-line bg-white shadow-card lg:grid-cols-[1fr_400px]">
      <div className="space-y-6 p-5 md:p-6">
        <fieldset>
          <legend className="font-bold text-navy">1. Choose a plan</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {(Object.keys(TIERS) as TierId[]).map((id) => (
              <label key={id} className={`cursor-pointer border-2 p-3 ${q.tier === id ? "border-navy bg-pale" : "border-line"}`}>
                <span className="flex items-center justify-between">
                  <span className="font-bold text-navy">{TIERS[id].name}</span>
                  <input type="radio" name="tier" className="size-5 accent-[#0e3b7d]" checked={q.tier === id} onChange={() => set("tier", id)} />
                </span>
                <span className="mt-1 block text-sm font-bold text-blue">{usd(TIERS[id].perSchool)} per school</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="schools" className="font-bold text-navy">2. Number of Title I schools</label>
          <div className="mt-3 flex items-center gap-3">
            <button aria-label="Fewer schools" onClick={() => set("schools", Math.max(1, q.schools - 1))} className="grid size-11 place-items-center border-2 border-line text-navy hover:bg-pale">
              <Minus aria-hidden className="size-4" />
            </button>
            <input
              id="schools"
              type="number"
              min={1}
              max={200}
              value={q.schools}
              onChange={(ev) => set("schools", Math.min(200, Math.max(1, Number(ev.target.value) || 1)))}
              className="min-h-11 w-24 border-2 border-line text-center text-lg font-bold text-navy tabular-nums"
            />
            <button aria-label="More schools" onClick={() => set("schools", Math.min(200, q.schools + 1))} className="grid size-11 place-items-center border-2 border-line text-navy hover:bg-pale">
              <Plus aria-hidden className="size-4" />
            </button>
          </div>
        </div>

        <fieldset className="space-y-3">
          <legend className="font-bold text-navy">3. Options</legend>
          <label className="mt-3 flex cursor-pointer items-start gap-3 border-2 border-line p-3">
            <input type="checkbox" className="mt-0.5 size-5 accent-[#0e3b7d]" checked={q.title1Crate} onChange={(ev) => set("title1Crate", ev.target.checked)} />
            <span>
              <span className="block font-bold text-navy">We already use Title1Crate</span>
              <span className="text-sm text-muted">District license ({usd(DISTRICT_LICENSE)}) is waived</span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 border-2 border-line p-3">
            <input type="checkbox" className="mt-0.5 size-5 accent-[#0e3b7d]" checked={q.multiYear} onChange={(ev) => set("multiYear", ev.target.checked)} />
            <span>
              <span className="block font-bold text-navy">3-year agreement</span>
              <span className="text-sm text-muted">{MULTI_YEAR_PCT * 100}% off school pricing, price locked for 3 years</span>
            </span>
          </label>
          <div className="flex flex-wrap items-center justify-between gap-3 border-2 border-line p-3">
            <span>
              <span className="block font-bold text-navy">Extra {ADDONS.boostPack.name.toLowerCase()}s</span>
              <span className="text-sm text-muted">{ADDONS.boostPack.unit} for {usd(ADDONS.boostPack.price)}</span>
            </span>
            <span className="flex items-center gap-2">
              <button aria-label="Fewer boost packs" onClick={() => set("boostPacks", Math.max(0, q.boostPacks - 1))} className="grid size-10 place-items-center border-2 border-line text-navy hover:bg-pale">
                <Minus aria-hidden className="size-4" />
              </button>
              <span className="w-8 text-center font-bold text-navy tabular-nums" aria-live="polite">{q.boostPacks}</span>
              <button aria-label="More boost packs" onClick={() => set("boostPacks", Math.min(50, q.boostPacks + 1))} className="grid size-10 place-items-center border-2 border-line text-navy hover:bg-pale">
                <Plus aria-hidden className="size-4" />
              </button>
            </span>
          </div>
        </fieldset>
      </div>

      <div className="flex flex-col bg-navy p-5 text-white md:p-6" aria-live="polite">
        <p className="text-sm font-semibold text-white/80">Annual estimate</p>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>District license</dt>
            <dd className="tabular-nums">{e.licenseWaived ? <span className="text-green">Waived</span> : usd(e.license)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>{q.schools} schools × {TIERS[q.tier].name} ({usd(TIERS[q.tier].perSchool)})</dt>
            <dd className="tabular-nums">{usd(e.schools)}</dd>
          </div>
          {e.boosts > 0 && (
            <div className="flex justify-between">
              <dt>{q.boostPacks} boost pack{q.boostPacks > 1 ? "s" : ""}</dt>
              <dd className="tabular-nums">{usd(e.boosts)}</dd>
            </div>
          )}
          {e.multiYearOff > 0 && (
            <div className="flex justify-between text-sky">
              <dt>3-year agreement</dt>
              <dd className="tabular-nums">-{usd(e.multiYearOff)}</dd>
            </div>
          )}
        </dl>
        <div className="mt-5 border-t border-white/20 pt-4">
          <p className="text-sm text-white/80">Estimated total per year</p>
          <p className="text-4xl font-bold tabular-nums">{usd(e.total)}</p>
          <p className="mt-2 text-xs text-white/75">Estimate only. Official quotes come from the sales team.</p>
        </div>
        <fieldset className="mt-5">
          <legend className="text-sm font-semibold text-white/80">Pay with</legend>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {PAY.map((m) => (
              <label
                key={m.id}
                className={`flex min-h-11 cursor-pointer items-center justify-center gap-1.5 border-2 px-2 text-xs font-bold ${
                  pay === m.id ? "border-green bg-white text-navy" : "border-white/30 text-white"
                }`}
              >
                <input type="radio" name="pay" className="sr-only" checked={pay === m.id} onChange={() => { setPay(m.id); setSent(false); }} />
                {m.icon ? (
                  <svg viewBox="0 0 24 24" aria-hidden className="size-4" fill={pay === m.id ? `#${m.icon.hex}` : "currentColor"}>
                    <path d={m.icon.path} />
                  </svg>
                ) : (
                  <FileText aria-hidden className="size-4" />
                )}
                {m.label}
              </label>
            ))}
          </div>
        </fieldset>
        <button
          onClick={() => setSent(true)}
          className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 bg-green px-4 text-sm font-semibold text-navy-900 uppercase hover:brightness-95"
        >
          <Lock aria-hidden className="size-4" />
          {sent ? CONFIRM[pay] : ACTION[pay]}
        </button>
        <button onClick={() => setEmailed(true)} className="mt-2 inline-flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-white underline underline-offset-2">
          <Mail aria-hidden className="size-4" /> {emailed ? "Quote sent to your email" : "Email me this quote"}
        </button>
        <p className="sr-only" aria-live="polite">{sent ? CONFIRM[pay] : ""} {emailed ? "Quote sent to your email" : ""}</p>
        <div className="mt-4 flex items-center justify-center gap-3 border-t border-white/20 pt-4" aria-label="Accepted payments">
          {[siVisa, siMastercard, siAmericanexpress, siApplepay, siPaypal, siStripe].map((i) => (
            <svg key={i.title} viewBox="0 0 24 24" role="img" aria-label={i.title} className="size-5 fill-white/80">
              <path d={i.path} />
            </svg>
          ))}
        </div>
      </div>
    </div>
  );
}
