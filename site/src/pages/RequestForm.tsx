import { useState } from "react";
import { BUDGETS, CITIES, FREQ, Field, GENDER, Group, LEVELS, PHONE, Pick, START, SUBJECTS, TIMES, TagInput, toggle, type Errors } from "./ui";
import { addRequests, updateStudent, type Student } from "../lib/store";
import { submitLead } from "../lib/submit";

/** Puts a saved value into a list's picker, using "Other" + free text when the list doesn't have it. */
const preset = (list: string[], saved: string, fallback: string) =>
  !saved ? { pick: fallback, other: "" } : list.includes(saved) ? { pick: saved, other: "" } : { pick: "Other", other: saved };

/** The student's tutor request, prefilled from their account. `openSubjects` blocks sending the same subject twice. */
export default function RequestForm({ me, openSubjects, onDone, onCancel }: { me: Student; openSubjects: string[]; onDone: (count: number) => void; onCancel: () => void }) {
  const level = preset(LEVELS, me.level, "Matric"), city = preset(CITIES, me.city, "");
  const [d, setD] = useState({
    child: false, childName: "", subjects: [] as string[], otherSubjects: [] as string[], level: level.pick, otherLevel: level.other,
    mode: "Online" as "Online" | "At home", city: city.pick, otherCity: city.other, area: "", budget: BUDGETS[0], times: [] as string[], start: START[0], freq: FREQ[3], gender: GENDER[0],
    goal: "", message: "", phone: me.phone, consent: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [submitErr, setSubmitErr] = useState("");
  const set = <K extends keyof typeof d>(k: K, v: (typeof d)[K]) => { setD((p) => ({ ...p, [k]: v })); setErrors((e) => { if (!e[k as string]) return e; const { [k as string]: _, ...rest } = e; return rest; }); };

  const subjectList = [...d.subjects.filter((x) => x !== "Other"), ...(d.subjects.includes("Other") ? d.otherSubjects : [])];
  const home = d.mode === "At home";

  const validate = () => {
    const e: Errors = {};
    const dup = subjectList.find((s) => openSubjects.some((o) => o.toLowerCase() === s.toLowerCase()));
    if (!d.subjects.length) e.subjects = "Pick at least one subject.";
    else if (d.subjects.includes("Other") && !d.otherSubjects.length) e.otherSubjects = "Add at least one subject — type it and press Enter.";
    else if (dup) e.subjects = `You already have an open request for ${dup}.`;
    if (d.level === "Other" && !d.otherLevel.trim()) e.otherLevel = "Tell us your level or class.";
    if (!d.city) e.city = "Select your city.";
    else if (d.city === "Other" && !d.otherCity.trim()) e.otherCity = "Type your city.";
    if (home && d.area.trim().length < 3) e.area = "Add your area so we can find tutors nearby.";
    if (!d.times.length) e.times = "Pick at least one time that suits you.";
    if (d.child && d.childName.trim().length < 2) e.childName = "Enter your child's name.";
    if (!PHONE.test(d.phone.trim())) e.phone = "Enter a valid WhatsApp number, e.g. +92 300 1234567.";
    if (!d.consent) e.consent = "Please allow us to contact you so we can send matches.";
    return e;
  };

  const send = async () => {
    setSubmitErr("");
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setSending(true);
    const lvl = d.level === "Other" ? d.otherLevel.trim() : d.level;
    const place = d.city === "Other" ? d.otherCity.trim() : d.city;
    const phone = d.phone.trim(), studentName = d.child ? d.childName.trim() : me.name;
    try {
      await submitLead({
        kind: "student-inquiry", name: me.name, phone, email: me.email || undefined, domain: subjectList.join(", "), stage: lvl, message: d.message.trim() || d.goal.trim(),
        details: { need: "Find a tutor", subjects: subjectList, goal: d.goal, mode: d.mode, city: place, area: d.area, budget: d.budget, times: d.times, start: d.start, frequency: d.freq, tutorGender: d.gender, parent: d.child, studentName },
      });
      addRequests(subjectList.map((subject) => ({
        name: me.name, studentName, phone, email: me.email || undefined, subject, level: lvl, mode: d.mode, city: place, area: d.area.trim(),
        budget: d.budget, times: d.times, start: d.start, frequency: d.freq, gender: d.gender, goal: d.goal.trim(), message: d.message.trim(),
      })), me.id);
      updateStudent(me.id, { phone, city: place, level: lvl });
      onDone(subjectList.length);
    } catch { setSending(false); setSubmitErr("We couldn't send your request. Please try again or message us on WhatsApp."); }
  };

  const E = errors;
  return (
    <section className="panel rq-form" aria-label="New tutor request">
      <div>
        <h2>What do you need?</h2>
        <p className="mut">Each subject becomes its own request, so you can get the right tutor for each one.</p>
      </div>
      <Group label="Who is this for? *">
        <div className="chips" role="radiogroup" aria-label="Who is this for">
          <Pick variant="pill" role="radio" on={!d.child} onClick={() => set("child", false)}>Me</Pick>
          <Pick variant="pill" role="radio" on={d.child} onClick={() => set("child", true)}>My child</Pick>
        </div>
      </Group>
      {d.child && <div className="other-reveal"><Field label="Child's name" required error={E.childName}><input type="text" value={d.childName} placeholder="Student's name" aria-invalid={!!E.childName} onChange={(e) => set("childName", e.target.value)} /></Field></div>}
      <Group label="Subjects *" hint="Pick one or more." error={E.subjects}>
        <div className="tiles">{SUBJECTS.map((s) => <Pick key={s} on={d.subjects.includes(s)} onClick={() => set("subjects", toggle(d.subjects, s))}>{s === "Other" ? "+ Other" : s}</Pick>)}</div>
      </Group>
      {d.subjects.includes("Other") && <TagInput label="Which other subjects?" required value={d.otherSubjects} onChange={(v) => set("otherSubjects", v)} placeholder="e.g. Accounting — press Enter to add" error={E.otherSubjects} />}
      <Group label="Level *">
        <div className="chips">{LEVELS.map((s) => <Pick key={s} variant="pill" on={d.level === s} onClick={() => set("level", s)}>{s === "Other" ? "+ Other" : s}</Pick>)}</div>
      </Group>
      {d.level === "Other" && <div className="other-reveal"><Field label="Your level or class" required error={E.otherLevel}><input type="text" value={d.otherLevel} placeholder="e.g. Grade 6, MBA, CSS preparation" aria-invalid={!!E.otherLevel} onChange={(e) => set("otherLevel", e.target.value)} /></Field></div>}

      <h2 className="rq-h">How do you want to learn?</h2>
      <Group label="Mode *">
        <div className="fgrid" style={{ gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 12 }} role="radiogroup" aria-label="Mode">
          {(["Online", "At home"] as const).map((m) => <Pick key={m} role="radio" on={d.mode === m} onClick={() => set("mode", m)}>{m}</Pick>)}
        </div>
      </Group>
      <div className="fgrid">
        <Field label="City" required error={E.city}>
          <select value={d.city} aria-invalid={!!E.city} onChange={(e) => set("city", e.target.value)}><option value="">Select your city</option>{CITIES.map((c) => <option key={c}>{c}</option>)}</select>
        </Field>
        <Field label="Budget per hour"><select value={d.budget} onChange={(e) => set("budget", e.target.value)}>{BUDGETS.map((c) => <option key={c}>{c}</option>)}</select></Field>
      </div>
      {d.city === "Other" && <div className="other-reveal"><Field label="Your city" required error={E.otherCity}><input type="text" value={d.otherCity} placeholder="Type your city" aria-invalid={!!E.otherCity} onChange={(e) => set("otherCity", e.target.value)} /></Field></div>}
      {home && <div className="other-reveal"><Field label="Your area" required error={E.area} help="Neighbourhood or sector, so we can match nearby tutors."><input type="text" value={d.area} placeholder="e.g. DHA Phase 5, Gulberg" aria-invalid={!!E.area} onChange={(e) => set("area", e.target.value)} /></Field></div>}
      <Group label="Best time *" error={E.times}>
        <div className="chips">{TIMES.map((s) => <Pick key={s} variant="pill" on={d.times.includes(s)} onClick={() => set("times", toggle(d.times, s))}>{s}</Pick>)}</div>
      </Group>
      <div className="fgrid">
        <Field label="When do you want to start?"><select value={d.start} onChange={(e) => set("start", e.target.value)}>{START.map((c) => <option key={c}>{c}</option>)}</select></Field>
        <Field label="How often?"><select value={d.freq} onChange={(e) => set("freq", e.target.value)}>{FREQ.map((c) => <option key={c}>{c}</option>)}</select></Field>
        <Field label="Tutor preference"><select value={d.gender} onChange={(e) => set("gender", e.target.value)}>{GENDER.map((c) => <option key={c}>{c}</option>)}</select></Field>
      </div>

      <h2 className="rq-h">Anything else?</h2>
      <div className="fgrid">
        <Field label="WhatsApp number" required error={E.phone}><input type="tel" autoComplete="tel" value={d.phone} placeholder="+92 300 1234567" aria-invalid={!!E.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
        <Field label="Your goal" optional><input type="text" value={d.goal} onChange={(e) => set("goal", e.target.value)} placeholder="e.g. Score an A in Maths" /></Field>
      </div>
      <Field label="Notes for us" optional><textarea rows={3} value={d.message} onChange={(e) => set("message", e.target.value)} placeholder="Exam date, topics you find hard…" /></Field>
      <div>
        <label className="agree" style={{ color: "#102027" }}><input type="checkbox" checked={d.consent} onChange={(e) => set("consent", e.target.checked)} />I agree that Career Gala may contact me on WhatsApp about this request.</label>
        {E.consent && <span className="errmsg block" role="alert" style={{ marginTop: 6 }}>{E.consent}</span>}
      </div>

      {Object.keys(E).length > 0 && <p className="errmsg block" role="alert">Please fix the highlighted fields to continue.</p>}
      {submitErr && <p className="errmsg block" role="alert">{submitErr}</p>}
      <div className="rq-actions">
        <button type="button" className="pg-btn pg-ghost" disabled={sending} onClick={onCancel}>Cancel</button>
        <button type="button" className="pg-btn btn-coral" disabled={sending} onClick={send}>{sending ? "Sending…" : subjectList.length > 1 ? `Send ${subjectList.length} requests` : "Send request"}</button>
      </div>
    </section>
  );
}
