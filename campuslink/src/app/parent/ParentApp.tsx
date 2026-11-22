"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  CalendarPlus,
  Check,
  CheckCircle2,
  ChevronRight,
  FileSignature,
  Globe,
  Home,
  MapPin,
  Megaphone,
  MessageCircle,
  QrCode,
  Utensils,
  FolderOpen,
} from "lucide-react";
import { Button, Wordmark } from "@/components/ui";
import { EVENTS, SLOTS, TAKEN_SLOTS } from "@/lib/data";
import { EVENT_I18N, LANG_OPTIONS, T, type Dict, type Lang } from "@/lib/i18n";

type Screen = "lang" | "home" | "event" | "scan" | "checked" | "compact" | "signed" | "book" | "inbox";

export default function ParentApp() {
  const [screen, setScreen] = useState<Screen>("lang");
  const [lang, setLang] = useState<Lang>("es");
  const [rsvp, setRsvp] = useState(false);
  const [compactSigned, setCompactSigned] = useState(false);
  const [slot, setSlot] = useState<string | null>(null);
  const [featuredSaved, setFeaturedSaved] = useState(false);
  const t: Dict = T[lang];
  const evTitle = (s: string) => (lang === "es" ? EVENT_I18N[s]?.es ?? s : s);

  const go = (s: Screen) => {
    setScreen(s);
    if (typeof window !== "undefined") document.getElementById("parent-scroll")?.scrollTo({ top: 0 });
  };

  const tabs: { id: Screen; label: string; Icon: typeof Home }[] = [
    { id: "home", label: t.home, Icon: Home },
    { id: "event", label: t.events, Icon: CalendarDays },
    { id: "inbox", label: t.inbox, Icon: MessageCircle },
    { id: "compact", label: t.docs, Icon: FolderOpen },
  ];

  return (
    <div lang={lang} className="relative flex h-[calc(100dvh-65px)] flex-col bg-pale md:h-full">
      <div id="parent-scroll" className="flex-1 overflow-y-auto">
        {screen === "lang" && (
          <section className="flex min-h-full flex-col bg-white px-5 pt-6 pb-6 md:pt-10">
            <span className="hidden md:block"><Wordmark /></span>
            <Globe aria-hidden className="size-10 text-blue md:mt-10" />
            <h1 className="mt-3 text-2xl font-bold text-navy">{t.chooseLang}</h1>
            <p className="text-muted">{t.chooseLangSub}</p>
            <fieldset className="mt-6 grid gap-3">
              <legend className="sr-only">{t.chooseLang}</legend>
              {LANG_OPTIONS.map((o) => {
                const active = o.code === lang;
                const disabled = "soon" in o && o.soon;
                return (
                  <label
                    key={o.code}
                    className={`flex min-h-14 cursor-pointer items-center justify-between rounded-xl border-2 px-4 ${
                      active ? "border-navy bg-pale" : "border-line bg-white"
                    } ${disabled ? "cursor-not-allowed opacity-55" : ""}`}
                  >
                    <span>
                      <span lang={o.code} className="block font-bold text-navy" dir={o.code === "ar" ? "rtl" : undefined}>
                        {o.native}
                      </span>
                      <span className="text-xs text-muted">{disabled ? `${o.label}, coming soon` : o.label}</span>
                    </span>
                    <input
                      type="radio"
                      name="lang"
                      className="size-5 accent-[#0e3b7d]"
                      checked={active}
                      disabled={!!disabled}
                      onChange={() => setLang(o.code as Lang)}
                    />
                  </label>
                );
              })}
            </fieldset>
            <div className="mt-auto pt-8">
              <Button className="w-full" onClick={() => go("home")}>
                {t.continue}
              </Button>
            </div>
          </section>
        )}

        {screen === "home" && (
          <section>
            <header className="hero-gradient px-5 pt-8 pb-14 text-white">
              <div className="flex items-center justify-end md:justify-between">
                <span className="hidden md:inline-flex"><Wordmark light /></span>
                <button aria-label="Notifications" className="relative grid size-11 place-items-center rounded-none bg-white/15">
                  <Bell aria-hidden className="size-5" />
                  <span className="absolute top-2 right-2 size-2.5 rounded-full bg-green" />
                </button>
              </div>
              <h1 className="mt-6 text-2xl font-bold">{t.hello}</h1>
              <p className="text-sm text-white/85">{t.child}</p>
            </header>
            <div className="-mt-8 space-y-5 px-4 pb-6">
              <article className="overflow-hidden bg-white shadow-card" aria-label={t.featured}>
                <div className="relative bg-green px-4 py-3 text-navy-900">
                  <span className="inline-flex items-center gap-1 bg-navy-900 px-2 py-0.5 text-[11px] font-bold tracking-wide text-white uppercase">
                    <Megaphone aria-hidden className="size-3" /> {t.featured}
                  </span>
                  <p className="mt-2 text-lg leading-snug font-bold">{evTitle(EVENTS[1].title)}</p>
                  <p className="text-sm font-semibold">{EVENTS[1].date}, {EVENTS[1].time}</p>
                </div>
                <div className="p-4">
                  <p className="text-sm text-ink">{t.featuredBody}</p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-xs text-muted">{t.featuredFrom}</span>
                    <Button
                      variant={featuredSaved ? "ghost" : "secondary"}
                      className="min-h-10"
                      aria-pressed={featuredSaved}
                      onClick={() => setFeaturedSaved(true)}
                    >
                      {featuredSaved ? <><Check aria-hidden className="size-4" /> {t.featuredSaved}</> : t.featuredCta}
                    </Button>
                  </div>
                </div>
              </article>

              {!compactSigned && (
                <div className="rounded-xl bg-white p-4 shadow-card">
                  <p className="text-xs font-bold tracking-wide text-warn uppercase">{t.todo}</p>
                  <button onClick={() => go("compact")} className="mt-2 flex w-full items-center gap-3 text-left">
                    <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-warn-50 text-warn">
                      <FileSignature aria-hidden className="size-5" />
                    </span>
                    <span className="flex-1">
                      <span className="block font-bold text-navy">{t.signCompact}</span>
                      <span className="text-sm text-muted">{t.signCompactSub}</span>
                    </span>
                    <ChevronRight aria-hidden className="size-5 text-muted" />
                  </button>
                </div>
              )}

              <button onClick={() => go("inbox")} className="flex w-full items-center gap-3 rounded-xl bg-white p-4 text-left shadow-card">
                <span className="grid size-11 place-items-center rounded-lg bg-sky-100 text-navy">
                  <MessageCircle aria-hidden className="size-5" />
                </span>
                <span className="flex-1 font-semibold text-navy">{t.newMsg}</span>
                <span className="rounded-none bg-green px-2 text-xs font-bold text-navy-900">1</span>
              </button>

              <div>
                <h2 className="mb-2 px-1 text-sm font-bold text-muted uppercase">{t.upcoming}</h2>
                <ul className="space-y-3">
                  {EVENTS.map((e, i) => (
                    <li key={e.id} className="rounded-xl bg-white p-4 shadow-card">
                      <p className="text-xs font-bold text-blue">{e.date}, {e.time}</p>
                      <p className="mt-1 font-bold text-navy">{evTitle(e.title)}</p>
                      <div className="mt-3 flex gap-2">
                        {i === 0 ? (
                          <>
                            <Button className="flex-1" variant={rsvp ? "ghost" : "primary"} onClick={() => setRsvp(true)} aria-pressed={rsvp}>
                              {rsvp ? <><Check aria-hidden className="size-4" /> {t.rsvped}</> : t.rsvp}
                            </Button>
                            <Button variant="ghost" onClick={() => go("event")}>{t.details}</Button>
                          </>
                        ) : i === 2 ? (
                          <Button variant="ghost" className="flex-1" onClick={() => go("book")}>
                            {slot ? `${t.booked}, ${slot} PM` : t.bookConf}
                          </Button>
                        ) : (
                          <Button variant="ghost" className="flex-1" onClick={() => go("event")}>{t.details}</Button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {screen === "event" && (
          <section className="bg-white pb-6">
            <TopBar title={t.events} onBack={() => go("home")} backLabel={t.back} />
            <div className="hero-gradient mx-4 mt-2 rounded-xl p-5 text-white">
              <p className="text-sm font-semibold text-white/85">{EVENTS[0].date}</p>
              <h1 className="mt-1 text-2xl font-bold">{evTitle(EVENTS[0].title)}</h1>
            </div>
            <ul className="mt-4 space-y-3 px-5 text-ink">
              <li className="flex items-center gap-3"><CalendarDays aria-hidden className="size-5 text-blue" />{EVENTS[0].time}</li>
              <li className="flex items-center gap-3"><MapPin aria-hidden className="size-5 text-blue" />Bluebonnet Elementary, {EVENTS[0].place}</li>
              <li className="flex items-center gap-3"><Utensils aria-hidden className="size-5 text-blue" />{t.childcare}</li>
            </ul>
            <div className="mt-6 grid gap-3 px-5">
              <Button onClick={() => go("scan")}><QrCode aria-hidden className="size-5" /> {t.checkIn}</Button>
              <Button variant="ghost" onClick={() => setRsvp(true)} aria-pressed={rsvp}>
                {rsvp ? <><Check aria-hidden className="size-4" /> {t.rsvped}</> : t.rsvp}
              </Button>
              <Button variant="ghost"><CalendarPlus aria-hidden className="size-4" /> {t.addCal}</Button>
            </div>
          </section>
        )}

        {screen === "scan" && (
          <section className="flex min-h-full flex-col bg-navy-900 text-white">
            <TopBar title={t.checkIn} onBack={() => go("event")} backLabel={t.back} dark />
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
              <div className="relative grid size-60 place-items-center rounded-3xl border-2 border-dashed border-sky">
                <QrCode aria-hidden className="size-28 text-sky" />
                <span className="absolute inset-x-6 top-1/2 h-0.5 animate-pulse bg-green" />
              </div>
              <h1 className="mt-8 text-xl font-bold">{t.scanTitle}</h1>
              <p className="mt-1 text-white/80">{t.scanSub}</p>
            </div>
            <div className="p-5">
              <Button className="w-full" onClick={() => go("checked")}>{t.simulateScan}</Button>
            </div>
          </section>
        )}

        {screen === "checked" && <CheckedIn t={t} onDone={() => go("home")} />}

        {screen === "compact" && (
          <Compact
            t={t}
            signed={compactSigned}
            onBack={() => go("home")}
            onSign={() => {
              setCompactSigned(true);
              go("signed");
            }}
          />
        )}

        {screen === "signed" && (
          <section className="flex min-h-full flex-col items-center justify-center bg-white px-6 text-center">
            <CheckCircle2 aria-hidden className="size-20 text-ok" />
            <h1 className="mt-4 text-2xl font-bold text-navy">{t.signed}</h1>
            <p className="mt-1 text-muted">{t.signedSub}</p>
            <Button className="mt-8 w-full" onClick={() => go("home")}>{t.home}</Button>
          </section>
        )}

        {screen === "book" && (
          <section className="min-h-full bg-white pb-6">
            <TopBar title={t.bookConf} onBack={() => go("home")} backLabel={t.back} />
            <div className="px-5">
              <p className="text-muted">{t.bookConfSub}</p>
              <p className="mt-4 text-sm font-bold text-navy">Mon, Dec 7</p>
              <div className="mt-2 grid grid-cols-3 gap-2" role="radiogroup" aria-label={t.bookConf}>
                {SLOTS.map((s) => {
                  const taken = TAKEN_SLOTS.has(s);
                  const active = slot === s;
                  return (
                    <button
                      key={s}
                      role="radio"
                      aria-checked={active}
                      disabled={taken}
                      onClick={() => setSlot(s)}
                      className={`min-h-12 rounded-lg border-2 text-sm font-bold ${
                        active ? "border-navy bg-navy text-white" : "border-line text-navy"
                      } disabled:border-dashed disabled:text-muted disabled:line-through`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              <Button className="mt-6 w-full" disabled={!slot} onClick={() => go("home")}>
                {t.book}{slot ? `, ${slot} PM` : ""}
              </Button>
            </div>
          </section>
        )}

        {screen === "inbox" && (
          <section className="min-h-full bg-white pb-6">
            <TopBar title="Ms. Carter, Grade 3" onBack={() => go("home")} backLabel={t.back} />
            <div className="space-y-3 px-4">
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-pale p-3">
                <p className="text-sm text-ink">
                  {lang === "es"
                    ? "¡Hola! Nuestra reunión familiar de Título I es el jueves a las 6:00 PM en la biblioteca. Habrá cena y cuidado de niños."
                    : "Hi! Our Title I family meeting is Thursday at 6:00 PM in the library. Dinner and childcare provided."}
                </p>
                {lang === "es" && (
                  <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-blue">
                    <Globe aria-hidden className="size-3" /> {t.langBadge}
                  </p>
                )}
              </div>
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-navy p-3 text-sm text-white">
                {lang === "es" ? "¿Puedo llevar a mi hijo menor a la reunión?" : "Can I bring my younger son to the meeting?"}
              </div>
            </div>
          </section>
        )}
      </div>

      {screen !== "lang" && screen !== "scan" && (
        <nav aria-label="App" className="grid grid-cols-4 border-t border-line bg-white pb-[env(safe-area-inset-bottom)]">
          {tabs.map(({ id, label, Icon }) => {
            const active = screen === id || (id === "compact" && screen === "signed");
            return (
              <button
                key={id}
                onClick={() => go(id)}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold ${
                  active ? "text-navy" : "text-muted"
                }`}
              >
                <Icon aria-hidden className="size-5" />
                {label}
                <span className={`mt-0.5 h-0.5 w-6 rounded ${active ? "bg-green" : "bg-transparent"}`} />
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}

function TopBar({ title, onBack, backLabel, dark }: { title: string; onBack: () => void; backLabel: string; dark?: boolean }) {
  return (
    <div className={`sticky top-0 z-10 flex items-center gap-2 px-2 py-2 ${dark ? "bg-navy-900 text-white" : "bg-white text-navy"}`}>
      <button onClick={onBack} aria-label={backLabel} className="grid size-11 place-items-center rounded-none hover:bg-black/5">
        <ArrowLeft aria-hidden className="size-5" />
      </button>
      <p className="font-bold">{title}</p>
    </div>
  );
}

const FACES = ["😟", "😐", "🙂", "😀"];

function CheckedIn({ t, onDone }: { t: Dict; onDone: () => void }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [sent, setSent] = useState(false);
  const qs = [t.q1, t.q2, t.q3];
  return (
    <section className="min-h-full bg-white pb-6">
      <div className="bg-ok-50 px-5 pt-10 pb-6 text-center">
        <CheckCircle2 aria-hidden className="mx-auto size-14 text-ok" />
        <h1 className="mt-3 text-xl font-bold text-navy">{t.checkedIn}</h1>
        <p className="text-sm text-ink">{t.checkedInSub}</p>
      </div>
      {sent ? (
        <div className="px-5 pt-10 text-center">
          <p className="text-lg font-bold text-navy">{t.thanks}</p>
          <Button className="mt-6 w-full" onClick={onDone}>{t.home}</Button>
        </div>
      ) : (
        <div className="px-5 pt-6">
          <h2 className="font-bold text-navy">{t.quickSurvey}</h2>
          {qs.map((q) => (
            <fieldset key={q} className="mt-4">
              <legend className="text-sm text-ink">{q}</legend>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {FACES.map((f, i) => (
                  <button
                    key={f}
                    aria-label={`${q}: ${i + 1} of 4`}
                    aria-pressed={answers[q] === i}
                    onClick={() => setAnswers((a) => ({ ...a, [q]: i }))}
                    className={`min-h-12 rounded-lg border-2 text-2xl ${answers[q] === i ? "border-navy bg-pale" : "border-line"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </fieldset>
          ))}
          <Button className="mt-6 w-full" disabled={Object.keys(answers).length < 3} onClick={() => setSent(true)}>
            {t.submit}
          </Button>
        </div>
      )}
    </section>
  );
}

function Compact({ t, signed, onBack, onSign }: { t: Dict; signed: boolean; onBack: () => void; onSign: () => void }) {
  const [name, setName] = useState("");
  return (
    <section className="min-h-full bg-white pb-6">
      <TopBar title={t.compactTitle} onBack={onBack} backLabel={t.back} />
      <div className="px-5">
        <p className="text-ink">{t.compactIntro}</p>
        {[
          { h: t.schoolWill, items: [t.school1, t.school2, t.school3] },
          { h: t.familyWill, items: [t.family1, t.family2, t.family3] },
        ].map((g) => (
          <div key={g.h} className="mt-4 rounded-xl bg-pale p-4">
            <h2 className="font-bold text-navy">{g.h}</h2>
            <ul className="mt-2 space-y-2 text-sm">
              {g.items.map((it) => (
                <li key={it} className="flex gap-2"><Check aria-hidden className="mt-0.5 size-4 shrink-0 text-ok" />{it}</li>
              ))}
            </ul>
          </div>
        ))}
        {signed ? (
          <p className="mt-6 flex items-center gap-2 font-bold text-ok"><CheckCircle2 aria-hidden className="size-5" />{t.signed}</p>
        ) : (
          <>
            <label htmlFor="sig" className="mt-6 block text-sm font-semibold text-navy">{t.typeName}</label>
            <input
              id="sig"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              placeholder="María Hernández"
              className="mt-1 min-h-12 w-full rounded-lg border-2 border-line px-3 text-lg italic focus:border-navy focus:outline-none"
            />
            <Button className="mt-4 w-full" disabled={name.trim().length < 3} onClick={onSign}>
              <FileSignature aria-hidden className="size-4" /> {t.sign}
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
