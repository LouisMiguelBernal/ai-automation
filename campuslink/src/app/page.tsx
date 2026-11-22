import Link from "next/link";
import {
  Smartphone,
  School,
  LayoutDashboard,
  CalendarCheck,
  QrCode,
  FileCheck2,
  Languages,
  ShieldCheck,
  Users,
  Scale,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Wordmark } from "@/components/ui";
import SiteHeader from "@/components/SiteHeader";

const VIEWS = [
  { href: "/parent", Icon: Smartphone, title: "Parent app", who: "Families, mobile", body: "Pick a language, RSVP, check in with a QR code, sign the compact and book a conference." },
  { href: "/campus", Icon: School, title: "Campus workspace", who: "Teachers & principals, desktop", body: "Create events with auto-translated invites, reply to families in any language, open conference slots." },
  { href: "/district", Icon: LayoutDashboard, title: "District dashboard", who: "Federal programs director, desktop", body: "See engagement by campus and language, spot at-risk schools, and file evidence to Title1Crate." },
];

const FLOW = [
  { Icon: CalendarCheck, t: "Campus creates event", d: "Invite auto-translated" },
  { Icon: QrCode, t: "Family checks in", d: "QR, 10 seconds" },
  { Icon: FileCheck2, t: "Evidence auto-checked", d: "Date, campus, attendees" },
  { Icon: ShieldCheck, t: "Filed to Title1Crate", d: "Audit-ready, no paper" },
];

const PRICING = [
  { tier: "District license", what: "Required once per district. Waived for Title1Crate districts", model: "$600 / year" },
  { tier: "Essential", what: "Event pages, RSVP, QR check-in, attendance filed to Title1Crate", model: "$300 per school / year" },
  { tier: "Standard", what: "Adds two-way translated messaging, conferences, e-sign compacts, surveys", model: "$450 per school / year" },
  { tier: "Professional", what: "Adds event promotion, analytics, AI evidence check, board reports", model: "$600 per school / year" },
  { tier: "Add-ons", what: "Event boost packs, extra texts, human translation via 806 Translations", model: "Usage" },
];

export default function Home() {
  return (
    <div className="min-h-dvh">
      <SiteHeader />

      <main id="main" tabIndex={-1}>
        <section className="hero-gradient flex items-center text-white md:min-h-[620px]">
          <div className="w-full px-4 py-16 md:px-[90px]">
            <h1 className="max-w-4xl text-4xl leading-tight font-semibold md:text-5xl md:leading-[1.4]">
              Every Family Conversation Counts, In Any Language
            </h1>
            <p className="mt-3 max-w-3xl text-2xl leading-snug font-semibold md:text-[32px]">
              Turning Every Check-In, Signature And Survey Into Title I Evidence
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/parent"
                className="inline-flex items-center gap-2 bg-green px-[38px] py-[11px] text-sm font-semibold text-navy-900 uppercase hover:brightness-95"
              >
                Start as a parent <ArrowRight aria-hidden className="size-4" />
              </Link>
              <Link
                href="/district"
                className="inline-flex items-center border-b-[3px] border-brand-red bg-white px-[38px] py-[11px] text-sm font-semibold text-black uppercase hover:bg-pale"
              >
                See the district view
              </Link>
            </div>
          </div>
        </section>

        <section className="soft-gradient">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <h2 className="text-center text-2xl font-bold text-navy md:text-3xl">Three users, one loop</h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-muted">Pick a role to walk through the prototype.</p>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {VIEWS.map(({ href, Icon, title, who, body }) => (
                <Link
                  key={href}
                  href={href}
                  className="group rounded-xl border border-line bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:border-sky"
                >
                  <span className="grid size-12 place-items-center rounded-xl bg-pale text-navy">
                    <Icon aria-hidden className="size-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-navy">{title}</h3>
                  <p className="text-sm font-semibold text-blue">{who}</p>
                  <p className="mt-2 text-sm text-ink">{body}</p>
                  <span className="mt-4 inline-flex items-center gap-1 border-b-2 border-green pb-0.5 text-xs font-bold tracking-wide text-navy uppercase">
                    Open <ArrowRight aria-hidden className="size-3.5 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14">
          <h2 className="text-2xl font-bold text-navy md:text-3xl">How it works</h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FLOW.map(({ Icon, t, d }, i) => (
              <li key={t} className="relative rounded-xl border border-line bg-white p-5">
                <span className="text-xs font-bold text-muted">STEP {i + 1}</span>
                <Icon aria-hidden className="mt-2 size-7 text-blue" />
                <p className="mt-3 font-bold text-navy">{t}</p>
                <p className="text-sm text-muted">{d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="why" className="scroll-mt-20 bg-pale">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-navy md:text-3xl">Why now</h2>
              <p className="mt-3 text-ink">
                Title I districts must reserve <strong>at least 1% of their allocation</strong> for parent and family
                engagement (when that 1% exceeds $5,000), and send <strong>at least 90%</strong> of it to schools.
                They also need a family engagement policy, a school-parent compact and an annual meeting, with
                proof. Today, much of that proof is paper sign-in sheets.
              </p>
              <a
                href="https://www.law.cornell.edu/uscode/text/20/6318"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1 font-semibold text-blue underline underline-offset-4"
              >
                20 U.S.C. § 6318 (ESSA §1116) <ExternalLink aria-hidden className="size-4" />
              </a>
            </div>
            <ul className="grid gap-3">
              {[
                { Icon: Scale, t: "Required budget already exists", d: "No new money to find, just a place to spend required funds well." },
                { Icon: Languages, t: "Families speak many languages", d: "Built-in translation; human translation via 806 Translations." },
                { Icon: Users, t: "Parents are a new user for 806", d: "Complements Title1Crate instead of overlapping it." },
              ].map(({ Icon, t, d }) => (
                <li key={t} className="flex gap-4 rounded-xl bg-white p-4 shadow-card">
                  <Icon aria-hidden className="mt-0.5 size-6 shrink-0 text-navy" />
                  <div>
                    <p className="font-bold text-navy">{t}</p>
                    <p className="text-sm text-muted">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="business" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14">
          <h2 className="text-2xl font-bold text-navy md:text-3xl">Business model</h2>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <p className="max-w-2xl text-muted">The district pays, never families.</p>
            <Link href="/business" className="inline-flex min-h-11 items-center gap-2 bg-navy px-4 text-sm font-bold text-white hover:bg-navy-900">
              Full business case and promotions <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
          <div className="mt-6 overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-navy text-white">
                <tr>
                  <th scope="col" className="px-4 py-3">Tier</th>
                  <th scope="col" className="px-4 py-3">What&apos;s included</th>
                  <th scope="col" className="px-4 py-3">Model</th>
                </tr>
              </thead>
              <tbody>
                {PRICING.map((r, i) => (
                  <tr key={r.tier} className={i % 2 ? "bg-pale/60" : "bg-white"}>
                    <th scope="row" className="px-4 py-3 font-bold text-navy">{r.tier}</th>
                    <td className="px-4 py-3">{r.what}</td>
                    <td className="px-4 py-3 text-muted">{r.model}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { t: "Privacy by design", d: "FERPA-minded: district-approved rosters only, parents see only their own child." },
              { t: "Less work for teachers", d: "Integrates with roster sync and SSO; replaces paper, not adds an app." },
              { t: "Translation quality", d: "Machine translation for messages; key documents flagged for human review." },
            ].map((r) => (
              <div key={r.t} className="rounded-xl border-l-4 border-green bg-white p-4 shadow-card">
                <p className="font-bold text-navy">{r.t}</p>
                <p className="mt-1 text-sm text-muted">{r.d}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="hero-gradient">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-8 text-sm text-white/90 md:flex-row md:items-center">
          <Wordmark light />
          <p>© 2026 CampusLink</p>
        </div>
      </footer>
    </div>
  );
}

