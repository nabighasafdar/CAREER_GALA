import { useState, type FormEvent } from "react";
import { AuthShell, Check } from "./Shell";
import { navigate } from "../lib/router";
import { isAdminEmail, loginAdmin, loginStudent } from "../lib/auth";
import { findStudent } from "../lib/store";

const Google = () => (<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden><path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 01-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z" fill="#4285F4" /><path d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0012 22z" fill="#34A853" /><path d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 000 9.2L6.4 14z" fill="#FBBC05" /><path d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 003.1 7.4L6.4 10C7.2 7.7 9.4 5.9 12 5.9z" fill="#EA4335" /></svg>);

export default function Login() {
  const [error, setError] = useState("");
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")), password = String(f.get("password"));
    if (loginAdmin(email, password)) return navigate("/admin");
    if (isAdminEmail(email)) return setError("Wrong password.");
    const student = findStudent(email);
    if (!student) return setError("No student account found. Check your details or create an account.");
    loginStudent(student.id);
    navigate("/student");
  };
  return (
    <AuthShell side={<>
      <h2>Welcome <span className="serif">back</span>.</h2>
      <ul>{["Your lessons and messages", "Your career roadmap", "Payments and receipts"].map((t) => <li key={t}><Check />{t}</li>)}</ul>
    </>}>
      <h1>Log in</h1>
      <p className="auth-sub">New here? <a href="/signup">Create an account</a></p>
      <form onSubmit={submit} onChange={() => setError("")}>
        <label className="pfld">Email or phone<input name="email" type="text" required autoComplete="username" placeholder="you@example.com or 03XX…" /></label>
        <label className="pfld"><span className="row">Password <a href="#main" onClick={(e) => e.preventDefault()}>Forgot?</a></span><input name="password" type="password" required autoComplete="current-password" placeholder="••••••••" /></label>
        {error && <span className="errmsg block" role="alert">{error}</span>}
        <button className="pg-btn btn-coral full" type="submit">Log in</button>
      </form>
      <div className="or"><i />or<i /></div>
      <button type="button" className="pg-btn pg-ghost full" style={{ marginTop: 0 }}><Google />Continue with Google</button>
    </AuthShell>
  );
}
