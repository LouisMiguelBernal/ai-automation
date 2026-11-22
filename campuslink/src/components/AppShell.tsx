"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, School, Users, LogOut } from "lucide-react";
import { Wordmark } from "@/components/ui";

const VIEWS = [
  { href: "/district", label: "District", Icon: Building2 },
  { href: "/campus", label: "Campus", Icon: School },
  { href: "/parent", label: "Family", Icon: Users },
];

export default function AppShell({ user, role, children }: { user: string; role: string; children: React.ReactNode }) {
  const path = usePathname();
  const initials = user.replace("Dr. ", "").split(" ").map((n) => n[0]).join("");

  return (
    <div className="flex min-h-dvh flex-col bg-pale">
      <header className="sticky top-0 z-30 border-b border-line bg-white">
        <div className="flex h-16 items-center gap-3 px-3 md:h-[72px] md:px-6">
          <Link href="/" aria-label="CampusLink home" className="shrink-0">
            <span className="hidden sm:inline"><Wordmark /></span>
            <span className="sm:hidden"><LogoMark /></span>
          </Link>

          <nav aria-label="Switch view" className="mx-auto flex border border-line bg-pale p-1">
            {VIEWS.map(({ href, label, Icon }) => {
              const active = path === href;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-10 items-center gap-1.5 px-3 text-sm font-semibold md:px-5 ${
                    active ? "bg-navy text-white" : "text-navy hover:bg-white"
                  }`}
                >
                  <Icon aria-hidden className="size-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <div className="hidden text-right lg:block">
              <p className="text-sm font-semibold text-navy">{user}</p>
              <p className="text-xs text-muted">{role}</p>
            </div>
            <span aria-hidden className="hidden size-10 place-items-center bg-sky-100 text-sm font-bold text-navy md:grid">
              {initials}
            </span>
            <Link href="/" aria-label="Exit to website" className="hidden size-10 place-items-center text-muted hover:text-navy md:grid">
              <LogOut aria-hidden className="size-5" />
            </Link>
          </div>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}

function LogoMark() {
  return (
    <span aria-hidden className="grid size-9 place-items-center bg-navy text-white">
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <circle cx="8" cy="8" r="3" />
        <circle cx="16" cy="16" r="3" />
        <path d="M10.5 10.5l3 3" />
      </svg>
    </span>
  );
}
