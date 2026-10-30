import { useSyncExternalStore } from "react";

/**
 * The admin "database": tutors and student requests, kept in localStorage so every tab in this
 * browser sees the same data. It is a stand-in for a real backend. Swap the bodies of read/write
 * for API calls and the pages keep working, since they only use the functions exported here.
 * Anything in localStorage is readable by whoever uses the browser, so tutor rates and margins are
 * NOT private until this moves to a server with auth.
 */

export type TutorStatus = "pending" | "approved" | "rejected";
export type Tutor = {
  id: string; createdAt: number; status: TutorStatus; sample?: boolean;
  name: string; phone: string; email: string; gender: string; city: string; areas: string;
  mode: "Online" | "Home tuition" | "Both"; subjects: string[]; levels: string[];
  /** Hourly rate per subject in Rs: what Career Gala pays the tutor. */
  rates: Record<string, number>;
  /** "Mon-Evening" style slots, as picked in tutor onboarding. */
  slots: string[]; experience: string;
};

/** An account made through "I want to learn". City and level fill in from their first request. */
export type Student = {
  id: string; createdAt: number; sample?: boolean;
  name: string; email: string; phone: string; city: string; level: string;
};

export type RequestStatus = "open" | "assigned" | "cancelled";
export type TutorRequest = {
  id: string; createdAt: number; status: RequestStatus;
  /** The account that sent it. Missing when sent from the public form without logging in. */
  studentId?: string;
  name: string; studentName: string; phone: string; email?: string;
  subject: string; level: string; mode: "Online" | "At home"; city: string; area: string;
  budget: string; times: string[]; start: string; frequency: string; gender: string; goal: string; message: string;
  /** Set on assignment. price = what the student pays per hour, tutorRate = what the tutor gets. */
  tutorId?: string; price?: number; tutorRate?: number; assignedAt?: number;
};

type Db = { tutors: Tutor[]; students: Student[]; requests: TutorRequest[] };

const KEY = "cg-db";
const MINE = "cg-my-requests";
const CHANGE = "cg-db-change";

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

/** Sample tutors so the admin has someone to match against on first run. Flagged `sample` in the UI. */
const seedTutors = (): Tutor[] => {
  const t = (name: string, gender: string, city: string, mode: Tutor["mode"], rates: Record<string, number>, levels: string[], sl: string[], experience: string): Tutor => ({
    id: uid(), createdAt: Date.now(), status: "approved", sample: true, name, gender, city, mode, rates, levels, slots: sl, experience,
    subjects: Object.keys(rates), phone: "+92 300 0000000", email: "", areas: mode === "Online" ? "" : "Nearby areas",
  });
  return [
    t("Ayesha Khan", "Female", "Lahore", "Both", { Maths: 1800, Physics: 2000 }, ["O Level", "A Level", "FSc"], ["Mon-Evening", "Wed-Evening", "Sat-Morning"], "5–10 years"),
    t("Hamza Raza", "Male", "Karachi", "Online", { English: 1500 }, ["IELTS", "O Level", "University"], ["Tue-Evening", "Thu-Evening", "Sun-Morning"], "3–5 years"),
    t("Bilal Ahmed", "Male", "Lahore", "Home tuition", { Maths: 1000, Chemistry: 1100 }, ["Matric", "FSc"], ["Mon-Afternoon", "Tue-Afternoon", "Thu-Afternoon"], "1–3 years"),
    t("Sana Tariq", "Female", "Islamabad", "Online", { Biology: 1300, Chemistry: 1300 }, ["FSc", "MDCAT", "A Level"], ["Mon-Evening", "Fri-Evening", "Sat-Afternoon"], "3–5 years"),
    t("Usman Ali", "Male", "Karachi", "Both", { Maths: 1200, Physics: 1200, Computer: 1400 }, ["Matric", "O Level", "FSc"], ["Wed-Morning", "Sat-Morning", "Sun-Afternoon"], "1–3 years"),
    t("Mahnoor Iqbal", "Female", "Lahore", "Online", { English: 900, Urdu: 800 }, ["Matric", "O Level", "IELTS"], ["Mon-Afternoon", "Wed-Afternoon", "Sat-Evening"], "Less than 1 year"),
    t("Daniyal Shah", "Male", "Rawalpindi", "Both", { Physics: 1600, Maths: 1500 }, ["A Level", "FSc", "University"], ["Tue-Evening", "Thu-Evening", "Sun-Evening"], "5–10 years"),
    t("Hiba Noor", "Female", "Karachi", "Home tuition", { Accounting: 1700, Maths: 1400 }, ["O Level", "A Level"], ["Fri-Afternoon", "Sat-Afternoon", "Sun-Morning"], "3–5 years"),
  ];
};

/** A test student to log in with. The fixed id keeps them logged in across "Reset demo data". */
const seedStudents = (): Student[] => [
  { id: "sample-student", createdAt: Date.now(), sample: true, name: "Ali Raza", email: "student@gmail.com", phone: "+92 300 1234567", city: "Lahore", level: "Matric" },
];

const fresh = (): Db => ({ tutors: seedTutors(), students: seedStudents(), requests: [] });

let cacheRaw: string | null | undefined;
let cache: Db = { tutors: [], students: [], requests: [] };
let memoryOnly = false;

function read(): Db {
  if (memoryOnly) return cache;
  let raw: string | null = null;
  try { raw = localStorage.getItem(KEY); } catch { /* storage unavailable */ }
  if (raw === cacheRaw) return cache;
  try {
    const saved = raw ? JSON.parse(raw) : null;
    cache = saved ? { ...saved, students: saved.students ?? seedStudents() } : fresh(); // data saved before students existed has none
  } catch { cache = fresh(); }
  cacheRaw = raw;
  if (!raw) persist(cache);
  return cache;
}

/** Saves without notifying, so read() can seed during render. */
function persist(db: Db) {
  cache = db;
  try { const raw = JSON.stringify(db); localStorage.setItem(KEY, raw); cacheRaw = raw; } catch { memoryOnly = true; }
}

function write(db: Db) {
  persist(db);
  window.dispatchEvent(new Event(CHANGE));
}

const update = (fn: (db: Db) => Db) => write(fn(read()));

function subscribe(cb: () => void) {
  window.addEventListener(CHANGE, cb);
  window.addEventListener("storage", cb); // other tabs
  return () => { window.removeEventListener(CHANGE, cb); window.removeEventListener("storage", cb); };
}

/** Re-renders whenever the data changes, in this tab or another one. */
export const useDb = () => useSyncExternalStore(subscribe, read);

export const tutorById = (id?: string) => read().tutors.find((t) => t.id === id);

export function addTutor(t: Omit<Tutor, "id" | "createdAt" | "status">) {
  const tutor: Tutor = { ...t, id: uid(), createdAt: Date.now(), status: "pending" };
  update((db) => ({ ...db, tutors: [tutor, ...db.tutors] }));
  return tutor;
}

export const setTutorStatus = (id: string, status: TutorStatus) =>
  update((db) => ({ ...db, tutors: db.tutors.map((t) => (t.id === id ? { ...t, status } : t)) }));

const lastTen = (s: string) => s.replace(/\D/g, "").slice(-10);

/** Finds an account by email or phone. Phones compare on their last 10 digits, so 0300… matches +92 300…. */
export function findStudent(contact: string) {
  const c = contact.trim().toLowerCase();
  const phone = c.includes("@") ? "" : lastTen(c);
  return read().students.find((s) => s.email.toLowerCase() === c || (phone.length === 10 && lastTen(s.phone) === phone));
}

export function addStudent(name: string, contact: string) {
  const c = contact.trim(), email = c.includes("@");
  const student: Student = { id: uid(), createdAt: Date.now(), name, email: email ? c : "", phone: email ? "" : c, city: "", level: "" };
  update((db) => ({ ...db, students: [student, ...db.students] }));
  return student;
}

export const updateStudent = (id: string, patch: Partial<Student>) =>
  update((db) => ({ ...db, students: db.students.map((s) => (s.id === id ? { ...s, ...patch } : s)) }));

/** One request per subject, so each subject gets its own tutor. Without an account, the ids are remembered until the student logs in. */
export function addRequests(reqs: Omit<TutorRequest, "id" | "createdAt" | "status" | "studentId">[], studentId?: string) {
  const made: TutorRequest[] = reqs.map((r) => ({ ...r, studentId, id: uid(), createdAt: Date.now(), status: "open" }));
  update((db) => ({ ...db, requests: [...made, ...db.requests] }));
  if (!studentId) try { localStorage.setItem(MINE, JSON.stringify([...myRequestIds(), ...made.map((r) => r.id)])); } catch { /* storage unavailable */ }
  return made;
}

const myRequestIds = (): string[] => { try { return JSON.parse(localStorage.getItem(MINE) || "[]"); } catch { return []; } };

/** Moves requests sent from this browser before logging in onto the account. */
export function claimMyRequests(studentId: string) {
  const mine = myRequestIds();
  if (!mine.length) return;
  update((db) => ({ ...db, requests: db.requests.map((r) => (mine.includes(r.id) && !r.studentId ? { ...r, studentId } : r)) }));
  try { localStorage.removeItem(MINE); } catch { /* storage unavailable */ }
}

export function assignTutor(requestId: string, tutorId: string, price: number, tutorRate: number) {
  update((db) => ({ ...db, requests: db.requests.map((r) => (r.id === requestId ? { ...r, status: "assigned", tutorId, price, tutorRate, assignedAt: Date.now() } : r)) }));
}

export const setRequestStatus = (id: string, status: RequestStatus) =>
  update((db) => ({ ...db, requests: db.requests.map((r) => (r.id !== id ? r : status === "assigned" ? { ...r, status } : { ...r, status, tutorId: undefined, price: undefined, tutorRate: undefined, assignedAt: undefined })) }));

export const resetDemoData = () => write(fresh());
