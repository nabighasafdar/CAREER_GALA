
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Preloader({ onDone }) {
  const root = useRef(null);
  const count = useRef(null);

  useEffect(() => {
    document.documentElement.classList.add("is-loading");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Only the first visit in a session waits for the intro
    let seen = false;
    try {
      seen = sessionStorage.getItem("cg-intro") === "1";
      sessionStorage.setItem("cg-intro", "1");
    } catch {}
    if (reduce || seen) {
      root.current.style.display = "none";
      onDone();
      return;
    }
    const state = { v: 0 };
    const tl = gsap.timeline();
    tl.to(state, {
      v: 100,
      duration: 0.7,
      ease: "power2.inOut",
      onUpdate: () => {
        if (count.current) count.current.textContent = `${Math.round(state.v)}%`;
      },
    })
      .to(root.current.querySelector(".preloader__inner"), { opacity: 0, y: -20, duration: 0.2, ease: "power2.in" })
      .to(root.current, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.5,
        ease: "power4.inOut",
        onStart: onDone,
      })
      .set(root.current, { display: "none" });
    return () => tl.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="preloader" ref={root} style={{ clipPath: "inset(0 0 0% 0)" }} aria-hidden="true">
      <div className="preloader__inner">
        <div className="preloader__ring">
          <svg viewBox="0 0 120 120" fill="none">
            <defs>
              <linearGradient id="pl" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#2453e6" />
                <stop offset=".5" stopColor="#16a36a" />
                <stop offset="1" stopColor="#f5a524" />
              </linearGradient>
            </defs>
            <ellipse cx="60" cy="60" rx="56" ry="22" stroke="url(#pl)" strokeWidth="3" />
            <ellipse cx="60" cy="60" rx="56" ry="22" stroke="url(#pl)" strokeWidth="3" transform="rotate(60 60 60)" />
            <ellipse cx="60" cy="60" rx="56" ry="22" stroke="url(#pl)" strokeWidth="3" transform="rotate(120 60 60)" />
            <circle cx="60" cy="60" r="9" fill="#0b1b34" />
          </svg>
        </div>
        <div className="preloader__label">Finding your path</div>
        <div className="preloader__count" ref={count}>0%</div>
      </div>
    </div>
  );
}
