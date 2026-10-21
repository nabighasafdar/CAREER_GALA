import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowRight, Check, ClipboardCheck, LifeBuoy, Map, PhoneCall } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { site } from "../../content/site";
import { ease, scrollToId, useMedia, useReducedMotion, viewport } from "../../lib/animations";
import { Eyebrow, Reveal } from "../ui/Reveal";

const icons = [PhoneCall, ClipboardCheck, Map, LifeBuoy];
const ROAD = "M60 0C60 40 90 40 90 80C90 140 30 160 30 240C30 320 90 320 90 400C90 480 30 480 30 560C30 600 60 610 60 640";
const NODES = [{ x: 90, y: 80 }, { x: 30, y: 240 }, { x: 90, y: 400 }, { x: 30, y: 560 }];

function Head() {
  return (
    <>
      <Eyebrow>The process</Eyebrow>
      <Reveal><h2>How it <em className="acc">works</em></h2></Reveal>
      <Reveal delay={0.1}><p style={{ marginTop: 16 }}>A simple, proven process to guide you from confusion to clarity</p></Reveal>
    </>
  );
}

function StepCard({ i, dim }: { i: number; dim?: boolean }) {
  const s = site.steps[i]; const I = icons[i];
  return (
    <div className={`step${dim ? " dim" : ""}`}>
      <span className="num" aria-hidden>0{i + 1}</span>
      <div className="chip-i"><I /></div>
      <h3>{s.title}</h3><p>{s.body}</p>
    </div>
  );
}

/** Desktop: pinned, scroll-scrubbed road driven by GSAP ScrollTrigger (loaded lazily). */
function Pinned() {
  const root = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGGElement>(null);
  const [active, setActive] = useState(-1);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let kill = () => {};
    let cancelled = false;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled || !root.current || !pathRef.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const path = pathRef.current; const len = path.getTotalLength();
      path.style.strokeDasharray = `${len}`; path.style.strokeDashoffset = `${len}`;
      // length along the path at which each node is reached
      const at = NODES.map((n) => { for (let l = 0; l <= len; l += 2) if (path.getPointAtLength(l).y >= n.y) return l / len; return 1; });
      let last = -1, fin = false;
      const st = ScrollTrigger.create({
        trigger: root.current, start: "top top", end: "+=250%", pin: true, scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          path.style.strokeDashoffset = `${len * (1 - p)}`;
          const pt = path.getPointAtLength(len * p);
          dotRef.current?.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
          const idx = at.reduce((a, f, i) => (p >= f ? i : a), -1);
          if (idx !== last) { last = idx; setActive(idx); }
          const d = p > 0.985; if (d !== fin) { fin = d; setDone(d); }
        },
      });
      kill = () => st.kill();
    })();
    return () => { cancelled = true; kill(); };
  }, []);

  return (
    <div ref={root} className="how" style={{ minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: 80 }}>
      <div className="container how-grid" style={{ width: "100%" }}>
        <div>
          <Head />
          <div className="bigcount" aria-live="polite" aria-label={`Step ${Math.max(active, 0) + 1} of 4`}>
            <span style={{ display: "block", overflow: "hidden", height: "1.05em" }}>
              <span className="roll" style={{ transform: `translateY(${-Math.max(active, 0) * 1.05}em)` }}>
                {[1, 2, 3, 4].map((n) => <span key={n} style={{ display: "block", height: "1.05em" }}>0{n}</span>)}
              </span>
            </span>
            <small>/ 04</small>
          </div>
          <div className="segs" aria-hidden>{[0, 1, 2, 3].map((i) => <i key={i} className={active >= i ? "on" : ""} />)}</div>
        </div>
        <div className="road" style={{ height: 680 }}>
          <svg viewBox="0 0 120 640" preserveAspectRatio="none" style={{ height: 640, top: 20 }} aria-hidden>
            <path d={ROAD} fill="none" stroke="var(--line)" strokeWidth="5" strokeLinecap="round" />
            <path ref={pathRef} d={ROAD} fill="none" stroke="url(#clarity)" strokeWidth="5" strokeLinecap="round" />
            {NODES.map((n, i) => (
              <g key={i}>
                {active >= i && <circle className="rip" cx={n.x} cy={n.y} r="9" fill="none" stroke="#1F8F7A" strokeWidth="2" />}
                <motion.circle cx={n.x} cy={n.y} r="9" stroke="url(#clarity)" strokeWidth="3" animate={{ fill: active >= i ? "#1F8F7A" : "#ffffff", scale: active === i ? [1, 1.3, 1] : 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} transition={{ duration: 0.5 }} />
              </g>
            ))}
            <g ref={dotRef} transform="translate(60 0)">
              <circle r="14" fill="#FF6342" opacity=".25" /><circle r="8" fill="#FF6342" />
              {done && <path d="M-4 0l3 3 5-6" stroke="#102027" strokeWidth="2" fill="none" strokeLinecap="round" />}
            </g>
          </svg>
          {NODES.map((n, i) => (
            <div key={i} className={`row ${i % 2 === 0 ? "l" : "r"}`} style={{ top: n.y - 80 + 20 }}>
              <div style={{ width: "calc(50% - 44px)" }}><StepCard i={i} dim={active < i} /></div>
            </div>
          ))}
          <motion.button className="btn btn-primary roadcta" initial={false} animate={{ opacity: done ? 1 : 0, y: done ? 0 : 12, pointerEvents: done ? "auto" : "none" }} onClick={() => scrollToId("contact")} tabIndex={done ? 0 : -1}>
            <Check size={18} /> Ready to start? Book your discovery call <ArrowRight size={18} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

/** Mobile / reduced motion: plain vertical timeline whose rail fills on scroll. */
function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  return (
    <div className="how sec">
      <div className="container">
        <div className="sec-head"><Head /></div>
        <div className="tline" ref={ref}>
          <div className="rail" aria-hidden />
          <motion.div className="fill" style={{ scaleY: reduced ? 1 : fill }} aria-hidden />
          {site.steps.map((_, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: reduced ? 0 : 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={viewport} transition={{ duration: 0.6, ease }}>
              <StepCard i={i} />
            </motion.div>
          ))}
        </div>
        <div style={{ marginTop: 32, textAlign: "center" }}>
          <button className="btn btn-primary" onClick={() => scrollToId("contact")}>Ready to start? Book your discovery call <ArrowRight size={18} /></button>
        </div>
      </div>
    </div>
  );
}

export function HowItWorks() {
  const wide = useMedia("(min-width: 1024px)");
  const reduced = useReducedMotion();
  return <section id="how-it-works">{wide && !reduced ? <Pinned /> : <Timeline />}</section>;
}
