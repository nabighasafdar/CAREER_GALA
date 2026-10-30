import { claimMyRequests } from "./store";

/**
 * TEST ONLY: a hardcoded admin login, checked in the browser. The email and password ship in the
 * public JS bundle and the flag below can be set by hand, so this keeps casual visitors out and
 * nothing more. Student passwords aren't stored or checked at all: an account is found by its
 * email or phone alone. Replace it with real server auth before launch.
 */
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "12345";
const KEY = "cg-admin";
const STUDENT_KEY = "cg-student";

export const isAdminEmail = (email: string) => email.trim().toLowerCase() === ADMIN_EMAIL;

export const isAdmin = () => { try { return localStorage.getItem(KEY) === "1"; } catch { return false; } };

/** True when the details match. Stays logged in on this browser until logoutAdmin(). */
export function loginAdmin(email: string, password: string) {
  if (!isAdminEmail(email) || password !== ADMIN_PASSWORD) return false;
  try { localStorage.setItem(KEY, "1"); } catch { /* storage unavailable */ }
  return true;
}

export const logoutAdmin = () => { try { localStorage.removeItem(KEY); } catch { /* storage unavailable */ } };

/** The logged-in student's id, if any. */
export const studentId = () => { try { return localStorage.getItem(STUDENT_KEY) ?? undefined; } catch { return undefined; } };

export function loginStudent(id: string) {
  try { localStorage.setItem(STUDENT_KEY, id); } catch { /* storage unavailable */ }
  claimMyRequests(id);
}

export const logoutStudent = () => { try { localStorage.removeItem(STUDENT_KEY); } catch { /* storage unavailable */ } };
