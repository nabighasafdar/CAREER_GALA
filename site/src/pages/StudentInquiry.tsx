import { useEffect, useRef, useState } from "react";
import { Brand, Check, Eyebrow } from "./Shell";
import { BUDGETS, CITIES, EMAIL, FREQ, Field, GENDER, Group, LEVELS, PHONE, Pick, START, SUBJECTS, TIMES, TagInput, Tick, toggle, type Errors } from "./ui";
import { submitLead } from "../lib/submit";
import { addRequests } from "../lib/store";
import { studentId } from "../lib/auth";
import { site } from "../content/site";

const NEEDS = [{ n: "Find a tutor", s: "One-to-one lessons" }, { n: "Career counselling", s: "Plan your next step" }];
const TOPICS = ["Choosing a field or degree", "University admissions", "Scholarships & studying abroad", "Switching careers", "CV & interview prep", "Other"];

const init = {
  need: "Find a tutor", subjects: ["Maths"], otherSubjects: [] as string[], topic: TOPICS[0], otherTopic: "", level: "Matric", otherLevel: "", grade: "", goal: "",
  mode: "Online", city: "", otherCity: "", area: "", budget: BUDGETS[0], times: ["Evening"], start: START[0], freq: FREQ[3], gender: GENDER[0],
  name: "", phone: "", email: "", message: "", parent: false, studentName: "", consent: false,
};

/** Subjects chosen on /subjects arrive as ?subjects=A,B; ones the form has no tile for go under "Other". */
const fromQuery = () => {
  const picked = (new URLSearchParams(location.search).get("subjects") ?? "").split(",").map((x) => x.trim()).filter(Boolean);
  const lvl = new URLSearchParams(location.search).get("level") ?? "";
  const level = LEVELS.includes(lvl) ? lvl : init.level;
  if (!picked.length) return { ...init, level };
  const known = picked.filter((x) => SUBJECTS.includes(x) && x !== "Other"), other = picked.filter((x) => !known.includes(x));
  return { ...init, level, subjects: [...known, ...(other.length ? ["Other"] : [])], otherSubjects: other };
};

export default function StudentInquiry() {
  const [step, setStep] = useState(0);
  const [d, setD] = useState(fromQuery);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [submitErr, setSubmitErr] = useState("");
  const set = <K extends keyof typeof d>(k: K, v: (typeof d)[K]) => { setD((p) => ({ ...p, [k]: v })); setErrors((e) => { if (!e[k as string]) return e; const { [k as string]: _, ...rest } = e; return rest; }); };
  const first = useRef(true);
  useEffect(() => { if (first.current) { first.current = false; return; } document.getElementById("form-top")?.scrollIntoView({ block: "nearest" }); }, [step]);

  const tutor = d.need === "Find a tutor";
  const home = d.mode === "At home";

  const validate = (s: number): Errors => {
    const e: Errors = {};
    if (s === 0) {
      if (tutor) {
        if (!d.subjects.length) e.subjects = "Pick at least one subject.";
        else if (d.subjects.includes("Other") && !d.otherSubjects.length) e.otherSubjects = "Add at least one subject — type it and press Enter.";
      } else if (d.topic === "Other" && !d.otherTopic.trim()) e.otherTopic = "Tell us what you need help with.";
      if (d.level === "Other" && !d.otherLevel.trim()) e.otherLevel = "Tell us your level or class.";
    }
    if (s === 1) {
      if (!d.city) e.city = "Select your city.";
      else if (d.city === "Other" && !d.otherCity.trim()) e.otherCity = "Type your city.";
      if (tutor && home && d.area.trim().length < 3) e.area = "Add your area so we can find tutors nearby.";
      if (!d.times.length) e.times = "Pick at least one time that suits you.";
    }
    if (s === 2) {
      if (d.name.trim().length < 2) e.name = "Enter your full name.";
      if (d.parent && d.studentName.trim().length < 2) e.studentName = "Enter your child's name.";
      if (!PHONE.test(d.phone.trim())) e.phone = "Enter a valid WhatsApp number, e.g. +92 300 1234567.";
      if (d.email.trim() && !EMAIL.test(d.email.trim())) e.email = "That email address doesn't look right.";
      if (!d.consent) e.consent = "Please allow us to contact you so we can send matches.";
    }
    return e;
  };

  const next = async () => {
    setSubmitErr("");
    const e = validate(step);
    if (Object.keys(e).length) return setErrors(e);
    setErrors({});
    if (step < 2) return setStep(step + 1);
    setStatus("sending");
    const subjectList = [...d.subjects.filter((x) => x !== "Other"), ...(d.subjects.includes("Other") ? d.otherSubjects : [])];
    const subject = subjectList.join(", ");
    const topic = d.topic === "Other" ? d.otherTopic.trim() : d.topic;
    const level = d.level === "Other" ? d.otherLevel.trim() : d.level;
    const city = d.city === "Other" ? d.otherCity.trim() : d.city;
    try {
      await submitLead({
        kind: "student-inquiry", name: d.name.trim(), phone: d.phone.trim(), email: d.email.trim() || undefined,
        domain: tutor ? subject : topic, stage: level, message: d.message.trim() || d.goal.trim(),
        details: { need: d.need, subjects: subjectList, grade: d.grade, goal: d.goal, mode: d.mode, city, area: d.area, budget: d.budget, times: d.times, start: d.start, frequency: d.freq, tutorGender: d.gender, parent: d.parent, studentName: d.parent ? d.studentName : d.name },
      });
      if (tutor) addRequests(subjectList.map((s) => ({
        name: d.name.trim(), studentName: (d.parent ? d.studentName : d.name).trim(), phone: d.phone.trim(), email: d.email.trim() || undefined,
        subject: s, level, mode: home ? "At home" : "Online", city, area: d.area.trim(), budget: d.budget, times: d.times, start: d.start,
        frequency: d.freq, gender: d.gender, goal: d.goal.trim(), message: d.message.trim(),
      })), studentId());
      setStatus("done");
    } catch { setStatus("idle"); setSubmitErr("We couldn't send your request. Please try again or message us on WhatsApp."); }
  };

  const E = errors;
  const otherField = (show: boolean, label: string, key: "otherTopic" | "otherLevel" | "otherCity", ph: string) =>
    show ? <div className="other-reveal"><Field label={label} required error={E[key]}><input type="text" autoFocus value={d[key]} placeholder={ph} aria-invalid={!!E[key]} onChange={(e) => set(key, e.target.value)} /></Field></div> : null;

  return (
    <div className="pg wiz-page" style={{ paddingTop: 28 }}>
      <div aria-hidden className="orb" style={{ width: 440, height: 440, left: "8%", top: 280, background: "#9FE3D2", opacity: .55, filter: "blur(90px)" }} />
      <div aria-hidden className="orb" style={{ width: 380, height: 380, right: "8%", top: 520, background: "#FFC2B3", opacity: .5, filter: "blur(100px)" }} />
      <div className="wiz-top" style={{ marginBottom: 16 }}><Brand /><a className="pg-btn pg-ghost" style={{ fontSize: 15, minHeight: 44 }} href="/home">Back to home</a></div>
      <div className="inq-head" id="main">
        <Eyebrow>Get started</Eyebrow>
        <h1>Tell us what you <span className="serif">need</span></h1>
        <p>Answer three quick steps and we'll match you with the right tutor or counsellor within 24 hours.</p>
      </div>

      <div className="wiz-card">
        <aside className="inq-side">
          <h2>The right match starts here.</h2>
          <ul>
            <li><Check />Free to ask, no commitment</li>
            <li><Check />Reply within 24 hours</li>
            <li><Check />Online or at home</li>
          </ul>
          <div className="contact">
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <a href={site.whatsapp} target="_blank" rel="noopener noreferrer">{site.phone}</a>
          </div>
          <svg aria-hidden style={{ marginTop: "auto" }} width="220" height="70" viewBox="0 0 220 70"><path d="M4 64C40 64 60 30 100 32S160 40 190 18" stroke="#1F8F7A" strokeWidth="4" fill="none" strokeLinecap="round" /><circle cx="196" cy="14" r="9" fill="#FF6342" /></svg>
        </aside>

        <div className="wiz-main" id="form-top" style={{ minHeight: 480 }}>
          {status === "done" ? (
            <div className="done">
              <span className="ok"><Tick /></span>
              <h2>You're on your <span className="serif">way</span>!</h2>
              <p role="status">We've received your request and will message you on WhatsApp within 24 hours with matching {tutor ? "tutors" : "counsellors"}.</p>
              <a className="pg-btn btn-coral" href={`${site.whatsapp}?text=${encodeURIComponent("Hi Career Gala, I just sent an enquiry.")}`} target="_blank" rel="noopener noreferrer">Chat on WhatsApp now</a>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 14, color: "#55627A", marginBottom: 10 }}>Step {step + 1} of 3 · Fields marked <span className="req-star">*</span> are required</div>
              <div className="wiz-bar" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={step + 1} aria-label="Form progress"><i style={{ width: `${((step + 1) / 3) * 100}%` }} /></div>

              {step === 0 && (
                <div className="wstep" key="1">
                  <h2>What are you looking for?</h2>
                  <div className="fgrid" style={{ gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 12 }} role="radiogroup" aria-label="Need">
                    {NEEDS.map((o) => <Pick key={o.n} variant="card" role="radio" on={d.need === o.n} onClick={() => set("need", o.n)}><b>{o.n}</b><span>{o.s}</span></Pick>)}
                  </div>
                  {tutor ? (
                    <>
                      <Group label="Subjects *" hint="Pick one or more." error={E.subjects}>
                        <div className="tiles">{SUBJECTS.map((s) => <Pick key={s} on={d.subjects.includes(s)} onClick={() => set("subjects", toggle(d.subjects, s))}>{s === "Other" ? "+ Other" : s}</Pick>)}</div>
                      </Group>
                      {d.subjects.includes("Other") && <TagInput label="Which other subjects?" required value={d.otherSubjects} onChange={(v) => set("otherSubjects", v)} placeholder="e.g. Accounting — press Enter to add" error={E.otherSubjects} help="Add as many as you like." />}
                    </>
                  ) : (
                    <>
                      <Group label="What do you need help with? *">
                        <div className="chips">{TOPICS.map((s) => <Pick key={s} variant="pill" on={d.topic === s} onClick={() => set("topic", s)}>{s === "Other" ? "+ Other" : s}</Pick>)}</div>
                      </Group>
                      {otherField(d.topic === "Other", "What do you need help with?", "otherTopic", "e.g. Choosing between medicine and pharmacy")}
                    </>
                  )}
                  <Group label={tutor ? "Level *" : "Where are you now? *"}>
                    <div className="chips">{LEVELS.map((s) => <Pick key={s} variant="pill" on={d.level === s} onClick={() => set("level", s)}>{s === "Other" ? "+ Other" : s}</Pick>)}</div>
                  </Group>
                  {otherField(d.level === "Other", "Your level or class", "otherLevel", "e.g. Grade 6, MBA, CSS preparation")}
                  <div className="fgrid">
                    <Field label="Class / school or institute" optional><input type="text" value={d.grade} onChange={(e) => set("grade", e.target.value)} placeholder="e.g. Grade 10, Beaconhouse" /></Field>
                    <Field label={tutor ? "Your goal" : "What would success look like?"} optional><input type="text" value={d.goal} onChange={(e) => set("goal", e.target.value)} placeholder={tutor ? "e.g. Score an A in O Level Maths" : "e.g. A clear plan for university"} /></Field>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="wstep" key="2">
                  <h2>{tutor ? "How do you want to learn?" : "How should we meet?"}</h2>
                  <Group label="Mode *">
                    <div className="fgrid" style={{ gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 12 }} role="radiogroup" aria-label="Mode">
                      {(tutor ? ["Online", "At home"] : ["Online", "In person"]).map((m) => <Pick key={m} role="radio" on={d.mode === m || (!tutor && d.mode === "At home" && m === "In person")} onClick={() => set("mode", m === "In person" ? "At home" : m)}>{m}</Pick>)}
                    </div>
                  </Group>
                  <div className="fgrid">
                    <Field label="City" required error={E.city}>
                      <select value={d.city} aria-invalid={!!E.city} onChange={(e) => set("city", e.target.value)}><option value="">Select your city</option>{CITIES.map((c) => <option key={c}>{c}</option>)}</select>
                    </Field>
                    {tutor && <Field label="Budget per hour"><select value={d.budget} onChange={(e) => set("budget", e.target.value)}>{BUDGETS.map((c) => <option key={c}>{c}</option>)}</select></Field>}
                  </div>
                  {otherField(d.city === "Other", "Your city", "otherCity", "Type your city")}
                  {tutor && home && <div className="other-reveal"><Field label="Your area" required error={E.area} help="Neighbourhood or sector, so we can match nearby tutors."><input type="text" value={d.area} placeholder="e.g. DHA Phase 5, Gulberg" aria-invalid={!!E.area} onChange={(e) => set("area", e.target.value)} /></Field></div>}
                  <Group label="Best time *" error={E.times}>
                    <div className="chips">{TIMES.map((s) => <Pick key={s} variant="pill" on={d.times.includes(s)} onClick={() => set("times", toggle(d.times, s))}>{s}</Pick>)}</div>
                  </Group>
                  <div className="fgrid">
                    <Field label="When do you want to start?"><select value={d.start} onChange={(e) => set("start", e.target.value)}>{START.map((c) => <option key={c}>{c}</option>)}</select></Field>
                    {tutor && <Field label="How often?"><select value={d.freq} onChange={(e) => set("freq", e.target.value)}>{FREQ.map((c) => <option key={c}>{c}</option>)}</select></Field>}
                    {tutor && <Field label="Tutor preference"><select value={d.gender} onChange={(e) => set("gender", e.target.value)}>{GENDER.map((c) => <option key={c}>{c}</option>)}</select></Field>}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="wstep" key="3">
                  <h2>Your details</h2>
                  <label className="agree" style={{ color: "#102027" }}><input type="checkbox" checked={d.parent} onChange={(e) => set("parent", e.target.checked)} />I'm a parent asking for my child</label>
                  <div className="fgrid">
                    <Field label={d.parent ? "Your name (parent)" : "Full name"} required error={E.name}><input type="text" autoComplete="name" value={d.name} placeholder="Your name" aria-invalid={!!E.name} onChange={(e) => set("name", e.target.value)} /></Field>
                    {d.parent && <Field label="Child's name" required error={E.studentName}><input type="text" value={d.studentName} placeholder="Student's name" aria-invalid={!!E.studentName} onChange={(e) => set("studentName", e.target.value)} /></Field>}
                    <Field label="WhatsApp number" required error={E.phone}><input type="tel" autoComplete="tel" value={d.phone} placeholder="+92 300 1234567" aria-invalid={!!E.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
                    <Field label="Email" optional error={E.email}><input type="email" autoComplete="email" value={d.email} placeholder="you@example.com" aria-invalid={!!E.email} onChange={(e) => set("email", e.target.value)} /></Field>
                  </div>
                  <Field label="Anything else?" optional><textarea rows={3} value={d.message} onChange={(e) => set("message", e.target.value)} placeholder="Exam date, topics you find hard, goals…" /></Field>
                  <div>
                    <label className="agree" style={{ color: "#102027" }}><input type="checkbox" checked={d.consent} onChange={(e) => set("consent", e.target.checked)} />I agree that Career Gala may contact me on WhatsApp about this request. <a href="/privacy.html" style={{ color: "#157A67", fontWeight: 600 }}>Privacy Policy</a></label>
                    {E.consent && <span className="errmsg block" role="alert" style={{ marginTop: 6 }}>{E.consent}</span>}
                  </div>
                </div>
              )}

              {Object.keys(E).length > 0 && <p className="errmsg block" role="alert" style={{ marginTop: 12 }}>Please fix the highlighted fields to continue.</p>}
              {submitErr && <p className="errmsg block" role="alert" style={{ marginTop: 12 }}>{submitErr}</p>}
              <div className="wiz-nav">
                {step > 0 ? <button type="button" className="pg-btn pg-ghost" style={{ fontSize: 15 }} onClick={() => { setErrors({}); setStep(step - 1); }}>Back</button> : <span />}
                <button type="button" className="pg-btn btn-coral" style={{ fontSize: 15 }} disabled={status === "sending"} onClick={next}>{status === "sending" ? "Sending…" : step === 2 ? "Send request" : "Next"}</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
