
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "./content";
import { scrollToHash } from "./Header";
import { Arrow, ArrowUpRight, Star4, Starburst, Orbit, Compass, GradCap, Art, Pin, Play, Clock, Shake, Globe } from "./bits";

export const L = ({ children }) => (
  <span className="line"><span>{children}</span></span>
);

export const go = (href) => (e) => {
  if (!href.startsWith("#")) return;
  e.preventDefault();
  scrollToHash(href);
};

/* ───────── Headline + intro row ───────── */
export function Intro() {
  const root = useRef(null);
  const h = site.headline;
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".intro .console", { y: -14, rotation: -8, duration: 3, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.from(".intro .console", {
        y: 120, rotation: -40, opacity: 0, duration: 1.4, ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 85%" },
      });
      gsap.from(".headline__btns, .headline__green", {
        scale: 0.6, opacity: 0, duration: 0.9, ease: "back.out(1.8)", stagger: 0.12,
        scrollTrigger: { trigger: ".headline", start: "top 80%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="intro" ref={root} id="intro">
      <div className="wrap">
        <div className="intro__tags">{site.hashtags.join(" ")}</div>
        <div className="intro__top">
          <GradCap />
          <h1 className="headline" data-reveal="lines" aria-label={h.label}>
            <L>{h.a}</L>
            <L>
              <span className="headline__btns">
                <a href="/contact" onClick={go("/contact")}>{h.primary} <Arrow width="22" /></a>
                <a href="/how-it-works" onClick={go("/how-it-works")}>{h.secondary}</a>
              </span>
              <span className="headline__pixel">{h.pixel}</span> <Compass /> {h.c}
            </L>
            <L>
              <span className="headline__display">{h.display}</span>
              <span className="headline__green">{h.pill}</span>
            </L>
          </h1>
        </div>

        <div className="intro__row">
          <article className="feature-card" data-reveal="fade">
            <div className="feature-card__art"><Art hue={225} title={site.featured.title} /></div>
            <div>
              <h3>{site.featured.eyebrow}:<br />{site.featured.title}</h3>
              <p style={{ margin: "0 0 14px", fontSize: 13, color: "var(--muted)" }}>{site.featured.blurb}</p>
              <a className="link-arrow" href={site.featured.href} onClick={go(site.featured.href)}>
                <Arrow /> {site.featured.link}
              </a>
              <div className="chips">{site.featured.tags.map((t) => <span key={t}>{t}</span>)}</div>
            </div>
          </article>
          <ul className="points" data-reveal="fade">
            {site.points.map((p) => <li key={p}>{p}</li>)}
          </ul>
          <div className="media-card" data-reveal="fade">
            <Art hue={155} title={site.initials} variant="initials" image={site.about.imageB} />
            <a className="play" href="/how-it-works" onClick={go("/how-it-works")} aria-label="See how it works"><Play width="18" /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── Career domains marquee ───────── */
export function Domains() {
  const items = [...site.domains, ...site.domains, ...site.domains];
  return (
    <section className="tech" aria-label="Career domains we cover">
      <div className="tech__track">
        {items.map((t, i) => (
          <span className="tech__item" key={i} aria-hidden={i >= site.domains.length}>{t}</span>
        ))}
      </div>
    </section>
  );
}

/* ───────── About ───────── */
export function About() {
  const root = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".about__a", { yPercent: 8 }, { yPercent: -6, ease: "none", scrollTrigger: { trigger: ".about__media", scrub: true } });
      gsap.fromTo(".about__b", { yPercent: 18 }, { yPercent: -10, ease: "none", scrollTrigger: { trigger: ".about__media", scrub: true } });
      gsap.to(".about__star", { rotation: 360, ease: "none", scrollTrigger: { trigger: ".about__media", scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section id="about" ref={root}>
      <div className="wrap">
        <div className="split">
          <h2 data-reveal="lines">{site.about.title.map((t) => <L key={t}>{t}</L>)}</h2>
          <p data-reveal="fade">{site.about.text}</p>
        </div>
        <div className="about__media">
          <div className="about__a">
            <span className="about__star"><Star4 /></span>
            <Art hue={225} title={site.about.artTitle} image={site.about.imageA} />
          </div>
          <div className="about__b">
            <Art hue={38} title={site.initials} variant="initials" image={site.about.imageB} alt={site.name} />
          </div>
        </div>
      </div>
    </section>
  );
}

export function Focus() {
  return (
    <section className="wrap">
      <div className="split">
        <h2 data-reveal="lines">{site.focus.title.map((t) => <L key={t}>{t}</L>)}</h2>
        <p data-reveal="fade">{site.focus.text}</p>
      </div>
    </section>
  );
}

/* ───────── Services (hover / focus switches the panel) ───────── */
export function Services() {
  const [active, setActive] = useState(0);
  const s = site.services;
  return (
    <section id="services" className="wrap">
      <div className="services">
        <div data-reveal="fade">
          <h2 className="display-serif services__title">{s.title}</h2>
          <p className="services__intro">{s.intro}</p>
          <ul className="services__list">
            {s.items.map((it, i) => (
              <li key={it.name}>
                <button
                  className={`svc ${i === active ? "is-active" : ""}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={i === active}
                >
                  <b>{String(i + 1).padStart(2, "0")}</b>
                  <span>{it.name}</span>
                  <Arrow />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="services__panel" data-reveal="fade" aria-live="polite">
          {s.items.map((it, i) => (
            <div key={it.name} className={i === active ? "is-active" : ""} aria-hidden={i !== active}>
              <Art hue={it.hue} title={String(i + 1).padStart(2, "0")} variant="initials" image={it.image} />
              <div className="svc-caption">
                <strong>{it.name}</strong>
                {it.text}
                <ul>{it.points.map((p) => <li key={p}>{p}</li>)}</ul>
              </div>
            </div>
          ))}
        </div>
        <div className="services__cards">
          <a className="mini-card mini-card--dark" href="/how-it-works" onClick={go("/how-it-works")} data-reveal="fade">
            <p>{s.workCard.kicker}</p>
            <footer><strong>{s.workCard.title}</strong><span className="round"><ArrowUpRight /></span></footer>
          </a>
          <a className="mini-card mini-card--green" href="/contact" onClick={go("/contact")} data-reveal="fade">
            <p>{s.aboutCard.kicker}</p>
            <footer><strong>{s.aboutCard.title}</strong><span className="round"><ArrowUpRight /></span></footer>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ───────── Black band: marquee that reacts to scroll speed & direction ───────── */
export function Band() {
  const track = useRef(null);
  useEffect(() => {
    let x = 0;
    let dir = -1;
    const tick = () => {
      const el = track.current;
      if (!el) return;
      const half = el.scrollWidth / 2;
      const v = window.lenis ? window.lenis.velocity : 0;
      if (window.lenis && window.lenis.direction) dir = window.lenis.direction > 0 ? -1 : 1;
      x += dir * (1 + Math.min(Math.abs(v) * 0.35, 14));
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      el.style.transform = `translate3d(${x}px,0,0)`;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);
  const items = Array.from({ length: 8 });
  return (
    <div className="band" aria-label={site.marquee}>
      <div className="band__track" ref={track} aria-hidden="true">
        {items.map((_, i) => (
          <span className="band__item" key={i}>{site.marquee} <Star4 /></span>
        ))}
      </div>
    </div>
  );
}

/* ───────── How it works: pinned horizontal scroll on desktop ───────── */
export function HowItWorks() {
  const root = useRef(null);
  const track = useRef(null);
  const p = site.process;
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 761px) and (prefers-reduced-motion: no-preference)", () => {
      const dist = () => Math.max(0, track.current.scrollWidth - window.innerWidth);
      gsap.to(track.current, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${dist()}`,
          scrub: 0.6,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
      gsap.utils.toArray(".project .art").forEach((a) => {
        gsap.fromTo(a, { scale: 1.15 }, { scale: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${dist()}`, scrub: true } });
      });
    });
    return () => mm.revert();
  }, []);
  return (
    <section className="projects" id="how-it-works" ref={root}>
      <div className="wrap projects__head">
        <p data-reveal="lines"><L>{p.kicker}</L></p>
        <h2 className="display-serif" data-reveal="lines"><L>{p.title}</L></h2>
        <p className="projects__intro" data-reveal="fade">{p.intro}</p>
      </div>
      <div className="projects__track" ref={track}>
        {p.items.map((it, i) => (
          <article className="project" key={it.title}>
            <Art hue={it.hue} title={String(i + 1).padStart(2, "0")} variant="initials" image={it.image} />
            <div className="project__label">
              <h3>{it.title}</h3>
              <small>{it.text}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ───────── Manifesto: words light up as you scroll ───────── */
export function Manifesto() {
  const root = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".w", {
        opacity: 1,
        stagger: 0.05,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top 80%", end: "bottom 45%", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section className="manifesto wrap" ref={root}>
      <p>
        {site.manifesto.split(" ").map((w, i) => (
          <span className="w" key={i}>{w} </span>
        ))}
      </p>
    </section>
  );
}

/* ───────── Black "power" panel with iridescent video block ───────── */
export function Power() {
  const root = useRef(null);
  const v = site.power.video;
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(root.current, { scale: 0.9, borderRadius: 60 }, {
        scale: 1, borderRadius: 28, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 30%", scrub: true },
      });
      gsap.fromTo(".power .console", { rotation: -30, y: 60 }, {
        rotation: 14, y: -40, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
      // Word swapper
      const words = gsap.utils.toArray(".power__swap span");
      gsap.set(words, { yPercent: 110 });
      gsap.set(words[0], { yPercent: 0 });
      let i = 0;
      const tl = gsap.timeline({ repeat: -1 });
      words.forEach(() => {
        tl.add(() => {
          const cur = words[i];
          i = (i + 1) % words.length;
          const next = words[i];
          gsap.to(cur, { yPercent: -110, duration: 0.6, ease: "power3.inOut" });
          gsap.fromTo(next, { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: "power3.inOut" });
        }, "+=1.8");
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section className="power" ref={root}>
      <div className="power__top">
        <h2 className="display-serif" data-reveal="lines">
          {site.power.lines.map((l) => <L key={l}>{l}</L>)}
        </h2>
        <GradCap />
      </div>
      <div className="power__video">
        <div className="iridescent" />
        <div className="power__words">
          {v.before}
          <span className="power__swap">{v.words.map((w) => <span key={w}>{w}</span>)}</span>
          {v.after}
        </div>
        <a className="play" href="/contact" onClick={go("/contact")} aria-label="Book your free consultation"><Play /></a>
      </div>
    </section>
  );
}

/* ───────── Why Career Gala ───────── */
const WHY_ICONS = [Shake, Clock, Globe];
export function Why() {
  const w = site.why;
  return (
    <section className="why wrap">
      <div className="why__head">
        <div>
          <p className="kicker" data-reveal="lines"><L>{w.kicker}</L></p>
          <h2 className="display-serif" data-reveal="lines"><L>{w.title}</L></h2>
        </div>
        <p className="text" data-reveal="fade">{w.text}</p>
      </div>
      <div className="why__cards">
        {w.cards.map((c, i) => {
          const Icon = WHY_ICONS[i % WHY_ICONS.length];
          return (
            <article className="why-card" key={c.title} data-reveal="fade">
              <div className="why-card__icon"><Icon /></div>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* ───────── CTA + giant email + footer ───────── */
export function Contact() {
  const root = useRef(null);
  const [user, domain] = site.email.split("@");
  const chars = site.email.length;
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".ufo", { y: -22, rotation: 4, duration: 2.6, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.fromTo(".ufo-wrap", { x: 260, y: -120, opacity: 0 }, {
        x: 0, y: 0, opacity: 1, ease: "power2.out",
        scrollTrigger: { trigger: root.current, start: "top 90%", end: "top 35%", scrub: 1 },
      });
      gsap.from(".mail > *", {
        yPercent: 100, opacity: 0, duration: 1, ease: "power4.out", stagger: 0.08,
        scrollTrigger: { trigger: ".mail", start: "top 92%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section className="cta" ref={root}>
      <div className="wrap">
        <div className="cta__grid">
          <h2 className="display-serif" data-reveal="lines">
            {site.cta.lines.map((l) => <L key={l}>{l}</L>)}
            <L>
              {site.cta.big}
              <a className="cta__go" href="/contact" onClick={go("/contact")} aria-label="Book your free consultation"><ArrowUpRight /></a>
            </L>
          </h2>
          <div className="ufo-wrap"><Pin className="ufo" /></div>
        </div>

        <a className="mail" href={`mailto:${site.email}`} style={{ fontSize: `min(calc(min(100vw - 2 * var(--pad), 1280px) / ${chars * 0.5}), 200px)` }}>
          <span>{user}</span>
          <span className="mail__at"><Starburst points={14} fill="#12805a" /><span>@</span></span>
          <span>{domain}</span>
        </a>

        <footer className="footer">
          <div className="footer__about">
            <div className="brand"><span className="brand__mark">{site.initials}</span><span>{site.name}</span></div>
            <p>{site.footerTagline}</p>
          </div>
          <div>
            <h4>Quick links</h4>
            <ul>{site.nav.map((n) => <li key={n.href}><a href={n.href} onClick={go(n.href)}>{n.label}</a></li>)}</ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>{site.contactLinks.map((n) => <li key={n.label}>{n.href ? <a href={n.href}>{n.label}</a> : n.label}</li>)}</ul>
          </div>
          <div>
            <h4>Social</h4>
            <ul>{site.socials.map((n) => <li key={n.label}><a href={n.href} target="_blank" rel="noreferrer">{n.label}</a></li>)}</ul>
          </div>
          <a className="start-card" href="/contact" onClick={go("/contact")}>
            <Orbit />
            Book free consultation
          </a>
        </footer>
        <div className="footer__bar">
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
          <span className="footer__legal">{site.legal.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}</span>
        </div>
      </div>
    </section>
  );
}
