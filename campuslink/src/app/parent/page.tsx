import { CheckCircle2 } from "lucide-react";
import AppShell from "@/components/AppShell";
import ParentApp from "./ParentApp";

export const metadata = { title: "CampusLink | Family" };

const POINTS = [
  { t: "Language first", d: "Families pick their language before anything else. No login wall." },
  { t: "One clear action", d: "One main button per screen, with large tap targets for thumbs." },
  { t: "Plain words", d: "“Sign the compact, 2 min” instead of “Pending document”." },
  { t: "Proof in the background", d: "Every check-in, signature and survey becomes district evidence automatically." },
];

export default function ParentPage() {
  return (
    <AppShell user="María Hernández" role="Parent, Bluebonnet Elementary">
      <div className="-m-4 md:m-0 md:flex md:items-start md:justify-center md:gap-10">
        <div className="shrink-0 md:h-[760px] md:w-[380px] md:overflow-hidden md:rounded-[40px] md:border-[10px] md:border-navy-900 md:shadow-2xl">
          <ParentApp />
        </div>
        <aside className="hidden max-w-md bg-white p-8 shadow-card md:block">
          <h2 className="text-[28px] leading-tight font-semibold text-navy">Designed for families first</h2>
          <ul className="mt-6 space-y-5">
            {POINTS.map((p) => (
              <li key={p.t} className="flex gap-3">
                <CheckCircle2 aria-hidden className="mt-0.5 size-6 shrink-0 text-green-700" />
                <div>
                  <p className="text-lg font-semibold text-navy">{p.t}</p>
                  <p className="text-base leading-relaxed text-ink">{p.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </AppShell>
  );
}
