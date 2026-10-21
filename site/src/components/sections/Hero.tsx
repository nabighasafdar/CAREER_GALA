import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { site } from "../../content/site";
import { ease, scrollToId, spring, useDesktopHover, useReducedMotion } from "../../lib/animations";
import { MagneticButton } from "../ui/MagneticButton";
import { PathDraw } from "../ui/PathDraw";

const words = ["Transform", "your", "career", "&", "life", "path"];
const TANGLE = "M40 470C90 410 150 500 125 440C100 380 40 405 82 445C130 490 210 420 172 382C140 350 92 385 132 412";
const ROAD = "M132 412C210 385 262 410 292 336S384 214 340 164S404 92 432 72";

const cards = [
  { t: "🎓 University chosen", l: "2%", top: "63%", d: 0.9, phase: 0 },
  { t: "🧭 Roadmap ready", l: "52%", top: "50%", d: 1.2, phase: 1.3 },
  { t: "💼 Internship secured", l: "30%", top: "13%", d: 1.5, phase: 2.4 },
];

export function Hero() {
  const reduced = useReducedMotion();
  const desktop = useDesktopHover();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const vScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const vOp = useTransform(scrollYProgress, [0, 1], [1, 0.6]);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 20 }), sy = useSpring(my, { stiffness: 80, damping: 20 });
  const bx = useTransform(sx, (v) => v * -1.2), by = useTransform(sy, (v) => v * -1.2);

  const onMove = (e: React.MouseEvent) => {
    if (!desktop || reduced) return;
    mx.set(((e.clientX / window.innerWidth) - 0.5) * -24);
    my.set(((e.clientY / window.innerHeight) - 0.5) * -24);
  };
  const t = (d: number) => ({ initial: { opacity: 0, y: reduced ? 0 : 16 }, animate: { opacity: 1, y: 0 }, transition: { delay: reduced ? 0 : d, duration: reduced ? 0.2 : 0.6, ease } });

  return (
    <section id="home" className="hero" ref={ref} onMouseMove={onMove}>
      <motion.div className="blob" aria-hidden style={{ width: 520, height: 520, background: "#9FE3D2", top: -160, right: -120, x: bx, y: by }}
        animate={reduced ? undefined : { scale: [1, 1.12, 1], x: [0, -30, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="blob" aria-hidden style={{ width: 460, height: 460, background: "#FFC2B3", bottom: -100, left: -140 }}
        animate={reduced ? undefined : { scale: [1, 1.15, 1], y: [0, -30, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} />
      <div className="container hero-grid">
        <div>
          <motion.div className="eyebrow" initial={{ opacity: 0, x: reduced ? 0 : -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease }}>
            <i aria-hidden />{site.hero.eyebrow}
          </motion.div>
          <h1 aria-label="Transform your career & life path">
            {words.map((w, i) => (
              <span key={i} aria-hidden>
                <span className="mask"><motion.span initial={{ y: reduced ? 0 : "110%" }} animate={{ y: 0 }} transition={{ delay: reduced ? 0 : 0.1 + i * 0.07, duration: reduced ? 0.01 : 0.7, ease }}>
                  {w === "career" ? <em className="acc shimmer">{w}</em> : w}
                </motion.span></span>{" "}
              </span>
            ))}
          </h1>
          <motion.p className="sub" {...t(0.5)}>{site.hero.sub}</motion.p>
          <motion.p className="body" {...t(0.55)}>{site.hero.body}</motion.p>
          <motion.div className="ctas" initial={{ opacity: 0, scale: reduced ? 1 : 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...spring, delay: reduced ? 0 : 0.7 }}>
            <MagneticButton className="btn-primary" onClick={() => scrollToId("contact")}>Book your free consultation <ArrowRight size={18} /></MagneticButton>
                      </motion.div>
          <motion.div className="trust" {...t(0.9)}>
            <div className="avs" aria-hidden>{["AK", "HA", "FM", "UA"].map((n, i) => <span className="av" key={n} style={{ background: ["linear-gradient(135deg,#157A67,#1F8F7A)", "linear-gradient(135deg,#1F8F7A,#0EA5C6)", "linear-gradient(135deg,#E8579A,#FF6342)", "linear-gradient(135deg,#157A67,#E8579A)"][i] }}>{n}</span>)}</div>
            <span>{site.hero.trust}</span>
          </motion.div>
        </div>

        <motion.div className="vis" style={{ scale: vScale, opacity: vOp }} aria-hidden>
          <svg className="path" viewBox="0 0 500 520">
            <PathDraw d={TANGLE} stroke="#8A97AD" width={3.5} duration={0.6} />
            <PathDraw d={ROAD} width={8} duration={1.1} delay={0.5} />
            <motion.g initial={{ opacity: 0, scale: reduced ? 1 : 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: reduced ? 0 : 1.6, ...spring }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <circle className="pinring" cx="432" cy="72" r="14" fill="#FF6342" />
              <circle cx="432" cy="72" r="14" fill="#FF6342" />
              <circle cx="432" cy="72" r="5.5" fill="#fff" />
            </motion.g>
          </svg>
          {cards.map((c) => (
            <motion.div key={c.t} style={{ position: "absolute", left: c.l, top: c.top, x: sx, y: sy }}>
              <motion.div className="mini" initial={{ opacity: 0, scale: reduced ? 1 : 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...spring, delay: reduced ? 0 : c.d }}>
                <motion.span animate={reduced ? undefined : { y: [-6, 6, -6] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: c.phase }}>{c.t}</motion.span>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
