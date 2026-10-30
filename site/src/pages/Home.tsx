import { useEffect, useState } from "react";
import { tutors } from "../content/site";
import { Calendar, Chat, Eyebrow, Icon, People, Shield, StatBand, Steps } from "./SiteLayout";

const words = ["doctor", "engineer", "designer", "entrepreneur"];

const categories = [
  { name: "School subjects", icon: <path d="M4 19V5a2 2 0 012-2h12v16H6a2 2 0 00-2 2zm0 0a2 2 0 002 2h12" /> },
  { name: "O / A Levels", icon: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" /></> },
  { name: "English", icon: <Chat /> },
  { name: "IELTS / TOEFL", icon: <path d="M3 11l18-8-8 18-2-8-8-2z" /> },
  { name: "MDCAT & Medical", icon: <><path d="M6 3v6a6 6 0 0012 0V3M12 15v3a3 3 0 006 0v-2" /><circle cx="18" cy="14" r="2" /></> },
  { name: "Professional", icon: <path d="M8 9l-4 3 4 3M16 9l4 3-4 3" /> },
];

const Float = ({ className, children }: { className: string; children: React.ReactNode }) => <div className={`float ${className}`}>{children}</div>;

export default function Home() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % words.length), 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <section className="s-wrap hm-hero">
        <div className="txt">
          <Eyebrow>Tutoring &amp; career guidance</Eyebrow>
          <h1>Find your <span className="serif">tutor</span><br />&amp; your path</h1>
          <p className="kick">Learn with verified tutors, or plan your career</p>
          <p className="lead">School subjects, O/A Levels, IELTS and MDCAT — plus counsellors who help you become a <span className="rot" key={words[i]}>{words[i]}</span>.</p>
          <div className="s-row">
            <a className="s-btn s-coral" href="/find-tutor">Find a Tutor <Icon size={16} stroke="currentColor" width={2.2}><path d="M5 12h14M13 6l6 6-6 6" /></Icon></a>
            <a className="s-btn s-ghost" href="/get-started">Book free consultation</a>
          </div>
          <div className="trust">
            <div aria-hidden>{[["AK", "#1F8F7A"], ["HA", "#1C9AB0"], ["FM", "#E2536F"], ["UA", "#6E5B8F"]].map(([n, c]) => <span key={n} style={{ background: c }}>{n}</span>)}</div>
            <span>500+ students guided · Online &amp; home tuition</span>
          </div>
        </div>
        <div className="vis" aria-hidden>
          <svg width="100%" height="460" viewBox="0 0 460 460" preserveAspectRatio="xMidYMid meet">
            <path d="M40 400 c30-30 60-30 70-10 s-20 40-40 20 10-60 50-50 40 50 10 60 -40-40 10-50" stroke="#8FA3AE" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".7" />
            <path d="M140 370 C 220 350, 260 340, 300 300 S 360 210, 350 170 S 320 110, 360 80 S 410 50, 420 40" stroke="#1F8F7A" strokeWidth="6" fill="none" strokeLinecap="round" />
            <circle cx="420" cy="40" r="13" fill="#FF6342" /><circle cx="420" cy="40" r="5" fill="#FFFFFF" />
          </svg>
          <Float className="f1"><Icon size={16} stroke="#102027" width={2}><path d="M2 9l10-5 10 5-10 5z" /><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" /></Icon>Trial booked</Float>
          <Float className="f2"><Icon size={16} stroke="#102027" width={2}><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></Icon>Roadmap ready</Float>
          <Float className="f3"><Icon size={16} stroke="#102027" width={2}><path d="M20 6L9 17l-5-5" /></Icon>Band 7.5 achieved</Float>
        </div>
      </section>

      <StatBand items={[
        { icon: <People />, value: "500+", label: "Students guided" },
        { icon: <Shield />, value: "[120+]", label: "Verified tutors" },
        { icon: <><circle cx="12" cy="9" r="5" /><path d="M9 13.5L8 21l4-2 4 2-1-7.5" /></>, value: "10+", label: "Years experience" },
      ]} />

      <section className="s-wrap hm-gap">
        <Eyebrow>Subjects</Eyebrow>
        <h2 className="s-h2 big">What will you <span className="serif">learn</span>?</h2>
        <div className="hm-cats">
          {categories.map((c) => <a key={c.name} className="lift" href="/subjects"><span className="s-chip"><Icon>{c.icon}</Icon></span>{c.name}</a>)}
        </div>
      </section>

      <section className="s-wrap hm-gap">
        <div className="hm-head">
          <div>
            <Eyebrow>Featured</Eyebrow>
            <h2 className="s-h2 big flush">Meet our <span className="serif">tutors</span></h2>
          </div>
          <a className="more" href="/find-tutor">View all tutors →</a>
        </div>
        <div className="hm-tutors">
          {tutors.slice(0, 4).map((t) => (
            <a key={t.ini} className="lift" href="/tutor/profile">
              <span className="av" style={{ background: t.bg }}>{t.ini}</span>
              <span><b>{t.name}</b><small>{t.short ?? t.subj}</small></span>
              <span className="meta"><span><i>★</i> {t.rating}</span><span>Rs [{t.rate.toLocaleString("en-PK")}]<em>/hr</em></span></span>
            </a>
          ))}
        </div>
      </section>

      <section className="s-wrap hm-gap">
        <Eyebrow>The process</Eyebrow>
        <h2 className="s-h2 big">How it <span className="serif">works</span></h2>
        <Steps items={[
          ["Search", "Pick a subject and find a verified tutor.", <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.5-4.5" /></>],
          ["Book a trial", "Choose a time — online or at home.", <Calendar />],
          ["Start learning", "Track every lesson in your dashboard.", <path d="M3 20l6-6 4 4 8-8M15 10h6v6" />],
        ]} />
      </section>

      <section className="s-wrap hm-paths">
        <div>
          <span className="s-chip alt"><Icon><Chat /></Icon></span>
          <h2>Career counselling</h2>
          <p>Not sure what to study next? Talk to a counsellor and get a clear roadmap.</p>
          <a href="/counselling">Book free consultation →</a>
        </div>
        <a className="teach" href="/signup?role=teach">
          <span><b>Teach on Career Gala</b><span>Set your own rate and hours. We bring the students.</span></span>
          <span className="go"><Icon size={20} stroke="#FFFFFF" width={2}><path d="M7 17L17 7M8 7h9v9" /></Icon></span>
        </a>
      </section>
    </>
  );
}
