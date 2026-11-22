// All names, schools and numbers are fictional sample data.

export const DISTRICT = "Lone Prairie ISD";

export type Status = "met" | "on-track" | "at-risk" | "missing";

export type Campus = {
  id: string;
  name: string;
  families: number;
  reached: number; // families reached this year
  annualMeeting: Status;
  compact: Status; // school-parent compact signed / distributed
  policy: Status; // parent & family engagement policy
  conferences: Status;
  topLanguage: string;
  fundsUsed: number; // % of campus engagement reservation spent
};

export const CAMPUSES: Campus[] = [
  { id: "bb", name: "Bluebonnet Elementary", families: 412, reached: 371, annualMeeting: "met", compact: "met", policy: "met", conferences: "on-track", topLanguage: "Spanish", fundsUsed: 64 },
  { id: "pg", name: "Pecan Grove Elementary", families: 388, reached: 302, annualMeeting: "met", compact: "on-track", policy: "met", conferences: "on-track", topLanguage: "Spanish", fundsUsed: 51 },
  { id: "hs", name: "High Plains Elementary", families: 301, reached: 154, annualMeeting: "at-risk", compact: "at-risk", policy: "met", conferences: "on-track", topLanguage: "Vietnamese", fundsUsed: 22 },
  { id: "cw", name: "Cottonwood Elementary", families: 356, reached: 298, annualMeeting: "met", compact: "met", policy: "on-track", conferences: "met", topLanguage: "Spanish", fundsUsed: 70 },
  { id: "rv", name: "Ridgeview Middle", families: 640, reached: 341, annualMeeting: "on-track", compact: "at-risk", policy: "met", conferences: "at-risk", topLanguage: "Arabic", fundsUsed: 38 },
  { id: "mc", name: "Mesa Creek Middle", families: 598, reached: 233, annualMeeting: "missing", compact: "missing", policy: "on-track", conferences: "at-risk", topLanguage: "Spanish", fundsUsed: 12 },
];

export type EvidenceItem = {
  id: string;
  campus: string;
  title: string;
  requirement: string;
  time: string;
  check: { ok: boolean; note: string };
  filed: boolean;
};

export const EVIDENCE: EvidenceItem[] = [
  { id: "e1", campus: "Bluebonnet Elementary", title: "Annual Title I Meeting attendance", requirement: "Annual meeting", time: "Today, 6:42 PM", check: { ok: true, note: "Date, campus and 58 attendees detected" }, filed: true },
  { id: "e2", campus: "Pecan Grove Elementary", title: "School-parent compact, 41 e-signatures", requirement: "School-parent compact", time: "Today, 2:15 PM", check: { ok: true, note: "Signatures match enrolled families" }, filed: true },
  { id: "e3", campus: "High Plains Elementary", title: "Family literacy night sign-in", requirement: "Engagement activity", time: "Yesterday", check: { ok: false, note: "Event date missing on agenda, needs review" }, filed: false },
  { id: "e4", campus: "Cottonwood Elementary", title: "Spring family survey, 212 responses", requirement: "Annual evaluation", time: "Mon", check: { ok: true, note: "Responses in 3 languages" }, filed: true },
];

export const LANGUAGES = [
  { name: "English", families: 1268 },
  { name: "Spanish", families: 942 },
  { name: "Vietnamese", families: 187 },
  { name: "Arabic", families: 142 },
  { name: "Other", families: 156 },
];

export type Thread = {
  id: string;
  parent: string;
  student: string;
  language: string;
  langCode: string;
  unread: boolean;
  preview: string;
  messages: { from: "parent" | "staff"; original: string; translated?: string; time: string }[];
};

export const THREADS: Thread[] = [
  {
    id: "t1",
    parent: "María Hernández",
    student: "Sofía H., Grade 3",
    language: "Spanish",
    langCode: "ES",
    unread: true,
    preview: "Can I bring my younger son to the meeting?",
    messages: [
      { from: "staff", original: "Hi! Our Title I family meeting is Thursday at 6:00 PM in the library. Dinner and childcare provided.", translated: "¡Hola! Nuestra reunión familiar de Título I es el jueves a las 6:00 PM en la biblioteca. Habrá cena y cuidado de niños.", time: "Mon 9:10 AM" },
      { from: "parent", original: "¿Puedo llevar a mi hijo menor a la reunión?", translated: "Can I bring my younger son to the meeting?", time: "Mon 7:48 PM" },
    ],
  },
  {
    id: "t2",
    parent: "Thanh Nguyen",
    student: "Bao N., Grade 5",
    language: "Vietnamese",
    langCode: "VI",
    unread: true,
    preview: "Thank you, I signed the compact.",
    messages: [
      { from: "parent", original: "Cảm ơn, tôi đã ký thỏa thuận.", translated: "Thank you, I signed the compact.", time: "Mon 5:02 PM" },
    ],
  },
  {
    id: "t3",
    parent: "James Walker",
    student: "Ava W., Grade 3",
    language: "English",
    langCode: "EN",
    unread: false,
    preview: "Booked the 4:30 conference slot.",
    messages: [{ from: "parent", original: "Booked the 4:30 conference slot. See you then!", time: "Fri 3:20 PM" }],
  },
];

export const EVENTS = [
  { id: "ev1", title: "Annual Title I Family Meeting", date: "Thu, Nov 19", time: "6:00 - 7:00 PM", place: "Library", rsvp: 64, capacity: 120, required: true },
  { id: "ev2", title: "Family Literacy Night", date: "Tue, Dec 1", time: "5:30 - 7:00 PM", place: "Cafeteria", rsvp: 38, capacity: 80, required: false },
  { id: "ev3", title: "Parent-Teacher Conferences", date: "Dec 7 - 11", time: "Book a 15-min slot", place: "Classrooms", rsvp: 211, capacity: 412, required: false },
];

export const PROMO = {
  boostsUsed: 23,
  boostsTotal: 60,
  promotedAttendance: 41, // % of invited families who checked in
  regularAttendance: 24,
  top: [
    { event: "Family Literacy Night", campus: "Bluebonnet Elementary", reach: 412, rsvp: 168, checkIns: 151 },
    { event: "Math Night", campus: "Cottonwood Elementary", reach: 356, rsvp: 131, checkIns: 117 },
    { event: "Annual Title I Meeting", campus: "Pecan Grove Elementary", reach: 388, rsvp: 142, checkIns: 126 },
  ],
};

export const SLOTS =["3:30", "3:45", "4:00", "4:15", "4:30", "4:45"];
export const TAKEN_SLOTS = new Set(["3:45", "4:30"]);
