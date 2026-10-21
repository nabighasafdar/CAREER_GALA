import { DashShell, Eyebrow, firstName } from "./Shell";

const Arrow = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
const stop = (e: React.MouseEvent) => e.preventDefault();

export default function StudentDashboard() {
  return (
    <DashShell nav={["Home", "My lessons", "Messages", "Payments", "Profile"]} foot={<a className="dash-foot" href="https://wa.me/923101178268">WhatsApp support</a>}>
      <div className="dash-top">
        <div><Eyebrow>Student</Eyebrow><h1>Hi <span className="serif">{firstName("Ali")}</span></h1></div>
        <a className="pg-btn btn-coral" href="/get-started">Find a Tutor</a>
      </div>

      <section className="panel" style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", marginBottom: 20 }}>
        <span aria-hidden style={{ width: 64, height: 64, flex: "none", borderRadius: "50%", background: "#1F8F7A", display: "grid", placeItems: "center", fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 20, color: "#fff" }}>AK</span>
        <div style={{ flex: "1 1 260px" }}>
          <div className="lbl">Next lesson · Today, 6:00 pm</div>
          <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 24, marginTop: 6 }}>O Level Maths with Ayesha K.</div>
        </div>
        <a className="pg-btn btn-coral" href="#main" onClick={stop}>Join lesson <Arrow /></a>
      </section>

      <div className="grid2">
        <section className="panel">
          <h2>Coming up</h2>
          <div className="rowline"><div><b>IELTS Speaking</b><small>Hamza R.</small></div><small style={{ textAlign: "right" }}>Thu<br />5:00 pm</small></div>
          <div className="rowline"><div><b>O Level Maths</b><small>Ayesha K.</small></div><small style={{ textAlign: "right" }}>Sat<br />6:00 pm</small></div>
          <a className="pmore" href="#main" onClick={stop}>See all lessons →</a>
        </section>
        <section className="panel" style={{ background: "#E8F5F0", border: "1px solid rgba(60,194,162,.25)", display: "flex", flexDirection: "column", gap: 14, alignItems: "start" }}>
          <div className="lbl">Career roadmap</div>
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <svg width="72" height="72" viewBox="0 0 72 72" role="img" aria-label="62 percent complete"><circle cx="36" cy="36" r="30" fill="none" stroke="rgba(16,32,39,.12)" strokeWidth="6" /><circle cx="36" cy="36" r="30" fill="none" stroke="#1F8F7A" strokeWidth="6" strokeLinecap="round" strokeDasharray="117 189" transform="rotate(-90 36 36)" /></svg>
            <div><div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 30 }}>62%</div><div className="mut">Next session: Sat, 2:00 pm</div></div>
          </div>
          <a className="pmore" style={{ marginTop: 4 }} href="#main" onClick={stop}>View roadmap →</a>
        </section>
      </div>
    </DashShell>
  );
}
