import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Star } from "lucide-react";
import { useState } from "react";
import { site, type Story } from "../../content/site";
import { ease, spring, useReducedMotion } from "../../lib/animations";
import { Avatar, domainColor } from "../ui/Brand";
import { Marquee } from "../ui/Marquee";
import { Eyebrow, Reveal } from "../ui/Reveal";

const Chip = ({ s }: { s: Story }) => <span className="fchip" style={{ background: domainColor[s.domain] }}>{s.field}</span>;

function Featured() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const n = site.stories.length;
  const s = site.stories[i];
  const next = () => setI((v) => (v + 1) % n);
  const prev = () => setI((v) => (v - 1 + n) % n);
  const d = reduced ? 0 : 1;
  return (
    <div className="feat noise" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <span className="qm" aria-hidden>“</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={i} style={{ display: "contents" }}>
          <motion.div initial={{ opacity: 0, x: 40 * d, filter: reduced ? "none" : "blur(6px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} exit={{ opacity: 0, x: -40 * d, filter: reduced ? "none" : "blur(6px)" }} transition={{ duration: reduced ? 0.2 : 0.5, ease }}>
            <blockquote>“{s.quote}”</blockquote>
            <div className="who"><Avatar name={s.name} i={i} size={52} /><div><b>{s.name}</b><Chip s={s} /></div></div>
          </motion.div>
          <div className="ba">
            <motion.div className="b" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 * d }}>
              <small>Before</small>
              <span className="strike">{s.before}
                <svg viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden><motion.path d="M0 5 Q 25 0 50 5 T 100 4" fill="none" stroke="#FF6342" strokeWidth="2" initial={{ pathLength: reduced ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 * d, duration: 0.5 }} /></svg>
              </span>
            </motion.div>
            <motion.div initial={{ x: -12 * d, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.9 * d }} style={{ color: "var(--saffron)" }} aria-hidden><ArrowRight /></motion.div>
            <motion.div className="a" initial={{ opacity: 0, scale: reduced ? 1 : 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...spring, delay: 1.1 * d }}>
              <small style={{ color: "#9FE3D2" }}>After</small>
              <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden><motion.path d="M4 12l5 5 11-11" fill="none" stroke="#9FE3D2" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: reduced ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.4 * d, duration: 0.4 }} /></svg>
                <span className="t">{s.after}</span>
              </span>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="ctrl" style={{ gridColumn: "1 / -1" }}>
        <button className="ar" aria-label="Previous story" onClick={prev}><ArrowLeft size={18} /></button>
        <div className="dotsrow" role="group" aria-label="Choose story">
          {site.stories.map((st, k) => <button key={k} aria-label={`Story ${k + 1}: ${st.name}`} aria-current={k === i} onClick={() => setI(k)} />)}
        </div>
        <button className="ar" aria-label="Next story" onClick={next}><ArrowRight size={18} /></button>
        {!reduced && (
          <div className="tbar" aria-hidden>
            <i key={i} style={{ animation: "fill 7s linear forwards", animationPlayState: paused ? "paused" : "running" }} onAnimationEnd={next} />
          </div>
        )}
      </div>
    </div>
  );
}

const Card = ({ s, i }: { s: Story; i: number }) => (
  <article className="tc">
    <div className="stars" aria-label="5 out of 5 stars">{[0, 1, 2, 3, 4].map((k) => <Star key={k} size={16} fill="currentColor" />)}</div>
    <p>{s.quote}</p>
    <div className="who"><Avatar name={s.name} i={i} size={40} /><div><b>{s.name}</b><Chip s={s} /></div></div>
  </article>
);

export function Stories() {
  return (
    <section id="testimonials" className="sec alt">
      <div className="container">
        <div className="sec-head">
          <Eyebrow>Real stories</Eyebrow>
          <Reveal><h2>Success <em className="acc">stories</em></h2></Reveal>
          <Reveal delay={0.1}><p>Hear from students who transformed their careers with Career Gala</p></Reveal>
        </div>
        <Reveal><Featured /></Reveal>
      </div>
      <div className="marq" style={{ margin: "48px 0 0" }}>
        <Marquee label="More student stories">{site.stories.map((s, i) => <Card key={s.name} s={s} i={i} />)}</Marquee>
        <Marquee reverse>{[...site.stories].reverse().map((s, i) => <Card key={s.name} s={s} i={4 - i} />)}</Marquee>
      </div>
    </section>
  );
}
