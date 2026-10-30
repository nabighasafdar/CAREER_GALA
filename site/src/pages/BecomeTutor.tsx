import type { ReactNode } from "react";
import { Calendar, Eyebrow, Faq, Icon, People, Tick } from "./SiteLayout";

const needs = ["A degree or strong expertise in your subject", "CNIC or passport for identity checks", "A 1–2 minute intro video", "Willing to give a free demo class", "Stable internet (for online lessons)"];
const steps: [string, string][] = [
  ["Apply", "A 7-step form — about 15 minutes"],
  ["Get verified", "Documents, ID and a short interview"],
  ["Set your rate & hours", "Your profile goes live in search"],
  ["Teach", "Accept bookings and give lessons"],
  ["Get paid", "Payouts every [2 weeks] · platform fee [—%]"],
];

const Benefit = ({ title, text, chip, stroke, children }: { title: string; text: string; chip?: string; stroke?: string; children: ReactNode }) => (
  <div className="lift"><span className={`s-chip ${chip ?? ""}`}><Icon stroke={stroke}>{children}</Icon></span><h3>{title}</h3><p>{text}</p></div>
);

export default function BecomeTutor() {
  return (
    <>
      <section className="s-wrap s-hero">
        <div className="txt">
          <Eyebrow>For teachers</Eyebrow>
          <h1>Teach on <span className="serif">your</span> terms</h1>
          <p className="lead">Set your own rate and hours, teach online or at home, and get matched with students across Pakistan.</p>
          <div className="s-row">
            <a className="s-btn s-coral" href="/signup?role=teach">Apply as a Tutor</a>
            <a className="s-btn s-ghost" href="#requirements">See requirements</a>
          </div>
        </div>
        <div className="s-panel bt-panel" aria-hidden>
          <div className="bk"><span className="av">AK</span><div><b>New booking request</b><small>O Level Maths · Sat 4:00 pm</small></div></div>
          <div className="two"><span>Decline</span><span className="ok">Accept</span></div>
          <div className="rate"><span>Your rate</span><b>You decide</b></div>
        </div>
      </section>

      <section className="s-wrap s-after">
        <h2 className="s-h2 flushtop">Why teach <span className="serif">here</span></h2>
        <div className="bt-why">
          <Benefit title="Students come to you" text="Once verified, your profile appears in search and in our matching."><People /></Benefit>
          <Benefit title="Your schedule" text="Pick your hours and accept only the bookings that suit you."><Calendar /></Benefit>
          <Benefit chip="warm" stroke="#E5482A" title="Reliable payouts" text="Paid to JazzCash, Easypaisa or your bank account."><path d="M12 2v20M17 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></Benefit>
        </div>
      </section>

      <section id="requirements" className="s-band">
        <div className="s-wrap bt-req">
          <div>
            <Eyebrow>Who can apply</Eyebrow>
            <h2 className="s-h2 sm">What you'll <span className="serif">need</span></h2>
            <ul>{needs.map((n) => <li key={n}><Tick />{n}</li>)}</ul>
          </div>
          <div>
            <Eyebrow>How it works</Eyebrow>
            <h2 className="s-h2 sm">From application to <span className="serif">first lesson</span></h2>
            <ol>
              {steps.map(([t, d], i) => (
                <li key={t}><span className={i === steps.length - 1 ? "last" : ""}>{i + 1}</span><div><b>{t}</b><small>{d}</small></div></li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="s-narrow s-pad">
        <h2 className="s-h2 sm c">Tutor <span className="serif">questions</span></h2>
        <Faq items={[
          ["How long does verification take?", "Usually [2–3 working days] after you submit everything."],
          ["How much does Career Gala charge?", "[Platform fee or commission — to be confirmed by the client.]"],
          ["Can I teach part-time?", "Yes. You choose your hours and can pause bookings any time."],
        ]} />
        <div className="s-center"><a className="s-btn s-coral" href="/signup?role=teach">Apply as a Tutor</a></div>
      </section>
    </>
  );
}
