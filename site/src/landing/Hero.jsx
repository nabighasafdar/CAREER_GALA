
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { site } from "./content";
import { Star4, Globe, Orbit, Compass } from "./bits";

const GREETINGS = ["Hello", "Salam", "Aadaab", "Welcome"];

function Greeting() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % GREETINGS.length), 1400);
    return () => clearInterval(t);
  }, []);
  return <span lang="">{GREETINGS[i]}!</span>;
}

// Sticker layout: position in % of the hero, resting rotation, parallax depth
const STICKERS = [
  { l: 9, t: 30, r: -14, d: 1.2, el: <div className="sticker__body st-round" style={{ background: "linear-gradient(140deg,#2453e6,#16a36a)", color: "#fff", fontWeight: 700, fontSize: 26 }}>{site.initials}</div> },
  { l: 60, t: 11, r: 8, d: 0.8, el: <div className="sticker__body st-oval"><Greeting /></div> },
  { l: 81, t: 58, r: 12, d: 1.4, el: <div className="sticker__body st-round" style={{ background: "#0b1b34", color: "#f5a524" }}><span style={{ fontSize: 40, display: "grid" }}><Compass /></span></div> },
  { l: 84, t: 17, r: -10, d: 0.9, desk: true, el: <div className="sticker__body st-chip" style={{ background: "#0b1b34", color: "#f5a524", fontSize: 15 }}>KHI · LHE · ISB</div> },
  { l: 21, t: 66, r: 10, d: 1.1, el: (
      <div className="sticker__body st-square" style={{ background: "#f5a524", position: "relative" }}>
        <svg viewBox="0 0 24 24" width="55%" fill="none" stroke="#0b1b34" strokeWidth="3"><path d="M5 12.5l5 5 9-10" /></svg>
      </div>) },
  { l: 36, t: 72, r: -6, d: 1.3, el: <div className="sticker__body st-chip">🎓 University chosen</div> },
  { l: 62, t: 78, r: 6, d: 1, desk: true, el: <div className="sticker__body st-chip" style={{ background: "#eef3ff" }}>💼 Internship secured</div> },
  { l: 4, t: 55, r: -20, d: 1.5, el: <div className="sticker__body st-round" style={{ background: "#ff8a3d", color: "#fff", fontWeight: 700, fontSize: 34 }}>?</div> },
  { l: 30, t: 12, r: -8, d: 0.7, desk: true, el: <div className="sticker__body st-chip" style={{ background: "#fff5e3" }}>🧭 Roadmap ready</div> },
];

const GLINTS = [
  { l: 30, t: 30 }, { l: 46, t: 26 }, { l: 63, t: 33 }, { l: 74, t: 38 }, { l: 39, t: 52 }, { l: 57, t: 47 },
];

export default function Hero({ ready }) {
  const root = useRef(null);
  const reveal = useRef(null);
  const word = useRef(null);
  const tl = useRef(null);
  const long = site.firstName.length > 8;

  // Initial hidden state + scroll choreography (set up once)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(reveal.current, { attr: { width: 0 } });
      gsap.set(word.current, { filter: "blur(14px)", opacity: 0.3 });
      gsap.set(".s-drop", { y: () => -window.innerHeight * 1.1, rotation: () => gsap.utils.random(-120, 120), opacity: 0 });
      gsap.set(".hero__bottom > *", { y: 30, opacity: 0 });

      // Idle wobble
      gsap.utils.toArray(".s-float").forEach((el) => {
        gsap.to(el, {
          y: gsap.utils.random(-14, 14),
          rotation: gsap.utils.random(-7, 7),
          duration: gsap.utils.random(2.4, 4),
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      // Scroll: stickers fly up & scatter, wordmark dissolves
      const st = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.8 },
      });
      st.to(word.current, { scale: 0.86, yPercent: -12, opacity: 0, filter: "blur(10px)", ease: "none" }, 0)
        .to(".glint", { opacity: 0, duration: 0.2 }, 0)
        .to(".hero__bottom", { opacity: 0, y: -40, duration: 0.35 }, 0)
        .to(".hero__grid", { opacity: 0, duration: 0.6 }, 0);
      gsap.utils.toArray(".s-scroll").forEach((el, i) => {
        st.to(
          el,
          {
            y: () => -window.innerHeight * gsap.utils.random(0.9, 1.6),
            x: () => gsap.utils.random(-120, 120),
            rotation: gsap.utils.random(-160, 160),
            ease: "power1.in",
          },
          0.02 * i
        );
      });

      // Mouse parallax
      const movers = gsap.utils.toArray(".s-mouse").map((el) => ({
        x: gsap.quickTo(el, "x", { duration: 0.8, ease: "power3" }),
        y: gsap.quickTo(el, "y", { duration: 0.8, ease: "power3" }),
        d: parseFloat(el.dataset.depth),
      }));
      const onMove = (e) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        movers.forEach((m) => { m.x(nx * 40 * m.d); m.y(ny * 30 * m.d); });
      };
      window.addEventListener("pointermove", onMove);
      return () => window.removeEventListener("pointermove", onMove);
    }, root);
    return () => ctx.revert();
  }, []);

  // Intro sequence once the preloader lifts
  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      tl.current = gsap
        .timeline({ delay: 0.25 })
        .to(reveal.current, { attr: { width: 1500 }, duration: 1.9, ease: "power2.inOut" }, 0)
        .to(word.current, { filter: "blur(0px)", opacity: 1, duration: 1.6, ease: "power2.out" }, 0.1)
        .to(".s-drop", { y: 0, rotation: 0, opacity: 1, duration: 1.4, ease: "elastic.out(1, 0.65)", stagger: { each: 0.08, from: "random" } }, 0.9)
        .to(".hero__bottom > *", { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.1 }, 1.2)
        .add(() => {
          gsap.utils.toArray(".glint").forEach((g) => {
            gsap.timeline({ repeat: -1, repeatDelay: gsap.utils.random(1.5, 4), delay: gsap.utils.random(0, 2) })
              .fromTo(g, { scale: 0, rotation: 0, opacity: 0 }, { scale: 1, rotation: 90, opacity: 1, duration: 0.45, ease: "power2.out" })
              .to(g, { scale: 0, rotation: 180, opacity: 0, duration: 0.45, ease: "power2.in" });
          });
        }, 1.6);
    }, root);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section className="hero" id="top" ref={root} aria-label="Intro">
      <div className="hero__sticky">
        <div className="hero__grid" aria-hidden="true" />

        <svg className="wordmark" ref={word} viewBox="0 0 1200 420" role="img" aria-label={site.name}>
          <defs>
            <linearGradient id="glassFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f4f6fb" />
              <stop offset=".55" stopColor="#e2ddd8" />
              <stop offset="1" stopColor="#d3cdc7" />
            </linearGradient>
            <filter id="glass" x="-10%" y="-30%" width="120%" height="170%" colorInterpolationFilters="sRGB">
              <feGaussianBlur in="SourceAlpha" stdDeviation="10" result="sb" />
              <feOffset in="sb" dy="18" result="so" />
              <feFlood floodColor="#5a5048" floodOpacity="0.2" />
              <feComposite in2="so" operator="in" result="shadow" />
              <feOffset in="SourceAlpha" dx="-5" dy="-7" result="up" />
              <feComposite in="SourceAlpha" in2="up" operator="out" result="edge" />
              <feGaussianBlur in="edge" stdDeviation="3" result="edgeB" />
              <feFlood floodColor="#8d847c" floodOpacity="0.55" />
              <feComposite in2="edgeB" operator="in" result="shade" />
              <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="bump" />
              <feSpecularLighting in="bump" surfaceScale="6" specularConstant="1.1" specularExponent="26" lightingColor="#ffffff" result="spec">
                <fePointLight x="350" y="-250" z="380" />
              </feSpecularLighting>
              <feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn" />
              <feMerge>
                <feMergeNode in="shadow" />
                <feMergeNode in="SourceGraphic" />
                <feMergeNode in="shade" />
                <feMergeNode in="specIn" />
              </feMerge>
            </filter>
            <filter id="soft"><feGaussianBlur stdDeviation="30" /></filter>
            <mask id="reveal" maskUnits="userSpaceOnUse" x="-200" y="-100" width="1600" height="620">
              <rect ref={reveal} x="-150" y="-100" width="0" height="620" fill="#fff" filter="url(#soft)" />
            </mask>
          </defs>
          <g mask="url(#reveal)">
            <text
              x="600"
              y="285"
              textAnchor="middle"
              fontSize="250"
              fill="url(#glassFill)"
              stroke="#ffffff"
              strokeWidth="2.5"
              filter="url(#glass)"
              {...(long ? { textLength: 1100, lengthAdjust: "spacingAndGlyphs" } : {})}
            >
              {site.firstName}
            </text>
          </g>
        </svg>

        {GLINTS.map((g, i) => (
          <span key={i} className="glint" style={{ left: `${g.l}%`, top: `${g.t}%` }} aria-hidden="true">
            <Star4 fill="#fff" />
          </span>
        ))}

        {STICKERS.map((s, i) => (
          <div key={i} className={`sticker ${s.desk ? "sticker--desk" : ""}`} style={{ left: `${s.l}%`, top: `${s.t}%` }} aria-hidden="true">
            <div className="s-scroll">
              <div className="s-drop">
                <div className="s-mouse" data-depth={s.d}>
                  <div className="s-float"><div style={{ transform: `rotate(${s.r}deg)` }}>{s.el}</div></div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="hero__bottom">
          <div>
            <div className="badge-box">
              <div><Globe width="34" />{site.badge.top}</div>
              <div style={{ display: "flex", alignItems: "center" }}>{site.badge.text}</div>
            </div>
            <p className="hero__desc">{site.heroLine}</p>
          </div>
          <div className="scroll-cue" aria-hidden="true">
            <span className="scroll-cue__ring" />
            Scroll to discover
          </div>
          <div className="orbit" aria-hidden="true"><Orbit /></div>
        </div>
      </div>
    </section>
  );
}
