"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Globe, Send, Plus, Users, ShieldCheck, CalendarDays, Languages, Printer, Megaphone } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { EVENTS, SLOTS, TAKEN_SLOTS, THREADS } from "@/lib/data";

type Tab = "inbox" | "events" | "conferences";

export default function CampusWorkspace() {
  const [tab, setTab] = useState<Tab>("inbox");
  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "inbox", label: "Family inbox", count: 2 },
    { id: "events", label: "Events" },
    { id: "conferences", label: "Conferences" },
  ];
  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-blue">Bluebonnet Elementary, Grade 3</p>
          <h1 className="text-2xl font-bold text-navy md:text-3xl">Good morning, Dana</h1>
        </div>
        <p className="text-sm text-muted">22 families, 4 home languages</p>
      </div>

      <div role="tablist" aria-label="Workspace" className="mt-6 flex gap-1 overflow-x-auto border-b border-line">
        {tabs.map((x) => (
          <button
            key={x.id}
            role="tab"
            aria-selected={tab === x.id}
            onClick={() => setTab(x.id)}
            className={`-mb-px flex min-h-11 items-center gap-2 border-b-[3px] px-4 text-sm font-bold whitespace-nowrap ${
              tab === x.id ? "border-green text-navy" : "border-transparent text-muted hover:text-navy"
            }`}
          >
            {x.label}
            {x.count ? <span className="rounded-none bg-navy px-1.5 text-[11px] text-white">{x.count}</span> : null}
          </button>
        ))}
      </div>

      <div className="mt-6" role="tabpanel">
        {tab === "inbox" && <Inbox />}
        {tab === "events" && <Events />}
        {tab === "conferences" && <Conferences />}
      </div>
    </div>
  );
}

function Inbox() {
  const [activeId, setActiveId] = useState(THREADS[0].id);
  const [showOriginal, setShowOriginal] = useState(false);
  const [draft, setDraft] = useState("Of course! Childcare is available for siblings of all ages.");
  const [sent, setSent] = useState<string[]>([]);
  const th = THREADS.find((x) => x.id === activeId)!;

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <Card className="overflow-hidden">
        <ul>
          {THREADS.map((x) => (
            <li key={x.id}>
              <button
                onClick={() => setActiveId(x.id)}
                aria-current={x.id === activeId ? "true" : undefined}
                className={`flex w-full gap-3 border-b border-line p-4 text-left ${x.id === activeId ? "bg-pale" : "hover:bg-pale/60"}`}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-none bg-sky-100 text-sm font-bold text-navy">
                  {x.parent.split(" ").map((n) => n[0]).join("")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className={`truncate ${x.unread ? "font-bold text-navy" : "font-semibold text-ink"}`}>{x.parent}</span>
                    <span className="rounded bg-pale px-1.5 text-[10px] font-bold text-blue">{x.langCode}</span>
                  </span>
                  <span className="block text-xs text-muted">{x.student}</span>
                  <span className="block truncate text-sm text-ink">{x.preview}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="flex min-h-[460px] flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line p-4">
          <div>
            <p className="font-bold text-navy">{th.parent}</p>
            <p className="text-xs text-muted">{th.student}, prefers {th.language}</p>
          </div>
          {th.language !== "English" && (
            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" className="size-4 accent-[#0e3b7d]" checked={showOriginal} onChange={(e) => setShowOriginal(e.target.checked)} />
              Show original {th.language}
            </label>
          )}
        </div>
        <div className="flex-1 space-y-3 p-4">
          {th.messages.map((m, i) => {
            const mine = m.from === "staff";
            const text = mine ? m.original : showOriginal ? m.original : m.translated ?? m.original;
            return (
              <div key={i} className={`max-w-[80%] ${mine ? "ml-auto" : ""}`}>
                <div className={`rounded-2xl p-3 text-sm ${mine ? "rounded-tr-sm bg-navy text-white" : "rounded-tl-sm bg-pale text-ink"}`}>
                  {text}
                </div>
                <p className={`mt-1 flex items-center gap-1 text-[11px] text-muted ${mine ? "justify-end" : ""}`}>
                  {m.translated && <Globe aria-hidden className="size-3" />}
                  {m.translated ? (mine ? `Delivered in ${th.language}` : `Translated from ${th.language}`) : ""}, {m.time}
                </p>
              </div>
            );
          })}
          {sent.map((s, i) => (
            <div key={`s${i}`} className="ml-auto max-w-[80%]">
              <div className="rounded-2xl rounded-tr-sm bg-navy p-3 text-sm text-white">{s}</div>
              <p className="mt-1 text-right text-[11px] text-muted">Delivered in {th.language}, just now</p>
            </div>
          ))}
        </div>
        <form
          className="border-t border-line p-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (draft.trim()) {
              setSent((s) => [...s, draft.trim()]);
              setDraft("");
            }
          }}
        >
          <label htmlFor="reply" className="sr-only">Reply</label>
          <textarea
            id="reply"
            rows={2}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full resize-none rounded-lg border-2 border-line p-3 text-sm focus:border-navy focus:outline-none"
          />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-1 text-xs text-muted">
              <Languages aria-hidden className="size-4 text-blue" />
              {th.language === "English" ? "Sends in English" : `You write in English, ${th.parent.split(" ")[0]} reads in ${th.language}`}
            </p>
            <Button type="submit" variant="secondary"><Send aria-hidden className="size-4" /> Send</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function Events() {
  const [title, setTitle] = useState("Annual Title I Family Meeting");
  const [evidence, setEvidence] = useState(true);
  const [promoting, setPromoting] = useState<string | null>("ev2");
  const [boosted, setBoosted] = useState<Set<string>>(new Set());
  const [credits, setCredits] = useState(8);
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
      <div className="space-y-3">
        {EVENTS.map((e) => {
          const pct = Math.round((e.rsvp / e.capacity) * 100);
          const isBoosted = boosted.has(e.id);
          return (
            <Card key={e.id} className={`p-4 ${promoting === e.id ? "outline-2 outline-navy" : ""}`}>
              <div className="mb-2 flex justify-end">
                {isBoosted ? (
                  <span className="inline-flex items-center gap-1 bg-green px-2 py-0.5 text-xs font-bold text-navy-900">
                    <Megaphone aria-hidden className="size-3.5" /> Featured for 7 days
                  </span>
                ) : (
                  <button
                    onClick={() => setPromoting(e.id)}
                    className="inline-flex min-h-9 items-center gap-1 border border-line px-2 text-xs font-bold text-navy hover:bg-pale"
                  >
                    <Megaphone aria-hidden className="size-3.5" /> Promote
                  </button>
                )}
              </div>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-blue">{e.date}, {e.time}</p>
                  <p className="font-bold text-navy">{e.title}</p>
                  <p className="text-sm text-muted">{e.place}</p>
                </div>
                {e.required && (
                  <span className="inline-flex items-center gap-1 rounded-none bg-ok-50 px-2 py-0.5 text-xs font-semibold text-ok">
                    <ShieldCheck aria-hidden className="size-3.5" /> Title I evidence
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-none bg-pale" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${e.title} RSVPs`}>
                  <div className="h-full rounded-none bg-blue" style={{ width: `${pct}%` }} />
                </div>
                <span className="flex items-center gap-1 text-sm text-ink"><Users aria-hidden className="size-4" />{e.rsvp}/{e.capacity}</span>
              </div>
            </Card>
          );
        })}
      </div>

      {promoting ? (
        <PromotePanel
          event={EVENTS.find((x) => x.id === promoting)!}
          credits={credits}
          onCancel={() => setPromoting(null)}
          onLaunch={() => {
            setBoosted((b) => new Set(b).add(promoting));
            setCredits((c) => c - 1);
            setPromoting(null);
          }}
        />
      ) : (
      <Card className="p-5">
        <h2 className="flex items-center gap-2 font-bold text-navy"><Plus aria-hidden className="size-5" /> New event</h2>
        <label htmlFor="ev-title" className="mt-4 block text-sm font-semibold text-navy">Title</label>
        <input id="ev-title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 min-h-11 w-full rounded-lg border-2 border-line px-3 text-sm focus:border-navy focus:outline-none" />
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="ev-date" className="block text-sm font-semibold text-navy">Date</label>
            <input id="ev-date" type="date" defaultValue="2026-11-19" className="mt-1 min-h-11 w-full rounded-lg border-2 border-line px-2 text-sm" />
          </div>
          <div>
            <label htmlFor="ev-time" className="block text-sm font-semibold text-navy">Time</label>
            <input id="ev-time" type="time" defaultValue="18:00" className="mt-1 min-h-11 w-full rounded-lg border-2 border-line px-2 text-sm" />
          </div>
        </div>
        <label className="mt-4 flex items-start gap-2 text-sm">
          <input type="checkbox" checked={evidence} onChange={(e) => setEvidence(e.target.checked)} className="mt-0.5 size-4 accent-[#0e3b7d]" />
          <span><strong className="text-navy">Count as Title I evidence</strong><br /><span className="text-muted">Attendance files to Title1Crate after the event.</span></span>
        </label>

        <div className="mt-5 rounded-lg bg-pale p-4">
          <p className="flex items-center gap-1 text-xs font-bold text-muted uppercase"><Languages aria-hidden className="size-4" /> Invite preview, auto-translated</p>
          <ul className="mt-2 space-y-1.5 text-sm">
            <li><span className="mr-2 rounded bg-white px-1 text-[10px] font-bold text-blue">EN</span>{title}</li>
            <li><span className="mr-2 rounded bg-white px-1 text-[10px] font-bold text-blue">ES</span>{title === "Annual Title I Family Meeting" ? "Reunión familiar anual de Título I" : `${title} (traducción automática)`}</li>
            <li className="text-muted"><span className="mr-2 rounded bg-white px-1 text-[10px] font-bold text-blue">VI</span>+ 2 more languages</li>
          </ul>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <div className="rounded-lg border border-line bg-white p-2">
            <QRCodeSVG value="https://example.org/campuslink/checkin/bluebonnet-nov19" size={92} fgColor="#0e3b7d" aria-label="Check-in QR code" />
          </div>
          <div className="text-sm">
            <p className="font-bold text-navy">Check-in QR</p>
            <p className="text-muted">Print for the entrance. Families scan, no login needed.</p>
            <button className="mt-1 inline-flex min-h-6 items-center gap-1 py-1 text-sm font-semibold text-blue hover:underline"><Printer aria-hidden className="size-4" /> Print</button>
          </div>
        </div>
        <Button className="mt-5 w-full"><CalendarDays aria-hidden className="size-4" /> Publish to 22 families</Button>
      </Card>
      )}
    </div>
  );
}

const AUDIENCES = [
  { id: "all", label: "All Bluebonnet families", n: 412 },
  { id: "g3", label: "Grade 3 families", n: 68 },
  { id: "es", label: "Spanish-speaking families", n: 189 },
];

function PromotePanel({
  event,
  credits,
  onCancel,
  onLaunch,
}: {
  event: (typeof EVENTS)[number];
  credits: number;
  onCancel: () => void;
  onLaunch: () => void;
}) {
  const [aud, setAud] = useState("all");
  const [remind, setRemind] = useState(true);
  const [flyer, setFlyer] = useState(false);
  const reach = AUDIENCES.find((a) => a.id === aud)!.n;
  return (
    <Card className="p-5">
      <h2 className="flex items-center gap-2 font-bold text-navy"><Megaphone aria-hidden className="size-5" /> Promote event</h2>
      <p className="mt-1 text-sm text-muted">{event.title}, {event.date}</p>

      <div className="mt-4 border border-line bg-pale p-3">
        <p className="text-[11px] font-bold text-muted uppercase">Preview on the family home screen</p>
        <div className="mt-2 bg-green px-3 py-2 text-navy-900">
          <span className="bg-navy-900 px-1.5 text-[10px] font-bold text-white uppercase">Featured</span>
          <p className="mt-1 text-sm font-bold">{event.title}</p>
          <p className="text-xs font-semibold">{event.date}, {event.time}</p>
        </div>
      </div>

      <fieldset className="mt-4">
        <legend className="text-sm font-semibold text-navy">Who sees it</legend>
        <div className="mt-2 grid gap-2">
          {AUDIENCES.map((a) => (
            <label key={a.id} className={`flex min-h-11 cursor-pointer items-center justify-between border-2 px-3 text-sm ${aud === a.id ? "border-navy bg-pale" : "border-line"}`}>
              <span className="flex items-center gap-2">
                <input type="radio" name="aud" className="size-4 accent-[#0e3b7d]" checked={aud === a.id} onChange={() => setAud(a.id)} />
                {a.label}
              </span>
              <span className="text-muted tabular-nums">{a.n}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-4 space-y-2 text-sm">
        <legend className="font-semibold text-navy">Channels</legend>
        <label className="flex items-start gap-2">
          <input type="checkbox" checked disabled className="mt-0.5 size-4 accent-[#0e3b7d]" />
          <span><strong className="text-navy">Featured on home screen</strong>, 7 days</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" checked={remind} onChange={(e) => setRemind(e.target.checked)} className="mt-0.5 size-4 accent-[#0e3b7d]" />
          <span><strong className="text-navy">Push and text reminder</strong>, 2 days before, in each family&apos;s language</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" checked={flyer} onChange={(e) => setFlyer(e.target.checked)} className="mt-0.5 size-4 accent-[#0e3b7d]" />
          <span><strong className="text-navy">Translated flyer</strong> by 806 Translations, $45</span>
        </label>
      </fieldset>

      <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-sm">
        <span className="text-muted">Estimated reach</span>
        <span className="font-bold text-navy tabular-nums">{reach} families</span>
      </div>
      <Button className="mt-4 w-full" onClick={onLaunch} disabled={credits < 1}>
        <Megaphone aria-hidden className="size-4" /> Launch boost, uses 1 of {credits} credits
      </Button>
      <button onClick={onCancel} className="mt-2 min-h-11 w-full text-sm font-semibold text-blue hover:underline">
        Cancel
      </button>
      <p className="mt-2 text-xs text-muted">Shown only to families at this campus. No outside advertisers.</p>
    </Card>
  );
}

function Conferences() {
  const days = ["Mon Dec 7", "Tue Dec 8", "Wed Dec 9"];
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-bold text-navy">Parent-teacher conferences</h2>
          <p className="text-sm text-muted">15-minute slots, 14 of 22 families booked</p>
        </div>
        <Button variant="ghost"><Plus aria-hidden className="size-4" /> Add slots</Button>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="text-left text-muted">
              <th scope="col" className="py-2 pr-3 font-semibold">Time</th>
              {days.map((d) => <th key={d} scope="col" className="py-2 pr-3 font-semibold">{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {SLOTS.map((s, r) => (
              <tr key={s} className="border-t border-line">
                <th scope="row" className="py-2 pr-3 text-left font-semibold text-navy">{s} PM</th>
                {days.map((d, c) => {
                  const booked = TAKEN_SLOTS.has(s) || (r + c) % 3 === 0;
                  return (
                    <td key={d} className="py-2 pr-3">
                      {booked ? (
                        <span className="inline-block rounded-md bg-navy px-2 py-1 text-xs font-semibold text-white">
                          {["Hernández", "Walker", "Nguyen", "Patel", "Okafor", "Lee"][(r + c) % 6]}
                        </span>
                      ) : (
                        <span className="inline-block rounded-md border border-dashed border-line px-2 py-1 text-xs text-muted">Open</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
