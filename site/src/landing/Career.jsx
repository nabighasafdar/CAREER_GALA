
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { site } from "./content";
import { Chat } from "./bits";

/* ───────── Impact numbers: rendered final, counted up only when motion is allowed ───────── */
export function Stats() {
  const root = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".stat__num").forEach((el, i) => {
        const { value, suffix } = site.stats[i];
        const state = { v: 0 };
        el.textContent = `0${suffix}`;
        gsap.to(state, {
          v: value,
          duration: 1.6,
          delay: i * 0.15,
          ease: "expo.out",
          onUpdate: () => { el.textContent = `${Math.round(state.v)}${suffix}`; },
          scrollTrigger: { trigger: root.current, start: "top 88%" },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section className="wrap" aria-label="Our impact">
      <div className="stats" ref={root}>
        {site.stats.map((s) => (
          <div className="stat" key={s.label}>
            <span className="stat__num">{s.value}{s.suffix}</span>
            <span className="stat__label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────── Floating WhatsApp button ───────── */
export function WhatsAppFloat() {
  return (
    <a className="wa-float" href={site.whatsapp} target="_blank" rel="noreferrer" aria-label="Chat with a counselor on WhatsApp">
      <Chat />
      <span aria-hidden="true">Chat with a counselor</span>
    </a>
  );
}
