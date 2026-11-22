// Example pricing for the business case. Structure mirrors 806's public pricing
// (a district license plus a per-school price, tiered like Plan4Learning).

export type TierId = "essential" | "standard" | "professional";

export const DISTRICT_LICENSE = 600;

export const TIERS: Record<TierId, { name: string; perSchool: number; tagline: string; features: string[] }> = {
  essential: {
    name: "Essential",
    perSchool: 300,
    tagline: "Events and proof",
    features: [
      "Event pages with RSVP",
      "QR check-in at the door",
      "Announcements in English and Spanish",
      "Attendance filed to Title1Crate",
    ],
  },
  standard: {
    name: "Standard",
    perSchool: 450,
    tagline: "Two-way family engagement",
    features: [
      "Everything in Essential",
      "Two-way messaging in 100+ languages",
      "Parent-teacher conference booking",
      "E-sign school-parent compact",
      "Family surveys",
    ],
  },
  professional: {
    name: "Professional",
    perSchool: 600,
    tagline: "Promote events, prove impact",
    features: [
      "Everything in Standard",
      "Featured events on the family home screen",
      "10 event boosts per school each year",
      "Promotion and attendance analytics",
      "AI evidence check and board reports",
    ],
  },
};

export const ADDONS = {
  boostPack: { name: "Event boost pack", unit: "10 boosts", price: 150 },
  sms: { name: "Extra texts", unit: "1,000 texts", price: 15 },
  translation: { name: "Human translation", unit: "document, via 806 Translations", price: 45 },
};

export const MULTI_YEAR_PCT = 0.1;

export type QuoteInput = { tier: TierId; schools: number; title1Crate: boolean; multiYear: boolean; boostPacks: number };

export function estimate(q: QuoteInput) {
  const license = q.title1Crate ? 0 : DISTRICT_LICENSE;
  const schools = q.schools * TIERS[q.tier].perSchool;
  const boosts = q.boostPacks * ADDONS.boostPack.price;
  const subtotal = license + schools + boosts;
  const multiYearOff = q.multiYear ? Math.round(schools * MULTI_YEAR_PCT) : 0;
  return { license, licenseWaived: q.title1Crate, schools, boosts, subtotal, multiYearOff, total: subtotal - multiYearOff };
}

export const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
