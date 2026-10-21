import type { ReactNode } from "react";
import "./pages.css";

export const Mark = ({ size = 34 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 34 34" aria-hidden><rect width="34" height="34" rx="9" fill="#1F8F7A" /><path d="M9 24c3-2 4-8 7-8s3 3 5 3 3-6 4-8" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" /><circle cx="25" cy="10" r="2.6" fill="#FF6342" /></svg>
);
export const Brand = ({ size }: { size?: number }) => (<a href="/" className="pg-brand" aria-label="Career Gala home"><Mark size={size} /><span>Career <b>Gala</b></span></a>);
export const Check = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E5482A" strokeWidth="2.4" aria-hidden><path d="M20 6L9 17l-5-5" /></svg>);
export const Eyebrow = ({ children }: { children: ReactNode }) => (<div className="eyebrow"><i />{children}</div>);

const Orb = ({ s, style }: { s: number; style: React.CSSProperties }) => (<div aria-hidden className="orb" style={{ width: s, height: s, ...style }} />);

export function AuthShell({ side, children }: { side: ReactNode; children: ReactNode }) {
  return (
    <div className="pg auth">
      <Orb s={440} style={{ left: "10%", top: 160, background: "#9FE3D2", opacity: .55, filter: "blur(90px)" }} />
      <Orb s={380} style={{ right: "12%", top: 400, background: "#FFC2B3", opacity: .5, filter: "blur(100px)" }} />
      <Orb s={320} style={{ right: "32%", top: 40, background: "#C9D8FF", opacity: .55, filter: "blur(90px)" }} />
      <Orb s={200} style={{ left: "calc(50% - 620px)", top: 580, background: "linear-gradient(135deg,#3CC2A2,#1F8F7A)" }} />
      <Orb s={130} style={{ right: "calc(50% - 610px)", top: 96, background: "linear-gradient(135deg,#FF8A6E,#FF6342)" }} />
      <div className="auth-brand"><Brand /></div>
      <div className="auth-card">
        <aside className="auth-side">
          {side}
          <svg aria-hidden style={{ marginTop: "auto" }} width="220" height="70" viewBox="0 0 220 70"><path d="M4 64C40 64 60 30 100 32S160 40 190 18" stroke="#1F8F7A" strokeWidth="4" fill="none" strokeLinecap="round" /><circle cx="196" cy="14" r="9" fill="#FF6342" /></svg>
        </aside>
        <main className="auth-main" id="main">{children}</main>
      </div>
    </div>
  );
}

export function DashShell({ nav, foot, children }: { nav: string[]; foot: ReactNode; children: ReactNode }) {
  return (
    <div className="pg dash">
      <aside className="dash-side">
        <Brand size={32} />
        <nav className="dash-nav" aria-label="Dashboard">
          {nav.map((n, i) => (<a key={n} href="#main" aria-current={i === 0 ? "page" : undefined} onClick={(e) => e.preventDefault()}>{n}</a>))}
        </nav>
        {foot}
      </aside>
      <main className="dash-main" id="main">{children}</main>
    </div>
  );
}

export const firstName = (fallback: string) => { try { return sessionStorage.getItem("cg-name") || fallback; } catch { return fallback; } };
