import Link from "next/link";
import { ArrowRight, GraduationCap, Headphones, Lock, Video } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PricingPlans from "./PricingPlans";
import { ADDONS, usd } from "@/lib/pricing";

export const metadata = { title: "CampusLink | Pricing" };

const INCLUDED = [
  { Icon: Headphones, t: "Dedicated Success Specialist" },
  { Icon: Video, t: "Free monthly trainings and on-demand videos" },
  { Icon: GraduationCap, t: "30-day free trial with full support" },
  { Icon: Lock, t: "256-bit encryption, SSO and roster sync" },
];

export default function PricingPage() {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <section id="plans" className="mx-auto max-w-6xl px-4 py-14">
          <PricingPlans />
          <ul className="mt-6 grid gap-3 border border-line bg-pale p-4 sm:grid-cols-2 lg:grid-cols-4">
            {INCLUDED.map(({ Icon, t }) => (
              <li key={t} className="flex items-center gap-2 text-sm font-semibold text-navy">
                <Icon aria-hidden className="size-5 shrink-0 text-blue" /> {t}
              </li>
            ))}
          </ul>
          <div className="mt-6 overflow-x-auto border border-line">
            <table className="w-full min-w-[480px] text-left text-sm">
              <caption className="bg-navy px-4 py-3 text-left font-bold text-white">Add-ons</caption>
              <tbody>
                {Object.values(ADDONS).map((a, i) => (
                  <tr key={a.name} className={i % 2 ? "bg-pale/60" : "bg-white"}>
                    <th scope="row" className="px-4 py-3 font-bold text-navy">{a.name}</th>
                    <td className="px-4 py-3">{usd(a.price)} per {a.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-pale">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-10">
            <div>
              <h2 className="text-2xl font-bold text-navy md:text-3xl">Ready for a number?</h2>
              <p className="mt-1 text-muted">Get your district&apos;s price and check out in under a minute.</p>
            </div>
            <Link href="/estimate" className="inline-flex items-center gap-2 bg-green px-[38px] py-[11px] text-sm font-semibold text-navy-900 uppercase hover:brightness-95">
              Estimate your price <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        </section>

        <section className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-10">
          <p className="text-lg text-ink">How this pays off for 806 and for districts.</p>
          <Link href="/business" className="inline-flex items-center gap-2 bg-navy px-[38px] py-[11px] text-sm font-semibold text-white uppercase hover:bg-navy-900">
            Read the business case <ArrowRight aria-hidden className="size-4" />
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
