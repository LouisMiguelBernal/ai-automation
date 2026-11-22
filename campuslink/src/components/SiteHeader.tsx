"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { TopBar, Wordmark } from "@/components/ui";

// Dimensions follow 806technologies.com: 89px header, 14px/600 uppercase nav
// with 13px 20px padding, 16px "Sign In", green CTA with 14.5px 36px padding.

const PRODUCT = [
  { href: "/parent", label: "Parent app" },
  { href: "/campus", label: "Campus workspace" },
  { href: "/district", label: "District dashboard" },
];

const NAV_ITEM = "inline-flex items-center gap-1 px-5 py-[13px] text-sm font-semibold uppercase text-black hover:text-blue";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TopBar />
      <header className="sticky top-0 z-30 border-b border-line bg-white">
        <div className="flex h-[89px] items-center justify-between gap-4 px-4">
          <Link href="/" aria-label="CampusLink home" className="shrink-0">
            <Wordmark large />
          </Link>

          <nav aria-label="Primary" className="hidden flex-1 items-center justify-center lg:flex">
            <div className="group relative">
              <button className={NAV_ITEM} aria-haspopup="true">
                Product <ChevronDown aria-hidden className="size-4" />
              </button>
              <ul className="invisible absolute top-full left-0 z-40 min-w-56 border border-line bg-white py-2 opacity-0 shadow-card transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                {PRODUCT.map((p) => (
                  <li key={p.href}>
                    <Link href={p.href} className="block px-5 py-2.5 text-sm font-semibold text-ink hover:bg-pale hover:text-navy">
                      {p.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/#how" className={NAV_ITEM}>How it works</Link>
            <Link href="/#why" className={NAV_ITEM}>Why now</Link>
            <Link href="/pricing" className={NAV_ITEM}>Pricing</Link>
            <Link href="/business#promotion" className={NAV_ITEM}>Event promotion</Link>
          </nav>

          <div className="hidden shrink-0 items-center lg:flex">
            <Link href="/district" className="px-5 py-[13px] text-base text-black hover:text-blue">Sign In</Link>
            <Link
              href="/parent"
              className="inline-flex items-center bg-green px-9 py-[14.5px] text-sm leading-none font-semibold text-navy-900 uppercase hover:brightness-95"
            >
              Try the prototype
            </Link>
          </div>

          <button
            className="grid size-11 place-items-center bg-green text-navy-900 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          </button>
        </div>

        {open && (
          <nav aria-label="Mobile" className="border-t border-line bg-white px-4 pb-4 lg:hidden">
            <ul className="divide-y divide-line">
              {[...PRODUCT, { href: "/#how", label: "How it works" }, { href: "/#why", label: "Why now" }, { href: "/pricing", label: "Pricing" }, { href: "/business#promotion", label: "Event promotion" }, { href: "/district", label: "Sign In" }].map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} onClick={() => setOpen(false)} className="block py-3 text-sm font-semibold text-black uppercase">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/parent" className="mt-3 flex min-h-11 items-center justify-center bg-green text-sm font-semibold text-navy-900 uppercase">
              Try the prototype
            </Link>
          </nav>
        )}
      </header>
    </>
  );
}
