import type { Tutor, TutorRequest } from "./store";

/**
 * Profit matching: the student pays `price` per hour, the tutor is paid their own rate for the
 * subject, Career Gala keeps the difference. For a fixed price the most profitable tutor is the
 * cheapest one who can actually take the student, so the ranking is:
 *   1. hard rules decide who can take the request at all (subject, online/home + city, gender),
 *   2. cheaper rate first (= higher margin),
 *   3. ties go to the better fit (level, timing), then to the tutor with fewer active students.
 * Soft mismatches are shown as warnings rather than hidden, so the admin can trade margin for fit.
 */

/** Highest hourly price the student said they can pay, or null when they gave no ceiling. */
export function budgetCap(budget: string): number | null {
  if (/under/i.test(budget)) return 1000;
  const nums = (budget.match(/\d[\d,]*/g) ?? []).map((n) => Number(n.replace(/,/g, "")));
  if (nums.length >= 2) return Math.max(...nums);
  if (nums.length === 1 && budget.includes("+")) return nums[0]; // "Rs 3,000+": they can pay at least this
  return null; // "Not sure yet": the admin sets the price
}

/** Student subjects that tutors list under a different name, mapped to the tutor subjects that cover them. */
const COVERS: Record<string, string[]> = {
  science: ["physics", "chemistry", "biology"],
  "ielts / toefl": ["english"],
  mdcat: ["biology", "chemistry", "physics"],
};
/** Student levels that tutors list under a different name. Levels not here are compared as-is. */
const LEVEL_ALIAS: Record<string, string> = { "ielts / toefl": "ielts", mdcat: "mdcat" };

const norm = (s: string) => s.trim().toLowerCase();

/** The tutor's lowest rate among the subjects that cover the requested one, or null if they don't teach it. */
export function rateFor(t: Tutor, subject: string): { subject: string; rate: number } | null {
  const want = COVERS[norm(subject)] ?? [norm(subject)];
  let best: { subject: string; rate: number } | null = null;
  for (const [s, r] of Object.entries(t.rates)) {
    if (want.includes(norm(s)) && r > 0 && (!best || r < best.rate)) best = { subject: s, rate: r };
  }
  return best;
}

/** Student "Weekends" matches any Sat/Sun slot; "Evening" etc. match that part of any day. */
const timesOverlap = (studentTimes: string[], slots: string[]) =>
  studentTimes.some((t) => slots.some((s) => (t === "Weekends" ? /^(Sat|Sun)-/.test(s) : s.endsWith(`-${t}`))));

export type Candidate = {
  tutor: Tutor; subject: string; rate: number;
  /** price − rate, or null while no price is set. */
  profit: number | null;
  warnings: string[]; activeStudents: number;
};

export function rankTutors(req: TutorRequest, tutors: Tutor[], requests: TutorRequest[], price: number | null) {
  const active = (id: string) => requests.filter((r) => r.status === "assigned" && r.tutorId === id).length;
  const out: Candidate[] = [];
  const excluded: { tutor: Tutor; rate: number; reason: string }[] = [];

  for (const t of tutors) {
    if (t.status !== "approved") continue;
    const r = rateFor(t, req.subject);
    if (!r) continue; // doesn't teach it: not worth listing
    const home = req.mode === "At home";
    if (home && t.mode === "Online") { excluded.push({ tutor: t, rate: r.rate, reason: "Online only" }); continue; }
    if (!home && t.mode === "Home tuition") { excluded.push({ tutor: t, rate: r.rate, reason: "Home tuition only" }); continue; }
    if (home && norm(t.city) !== norm(req.city)) { excluded.push({ tutor: t, rate: r.rate, reason: `Based in ${t.city}` }); continue; }
    if (req.gender === "Female tutor" && t.gender !== "Female") { excluded.push({ tutor: t, rate: r.rate, reason: "Student asked for a female tutor" }); continue; }
    if (req.gender === "Male tutor" && t.gender !== "Male") { excluded.push({ tutor: t, rate: r.rate, reason: "Student asked for a male tutor" }); continue; }

    const warnings: string[] = [];
    const lvl = LEVEL_ALIAS[norm(req.subject)] ?? norm(req.level);
    const knownLevel = !["primary / middle", "professional"].includes(lvl);
    if (knownLevel && !t.levels.some((l) => norm(l) === lvl)) warnings.push(`Doesn't list ${LEVEL_ALIAS[norm(req.subject)] ? req.subject : req.level}`);
    if (req.times.length && !timesOverlap(req.times, t.slots)) warnings.push(`Not free: ${req.times.join(", ")}`);
    if (price != null && r.rate > price) warnings.push("Costs more than the student pays");

    out.push({ tutor: t, subject: r.subject, rate: r.rate, profit: price == null ? null : price - r.rate, warnings, activeStudents: active(t.id) });
  }

  out.sort((a, b) => a.rate - b.rate || a.warnings.length - b.warnings.length || a.activeStudents - b.activeStudents);
  return { candidates: out, excluded };
}

/** The top candidate the admin can assign without making a loss, if any. */
export const bestPick = (c: Candidate[]) => c.find((x) => x.profit == null || x.profit >= 0);
