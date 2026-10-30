import { useEffect, useState } from "react";
import { DashShell, Eyebrow, Stat } from "./Shell";
import RequestForm from "./RequestForm";
import { setRequestStatus, tutorById, useDb, type RequestStatus, type Student, type TutorRequest } from "../lib/store";
import { logoutStudent, studentId } from "../lib/auth";
import { navigate } from "../lib/router";
import { site } from "../content/site";

const rs = (n: number) => `Rs ${n.toLocaleString()}`;
const LABEL: Record<RequestStatus, { tag: string; cls: string }> = {
  open: { tag: "In review", cls: "pending" }, assigned: { tag: "Matched", cls: "assigned" }, cancelled: { tag: "Cancelled", cls: "cancelled" },
};

/** Shows the price the student pays, never the tutor's rate. */
function RequestCard({ r }: { r: TutorRequest }) {
  const t = tutorById(r.tutorId);
  const { tag, cls } = LABEL[r.status];
  return (
    <article className="rq-card">
      <div className="rq-head">
        <div>
          <b>{r.subject} · {r.level}</b>
          <span className="mut">{r.studentName} · {r.mode === "At home" ? `At home in ${r.city}` : "Online"} · {r.times.join(", ")}</span>
          <span className="mut">Budget: {r.budget} · How often: {r.frequency}</span>
        </div>
        <span className={`tag ${cls}`}>{tag}</span>
      </div>
      {r.status === "assigned" && t && (
        <div className="callout rq-match">
          <div><div className="lbl">Your tutor</div><b style={{ fontSize: 18 }}>{t.name}</b><span className="mut">{t.experience} experience</span></div>
          {r.price != null && <div className="profit">{rs(r.price)}<small>per hour</small></div>}
        </div>
      )}
      {r.status === "open" && (
        <div className="rq-foot">
          <span className="mut">We're finding your tutor and will message you on WhatsApp.</span>
          <button type="button" className="mbtn" onClick={() => { if (confirm(`Cancel your ${r.subject} request?`)) setRequestStatus(r.id, "cancelled"); }}>Cancel request</button>
        </div>
      )}
    </article>
  );
}

/** Sends anyone without a student account to /login. */
export default function StudentDashboard() {
  const db = useDb();
  const id = studentId();
  const me = db.students.find((s) => s.id === id);
  useEffect(() => { if (!me) navigate("/login", true); }, [me]);
  return me ? <Dashboard me={me} requests={db.requests.filter((r) => r.studentId === me.id)} /> : null;
}

function Dashboard({ me, requests }: { me: Student; requests: TutorRequest[] }) {
  const [view, setView] = useState("Home");
  const [sent, setSent] = useState(0);
  const go = (v: string) => { setView(v); setSent(0); window.scrollTo(0, 0); };

  const open = requests.filter((r) => r.status === "open");
  const matched = requests.filter((r) => r.status === "assigned");
  const active = [...matched, ...open];
  const NewRequest = <button type="button" className="pg-btn btn-coral" onClick={() => go("New request")}>Request a tutor</button>;

  return (
    <DashShell nav={["Home", "My requests", "New request"]} current={view} onNav={go}
      foot={<div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
        <a className="dash-foot" href={site.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp support</a>
        <button type="button" className="dash-foot" onClick={() => { logoutStudent(); navigate("/login"); }}>Log out</button>
      </div>}>
      <div className="dash-top" style={{ marginBottom: 24 }}>
        <div><Eyebrow>Student</Eyebrow><h1>{view === "Home" ? <>Hi <span className="serif">{me.name.split(/\s+/)[0]}</span></> : view === "My requests" ? <>My <span className="serif">requests</span></> : <>Request a <span className="serif">tutor</span></>}</h1></div>
        {view !== "New request" && NewRequest}
      </div>

      {sent > 0 && <div className="banner ok" role="status">{sent > 1 ? `${sent} requests sent.` : "Request sent."} We'll message you on WhatsApp within 24 hours.</div>}

      {view === "New request" ? (
        <RequestForm me={me} openSubjects={active.map((r) => r.subject)} onCancel={() => go("Home")} onDone={(n) => { go("My requests"); setSent(n); }} />
      ) : view === "My requests" ? (
        requests.length ? <section className="panel rq-list">{requests.map((r) => <RequestCard key={r.id} r={r} />)}</section> : <Empty action={NewRequest} />
      ) : (
        <>
          <div className="pstats">
            <Stat v={String(open.length)} l="In review"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Stat>
            <Stat v={String(matched.length)} l="Tutors matched"><path d="M20 6L9 17l-5-5" /></Stat>
            <Stat v={matched.length ? rs(matched.reduce((a, r) => a + (r.price ?? 0), 0)) : "–"} l="Total per hour"><path d="M12 2v20M17 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></Stat>
          </div>
          {active.length ? (
            <section className="panel rq-list">
              <h2>Your tutors and requests</h2>
              {active.slice(0, 3).map((r) => <RequestCard key={r.id} r={r} />)}
              {requests.length > 3 && <button type="button" className="pmore" style={{ alignSelf: "start" }} onClick={() => go("My requests")}>See all {requests.length} requests →</button>}
            </section>
          ) : <Empty action={NewRequest} />}
        </>
      )}
    </DashShell>
  );
}

const Empty = ({ action }: { action: React.ReactNode }) => (
  <section className="panel rq-empty">
    <h2>Find your tutor</h2>
    <p className="mut">Tell us the subject, level and times that suit you. We'll match you with a tutor and message you on WhatsApp.</p>
    {action}
  </section>
);
