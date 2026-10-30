import { useEffect, type ReactNode } from "react";
import { site } from "../content/site";
import { Brand } from "./Shell";
import "./site.css";

const titles: Record<string, string> = {
  "/": "Free trial lesson", "/find-tutor": "Find a Tutor", "/counselling": "Career Counselling",
  "/become-tutor": "Become a Tutor", "/pricing": "Pricing", "/login": "Log in", "/signup": "Sign up",
  "/get-started": "Get started", "/subjects": "Subjects", "/tutor/profile": "Tutor profile",
};

export const Icon = ({ size = 22, stroke = "#1F8F7A", width = 1.75, children }: { size?: number; stroke?: string; width?: number; children: ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={width} aria-hidden>{children}</svg>
);
export const Tick = ({ size = 20 }: { size?: number }) => <Icon size={size} width={2.4}><path d="M20 6L9 17l-5-5" /></Icon>;
export const Eyebrow = ({ children }: { children: ReactNode }) => <div className="s-eye"><i />{children}</div>;

export const Chat = () => <path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z" />;
export const People = () => <><circle cx="9" cy="8" r="3.5" /><path d="M3 20a6 6 0 0112 0M16 4.5a3.5 3.5 0 010 7M21 20a6 6 0 00-4-5.6" /></>;
export const Shield = () => <><path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z" /><path d="M9 12l2 2 4-4" /></>;
export const Calendar = () => <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" /></>;

export const StatBand = ({ items }: { items: { icon: ReactNode; value: string; label: string }[] }) => (
  <section className="s-wrap">
    <div className="s-stats">
      {items.map((s) => (
        <div key={s.label}><span className="ring"><Icon stroke="#102027">{s.icon}</Icon></span><div><b>{s.value}</b><span>{s.label}</span></div></div>
      ))}
    </div>
  </section>
);

export const Faq = ({ items }: { items: [string, string][] }) => (
  <div className="s-faq">
    {items.map(([q, a], i) => (
      <details key={q} open={i === 0}><summary>{q} <span aria-hidden>+</span></summary><p>{a}</p></details>
    ))}
  </div>
);

export const Steps = ({ items, min = 260 }: { items: [string, string, ReactNode?][]; min?: number }) => (
  <ol className="s-steps" style={{ gridTemplateColumns: `repeat(auto-fit,minmax(min(${min}px,100%),1fr))` }}>
    {items.map(([title, text, icon], i) => (
      <li key={title}>
        <span className="num" aria-hidden>0{i + 1}</span>
        {icon && <span className="s-chip"><Icon>{icon}</Icon></span>}
        <h3>{title}</h3><p>{text}</p>
      </li>
    ))}
  </ol>
);

const packages = [
  { name: "Free consultation", price: "Free", pts: ["20-minute discovery call", "Quick advice on next steps"], cta: "Book free call" },
  { name: "Career roadmap", price: "Rs [—]", pts: ["Full assessment", "Written personalised roadmap", "2 follow-up sessions"], cta: "Get started", popular: true },
  { name: "Full guidance", price: "Rs [—]", pts: ["Everything in Roadmap", "University applications help", "3 months of check-ins"], cta: "Talk to us" },
];

export const Packages = () => (
  <div className="s-packs">
    {packages.map((p) => (
      <div key={p.name} className={p.popular ? "dark" : ""}>
        <div className="top"><span>{p.name}</span>{p.popular && <em>Popular</em>}</div>
        <div className="price">{p.price}</div>
        <ul>{p.pts.map((t) => <li key={t}>✓ {t}</li>)}</ul>
        <a className={`s-btn ${p.popular ? "s-coral" : "s-ghost"}`} href="/get-started">{p.cta}</a>
      </div>
    ))}
  </div>
);

/** Scrolls to the #hash a page was opened with, for links that come from another page. */
export function useHashScroll() {
  useEffect(() => { if (location.hash) document.querySelector(location.hash)?.scrollIntoView(); }, []);
}

const Footer = () => (
  <footer className="s-foot">
    <div className="in">
      <div className="top">
        <h2>Your future won't <span className="serif">plan itself</span>.</h2>
        <div className="s-row">
          <a className="s-btn s-coral" href="/find-tutor">Find a Tutor</a>
          <a className="s-btn s-ghost" href={site.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp us</a>
        </div>
      </div>
      <div className="bottom">
        <span className="name">Career <b>Gala</b></span>
        <nav aria-label="Footer">
          <a href="/">Free trial</a>
          <a href="/pricing#faq">FAQ</a>
          <a href={`mailto:${site.email}`}>Contact</a>
          <a href="/privacy.html">Privacy</a>
          <a href="/terms.html">Terms</a>
        </nav>
        <span>© 2026 Career Gala</span>
      </div>
    </div>
  </footer>
);

/** `bare` pages bring their own <main> and no footer, and keep the same navigation bar. */
export default function SiteLayout({ path, bare, children }: { path: string; bare?: boolean; children: ReactNode }) {
  useEffect(() => {
    const t = titles[path];
    document.title = t ? `${t} | Career Gala` : "Career Gala | Career Counselling for Pakistani Students";
  }, [path]);

  return (
    <div className="pg site">
      <a className="skip" href="#main">Skip to content</a>
      <div className="s-bar">
        <header>
          <Brand />
          {path === "/" ? (
            <div className="s-row acts">
              <a className="s-btn s-ghost sm wa" href={site.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp us"><Icon size={18} stroke="currentColor"><Chat /></Icon>WhatsApp us</a>
              <a className="s-btn s-coral sm" href="/home">Get started</a>
            </div>
          ) : (
            <>
              <nav aria-label="Main">
                {site.nav.map((n) => <a key={n.path} href={n.path} aria-current={n.path === path ? "page" : undefined}>{n.label}</a>)}
              </nav>
              <div className="s-row acts">
                <a className="s-btn s-ghost sm" href="/login">Log in</a>
                <a className="s-btn s-coral sm" href="/signup">Sign up</a>
              </div>
            </>
          )}
        </header>
      </div>
      {bare ? children : <main id="main" className="s-main">{children}</main>}
      {bare ? null : path === "/"
        ? <footer className="s-mini">© 2026 Career Gala · <a href="/privacy.html">Privacy</a> · <a href="/terms.html">Terms</a></footer>
        : <Footer />}
    </div>
  );
}
