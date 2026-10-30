import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, Clock, Compass, Heart, MessageCircle, Mic, Route, Users, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { site } from "../../content/site";
import { ease, scrollToId, viewport, useReducedMotion } from "../../lib/animations";
import { Eyebrow, Reveal } from "../ui/Reveal";
import { TiltCard } from "../ui/TiltCard";

type Svc = (typeof site.services)["counselling"];

function Wipe({ i, className, children }: { i: number; className: string; children: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.div className={className}
      initial={reduced ? { opacity: 0 } : { clipPath: "inset(100% 0 0 0)", y: 24 }}
      whileInView={reduced ? { opacity: 1 } : { clipPath: "inset(0% 0 0 0)", y: 0 }}
      viewport={viewport} transition={{ duration: 0.6, delay: i * 0.12, ease }}>
      {children}
    </motion.div>
  );
}
const inner = (n: number) => ({ initial: { opacity: 0, y: 12 }, whileInView: { opacity: 1, y: 0 }, viewport, transition: { delay: 0.35 + n * 0.06, duration: 0.5, ease } });

function Checks({ points, open }: { points: string[]; open?: boolean }) {
  return (
    <ul className="checks collapsible" data-open={open ?? true}>
      {points.map((p) => <li key={p}><Check size={18} strokeWidth={2.25} />{p}</li>)}
    </ul>
  );
}

function Learn({ s, onOpen }: { s: Svc; onOpen: () => void }) {
  return <button className="more" onClick={onOpen} aria-haspopup="dialog">Learn more <ArrowRight size={16} /></button>;
}

function Chat() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? 5 : 0);
  useEffect(() => {
    if (!inView || reduced) return;
    // 0 typing, 1 c1, 2 s1, 3 typing, 4 c2 ... loop every 6s
    const seq = [0, 600, 1700, 2800, 3700, 6000];
    const ts = seq.map((ms, i) => setTimeout(() => setN(i), ms));
    const loop = setInterval(() => { setN(0); seq.forEach((ms, i) => ts.push(setTimeout(() => setN(i), ms))); }, 6000);
    return () => { ts.forEach(clearTimeout); clearInterval(loop); };
  }, [inView, reduced]);
  return (
    <div className="chat" ref={ref} aria-hidden>
      <AnimatePresence initial={false}>
        {n === 0 && <motion.div key="t0" className="dots" exit={{ opacity: 0 }}><i /><i /><i /></motion.div>}
        {n >= 1 && <motion.div key="c1" className="bub c" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>Which subjects do you enjoy most?</motion.div>}
        {n === 2 && <motion.div key="t2" className="dots" style={{ justifySelf: "end" }} exit={{ opacity: 0 }}><i /><i /><i /></motion.div>}
        {n >= 3 && <motion.div key="s1" className="bub s" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>Biology, but my family wants engineering…</motion.div>}
        {n === 4 && <motion.div key="t4" className="dots" exit={{ opacity: 0 }}><i /><i /><i /></motion.div>}
        {n >= 5 && <motion.div key="c2" className="bub c" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>Let's map options that honour both.</motion.div>}
      </AnimatePresence>
    </div>
  );
}

export function Services() {
  const sv = site.services;
  const [dlg, setDlg] = useState<Svc | null>(null);
  const [openB, setOpenB] = useState(false);
  const [openC, setOpenC] = useState(false);
  const reduced = useReducedMotion();
  const skills = [Mic, Clock, Users, Heart];

  useEffect(() => {
    if (!dlg) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setDlg(null);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [dlg]);

  return (
    <section id="services" className="sec">
      <div className="container">
        <div className="sec-head">
          <Eyebrow>What we do</Eyebrow>
          <Reveal><h2>Our <em className="acc">services</em></h2></Reveal>
          <Reveal delay={0.1}><p>{sv.sub}</p></Reveal>
        </div>
        <div className="bento">
          <Wipe i={0} className="g-A">
            <TiltCard className="A">
              <motion.div {...inner(0)}><Chat /></motion.div>
              <motion.div {...inner(1)}><div className="chip-i"><MessageCircle /></div><h3>{sv.counselling.title}</h3><p>{sv.counselling.body}</p></motion.div>
              <motion.div {...inner(2)}><Checks points={sv.counselling.points} /><Learn s={sv.counselling} onOpen={() => setDlg(sv.counselling)} /></motion.div>
            </TiltCard>
          </Wipe>
          <Wipe i={1} className="g-B">
            <TiltCard className="B">
              <motion.div {...inner(0)}><div className="chip-i"><Route /></div><h3>{sv.roadmap.title}</h3><p>{sv.roadmap.body}</p></motion.div>
              <button className="more acc-toggle" aria-expanded={openB} onClick={() => setOpenB(!openB)}>{openB ? "Hide" : "Show"} what's included</button>
              <div className="collapsible" data-open={openB}>
                <ul className="tl" style={{ paddingLeft: 28 }}>
                  <motion.span className="line" aria-hidden initial={{ scaleY: reduced ? 1 : 0 }} whileInView={{ scaleY: 1 }} viewport={viewport} transition={{ duration: 1, delay: 0.3, ease }} />
                  {sv.roadmap.points.map((p, i) => (
                    <motion.li key={p} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={viewport} transition={{ delay: 0.4 + i * 0.2, duration: 0.4, ease }}>{p}</motion.li>
                  ))}
                </ul>
              </div>
              <Learn s={sv.roadmap} onOpen={() => setDlg(sv.roadmap)} />
            </TiltCard>
          </Wipe>
          <Wipe i={2} className="g-C">
            <TiltCard className="C">
              <motion.div {...inner(0)}><div className="chip-i"><Compass /></div><h3>{sv.life.title}</h3><p>{sv.life.body}</p></motion.div>
              <button className="more acc-toggle" aria-expanded={openC} onClick={() => setOpenC(!openC)}>{openC ? "Hide" : "Show"} what's included</button>
              <div className="collapsible" data-open={openC}>
                <div className="pills" style={{ marginBottom: 20 }}>
                  {sv.life.points.map((p, i) => { const I = skills[i]; return <span className="pill" key={p}><I size={18} />{p}</span>; })}
                </div>
              </div>
              <Learn s={sv.life} onOpen={() => setDlg(sv.life)} />
            </TiltCard>
          </Wipe>
          <Wipe i={3} className="g-D">
            <a href="/contact" style={{ display: "flex", flex: 1 }}>
              <TiltCard className="D" style={{ flex: 1 }}>
                <div><h3>Free first consultation</h3><p style={{ marginTop: 8 }}>Tell us where you are. We'll help you see where you could go.</p></div>
                <span className="arrow"><ArrowUpRight /></span>
              </TiltCard>
            </a>
          </Wipe>
        </div>
      </div>
      <AnimatePresence>
        {dlg && (
          <motion.div className="dlg-bg" onClick={() => setDlg(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="dlg" role="dialog" aria-modal="true" aria-label={dlg.title} onClick={(e) => e.stopPropagation()}
              initial={{ y: 30, opacity: 0, scale: 0.96 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.35, ease }}>
              <button className="x" aria-label="Close" onClick={() => setDlg(null)} autoFocus><X /></button>
              <h3>{dlg.title}</h3><p style={{ marginBottom: 14 }}>{dlg.body}</p><p style={{ marginBottom: 18 }}>{dlg.more}</p>
              <button className="btn btn-primary" onClick={() => { setDlg(null); scrollToId("contact"); }}>Book free consultation</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
