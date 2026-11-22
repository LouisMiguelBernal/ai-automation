import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PromoCalculator from "./PromoCalculator";
import { TIERS, type TierId } from "@/lib/pricing";

export const metadata = { title: "CampusLink | Estimate your price" };

export default async function EstimatePage({ searchParams }: { searchParams: Promise<{ plan?: string; term?: string }> }) {
  const { plan, term } = await searchParams;
  const tier = plan && plan in TIERS ? (plan as TierId) : "standard";
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main id="main" tabIndex={-1} className="bg-pale">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <Link href="/pricing" className="inline-flex min-h-6 items-center gap-1 py-1 text-sm font-semibold text-blue hover:underline">
            <ArrowLeft aria-hidden className="size-4" /> Back to plans
          </Link>
          <h1 className="mt-3 text-3xl font-bold text-navy md:text-4xl">Estimate your price</h1>
          <p className="mt-2 text-muted">Pick a plan and the number of Title I schools.</p>
          <div className="mt-6">
            <PromoCalculator initialTier={tier} initialMultiYear={term === "3y"} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
