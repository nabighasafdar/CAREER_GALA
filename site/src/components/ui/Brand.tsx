export const LogoMark = ({ size = 34 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
    <defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#157A67" /><stop offset="1" stopColor="#1F8F7A" /></linearGradient></defs>
    <rect width="64" height="64" rx="16" fill="url(#lg)" />
    <path d="M14 46c10 0 6-18 16-18s6 12 20-12" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
    <circle cx="50" cy="16" r="5" fill="#FF6342" />
  </svg>
);
export const Logo = () => (<a href="#home" className="logo" aria-label="Career Gala home"><LogoMark /><span>Career <b>Gala</b></span></a>);

export const initials = (n: string) => n.split(" ").map((s) => s[0]).join("").slice(0, 2);
const grads = ["#157A67,#1F8F7A", "#1F8F7A,#0EA5C6", "#E8579A,#FF6342", "#157A67,#E8579A", "#0EA5C6,#059669"];
export const Avatar = ({ name, i = 0, size = 44 }: { name: string; i?: number; size?: number }) => (
  <span aria-hidden style={{ width: size, height: size, borderRadius: "50%", display: "grid", placeItems: "center", color: "#fff", fontWeight: 700, fontSize: size * 0.34, flex: "none", background: `linear-gradient(135deg,${grads[i % grads.length]})` }}>{initials(name)}</span>
);
export const domainColor: Record<string, string> = { tech: "#3B5BDB", business: "#C27A00", design: "#E8579A", medicine: "#059669", engineering: "#0EA5C6" };
