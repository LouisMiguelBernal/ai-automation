import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BellRing,
  Check,
  ExternalLink,
  FileText,
  Megaphone,
  ShieldCheck,
  Sparkles,
  Store,
  Target,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { ADDONS, DISTRICT_LICENSE, TIERS, estimate, usd } from "@/lib/pricing";

export const metadata = { title: "CampusLink | Business case" };

const BOOST_STEPS = [
  { Icon: Megaphone, t: "Campus picks an event", d: "Literacy night, Title I meeting, conferences, open house." },
  { Icon: Target, t: "Chooses who sees it", d: "All families, a grade, or one language group at that campus." },
  { Icon: BellRing, t: "CampusLink promotes it", d: "Featured on the family home screen for 7 days, plus push and text reminders in each family's language." },
  { Icon: BarChart3, t: "Results come back", d: "Views, RSVPs and check-ins, compared with events that were not promoted." },
];

const PROMOTIONS = [
  { t: "30-day free trial", d: "Same as 806 offers today, so it fits the current sales motion." },
  { t: "Semester pilot", d: "For the first 10 districts: up to 3 schools free for one semester, ending with a results report for the board." },
  { t: "Title1Crate districts", d: `District license (${usd(DISTRICT_LICENSE)}) waived. The easiest upsell 806 has.` },
  { t: "3-year agreement", d: "10% off school pricing, price locked. Lowers churn." },
  { t: "Sign before the new budget year", d: "One free boost pack per school when signed before July 1." },
];

const GTM = [
  { h: "Who buys", d: "Federal programs directors. Title I family engagement funds already pay for this kind of tool." },
  { h: "Who uses it", d: "Principals and teachers send. Parents receive, free, on any phone, in their language." },
  { h: "First market", d: "Existing Title1Crate districts in Texas, then the rest of 806's customer base." },
  { h: "Channels", d: "Success Specialists, monthly trainings and webinars, regional education service centers, federal programs conferences." },
  { h: "When", d: "Demos in spring, pilots in fall, contracts signed before the new budget year." },
];

const KPIS = [
  { k: "Attach rate", v: "Share of Title1Crate districts that add CampusLink" },
  { k: "Pilot to paid", v: "Share of pilots that become paid contracts" },
  { k: "Attendance lift", v: "Check-ins at promoted events vs. not promoted" },
  { k: "Net revenue retention", v: "Renewals plus upgrades from Standard to Professional" },
];

const FAQ = [
  { q: "Do parents pay or see outside ads?", a: "No. Parents use CampusLink for free. Featured events come only from their own school and district." },
  { q: "Is promoting events allowed under student privacy law?", a: "Yes. Schools promoting their own events to their own families is a school purpose. CampusLink never sells data and never runs targeted advertising based on student information." },
  { q: "How does it work with Title1Crate?", a: "Attendance, signed compacts and survey results file into Title1Crate as evidence automatically." },
  { q: "Can we pay with Title I funds?", a: "Districts decide that with their state agency. Family engagement is one of the purposes the 1% reservation is meant for." },
];

const CASE = (() => {
  const y1 = estimate({ tier: "standard", schools: 24, title1Crate: true, multiYear: false, boostPacks: 0 });
  const y2 = estimate({ tier: "professional", schools: 24, title1Crate: true, multiYear: true, boostPacks: 2 });
  return [
    { when: "Fall", what: "Semester pilot at 3 schools", rev: 0, note: "Title I meetings run on CampusLink" },
    { when: "Year 1", what: "All 24 schools on Standard", rev: y1.total, note: "District license waived" },
    { when: "Year 2", what: "Upgrade to Professional, 3-year deal", rev: y2.total, note: "Event promotion turned on" },
    { when: "Year 3", what: "Renew at locked price", rev: y2.total, note: "Plus usage: texts, translations" },
  ];
})();
const CASE_TOTAL = CASE.reduce((a, r) => a + r.rev, 0);

export default function BusinessPage() {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <section className="hero-gradient text-white">
          <div className="grid gap-8 px-4 py-16 md:grid-cols-[1fr_320px] md:px-[90px] md:py-24">
            <div>
              <h1 className="max-w-3xl text-4xl leading-tight font-semibold md:text-5xl md:leading-[1.4]">Fill Every Family Event. Prove It For Title I.</h1>
              <p className="mt-4 max-w-2xl text-lg text-white/90">
                Districts must spend at least 1% of their Title I money on family engagement. CampusLink helps them spend
                it on events families actually attend, and files the proof automatically.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/pricing" className="inline-flex items-center gap-2 bg-green px-[38px] py-[11px] text-sm font-semibold text-navy-900 uppercase hover:brightness-95">
                  See pricing <ArrowRight aria-hidden className="size-4" />
                </Link>
                <a
                  href="https://www.law.cornell.edu/uscode/text/20/6318"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center gap-1 px-2 text-sm font-semibold text-white underline underline-offset-4"
                >
                  ESSA Section 1116 <ExternalLink aria-hidden className="size-4" />
                </a>
              </div>
            </div>
            <ul className="grid content-start gap-3">
              {[
                { n: "1%", d: "of Title I funds reserved for family engagement" },
                { n: "90%", d: "of that must reach schools" },
                { n: "$0", d: "cost to parents, always" },
              ].map((s) => (
                <li key={s.n} className="bg-white/10 p-4">
                  <p className="text-3xl font-bold">{s.n}</p>
                  <p className="text-sm text-white/85">{s.d}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="promotion" className="scroll-mt-28 bg-pale">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <h2 className="text-2xl font-bold text-navy md:text-3xl">Event promotion: ads that schools run for their own events</h2>
            <p className="mt-2 max-w-3xl text-ink">
              Schools already compete for parents&apos; attention with flyers, robocalls and backpack notes. A boost puts
              their event in front of the right families, in the right language, at the right time. The district pays;
              families see only their own school.
            </p>
            <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {BOOST_STEPS.map(({ Icon, t, d }, i) => (
                <li key={t} className="border-t-4 border-green bg-white p-5 shadow-card">
                  <p className="text-xs font-bold text-muted">STEP {i + 1}</p>
                  <Icon aria-hidden className="mt-2 size-6 text-navy" />
                  <p className="mt-2 font-bold text-navy">{t}</p>
                  <p className="mt-1 text-sm text-ink">{d}</p>
                </li>
              ))}
            </ol>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="border border-line bg-white p-5">
                <p className="flex items-center gap-2 font-bold text-navy"><Sparkles aria-hidden className="size-5 text-blue" /> How 806 earns from it</p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex gap-2"><Check aria-hidden className="mt-0.5 size-4 shrink-0 text-ok" />Drives upgrades: promotion is only in Professional ({usd(TIERS.professional.perSchool)} vs {usd(TIERS.standard.perSchool)} per school).</li>
                  <li className="flex gap-2"><Check aria-hidden className="mt-0.5 size-4 shrink-0 text-ok" />Boost packs sell again every year: {usd(ADDONS.boostPack.price)} for {ADDONS.boostPack.unit}.</li>
                  <li className="flex gap-2"><Check aria-hidden className="mt-0.5 size-4 shrink-0 text-ok" />Text reminders and translated flyers pull in usage revenue.</li>
                </ul>
              </div>
              <div className="border border-line bg-white p-5">
                <p className="flex items-center gap-2 font-bold text-navy"><Store aria-hidden className="size-5 text-blue" /> Later: community partner spotlights</p>
                <p className="mt-3 text-sm text-ink">
                  Phase 2, only if districts ask for it. A district could feature approved local partners such as the
                  public library, a food bank or a tutoring nonprofit, the same way schools sell yearbook or scoreboard
                  sponsorships. Shown to every family at a campus, never targeted by student data, and the district
                  approves every listing.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-pale">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <h2 className="text-2xl font-bold text-navy md:text-3xl">Go-to-market</h2>
            <dl className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {GTM.map((g) => (
                <div key={g.h} className="border border-line bg-white p-5">
                  <dt className="font-bold text-navy">{g.h}</dt>
                  <dd className="mt-1 text-sm text-ink">{g.d}</dd>
                </div>
              ))}
            </dl>
            <h3 className="mt-10 text-xl font-bold text-navy">Launch promotions</h3>
            <ul className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {PROMOTIONS.map((p) => (
                <li key={p.t} className="border-l-4 border-green bg-white p-4 shadow-card">
                  <p className="font-bold text-navy">{p.t}</p>
                  <p className="mt-1 text-sm text-ink">{p.d}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl font-bold text-navy md:text-3xl">Case study: a 24-school district</h2>
          <p className="mt-2 max-w-2xl text-muted">A district that already uses Title1Crate, from pilot to renewal.</p>
          <ol className="mt-6 grid gap-4 md:grid-cols-4">
            {CASE.map((r, i) => (
              <li key={r.when} className="border-t-4 border-navy bg-white p-5 shadow-card">
                <p className="text-xs font-bold text-muted uppercase">Step {i + 1}: {r.when}</p>
                <p className="mt-2 font-bold text-navy">{r.what}</p>
                <p className="mt-3 text-2xl font-bold text-navy tabular-nums">{r.rev === 0 ? "Free" : usd(r.rev)}</p>
                <p className="mt-1 text-xs text-muted">{r.note}</p>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 bg-navy p-5 text-white">
            <div>
              <p className="text-sm text-white/80">3-year subscription value, one district</p>
              <p className="text-3xl font-bold tabular-nums">{usd(CASE_TOTAL)}</p>
            </div>
            <p className="max-w-md text-sm text-white/90">
              Sold through the same Success Specialists who already support the district. No new sales team needed.
            </p>
          </div>

          <h3 className="mt-12 text-xl font-bold text-navy">What leadership tracks</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {KPIS.map((k) => (
              <li key={k.k} className="border border-line bg-white p-4">
                <p className="font-bold text-navy">{k.k}</p>
                <p className="mt-1 text-sm text-muted">{k.v}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-pale">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-navy md:text-3xl">Privacy and trust</h2>
              <ul className="mt-5 space-y-3">
                {[
                  "Never sells or rents student or family data.",
                  "No targeted advertising based on student information (Texas Education Code §32.152).",
                  "Parents see only their own child and their own school.",
                  "Rosters come only from the district (Clever, ClassLink or OneRoster).",
                  "256-bit encryption, single sign-on, nightly backups.",
                ].map((x) => (
                  <li key={x} className="flex gap-3 text-sm text-ink">
                    <ShieldCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-ok" />
                    {x}
                  </li>
                ))}
              </ul>
              <a
                href="https://texas.public.law/statutes/tex._educ._code_section_32.152"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex min-h-6 items-center gap-1 py-1 text-sm font-semibold text-blue underline underline-offset-4"
              >
                Texas Education Code §32.152 <ExternalLink aria-hidden className="size-4" />
              </a>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-navy md:text-3xl">Questions districts ask</h2>
              <dl className="mt-5 space-y-3">
                {FAQ.map((f) => (
                  <div key={f.q} className="border border-line bg-white p-4">
                    <dt className="flex items-center gap-2 font-bold text-navy"><FileText aria-hidden className="size-4 text-blue" />{f.q}</dt>
                    <dd className="mt-1 text-sm text-ink">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 text-center">
          <h2 className="text-2xl font-bold text-navy md:text-3xl">See it with your own campuses</h2>
          <p className="mt-2 text-muted">Start with 30 days free, with full support.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/estimate" className="inline-flex min-h-11 items-center gap-2 bg-green px-5 font-bold text-navy-900 hover:brightness-95">
              Start free trial <ArrowRight aria-hidden className="size-4" />
            </Link>
            <Link href="/district" className="inline-flex min-h-11 items-center gap-2 border border-line bg-white px-5 font-bold text-navy hover:bg-pale">
              View the district dashboard
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
