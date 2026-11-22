import Link from "next/link";
import { CheckCircle2, Clock, AlertTriangle, XCircle, ArrowRight } from "lucide-react";
import type { Status } from "@/lib/data";

export function Wordmark({ light = false, large = false }: { light?: boolean; large?: boolean }) {
  return (
    <span className={`inline-flex items-center ${large ? "gap-3" : "gap-2"}`}>
      <span
        aria-hidden
        className={`grid place-items-center rounded-lg ${large ? "size-11" : "size-8"} ${light ? "bg-white text-navy" : "bg-navy text-white"}`}
      >
        <svg viewBox="0 0 24 24" className={large ? "size-7" : "size-5"} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <circle cx="8" cy="8" r="3" />
          <circle cx="16" cy="16" r="3" />
          <path d="M10.5 10.5l3 3" />
        </svg>
      </span>
      <span className={`font-bold tracking-tight ${large ? "text-[26px]" : "text-lg"} ${light ? "text-white" : "text-navy"}`}>CampusLink</span>
    </span>
  );
}

export function TopBar() {
  return (
    <div className="bg-navy-900 px-4 py-2 text-center text-xs text-white sm:text-sm">
      <span className="mr-2 inline-block bg-green px-1.5 py-0.5 text-[11px] font-bold tracking-wide text-navy-900 uppercase">
        Launch offer
      </span>
      <span className="font-semibold">First 10 districts get a free semester pilot.</span>{" "}
      <span className="text-white/85">Sign before July 1 for free event boosts.</span>{" "}
      <Link href="/estimate" className="inline-block min-h-6 py-1 font-bold whitespace-nowrap text-green underline underline-offset-2 hover:text-white">
        See pricing <ArrowRight aria-hidden className="inline size-3.5" />
      </Link>
    </div>
  );
}

const STATUS_META: Record<Status, { label: string; cls: string; Icon: typeof CheckCircle2 }> = {
  met: { label: "Met", cls: "bg-ok-50 text-ok", Icon: CheckCircle2 },
  "on-track": { label: "On track", cls: "bg-sky-100 text-navy", Icon: Clock },
  "at-risk": { label: "At risk", cls: "bg-warn-50 text-warn", Icon: AlertTriangle },
  missing: { label: "Missing", cls: "bg-danger-50 text-danger", Icon: XCircle },
};

export function StatusChip({ status }: { status: Status }) {
  const m = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-none px-2 py-0.5 text-xs font-semibold ${m.cls}`}>
      <m.Icon aria-hidden className="size-3.5" />
      {m.label}
    </span>
  );
}

export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`rounded-xl border border-line bg-white shadow-card ${className}`}>{children}</div>;
}

type BtnProps = {
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const BTN = {
  // Brand green with navy text keeps WCAG AA contrast (white on #8AC343 fails).
  primary: "bg-green text-navy-900 hover:brightness-95",
  secondary: "bg-navy text-white hover:bg-navy-900",
  ghost: "border border-line bg-white text-navy hover:bg-pale",
};

export function Button({ variant = "primary", className = "", children, ...rest }: BtnProps) {
  return (
    <button
      {...rest}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-none px-4 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${BTN[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function NavLink({ href, children, light }: { href: string; children: React.ReactNode; light?: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-md px-3 py-2 text-sm font-semibold ${light ? "text-white/90 hover:bg-white/10" : "text-navy hover:bg-pale"}`}
    >
      {children}
    </Link>
  );
}
