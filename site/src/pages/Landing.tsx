import { useState, type FormEvent } from "react";
import { site } from "../content/site";
import { addRequests } from "../lib/store";
import { submitLead } from "../lib/submit";
import { Faq, Icon, People, Shield, StatBand, Steps, Tick } from "./SiteLayout";
import { PHONE } from "./ui";

const points = ["Tutors checked for degrees & teaching skill", "First lesson free — pay only if you continue", "Online or at home in [Lahore, Karachi, Islamabad]"];
const subjects = ["Maths", "Physics", "Chemistry", "Biology", "English", "Computer", "IELTS / TOEFL", "MDCAT"];

function TrialForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  const send = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name")).trim(), phone = String(f.get("phone")).trim();
    const subject = String(f.get("subject")), level = String(f.get("level"));
    if (!name) return setError("Please enter your name.");
    if (!PHONE.test(phone)) return setError("Please enter a valid WhatsApp number.");
    setError(""); setStatus("sending");
    try {
      await submitLead({ kind: "free-trial", name, phone, domain: subject, stage: level });
      addRequests([{
        name, studentName: name, phone, subject, level, mode: "Online", city: "", area: "", budget: "Not sure yet", times: [],
        start: "As soon as possible", frequency: "Not sure yet", gender: "No preference", goal: "Free trial lesson", message: "",
      }]);
      setStatus("sent");
    } catch {
      setStatus("idle");
      setError("We couldn't send your request. Please try again or message us on WhatsApp.");
    }
  };

  if (status === "sent") return (
    <div className="lp-done">
      <span><Tick size={34} /></span>
      <h2>Request <span className="serif">received</span></h2>
      <p>We'll send you matching tutors on WhatsApp within 24 hours.</p>
      <a className="s-btn s-ghost" href={site.whatsapp} target="_blank" rel="noopener noreferrer">Chat now on WhatsApp</a>
      <a href="/home">Explore the website →</a>
    </div>
  );

  return (
    <>
      <h2>Book your free trial</h2>
      <p className="sub">Takes 30 seconds. No account needed.</p>
      <form onSubmit={send} onChange={() => setError("")} noValidate>
        <label>Student or parent name<input name="name" type="text" placeholder="Your name" autoComplete="name" /></label>
        <label>WhatsApp number<input name="phone" type="tel" placeholder="+92 300 1234567" autoComplete="tel" /></label>
        <div className="two">
          <label>Subject<select name="subject">{["Maths", "Physics", "Chemistry", "Biology", "English", "IELTS", "MDCAT"].map((o) => <option key={o}>{o}</option>)}</select></label>
          <label>Level<select name="level">{["O / A Level", "Matric", "FSc", "University", "Other"].map((o) => <option key={o}>{o}</option>)}</select></label>
        </div>
        {error && <span className="s-err" role="alert">{error}</span>}
        <button className="s-btn s-coral" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Get my free trial"}</button>
        <p className="note">We'll reply on WhatsApp within 24 hours.</p>
      </form>
    </>
  );
}

export default function Landing() {
  return (
    <div className="lp">
      <div className="blob a" aria-hidden /><div className="blob b" aria-hidden /><div className="blob c" aria-hidden />

      <section id="form" className="s-wrap lp-hero">
        <div className="txt">
          <div className="s-eye"><i />Free trial lesson</div>
          <h1>Get a verified <span className="serif">tutor</span> in 24 hours</h1>
          <p className="lead">O/A Levels, Matric, FSc, IELTS and MDCAT. Tell us what you need — we'll match you and book your first lesson free.</p>
          <ul>{points.map((p) => <li key={p}><span><Tick size={16} /></span>{p}</li>)}</ul>
        </div>
        <div className="lp-card"><TrialForm /></div>
      </section>

      <StatBand items={[
        { icon: <People />, value: "500+", label: "Students guided" },
        { icon: <Shield />, value: "[120+]", label: "Verified tutors" },
        { icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>, value: "24 hrs", label: "To get matched" },
      ]} />

      <section className="s-wrap s-gap">
        <h2 className="s-h2 c">Three steps to your first <span className="serif">lesson</span></h2>
        <Steps items={[
          ["Tell us what you need", "Subject, level and your WhatsApp number."],
          ["Meet your matches", "We send 2–3 verified tutors that fit."],
          ["Free trial lesson", "Try it. Continue only if it's right."],
        ]} />
      </section>

      <section className="s-wrap s-gap lp-subj">
        <h2 className="s-h2 sm c">Subjects we <span className="serif">cover</span></h2>
        <div>{subjects.map((s) => <span key={s}>{s}</span>)}</div>
      </section>

      <section className="s-wrap s-gap">
        <figure className="lp-story">
          <span className="q" aria-hidden>“</span>
          <blockquote>[Real student or parent quote about their results, shared with consent.]</blockquote>
          <figcaption><span className="av">[AB]</span><span><b>[Student name]</b><small>[O Level Maths · A*]</small></span></figcaption>
        </figure>
      </section>

      <section className="s-narrow s-gap">
        <h2 className="s-h2 sm c">Quick <span className="serif">questions</span></h2>
        <Faq items={[
          ["Is the trial lesson really free?", "[Confirm trial policy — e.g. yes, the first 30-minute lesson is free with any tutor.]"],
          ["How much do lessons cost after that?", "Each tutor sets their own hourly rate. [Typical range per subject.]"],
          ["How are tutors verified?", "[Verification steps — documents, interview, demo lesson.]"],
        ]} />
      </section>

      <section className="s-wrap s-gap lp-end">
        <div>
          <h2>Your first lesson is on us.</h2>
          <div className="s-row">
            <a className="s-btn s-dark" href="#form">Get my free trial</a>
            <a className="s-btn s-line" href={site.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp us</a>
          </div>
        </div>
      </section>
    </div>
  );
}
