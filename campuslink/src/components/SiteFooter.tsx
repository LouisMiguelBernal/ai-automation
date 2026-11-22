import Link from "next/link";
import { Wordmark } from "@/components/ui";

export default function SiteFooter() {
  return (
    <footer className="hero-gradient">
      <div className="flex flex-col gap-4 px-4 py-8 text-sm text-white md:flex-row md:items-center md:justify-between md:px-[90px]">
        <Wordmark light />
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 font-semibold">
          <Link href="/#how" className="inline-block py-1 hover:underline">How it works</Link>
          <Link href="/pricing" className="inline-block py-1 hover:underline">Pricing</Link>
          <Link href="/business" className="inline-block py-1 hover:underline">Business case</Link>
          <Link href="/district" className="inline-block py-1 hover:underline">Sign In</Link>
        </nav>
        <p className="text-white/85">© 2026 CampusLink</p>
      </div>
    </footer>
  );
}
