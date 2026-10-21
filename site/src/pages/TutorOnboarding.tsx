import { useEffect, useRef, useState, type ReactNode } from "react";
import { Brand, Eyebrow } from "./Shell";
import { CITIES, EMAIL, Field, Group, PHONE, Pick, TagInput, Tick, asList, toggle, type Errors } from "./ui";
import { navigate } from "../lib/router";
import { submitLead } from "../lib/submit";

export const TUTOR_KEY = "cg-tutor";
const STEPS = ["Personal", "Teaching profile", "Qualifications", "Identity", "Intro video", "Availability & rates", "Agreement"];
const LANGS = ["English", "Urdu", "Punjabi", "Sindhi", "Pashto", "Arabic", "Other"];
const SUBJECTS = ["Maths", "Physics", "Chemistry", "Biology", "English", "Urdu", "Computer", "Accounting", "Other"];
const LEVELS = ["Matric", "FSc", "O Level", "A Level", "IGCSE", "IELTS", "MDCAT", "SAT", "University", "Other"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIMES = ["Morning", "Afternoon", "Evening"];
const EXP = ["Less than 1 year", "1–3 years", "3–5 years", "5–10 years", "10+ years"];
const STYLES = ["Concepts first, then practice", "Exam & past-paper focused", "Interactive & conversational", "Structured with weekly tests"];
const MODES = ["Online", "Home tuition", "Both"];
const POLICIES: [string, string][] = [["Terms of Use", ""], ["Tutor Agreement", " (payments, platform fee, cancellations)"], ["Code of Conduct", ""], ["Child Safety Policy", ""]];

const defaults = {
  photo: "", name: "", email: "", phone: "", gender: "Female", country: "Pakistan", city: "", otherCity: "", timezone: "Pakistan (GMT+5)",
  langs: ["English", "Urdu"], otherLangs: [] as string[],
  subjects: ["Maths", "Physics"], otherSubjects: [] as string[], levels: ["O Level", "FSc"], otherLevels: [] as string[], experience: EXP[0], style: STYLES[0], bio: "",
  degrees: [{ degree: "", institution: "", year: "" }], certs: [{ name: "", issuer: "", year: "" }] as { name: string; issuer: string; year: string }[], docs: [] as string[],
  idType: "CNIC", idFront: "", idBack: "", selfie: "", videoFile: "", videoLink: "",
  slots: ["Mon-Evening", "Wed-Evening", "Sat-Morning", "Sat-Afternoon"], mode: "Online", areas: "", rates: {} as Record<string, string>, demo: true,
  agreed: [false, false, false, false],
};
export type TutorData = typeof defaults;

/** Subject names with "Other" replaced by what the tutor typed. */
export const allSubjects = (d: { subjects: string[]; otherSubjects: unknown }) => [...d.subjects.filter((s) => s !== "Other"), ...(d.subjects.includes("Other") ? asList(d.otherSubjects) : [])];
export const allLevels = (d: { levels: string[]; otherLevels: unknown }) => [...d.levels.filter((s) => s !== "Other"), ...(d.levels.includes("Other") ? asList(d.otherLevels) : [])];
export const allLangs = (d: { langs: string[]; otherLangs: unknown }) => [...d.langs.filter((s) => s !== "Other"), ...(d.langs.includes("Other") ? asList(d.otherLangs) : [])];

const load = (): TutorData => {
  const base = { ...defaults };
  try {
    base.name = sessionStorage.getItem("cg-full") || "";
    const saved = JSON.parse(sessionStorage.getItem(TUTOR_KEY) || "{}");
    const certs = Array.isArray(saved.certs) && saved.certs.length ? saved.certs : typeof saved.certs === "string" && saved.certs.trim() ? [{ name: saved.certs, issuer: "", year: "" }] : base.certs;
    return { ...base, ...saved, certs, otherLangs: asList(saved.otherLangs), otherSubjects: asList(saved.otherSubjects), otherLevels: asList(saved.otherLevels) };
  } catch { return base; }
};

const svg = (d: ReactNode, w = 30, h = 30, vb = "0 0 24 24") => <svg width={w} height={h} viewBox={vb} fill="none" stroke="#1F8F7A" strokeWidth="1.75" aria-hidden>{d}</svg>;
const upIcon = svg(<path d="M12 16V4M7 9l5-5 5 5M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3" />);
const Drop = ({ icon, title, sub, value, error, accept, multiple, capture, onFiles }: { icon: ReactNode; title: string; sub: string; value: string; error?: string; accept?: string; multiple?: boolean; capture?: "user"; onFiles: (names: string) => void }) => (
  <div>
    <label className="upload sm" style={error ? { borderColor: "#E5482A" } : undefined}>{icon}<b>{title}</b>{value ? <span className="got">✓ {value}</span> : <small>{sub}</small>}
      <input type="file" accept={accept} multiple={multiple} capture={capture} onChange={(e) => onFiles(Array.from(e.target.files ?? []).map((f) => f.name).join(", "))} /></label>
    {error && <span className="errmsg block" role="alert" style={{ marginTop: 6 }}>{error}</span>}
  </div>
);
const Other = ({ show, label, value, onChange, error, placeholder, help }: { show: boolean; label: string; value: string; onChange: (v: string) => void; error?: string; placeholder: string; help?: string }) =>
  show ? <div className="other-reveal"><Field label={label} required error={error} help={help}><input type="text" autoFocus value={value} placeholder={placeholder} aria-invalid={!!error} onChange={(e) => onChange(e.target.value)} /></Field></div> : null;

export default function TutorOnboarding() {
  const [d, setD] = useState<TutorData>(load);
  const [step, setStep] = useState(Math.max(0, Math.min(7, (Number(new URLSearchParams(location.search).get("step")) || 1) - 1)));
  const [status, setStatus] = useState<"idle" | "sending">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [submitErr, setSubmitErr] = useState("");
  const set = <K extends keyof TutorData>(k: K, v: TutorData[K]) => { setD((p) => ({ ...p, [k]: v })); setErrors((e) => { if (!e[k as string]) return e; const { [k as string]: _, ...rest } = e; return rest; }); };
  useEffect(() => { try { sessionStorage.setItem(TUTOR_KEY, JSON.stringify(d)); } catch { /* storage unavailable */ } });
  const first = useRef(true);
  useEffect(() => { if (first.current) { first.current = false; return; } document.getElementById("main")?.scrollIntoView({ block: "start" }); }, [step]);

  const subjects = allSubjects(d);
  const homeMode = d.mode !== "Online";

  const validate = (s: number): Errors => {
    const e: Errors = {};
    if (s === 0) {
      if (d.name.trim().length < 2) e.name = "Enter your full name as on your ID.";
      if (!EMAIL.test(d.email.trim())) e.email = "Enter a valid email address.";
      if (!PHONE.test(d.phone.trim())) e.phone = "Enter a valid number, e.g. +92 300 1234567.";
      if (!d.city.trim() || (d.city === "Other" && !d.otherCity.trim())) e.city = "Tell us which city you're in.";
      if (!d.langs.length) e.langs = "Pick at least one language.";
      else if (d.langs.includes("Other") && !d.otherLangs.length) e.otherLangs = "Add at least one language — type it and press Enter.";
    }
    if (s === 1) {
      if (!d.subjects.length) e.subjects = "Pick at least one subject.";
      else if (d.subjects.includes("Other") && !d.otherSubjects.length) e.otherSubjects = "Add at least one subject — type it and press Enter.";
      if (!d.levels.length) e.levels = "Pick at least one level.";
      else if (d.levels.includes("Other") && !d.otherLevels.length) e.otherLevels = "Add at least one level or exam — type it and press Enter.";
      if (d.bio.trim().length < 30) e.bio = "Write at least 30 characters so students know who you are.";
    }
    if (s === 2) {
      d.degrees.forEach((g, i) => {
        if (!g.degree.trim()) e[`degree${i}`] = "Required";
        if (!g.institution.trim()) e[`institution${i}`] = "Required";
        if (!/^(19|20)\d{2}$/.test(g.year.trim())) e[`year${i}`] = "Enter a 4-digit year";
      });
      d.certs.forEach((c, i) => {
        const any = c.name.trim() || c.issuer.trim() || c.year.trim();
        if (any && !c.name.trim()) e[`cert${i}`] = "Add the certificate name";
        if (c.year.trim() && !/^(19|20)\d{2}$/.test(c.year.trim())) e[`certyear${i}`] = "Enter a 4-digit year";
      });
      if (!d.docs.length) e.docs = "Upload at least one degree or certificate for verification.";
    }
    if (s === 3) {
      if (d.idType === "Passport") { if (!d.idFront) e.idFront = "Upload the photo page of your passport."; }
      else {
        if (!d.idFront) e.idFront = "Upload the front of your CNIC.";
        if (!d.idBack) e.idBack = "Upload the back of your CNIC.";
      }
    }
    if (s === 4 && d.videoLink.trim() && !/^https?:\/\/\S+\.\S+/.test(d.videoLink.trim())) e.videoLink = "Enter a full link starting with https://";
    if (s === 5) {
      if (!d.slots.length) e.slots = "Select at least one time slot.";
      if (homeMode && d.areas.trim().length < 3) e.areas = "Tell us which areas you can travel to.";
      subjects.forEach((x) => { if (!(Number(d.rates[x]) > 0)) e[`rate_${x}`] = "Enter your hourly rate"; });
      if (!d.demo) e.demo = "A free demo class is required for new tutors.";
    }
    if (s === 6 && d.agreed.some((a) => !a)) e.agreed = "Please accept each policy to submit.";
    return e;
  };

  const go = (to: number) => {
    setSubmitErr("");
    for (let s = step; s < to; s++) { const e = validate(s); if (Object.keys(e).length) { setStep(s); return setErrors(e); } }
    setErrors({}); setStep(to);
  };
  const next = async () => {
    setSubmitErr("");
    if (step < 6) return go(step + 1);
    for (let s = 0; s <= 6; s++) { const e = validate(s); if (Object.keys(e).length) { setStep(s); return setErrors(e); } }
    setStatus("sending");
    try {
      const { photo: _p, ...rest } = d;
      await submitLead({ kind: "tutor-application", name: d.name.trim(), email: d.email.trim(), phone: d.phone.trim(), message: d.bio, details: { ...rest, certs: d.certs.filter((c) => c.name.trim()), subjects, levels: allLevels(d), langs: allLangs(d) } });
      setStep(7);
    } catch { setSubmitErr("We couldn't submit your application. Please try again."); }
    setStatus("idle");
  };

  const setDegree = (i: number, k: "degree" | "institution" | "year", v: string) => { set("degrees", d.degrees.map((x, j) => (j === i ? { ...x, [k]: v } : x))); };
  const setCert = (i: number, k: "name" | "issuer" | "year", v: string) => { set("certs", d.certs.map((x, j) => (j === i ? { ...x, [k]: v } : x))); };
    const done = step >= 7;
  const E = errors;

  return (
    <div className="pg wiz-page">
      {[{ w: 440, left: "6%", top: 200, bg: "#9FE3D2", o: .55, b: 90 }, { w: 380, right: "8%", top: 520, bg: "#FFC2B3", o: .5, b: 100 }, { w: 320, right: "30%", top: 20, bg: "#C9D8FF", o: .55, b: 90 }]
        .map((o, i) => <div key={i} aria-hidden className="orb" style={{ width: o.w, height: o.w, left: o.left, right: o.right, top: o.top, background: o.bg, opacity: o.o, filter: `blur(${o.b}px)` }} />)}
      <div className="wiz-top" style={{ maxWidth: 1180, marginBottom: 28 }}>
        <Brand />
        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <span className="saved"><Tick size={16} />Progress saved · resume anytime</span>
          <a className="pg-btn pg-ghost" style={{ fontSize: 15, minHeight: 44 }} href="/tutor">Save &amp; exit</a>
        </div>
      </div>

      <div className="wiz-card" style={{ maxWidth: 1180 }}>
        <aside className="rail" style={{ flexBasis: 270, padding: "36px 26px" }}>
          <Eyebrow>Tutor application</Eyebrow>
          <h1 style={{ fontSize: 32, margin: "14px 0 26px" }}>Become a <span className="serif">tutor</span></h1>
          <ol>{STEPS.map((l, i) => (
            <li key={l} style={{ padding: 0 }}><button type="button" className={`rs${i < step ? " done" : ""}`} aria-current={i === step ? "step" : undefined} onClick={() => go(i)}><span>{i < step ? "✓" : i + 1}</span>{l}</button></li>
          ))}</ol>
          <div className="pnote">Takes about 15 minutes. Fields marked <span className="req-star">*</span> are required. You'll appear in search once our team verifies your profile.</div>
        </aside>

        <main className="wiz-main" id="main" style={{ flexBasis: 560, padding: "28px 36px", minHeight: 600 }}>
          {done ? (
            <div className="done" style={{ maxWidth: 460 }}>
              <span className="ok"><Tick /></span>
              <h2>Application <span className="serif">submitted</span></h2>
              <p>Our team will check your documents, ID and video within [2–3 working days]. We'll message you on WhatsApp to schedule a short interview.</p>
              <a className="pg-btn btn-coral" href="/tutor?status=pending">Go to dashboard</a>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#55627A", marginBottom: 10 }}><span>Step {step + 1} of 7</span><span>{Math.round((step / 7) * 100)}% complete</span></div>
              <div className="wiz-bar" role="progressbar" aria-valuemin={1} aria-valuemax={7} aria-valuenow={step + 1} aria-label="Application progress"><i style={{ width: `${((step + 1) / 7) * 100}%` }} /></div>

              {step === 0 && (
                <div className="wstep" key="1">
                  <h2>Personal details</h2>
                  <div className="photo">
                    <span className="ph">{d.photo ? <img src={d.photo} alt="Your profile preview" /> : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#55627A" strokeWidth="1.75" aria-hidden><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0116 0" /></svg>}</span>
                    <div><label>Upload photo<input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) set("photo", URL.createObjectURL(f)); }} /></label><div style={{ fontSize: 13, color: "#55627A", marginTop: 6 }}>Clear, friendly, face visible</div></div>
                  </div>
                  <div className="fgrid">
                    <Field label="Full name" required error={E.name}><input type="text" autoComplete="name" value={d.name} placeholder="As on your ID" aria-invalid={!!E.name} onChange={(e) => set("name", e.target.value)} /></Field>
                    <Field label="Gender"><select value={d.gender} onChange={(e) => set("gender", e.target.value)}>{["Female", "Male", "Prefer not to say"].map((c) => <option key={c}>{c}</option>)}</select></Field>
                    <Field label="Email" required error={E.email}><input type="email" autoComplete="email" value={d.email} placeholder="you@example.com" aria-invalid={!!E.email} onChange={(e) => set("email", e.target.value)} /></Field>
                    <Field label="Phone / WhatsApp" required error={E.phone}><input type="tel" autoComplete="tel" value={d.phone} placeholder="+92 300 1234567" aria-invalid={!!E.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
                    <Field label="Country"><select value={d.country} onChange={(e) => set("country", e.target.value)}>{["Pakistan", "United Arab Emirates", "Saudi Arabia", "United Kingdom", "Other"].map((c) => <option key={c}>{c}</option>)}</select></Field>
                    <Field label="City" required error={E.city}>
                      <select value={d.city} aria-invalid={!!E.city} onChange={(e) => set("city", e.target.value)}><option value="">Select your city</option>{CITIES.map((c) => <option key={c}>{c}</option>)}</select>
                    </Field>
                    <Field label="Timezone"><select value={d.timezone} onChange={(e) => set("timezone", e.target.value)}>{["Pakistan (GMT+5)", "Gulf (GMT+4)", "UK (GMT+0/+1)", "Other"].map((c) => <option key={c}>{c}</option>)}</select></Field>
                  </div>
                  <Other show={d.city === "Other"} label="Your city" value={d.otherCity} onChange={(v) => set("otherCity", v)} placeholder="Type your city" error={E.city} />
                  <Group label="Languages spoken" error={E.langs}>
                    <div className="chips">{LANGS.map((s) => <Pick key={s} variant="pill" on={d.langs.includes(s)} onClick={() => set("langs", toggle(d.langs, s))}>{s}</Pick>)}</div>
                  </Group>
                  {d.langs.includes("Other") && <TagInput label="Other languages" required value={d.otherLangs} onChange={(v) => set("otherLangs", v)} placeholder="e.g. Balochi — press Enter to add" error={E.otherLangs} help="Add as many as you like." />}
                </div>
              )}

              {step === 1 && (
                <div className="wstep" key="2">
                  <h2>Teaching profile</h2>
                  <Group label="Subjects you teach *" error={E.subjects}>
                    <div className="tiles">{SUBJECTS.map((s) => <Pick key={s} on={d.subjects.includes(s)} onClick={() => set("subjects", toggle(d.subjects, s))}>{s === "Other" ? "+ Other" : s}</Pick>)}</div>
                  </Group>
                  {d.subjects.includes("Other") && <TagInput label="Other subjects you teach" required value={d.otherSubjects} onChange={(v) => set("otherSubjects", v)} placeholder="e.g. Statistics — press Enter to add" error={E.otherSubjects} help="Add as many as you like — each one gets its own rate in step 6." />}
                  <Group label="Levels & exams *" error={E.levels}>
                    <div className="chips">{LEVELS.map((s) => <Pick key={s} variant="pill" on={d.levels.includes(s)} onClick={() => set("levels", toggle(d.levels, s))}>{s === "Other" ? "+ Other" : s}</Pick>)}</div>
                  </Group>
                  {d.levels.includes("Other") && <TagInput label="Other levels or exams" required value={d.otherLevels} onChange={(v) => set("otherLevels", v)} placeholder="e.g. ACCA — press Enter to add" error={E.otherLevels} help="Add as many as you like." />}
                  <div className="fgrid">
                    <Field label="Years of experience"><select value={d.experience} onChange={(e) => set("experience", e.target.value)}>{EXP.map((o) => <option key={o}>{o}</option>)}</select></Field>
                    <Field label="Teaching style"><select value={d.style} onChange={(e) => set("style", e.target.value)}>{STYLES.map((o) => <option key={o}>{o}</option>)}</select></Field>
                  </div>
                  <Field label="Short bio" required error={E.bio} help={`Shown on your profile · ${d.bio.trim().length}/30 characters minimum`}>
                    <textarea rows={4} value={d.bio} aria-invalid={!!E.bio} onChange={(e) => set("bio", e.target.value)} placeholder="Who you teach best, what students can expect, results you're proud of…" />
                  </Field>
                </div>
              )}

              {step === 2 && (
                <div className="wstep" key="3">
                  <h2>Qualifications</h2>
                  {d.degrees.map((g, i) => (
                    <div className="degree" key={i}>
                      <Field label="Degree" required error={E[`degree${i}`]}><input type="text" value={g.degree} placeholder="e.g. BS Mathematics" aria-invalid={!!E[`degree${i}`]} onChange={(e) => setDegree(i, "degree", e.target.value)} /></Field>
                      <Field label="Institution" required error={E[`institution${i}`]}><input type="text" value={g.institution} placeholder="e.g. University of the Punjab" aria-invalid={!!E[`institution${i}`]} onChange={(e) => setDegree(i, "institution", e.target.value)} /></Field>
                      <Field label="Year" required error={E[`year${i}`]}><input type="text" inputMode="numeric" maxLength={4} value={g.year} placeholder="e.g. 2019" aria-invalid={!!E[`year${i}`]} onChange={(e) => setDegree(i, "year", e.target.value)} /></Field>
                      {d.degrees.length > 1 && <button type="button" className="linkbtn" style={{ gridColumn: "1/-1", color: "#E5482A" }} onClick={() => set("degrees", d.degrees.filter((_, j) => j !== i))}>Remove this degree</button>}
                    </div>
                  ))}
                  <button type="button" className="linkbtn" onClick={() => set("degrees", [...d.degrees, { degree: "", institution: "", year: "" }])}>+ Add another degree</button>
                  <div className="sub">Certifications <span style={{ fontWeight: 400, color: "#55627A" }}>(optional)</span></div>
                  {d.certs.map((c, i) => (
                    <div className="degree" key={i}>
                      <Field label="Certificate" error={E[`cert${i}`]}><input type="text" value={c.name} placeholder="e.g. CELTA" aria-invalid={!!E[`cert${i}`]} onChange={(e) => setCert(i, "name", e.target.value)} /></Field>
                      <Field label="Issued by"><input type="text" value={c.issuer} placeholder="e.g. Cambridge" onChange={(e) => setCert(i, "issuer", e.target.value)} /></Field>
                      <Field label="Year" error={E[`certyear${i}`]}><input type="text" inputMode="numeric" maxLength={4} value={c.year} placeholder="e.g. 2021" aria-invalid={!!E[`certyear${i}`]} onChange={(e) => setCert(i, "year", e.target.value)} /></Field>
                      {d.certs.length > 1 && <button type="button" className="linkbtn" style={{ gridColumn: "1/-1", color: "#E5482A" }} onClick={() => set("certs", d.certs.filter((_, j) => j !== i))}>Remove this certificate</button>}
                    </div>
                  ))}
                  <button type="button" className="linkbtn" onClick={() => set("certs", [...d.certs, { name: "", issuer: "", year: "" }])}>+ Add another certificate</button>
                  <Drop icon={upIcon} title="Upload degree & certificate documents *" sub="PDF, JPG or PNG · max 10 MB each" multiple value={d.docs.join(", ")} error={E.docs} onFiles={(n) => set("docs", n ? n.split(", ") : [])} />
                </div>
              )}

              {step === 3 && (
                <div className="wstep" key="4">
                  <h2>Identity verification</h2>
                  <div className="callout"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F8F7A" strokeWidth="2" aria-hidden><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 018 0v3" /></svg>Stored privately and encrypted. Only the Career Gala verification team can see these — never students or parents.</div>
                  <div className="fgrid" style={{ gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 12, maxWidth: 420 }} role="radiogroup" aria-label="ID type">
                    {["CNIC", "Passport"].map((t) => <Pick key={t} role="radio" on={d.idType === t} onClick={() => set("idType", t)}>{t}</Pick>)}
                  </div>
                  <div className="dropgrid">
                    {d.idType === "Passport" ? (
                      <Drop icon={svg(<><rect x="1" y="1" width="38" height="28" rx="4" /><circle cx="12" cy="13" r="4" /><path d="M6 23a6 6 0 0112 0M23 10h10M23 15h10M23 20h6" /></>, 40, 30, "0 0 40 30")} title="Passport *" sub="Photo page · photo or scan" accept="image/*,.pdf" value={d.idFront} error={E.idFront} onFiles={(n) => set("idFront", n)} />
                    ) : (<>
                      <Drop icon={svg(<><rect x="1" y="1" width="38" height="28" rx="4" /><circle cx="12" cy="13" r="4" /><path d="M6 23a6 6 0 0112 0M23 10h10M23 15h10M23 20h6" /></>, 40, 30, "0 0 40 30")} title="CNIC — front *" sub="Photo or scan" accept="image/*,.pdf" value={d.idFront} error={E.idFront} onFiles={(n) => set("idFront", n)} />
                      <Drop icon={svg(<><rect x="1" y="1" width="38" height="28" rx="4" /><path d="M6 10h28M6 16h20M6 22h14" /></>, 40, 30, "0 0 40 30")} title="CNIC — back *" sub="Photo or scan" accept="image/*,.pdf" value={d.idBack} error={E.idBack} onFiles={(n) => set("idBack", n)} />
                    </>)}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="wstep" key="5">
                  <h2>Intro video <span style={{ fontSize: 15, fontWeight: 500, color: "#55627A" }}>(recommended)</span></h2>
                  <p className="hint" style={{ marginTop: -6, fontSize: 16 }}>A 1–2 minute video introducing yourself and showing how you teach. Profiles with a video get more bookings.</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
                    <label className="upload" style={{ flex: "1 1 300px", justifyContent: "center", padding: "40px 20px", aspectRatio: "16/10" }}>
                      <span style={{ width: 64, height: 64, borderRadius: "50%", background: "#FF6342", display: "grid", placeItems: "center" }}><svg width="24" height="24" viewBox="0 0 24 24" fill="#102027" aria-hidden><path d="M8 5v14l11-7z" /></svg></span>
                      <b>Upload your video</b>{d.videoFile ? <span className="got">✓ {d.videoFile}</span> : <small>MP4 or MOV · 1–2 min · max 200 MB</small>}
                      <input type="file" accept="video/*" onChange={(e) => set("videoFile", e.target.files?.[0]?.name ?? "")} />
                    </label>
                    <div style={{ flex: "1 1 220px", display: "flex", flexDirection: "column", gap: 12 }}>
                      <div className="sub">Tips for a great video</div>
                      <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10, fontSize: 14, color: "#33434D" }}>
                        {["Good light, quiet room", "Say who you are and what you teach", "Explain one short concept on a board", "End with why students enjoy your lessons"].map((t) => <li key={t} style={{ display: "flex", gap: 10 }}><span style={{ color: "#1F8F7A" }}>●</span>{t}</li>)}
                      </ul>
                    </div>
                  </div>
                  <Field label="Or paste a link" optional error={E.videoLink}><input type="url" value={d.videoLink} placeholder="YouTube (unlisted) or Google Drive link" aria-invalid={!!E.videoLink} onChange={(e) => set("videoLink", e.target.value)} /></Field>
                </div>
              )}

              {step === 5 && (
                <div className="wstep" key="6">
                  <h2>Availability &amp; rates</h2>
                  <Group label="How do you teach? *">
                    <div className="fgrid" style={{ gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 12 }} role="radiogroup" aria-label="Teaching mode">
                      {MODES.map((m) => <Pick key={m} role="radio" on={d.mode === m} onClick={() => set("mode", m)}>{m}</Pick>)}
                    </div>
                  </Group>
                  {homeMode && <div className="other-reveal"><Field label="Areas you can travel to" required error={E.areas} help="Neighbourhoods or sectors for home tuition."><input type="text" value={d.areas} placeholder="e.g. DHA, Gulberg, Model Town" aria-invalid={!!E.areas} onChange={(e) => set("areas", e.target.value)} /></Field></div>}
                  <Group label="Weekly time slots *" hint="Tap to select the times you're free." error={E.slots}>
                    <div className="slots"><div>
                      <span />{DAYS.map((x) => <span key={x} className="dn">{x}</span>)}
                      {TIMES.map((t) => (<div key={t} style={{ display: "contents" }}>
                        <span className="tn">{t}</span>
                        {DAYS.map((x) => { const k = `${x}-${t}`; return <button type="button" key={k} aria-label={`${x} ${t}`} aria-pressed={d.slots.includes(k)} onClick={() => set("slots", toggle(d.slots, k))} />; })}
                      </div>))}
                    </div></div>
                  </Group>
                  <div className="sub" style={{ marginTop: 4 }}>Hourly rate per subject (Rs) *</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {(subjects.length ? subjects : ["Add a subject in step 2"]).map((s) => (
                      <div key={s}>
                        <label className="raterow">{s}<input type="number" min={0} inputMode="numeric" value={d.rates[s] ?? ""} placeholder="e.g. 1800" aria-invalid={!!E[`rate_${s}`]} style={E[`rate_${s}`] ? { borderColor: "#E5482A" } : undefined} onChange={(e) => { set("rates", { ...d.rates, [s]: e.target.value }); setErrors((x) => { const { [`rate_${s}`]: _, ...r } = x; return r; }); }} /></label>
                        {E[`rate_${s}`] && <span className="errmsg block" role="alert" style={{ marginTop: 4 }}>{E[`rate_${s}`]}</span>}
                      </div>
                    ))}
                  </div>
                  <div className="callout warn">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E5482A" strokeWidth="2" aria-hidden style={{ marginTop: 2 }}><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v5h1" /></svg>
                    <div style={{ flex: 1 }}>
                      <b style={{ fontWeight: 600 }}>Free demo class is required</b>
                      <div style={{ fontSize: 14, margin: "4px 0 10px" }}>Every new student gets one free demo lesson with you before booking.</div>
                      <label className="agree" style={{ color: "#102027" }}><input type="checkbox" checked={d.demo} onChange={(e) => set("demo", e.target.checked)} />I'm willing to give a free [30-minute] demo class</label>
                      {E.demo && <span className="errmsg block" role="alert" style={{ marginTop: 6 }}>{E.demo}</span>}
                    </div>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="wstep" key="7" style={{ gap: 14 }}>
                  <h2>Agreement</h2>
                  <p className="hint" style={{ marginTop: -4, fontSize: 16 }}>Please read and accept each policy to submit your application.</p>
                  {POLICIES.map(([name, extra], i) => (
                    <label className="agreerow" key={name}>
                      <input type="checkbox" checked={d.agreed[i]} onChange={(e) => set("agreed", d.agreed.map((a, j) => (j === i ? e.target.checked : a)))} />
                      <span>{i === 2 ? "I will follow the " : i === 3 ? "I have read and will follow the " : "I accept the "}<a href="/terms.html">{name}</a>{extra}</span>
                    </label>
                  ))}
                  {E.agreed && <span className="errmsg block" role="alert">{E.agreed}</span>}
                </div>
              )}

              {Object.keys(E).length > 0 && <p className="errmsg block" role="alert" style={{ marginTop: 14 }}>Please fix the highlighted fields to continue.</p>}
              {submitErr && <p className="errmsg block" role="alert" style={{ marginTop: 14 }}>{submitErr}</p>}
              <div className="wiz-nav" style={{ alignItems: "center" }}>
                {step > 0 ? <button type="button" className="pg-btn pg-ghost" style={{ fontSize: 15 }} onClick={() => { setErrors({}); setStep(step - 1); }}>Back</button> : <span />}
                <button type="button" className="pg-btn btn-coral" style={{ fontSize: 15 }} disabled={status === "sending"} onClick={next}>{status === "sending" ? "Submitting…" : step === 6 ? "Submit application" : "Save & continue"}</button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
