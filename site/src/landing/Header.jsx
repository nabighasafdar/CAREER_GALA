
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { site } from "./content";
import { Starburst, Star4 } from "./bits";

export function scrollToHash(href) {
  const el = document.querySelector(href);
  if (!el) return;
  if (window.lenis) window.lenis.scrollTo(el, { offset: 0, duration: 1.6 });
  else el.scrollIntoView({ behavior: "smooth" });
}

export default function Header({ ready }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const nav = useRef(null);

  useEffect(() => {
    if (!ready) {
      gsap.set(root.current, { opacity: 0, y: -20 });
      return;
    }
    gsap.to(root.current, { opacity: 1, y: 0, duration: 0.9, delay: 0.6, ease: "power3.out" });
  }, [ready]);

  // Pills slide out from the menu button, nearest first
  useEffect(() => {
    const pills = [...nav.current.children].reverse();
    gsap.killTweensOf(pills);
    if (open) {
      gsap.fromTo(
        pills,
        { x: 40, opacity: 0, autoAlpha: 0, scale: 0.9 },
        { x: 0, autoAlpha: 1, scale: 1, duration: 0.55, stagger: 0.06, ease: "back.out(1.7)" }
      );
    } else {
      gsap.to(pills, { x: 30, autoAlpha: 0, duration: 0.3, stagger: 0.03, ease: "power2.in" });
    }
  }, [open]);

  // Hide on scroll down, reappear on scroll up, so the header never sits on top of content
  useEffect(() => {
    let last = window.scrollY;
    let hidden = false;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 6) return;
      const hide = y > last && y > 160;
      last = y;
      if (hide === hidden) return;
      hidden = hide;
      setOpen(false);
      gsap.to(root.current, { yPercent: hide ? -130 : 0, duration: 0.35, ease: "power3.out", overwrite: "auto" });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="header" ref={root}>
      <a className="brand" href="#top" onClick={(e) => { e.preventDefault(); scrollToHash("#top"); }}>
        <span className="brand__mark">{site.initials}</span>
        <span>
          {site.name.split(" ")[0]}
          <br />
          {site.name.split(" ").slice(1).join(" ")}
        </span>
      </a>
      <div className="header__right">
        <nav className="nav" ref={nav} id="site-nav" aria-label="Main">
          {site.nav.map((n) => (
            <a
              key={n.href}
              className="pill"
              href={n.href}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
            >
              {n.label} <Star4 width="10" />
            </a>
          ))}
        </nav>
        <span className="burst" aria-hidden="true">
          <Starburst />
          <span>{site.initials}</span>
        </span>
        <a className="pill enter-btn" href="/home">Enter site <Star4 width="10" /></a>
        <button className="pill menu-btn" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen((o) => !o)}>
          {open ? "Close" : "Menu"} <span className="menu-btn__icon"><Star4 width="13" /></span>
        </button>
      </div>
    </header>
  );
}
