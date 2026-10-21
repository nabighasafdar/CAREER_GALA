import { DashShell, Eyebrow, firstName } from "./Shell";

const stop = (e: React.MouseEvent) => e.preventDefault();
const ico = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "#102027", strokeWidth: 1.75, "aria-hidden": true } as const;
const Stat = ({ v, l, children }: { v: string; l: string; children: React.ReactNode }) => (
  <div className="pstat"><span className="pring"><svg {...ico}>{children}</svg></span><div><b>{v}</b><span className="mut" style={{ marginTop: 4 }}>{l}</span></div></div>
);
const Req = ({ n, d }: { n: string; d: string }) => (
  <div className="req"><div><b>{n}</b><span className="mut">{d}</span></div>
    <div style={{ display: "flex", gap: 8 }}>
      <button type="button" className="pg-ghost">Decline</button>
      <button type="button" className="btn-coral">Accept</button>
    </div></div>
);

export default function TutorDashboard() {
  const pending = new URLSearchParams(location.search).get("status") === "pending";
  return (
    <DashShell nav={["Home", "Requests", "Calendar", "Earnings", "My profile"]} foot={<a className="dash-foot" href="/tutor/profile">View public profile</a>}>
      <div className="dash-top" style={{ marginBottom: 24 }}>
        <div><Eyebrow>Tutor</Eyebrow><h1>Hi <span className="serif">{firstName("Ayesha")}</span></h1></div>
        <a className="pg-btn pg-ghost" href="/tutor/onboarding">Edit profile</a>
      </div>

      {pending ? (
        <div className="banner wait" role="status"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E5482A" strokeWidth="2" aria-hidden><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>Pending verification — you'll appear in search once approved.</div>
      ) : (
        <div className="banner ok" role="status"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F8F7A" strokeWidth="2.4" aria-hidden><path d="M20 6L9 17l-5-5" /></svg>Your profile is live — students can find and book you.</div>
      )}

      <div className="pstats">
        <Stat v="Rs [48,600]" l="This month"><path d="M12 2v20M17 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></Stat>
        <Stat v="11" l="Lessons this week"><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" /></Stat>
        <Stat v="4.9" l="Rating"><path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z" /></Stat>
      </div>

      <div className="grid2">
        <section className="panel">
          <h2 style={{ marginBottom: 16 }}>New requests</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Req n="Mahnoor I. · Trial" d="O Level Maths · Sat 4 pm" />
            <Req n="Daniyal S. · Weekly" d="Add Maths · Mon & Wed 7 pm" />
          </div>
        </section>
        <section className="panel">
          <h2 style={{ marginBottom: 16 }}>Today</h2>
          <div className="ptl">
            <div><b>3:00</b> &nbsp;Usman · Add Maths</div>
            <div><b>5:00</b> &nbsp;Hiba · Maths</div>
            <div><b>6:00</b> &nbsp;Ali · Maths</div>
          </div>
          <a className="pmore" style={{ marginTop: 12 }} href="#main" onClick={stop}>Open calendar →</a>
        </section>
      </div>
    </DashShell>
  );
}
