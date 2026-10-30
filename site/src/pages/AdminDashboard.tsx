import { useEffect, useState } from "react";
import { DashShell, Eyebrow, Stat } from "./Shell";
import { Field, Pick } from "./ui";
import { assignTutor, resetDemoData, setRequestStatus, setTutorStatus, tutorById, useDb, type RequestStatus, type TutorRequest } from "../lib/store";
import { bestPick, budgetCap, rankTutors } from "../lib/matching";
import { isAdmin, logoutAdmin } from "../lib/auth";
import { navigate } from "../lib/router";

const rs = (n: number) => `Rs ${n.toLocaleString()}`;
const when = (t: number) => new Date(t).toLocaleString(undefined, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
const FILTERS: { k: RequestStatus | "all"; l: string }[] = [{ k: "open", l: "Open" }, { k: "assigned", l: "Assigned" }, { k: "cancelled", l: "Cancelled" }, { k: "all", l: "All" }];

/** Sends anyone not logged in as admin to /login. See lib/auth.ts for what this does and doesn't protect. */
export default function AdminDashboard() {
  const allowed = isAdmin();
  useEffect(() => { if (!allowed) navigate("/login", true); }, [allowed]);
  return allowed ? <Admin /> : null;
}

function Admin() {
  const db = useDb();
  const [view, setView] = useState("Requests");
  const [filter, setFilter] = useState<RequestStatus | "all">("open");
  const [selId, setSelId] = useState<string>();
  /** Set from the Students tab to show one student's requests. */
  const [who, setWho] = useState<string>();

  const assigned = db.requests.filter((r) => r.status === "assigned");
  const margins = assigned.map((r) => (r.price ?? 0) - (r.tutorRate ?? 0));
  const totalMargin = margins.reduce((a, b) => a + b, 0);
  const pendingTutors = db.tutors.filter((t) => t.status === "pending").length;

  const pool = who ? db.requests.filter((r) => r.studentId === who) : db.requests;
  const list = pool.filter((r) => filter === "all" || r.status === filter);
  const sel = list.find((r) => r.id === selId) ?? list[0];
  const showStudent = (id: string) => { setWho(id); setFilter("all"); setSelId(undefined); setView("Requests"); };

  return (
    <DashShell nav={["Requests", "Tutors", "Students"]} current={view} onNav={setView}
      foot={<div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
        <button type="button" className="dash-foot" onClick={() => { if (confirm("Replace all tutors, students and requests with fresh sample data?")) resetDemoData(); }}>Reset demo data</button>
        <button type="button" className="dash-foot" onClick={() => { logoutAdmin(); navigate("/login"); }}>Log out</button>
      </div>}>
      <div className="dash-top" style={{ marginBottom: 24 }}>
        <div><Eyebrow>Admin</Eyebrow><h1>{view === "Requests" ? <>Match &amp; <span className="serif">assign</span></> : view === "Tutors" ? <>Tutor <span className="serif">database</span></> : <>Student <span className="serif">accounts</span></>}</h1></div>
      </div>

      <div className="pstats">
        <Stat v={String(db.requests.filter((r) => r.status === "open").length)} l="Open requests"><path d="M4 4h16v12H5.2L4 17.2z" /><path d="M8 9h8M8 12h5" /></Stat>
        <Stat v={String(assigned.length)} l="Assigned"><path d="M20 6L9 17l-5-5" /></Stat>
        <Stat v={assigned.length ? rs(Math.round(totalMargin / assigned.length)) : "–"} l="Avg margin / hour"><path d="M12 2v20M17 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></Stat>
        <Stat v={rs(totalMargin)} l="Margin / hour, all active"><path d="M3 17l6-6 4 4 8-8" /><path d="M14 7h7v7" /></Stat>
      </div>

      {view === "Requests" ? (
        <>
          <div className="chips" role="radiogroup" aria-label="Filter requests" style={{ marginBottom: 16 }}>
            {FILTERS.map((f) => <Pick key={f.k} variant="pill" role="radio" on={filter === f.k} onClick={() => setFilter(f.k)}>{f.l} ({f.k === "all" ? pool.length : pool.filter((r) => r.status === f.k).length})</Pick>)}
            {who && <button type="button" className="mbtn" onClick={() => setWho(undefined)}>{db.students.find((s) => s.id === who)?.name ?? "Student"} ×</button>}
          </div>
          {list.length === 0 ? (
            <section className="panel"><h2>No {filter === "all" ? "" : filter} requests</h2><p className="mut">When a student sends a request from <a href="/get-started">Find a Tutor</a>, it lands here, one per subject.</p></section>
          ) : (
            <div className="adm-grid">
              <section className="panel adm-list" aria-label="Requests">
                {list.map((r) => (
                  <button key={r.id} type="button" className="adm-item" aria-pressed={r.id === sel?.id} onClick={() => setSelId(r.id)}>
                    <b>{r.subject} · {r.level}</b>
                    <span className="mut">{r.studentName} · {r.mode === "At home" ? `Home, ${r.city}` : "Online"}</span>
                    <span className="mut">{r.budget} · {when(r.createdAt)}</span>
                    {r.status !== "open" && <span className={`tag ${r.status}`}>{r.status}</span>}
                  </button>
                ))}
              </section>
              {sel && <RequestDetail key={sel.id} r={sel} />}
            </div>
          )}
        </>
      ) : view === "Tutors" ? (
        <TutorTable pendingTutors={pendingTutors} />
      ) : (
        <StudentTable onView={showStudent} />
      )}
    </DashShell>
  );
}

function RequestDetail({ r }: { r: TutorRequest }) {
  const db = useDb();
  const cap = budgetCap(r.budget);
  const [priceText, setPriceText] = useState(cap ? String(cap) : "");
  const price = Number(priceText) > 0 ? Number(priceText) : null;
  const { candidates, excluded } = rankTutors(r, db.tutors, db.requests, price);
  const best = bestPick(candidates);
  const tutor = tutorById(r.tutorId);

  return (
    <section className="panel" aria-label="Request detail">
      <div className="lbl">Request · {when(r.createdAt)}</div>
      <h2 style={{ fontSize: 26, margin: "8px 0 4px" }}>{r.subject} <span className="serif">for</span> {r.studentName}</h2>
      <p className="mut">{r.level} · {r.mode === "At home" ? `At home in ${r.city}${r.area ? `, ${r.area}` : ""}` : `Online, ${r.city}`} · {r.times.join(", ")} · {r.frequency} · starts {r.start.toLowerCase()}</p>
      <p className="mut">Budget: <b style={{ color: "#102027" }}>{r.budget}</b>{r.gender !== "No preference" && <> · Wants a {r.gender.toLowerCase()}</>}</p>
      {(r.goal || r.message) && <p className="mut" style={{ marginTop: 6 }}>“{[r.goal, r.message].filter(Boolean).join(" — ")}”</p>}
      <p className="mut" style={{ marginTop: 6 }}>Contact: {r.name}{r.name !== r.studentName && " (parent)"} · <a href={`https://wa.me/${r.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">{r.phone}</a>{r.email && <> · {r.email}</>}</p>

      {r.status === "assigned" && r.price != null && r.tutorRate != null ? (
        <div className="callout adm-done">
          <div><div className="lbl">Assigned</div><b style={{ fontSize: 20 }}>{tutor?.name ?? "Removed tutor"}</b><span className="mut">Student pays {rs(r.price)}/hr · tutor gets {rs(r.tutorRate)}/hr</span></div>
          <div className={`profit ${r.price - r.tutorRate < 0 ? "neg" : ""}`}>{rs(r.price - r.tutorRate)}<small>margin / hr</small></div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" className="pg-btn pg-ghost" onClick={() => setRequestStatus(r.id, "open")}>Unassign</button>
            <button type="button" className="pg-btn pg-ghost" onClick={() => setRequestStatus(r.id, "cancelled")}>Cancel request</button>
          </div>
        </div>
      ) : r.status === "cancelled" ? (
        <div className="callout adm-done"><div><b>Cancelled</b><span className="mut">This request is closed.</span></div><button type="button" className="pg-btn pg-ghost" onClick={() => setRequestStatus(r.id, "open")}>Reopen</button></div>
      ) : (
        <>
          <div className="adm-price">
            <Field label="Student pays per hour (Rs)" required help={cap ? `Defaults to the top of their budget (${rs(cap)}).` : "They didn't give a ceiling. Set what you'll charge to see the margin."}>
              <input type="number" min={0} inputMode="numeric" value={priceText} placeholder="e.g. 2000" onChange={(e) => setPriceText(e.target.value)} />
            </Field>
            <button type="button" className="pg-btn pg-ghost" onClick={() => setRequestStatus(r.id, "cancelled")}>Cancel request</button>
          </div>

          <h3 className="adm-h">Tutors who can take this <span className="mut" style={{ display: "inline", fontWeight: 400 }}>· cheapest first = highest margin</span></h3>
          {candidates.length === 0 ? (
            <p className="mut">No approved tutor teaches {r.subject}{r.mode === "At home" ? ` at home in ${r.city}` : " online"}. Approve or recruit one in Tutors.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {candidates.map((c) => {
                const isBest = c === best;
                return (
                  <div key={c.tutor.id} className={`cand${isBest ? " best" : ""}`}>
                    <div style={{ flex: "1 1 220px", minWidth: 0 }}>
                      <b>{c.tutor.name}</b>{isBest && <span className="tag best">Best margin</span>}{c.tutor.sample && <span className="tag">sample</span>}
                      <span className="mut">{c.subject} at {rs(c.rate)}/hr · {c.tutor.city} · {c.tutor.mode} · {c.tutor.experience} · {c.activeStudents} active</span>
                      {c.warnings.map((w) => <span key={w} className="warn">{w}</span>)}
                    </div>
                    <div className={`profit ${c.profit != null && c.profit < 0 ? "neg" : ""}`}>{c.profit == null ? "–" : rs(c.profit)}<small>{c.profit != null && price ? `margin / hr · ${Math.round((c.profit / price) * 100)}%` : "margin / hr"}</small></div>
                    <button type="button" className={`pg-btn ${isBest ? "btn-coral" : "pg-ghost"}`} disabled={price == null} title={price == null ? "Set the student's price first" : undefined}
                      onClick={() => { if (price != null && (c.profit! >= 0 || confirm(`This loses ${rs(-c.profit!)} per hour. Assign anyway?`))) assignTutor(r.id, c.tutor.id, price, c.rate); }}>Assign</button>
                  </div>
                );
              })}
            </div>
          )}
          {excluded.length > 0 && (
            <details className="adm-excl">
              <summary>{excluded.length} more teach {r.subject} but can't take this request</summary>
              <ul>{excluded.map((x) => <li key={x.tutor.id}><b>{x.tutor.name}</b> · {rs(x.rate)}/hr · {x.reason}</li>)}</ul>
            </details>
          )}
        </>
      )}
    </section>
  );
}

function StudentTable({ onView }: { onView: (id: string) => void }) {
  const db = useDb();
  return (
    <section className="panel">
      <h2>{db.students.length} students</h2>
      <p className="mut" style={{ marginBottom: 16 }}>Accounts made through sign up. Requests sent from the public form without an account only appear under Requests.</p>
      <div className="tbl-wrap">
        <table className="tbl">
          <thead><tr><th>Student</th><th>Contact</th><th>Requests</th><th>Margin / hr</th><th /></tr></thead>
          <tbody>
            {db.students.map((s) => {
              const reqs = db.requests.filter((r) => r.studentId === s.id);
              const matched = reqs.filter((r) => r.status === "assigned");
              return (
                <tr key={s.id}>
                  <td><b>{s.name}</b>{s.sample && <span className="tag">sample</span>}<span className="mut">{[s.level, s.city].filter(Boolean).join(" · ") || "No request yet"}</span></td>
                  <td><span className="mut">{s.phone}</span><span className="mut">{s.email}</span></td>
                  <td>{reqs.filter((r) => r.status === "open").length} open<span className="mut">{matched.length} matched</span></td>
                  <td>{rs(matched.reduce((a, r) => a + (r.price ?? 0) - (r.tutorRate ?? 0), 0))}</td>
                  <td><button type="button" className="mbtn" disabled={!reqs.length} onClick={() => onView(s.id)}>View requests</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TutorTable({ pendingTutors }: { pendingTutors: number }) {
  const db = useDb();
  const active = (id: string) => db.requests.filter((r) => r.status === "assigned" && r.tutorId === id).length;
  return (
    <section className="panel">
      <h2>{db.tutors.length} tutors{pendingTutors > 0 && <span className="tag pending" style={{ marginLeft: 10 }}>{pendingTutors} awaiting approval</span>}</h2>
      <p className="mut" style={{ marginBottom: 16 }}>Only approved tutors are offered as matches. New tutors arrive here as pending when they finish <a href="/tutor/onboarding">onboarding</a>.</p>
      <div className="tbl-wrap">
        <table className="tbl">
          <thead><tr><th>Tutor</th><th>Rates / hr</th><th>Teaches</th><th>Active</th><th>Status</th></tr></thead>
          <tbody>
            {db.tutors.map((t) => (
              <tr key={t.id}>
                <td><b>{t.name}</b>{t.sample && <span className="tag">sample</span>}<span className="mut">{t.gender} · {t.city} · {t.phone}</span></td>
                <td>{Object.entries(t.rates).map(([s, r]) => <div key={s}>{s} <b>{rs(r)}</b></div>)}</td>
                <td><span className="mut">{t.mode}</span><span className="mut">{t.levels.join(", ")}</span></td>
                <td>{active(t.id)}</td>
                <td>
                  <span className={`tag ${t.status}`}>{t.status}</span>
                  <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                    {t.status !== "approved" && <button type="button" className="mbtn ok" onClick={() => setTutorStatus(t.id, "approved")}>Approve</button>}
                    {t.status !== "rejected" && <button type="button" className="mbtn" onClick={() => setTutorStatus(t.id, "rejected")}>{t.status === "approved" ? "Suspend" : "Reject"}</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
