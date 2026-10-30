import type { ReactNode } from "react";
import { Chat, Eyebrow, Icon, Packages, Steps } from "./SiteLayout";

const roadmap: [string, string, boolean?][] = [
  ["FSc Pre-Medical", "Target 85%+ in Biology & Chemistry"],
  ["MDCAT preparation", "6-month plan with weekly mocks"],
  ["University shortlist", "Public & private options, merit tracking", true],
  ["MBBS admission", ""],
];

const Service = ({ title, text, pts, icon, stroke, alt, chip }: { title: string; text: string; pts: string[]; icon: ReactNode; stroke?: string; alt?: boolean; chip?: string }) => (
  <article className={`lift${alt ? " alt" : ""}`}>
    <span className={`s-chip ${chip ?? ""}`}><Icon stroke={stroke}>{icon}</Icon></span>
    <h3>{title}</h3><p>{text}</p>
    <ul>{pts.map((t) => <li key={t}>✓ {t}</li>)}</ul>
  </article>
);

export default function Counselling() {
  return (
    <>
      <section className="s-wrap s-hero">
        <div className="txt">
          <Eyebrow>Career counselling</Eyebrow>
          <h1>Plan your <span className="serif">career</span> with confidence</h1>
          <p className="lead">One-on-one sessions with counsellors who understand Pakistan's education system — from choosing subjects after Matric to picking a university.</p>
          <div className="s-row">
            <a className="s-btn s-coral" href="/get-started">Book free consultation</a>
            <a className="s-btn s-ghost" href="/subjects">Take the career quiz</a>
          </div>
        </div>
        <div className="s-panel">
          <div className="cap">Sample roadmap</div>
          <div className="ttl">Pre-Medical → MBBS</div>
          <div className="cn-road">
            <i aria-hidden />
            {roadmap.map(([t, d, open], i) => (
              <div key={t}><span aria-hidden className={open ? "open" : i === roadmap.length - 1 ? "end" : ""} /><b>{t}</b>{d && <small>{d}</small>}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="s-wrap s-after">
        <Eyebrow>What we do</Eyebrow>
        <h2 className="s-h2">Our <span className="serif">services</span></h2>
        <div className="cn-serv">
          <Service title="Career counselling" text="Find the subjects, fields and careers that fit your strengths." pts={["Strengths & interest assessment", "Career path exploration", "University & program guidance"]} icon={<Chat />} />
          <Service alt chip="alt" title="Personalised roadmap" text="A clear action plan with milestones and timelines." pts={["Step-by-step milestones", "Skill recommendations", "Progress check-ins"]} icon={<><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z" /><path d="M9 4v14M15 6v14" /></>} />
          <Service chip="warm" stroke="#E5482A" title="Life skills training" text="Soft skills that help in interviews, university and work." pts={["Communication & presentation", "Time management", "Interview preparation"]} icon={<><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></>} />
        </div>
      </section>

      <section className="s-band">
        <div className="s-wrap">
          <h2 className="s-h2 c">How it <span className="serif">works</span></h2>
          <Steps min={230} items={[
            ["Discovery call", "Free 20-minute chat about your goals."],
            ["Assessment", "We map your strengths and interests."],
            ["Your roadmap", "A written plan for subjects, exams and unis."],
            ["Ongoing support", "Check-ins as you move forward."],
          ]} />
        </div>
      </section>

      <section className="s-wrap s-pad">
        <h2 className="s-h2 c tight">Choose a <span className="serif">package</span></h2>
        <p className="s-sub">Start free. Upgrade only if you want more support.</p>
        <Packages />
      </section>
    </>
  );
}
