// Small shared visual pieces: icons, the graduation cap, generated art, map pin.

export const Arrow = (p) => (
  <svg viewBox="0 0 34 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" {...p}>
    <path d="M0 7h32M26 1l6 6-6 6" />
  </svg>
);

export const ArrowUpRight = (p) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...p}>
    <path d="M4 12L12 4M5 4h7v7" />
  </svg>
);

export const Star4 = ({ fill = "currentColor", ...p }) => (
  <svg viewBox="0 0 40 40" aria-hidden="true" {...p}>
    <path d="M20 0C21.5 12 28 18.5 40 20 28 21.5 21.5 28 20 40 18.5 28 12 21.5 0 20 12 18.5 18.5 12 20 0Z" fill={fill} />
  </svg>
);

export const Starburst = ({ points = 24, fill = "#111", ...p }) => {
  const d = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 ? 40 : 50;
    const a = (Math.PI * i) / points;
    d.push(`${(50 + r * Math.sin(a)).toFixed(3)},${(50 - r * Math.cos(a)).toFixed(3)}`);
  }
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" {...p}>
      <polygon points={d.join(" ")} fill={fill} />
    </svg>
  );
};

export const Orbit = (p) => (
  <svg viewBox="0 0 100 70" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" {...p}>
    <ellipse cx="50" cy="38" rx="44" ry="24" />
    <path d="M50 14c1.5 12 8 19 20 21-12 2-18.5 9-20 21-1.5-12-8-19-20-21 12-2 18.5-9 20-21Z" />
    <path d="M14 10c.7 5 3.4 7.7 8.4 8.4-5 .7-7.7 3.4-8.4 8.4-.7-5-3.4-7.7-8.4-8.4 5-.7 7.7-3.4 8.4-8.4ZM86 48c.6 4 2.8 6.2 6.8 6.8-4 .6-6.2 2.8-6.8 6.8-.6-4-2.8-6.2-6.8-6.8 4-.6 6.2-2.8 6.8-6.8Z" />
  </svg>
);

export const Globe = (p) => (
  <svg viewBox="0 0 40 26" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" {...p}>
    <ellipse cx="20" cy="13" rx="18" ry="11.5" />
    <ellipse cx="20" cy="13" rx="8" ry="11.5" />
    <path d="M2 13h36M5 6.5h30M5 19.5h30" />
  </svg>
);

export const Compass = () => (
  <span className="compass" aria-hidden="true">
    <svg viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="1.3">
      <circle cx="25" cy="25" r="23" strokeDasharray="2 3" />
      <circle cx="25" cy="25" r="17" />
      <path d="M25 6c1.2 10 6 15 15 19-9 1.2-13.8 6-15 19-1.2-13-6-17.8-15-19 9-4 13.8-9 15-19Z" fill="currentColor" fillOpacity=".08" />
    </svg>
  </span>
);

export const Play = (p) => (
  <svg viewBox="0 0 20 20" aria-hidden="true" {...p}>
    <path d="M5 3l12 7-12 7z" fill="#111" />
  </svg>
);

export const Clock = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </svg>
);
export const Shake = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M7 12.5l3 3 7-7" />
  </svg>
);
export const Chat = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...p}>
    <path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3Z" />
    <path d="M8.5 9.5c0 3.5 2.5 6 6 6l1.2-1.6-2-1-.9.8c-1-.4-1.8-1.2-2.2-2.2l.8-.9-1-2-1.9 1Z" />
  </svg>
);

/** Graduation cap in the brand colours. */
export function GradCap({ className = "" }) {
  return (
    <div className={`console ${className}`} aria-hidden="true">
      <svg viewBox="0 0 200 170" width="100%">
        <defs>
          <linearGradient id="capTop" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2453e6" />
            <stop offset="1" stopColor="#16a36a" />
          </linearGradient>
        </defs>
        <path d="M52 84v42c0 12 22 24 48 24s48-12 48-24V84Z" fill="#0b1b34" />
        <path d="M100 24 8 68l92 44 92-44Z" fill="url(#capTop)" stroke="#fff" strokeWidth="4" strokeLinejoin="round" />
        <path d="M100 68l66 12v44" fill="none" stroke="#f5a524" strokeWidth="5" strokeLinecap="round" />
        <circle cx="166" cy="130" r="9" fill="#f5a524" />
      </svg>
    </div>
  );
}

/** Image if provided, otherwise a generated gradient + browser-window art panel. */
export function Art({ image, hue = 260, title, variant = "window", alt = "" }) {
  if (image) {
    return (
      <div className="art">
        <img src={image} alt={alt || title || ""} />
      </div>
    );
  }
  const h = hue;
  const bg = `radial-gradient(60% 60% at 25% 20%, hsl(${h} 85% 72%) 0%, transparent 60%),
    radial-gradient(55% 55% at 85% 85%, hsl(${(h + 40) % 360} 80% 58%) 0%, transparent 60%),
    linear-gradient(135deg, hsl(${h} 55% 26%), hsl(${(h + 25) % 360} 65% 42%))`;
  return (
    <div className="art" aria-hidden="true">
      <div className="art__bg" style={{ background: bg }} />
      <div className="art__dots" />
      {variant === "window" && (
        <div className="art__window">
          <div className="art__bar"><i /><i /><i /></div>
          <div className="art__content">
            <b>{title}</b>
            <i style={{ width: "80%" }} />
            <i style={{ width: "60%" }} />
            <i style={{ width: "70%", marginTop: 10, height: 26, background: `hsl(${h} 60% 55% / .35)` }} />
          </div>
        </div>
      )}
      {variant === "initials" && <div className="art__initials">{title}</div>}
    </div>
  );
}

/** Destination pin: the end of the "confusion to clarity" path. */
export function Pin(props) {
  return (
    <svg viewBox="0 0 400 300" aria-hidden="true" {...props}>
      <defs>
        <linearGradient id="clarity" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2453e6" />
          <stop offset="1" stopColor="#16a36a" />
        </linearGradient>
      </defs>
      <path d="M14 282c60-6 34-74 96-70s40 74 104 54 44-82 88-96" fill="none" stroke="url(#clarity)" strokeWidth="9" strokeLinecap="round" strokeDasharray="1 20" />
      <path d="M302 186c-40-52-62-84-62-114a62 62 0 0 1 124 0c0 30-22 62-62 114Z" fill="url(#clarity)" />
      <circle cx="302" cy="72" r="24" fill="#f5a524" />
    </svg>
  );
}
