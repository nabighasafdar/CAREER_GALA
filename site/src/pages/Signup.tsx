import { useState } from "react";
import { AuthShell, Check } from "./Shell";
import { navigate } from "../lib/router";

const copy = {
  learn: { h: <>Start learning <span className="serif">today</span>.</>, pts: ["Verified tutors", "Book a trial in minutes", "Online or at home"], cta: "Create account", to: "/student" },
  teach: { h: <>Teach on your <span className="serif">schedule</span>.</>, pts: ["Set your own rate", "Students come to you", "Reliable payouts"], cta: "Continue to tutor profile", to: "/tutor/onboarding" },
};

export default function Signup() {
  const [role, setRole] = useState<"learn" | "teach">(new URLSearchParams(location.search).get("role") === "teach" ? "teach" : "learn");
  const c = copy[role];
  return (
    <AuthShell side={<>
      <h2>{c.h}</h2>
      <ul>{c.pts.map((t) => <li key={t}><Check />{t}</li>)}</ul>
    </>}>
      <h1>Create your account</h1>
      <p className="auth-sub" style={{ marginBottom: 24 }}>Already have one? <a href="/login">Log in</a></p>
      <div className="roles" role="radiogroup" aria-label="I want to">
        <button type="button" role="radio" aria-checked={role === "learn"} className="role" onClick={() => setRole("learn")}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1F8F7A" strokeWidth="1.75" aria-hidden><path d="M2 9l10-5 10 5-10 5z" /><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" /></svg>I want to learn</button>
        <button type="button" role="radio" aria-checked={role === "teach"} className="role" onClick={() => setRole("teach")}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1F8F7A" strokeWidth="1.75" aria-hidden><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></svg>I want to teach</button>
      </div>
      <form onSubmit={(e) => {
        e.preventDefault();
        const full = String(new FormData(e.currentTarget).get("name") ?? "").trim();
        try { sessionStorage.setItem("cg-name", full.split(/\s+/)[0]); sessionStorage.setItem("cg-full", full); } catch {}
        navigate(c.to);
      }}>
        <label className="pfld">Full name<input type="text" name="name" required autoComplete="name" placeholder="Your name" /></label>
        <label className="pfld">Email or phone<input type="text" required autoComplete="username" placeholder="you@example.com or 03XX…" /></label>
        <label className="pfld">Password<input type="password" required minLength={8} autoComplete="new-password" placeholder="At least 8 characters" /></label>
        <label className="agree"><input type="checkbox" required />I agree to the <a href="/terms.html">Terms</a> and <a href="/privacy.html">Privacy Policy</a></label>
        <button className="pg-btn btn-coral full" type="submit">{c.cta}</button>
      </form>
    </AuthShell>
  );
}
