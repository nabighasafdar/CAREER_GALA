import { Brand, Check } from "./Shell";
import { TUTOR_KEY, allLangs, allLevels, allSubjects } from "./TutorOnboarding";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const star = <span style={{ color: "#E5482A" }}>★</span>;

type Saved = { name?: string; city?: string; otherCity?: string; langs?: string[]; otherLangs?: unknown; subjects?: string[]; otherSubjects?: unknown; levels?: string[]; otherLevels?: unknown; mode?: string; degrees?: { degree: string; institution: string; year: string }[]; experience?: string; rates?: Record<string, string>; slots?: string[]; bio?: string; photo?: string; videoLink?: string };
const load = (): Saved => { try { return JSON.parse(sessionStorage.getItem(TUTOR_KEY) || "{}"); } catch { return {}; } };
const ini = (n: string) => n.split(/\s+/).map((s) => s[0]).join("").slice(0, 2).toUpperCase();

export default function TutorProfile() {
  const s = load();
  const own = !!s.name;
  const name = s.name || "Ayesha Khan";
  const subjects = own ? allSubjects({ subjects: s.subjects ?? [], otherSubjects: s.otherSubjects }) : ["O Level Maths", "Additional Maths", "FSc Maths", "Matric Maths", "IGCSE Maths"];
  const days = s.slots ? DAYS.filter((x) => s.slots!.some((k) => k.startsWith(`${x}-`))) : ["Mon", "Wed", "Fri", "Sat"];
  const rates = Object.values(s.rates ?? {}).map(Number).filter((n) => n > 0);
  const rate = rates.length ? Math.min(...rates) : 0;
  const deg = s.degrees?.find((g) => g.degree.trim());
  const city = s.city === "Other" ? s.otherCity : s.city;
  const where = own ? (s.mode === "Online" || !city ? "Online" : s.mode === "Home tuition" ? `Home in ${city}` : `Online · Home in ${city}`) : "Online · Home in Lahore";
  const levels = allLevels({ levels: s.levels ?? [], otherLevels: s.otherLevels });
  const langs = allLangs({ langs: s.langs ?? [], otherLangs: s.otherLangs });
  return (
    <div className="pg tp">
      <header className="tp-hdr">
        <Brand />
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a href="/" style={{ fontWeight: 600, fontSize: 15, color: "#55627A" }}>← Back to home</a>
          <a className="pg-btn pg-ghost" style={{ fontSize: 15, minHeight: 44 }} href="/login">Log in</a>
        </div>
      </header>

      <main id="main" className="tp-body">
        <div className="tp-main">
          <section className="box" style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center" }}>
            {s.photo
              ? <img src={s.photo} alt={name} style={{ width: 116, height: 116, borderRadius: "50%", objectFit: "cover", boxShadow: "0 0 0 6px rgba(60,194,162,.15)" }} />
              : <span aria-hidden style={{ width: 116, height: 116, flex: "none", borderRadius: "50%", background: "linear-gradient(135deg,#3CC2A2,#1F8F7A)", display: "grid", placeItems: "center", fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 36, color: "#fff", boxShadow: "0 0 0 6px rgba(60,194,162,.15)" }}>{ini(name)}</span>}
            <div style={{ flex: "1 1 320px", minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <h1 style={{ fontWeight: 800, fontSize: 36, letterSpacing: "-.03em" }}>{name}</h1>
                <span style={{ display: "inline-flex", gap: 6, alignItems: "center", fontSize: 13, fontWeight: 600, color: "#157A67", background: "rgba(60,194,162,.14)", padding: "5px 12px", borderRadius: 999 }}>{own ? "Pending verification" : <><Check />Verified</>}</span>
              </div>
              <p style={{ margin: "6px 0 14px", fontSize: 18, color: "#33434D" }}>{own ? levels.join(" & ") + " tutor" : "O Level & FSc Maths tutor"}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {!own && <span className="tag">{star} 4.9 · 48 reviews</span>}
                <span className="tag">{own ? (s.experience ? `${s.experience} teaching` : "New tutor") : "6 years teaching"}</span>
                <span className="tag">{where}</span>
                {(langs.length > 0 || !own) && <span className="tag">{langs.join(", ") || "English, Urdu"}</span>}
              </div>
            </div>
          </section>

          <section className="box" style={{ display: "flex", flexWrap: "wrap", gap: 28 }}>
            <div style={{ flex: "1 1 280px", aspectRatio: "16/10", borderRadius: 20, background: "linear-gradient(135deg,#E1F3EE,#FBF8F3)", border: "1px solid rgba(16,32,39,.08)", display: "grid", placeItems: "center", position: "relative" }}>
              <span aria-hidden style={{ width: 68, height: 68, borderRadius: "50%", background: "#FF6342", display: "grid", placeItems: "center", boxShadow: "0 10px 30px -8px rgba(255,99,66,.7)" }}><svg width="24" height="24" viewBox="0 0 24 24" fill="#102027"><path d="M8 5v14l11-7z" /></svg></span>
              <span style={{ position: "absolute", left: 16, bottom: 14, fontSize: 13, color: "#55627A" }}>Intro video</span>
            </div>
            <div style={{ flex: "1 1 300px" }}>
              <h2 style={{ fontWeight: 700, fontSize: 24, margin: "0 0 12px", letterSpacing: 0 }}>About <span className="serif">me</span></h2>
              <p style={{ color: "#33434D", lineHeight: 1.7 }}>{s.bio || "[Tutor's own bio — how they teach, who they work best with, and what students can expect from the first lesson.]"}</p>
            </div>
          </section>

          <section className="box">
            <h2>Subjects &amp; <span className="serif">levels</span></h2>
            <div className="chips">{subjects.map((x) => <span key={x} className="subj">{x}</span>)}</div>
            {own && levels.length > 0 && <div className="chips" style={{ marginTop: 12 }}>{levels.map((x) => <span key={x} className="tag">{x}</span>)}</div>}
          </section>

          <section className="box">
            <div className="eyebrow"><i />Portfolio</div>
            <h2 style={{ marginTop: 10 }}>Results &amp; <span className="serif">work</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 14, marginBottom: 20 }}>
              <div className="kpi"><b>[12]</b><span>Students scored A* in O Level Maths</span></div>
              <div className="kpi"><b>[+22%]</b><span>Average score improvement</span></div>
              <div className="kpi"><b>[300+]</b><span>Lessons taught on Career Gala</span></div>
            </div>
            <div className="work">
              <a href="#main" onClick={(e) => e.preventDefault()}><span className="th" style={{ background: "linear-gradient(135deg,#1C9AB0,#FFFFFF)" }}><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" aria-hidden><path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z" /><path d="M14 3v6h6M8 13h8M8 17h5" /></svg></span><span className="cap"><b>Quadratics revision notes</b><small>PDF · 6 pages</small></span></a>
              <a href="#main" onClick={(e) => e.preventDefault()}><span className="th" style={{ background: "linear-gradient(135deg,#FF6342,#8E3A2C)" }}><svg width="40" height="40" viewBox="0 0 24 24" fill="#fff" aria-hidden><path d="M8 5v14l11-7z" /></svg></span><span className="cap"><b>Past paper walkthrough</b><small>Video · 12 min</small></span></a>
              <a href="#main" onClick={(e) => e.preventDefault()}><span className="th" style={{ background: "linear-gradient(135deg,#3CC2A2,#E1F3EE)" }}><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" aria-hidden><path d="M3 20l6-6 4 4 8-8M15 10h6v6" /></svg></span><span className="cap"><b>Student progress: C → A*</b><small>Case study · shared with consent</small></span></a>
            </div>
          </section>

          <section className="box">
            <h2>Qualifications &amp; <span className="serif">experience</span></h2>
            <div className="ptl">
              <div><b style={{ color: "#102027" }}>{deg ? `${deg.degree}${deg.institution ? ` — ${deg.institution}` : ""}${deg.year ? `, ${deg.year}` : ""}` : "[BS Mathematics — University name]"}</b><span className="mut">{own ? "Document submitted for verification" : "[Year] · Document verified"}</span></div>
              {!own && <><div><b style={{ color: "#102027" }}>[Maths teacher — School name]</b><span className="mut">[2019 – present]</span></div><div><b style={{ color: "#102027" }}>[Certification or training]</b><span className="mut">[Issuer · Year]</span></div></>}
            </div>
          </section>

          <section className="box">
            <h2>Student <span className="serif">reviews</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 14 }}>
              {own ? <p className="mut">No reviews yet. They'll appear here after your first lessons.</p> : <>
                <figure className="rev"><div className="st" aria-label="5 out of 5 stars">★★★★★</div><blockquote>“[Real review from a student after a lesson.]”</blockquote><figcaption>[Student name] · O Level</figcaption></figure>
                <figure className="rev"><div className="st" aria-label="5 out of 5 stars">★★★★★</div><blockquote>“[Real review from a parent.]”</blockquote><figcaption>[Parent name] · Matric</figcaption></figure>
              </>}
            </div>
          </section>
        </div>

        <aside className="tp-book">
          <div><span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 34 }}>Rs {rate ? rate.toLocaleString() : "[1,800]"}</span><span className="mut" style={{ display: "inline" }}> / hour</span></div>
          <div className="li"><Check />Free 30-min demo lesson</div>
          {!own && <div className="li"><Check />Usually responds within 1 hour</div>}
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>Available this week</div>
            <div className="wk">{DAYS.map((x) => <span key={x} className={days.includes(x) ? "on" : ""}>{x}</span>)}</div>
          </div>
          <a className="pg-btn btn-coral" href="/get-started">Book trial lesson</a>
          <a className="pg-btn pg-ghost" style={{ fontSize: 15 }} href="https://wa.me/923101178268">Message tutor</a>
        </aside>
      </main>
    </div>
  );
}
