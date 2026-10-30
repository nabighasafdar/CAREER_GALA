import { useState, type ReactNode } from "react";

export const Pick = ({ on, onClick, variant = "", role, children }: { on: boolean; onClick: () => void; variant?: "card" | "pill" | "day" | ""; role?: "radio"; children: ReactNode }) => (
  <button type="button" className={`opt-btn ${variant}`} {...(role ? { role, "aria-checked": on } : { "aria-pressed": on })} onClick={onClick}>{children}</button>
);

export const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
export const asList = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : typeof v === "string" ? splitList(v) : []);
export const splitList = (s: string) => s.split(/[,،\n]/).map((x) => x.trim()).filter(Boolean);

export const Tick = ({ size = 38 }: { size?: number }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#1F8F7A" strokeWidth="2.4" aria-hidden><path d="M20 6L9 17l-5-5" /></svg>);

export const CITIES = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Peshawar", "Quetta", "Multan", "Other"];
export const SUBJECTS = ["Maths", "Physics", "Chemistry", "Biology", "Science", "English", "Urdu", "Computer", "IELTS / TOEFL", "MDCAT", "Other"];
export const LEVELS = ["Primary / Middle", "Matric", "FSc", "O Level", "A Level", "University", "Professional", "Other"];
export const TIMES = ["Morning", "Afternoon", "Evening", "Weekends"];
export const BUDGETS = ["Not sure yet", "Under Rs 1,000", "Rs 1,000 – 2,000", "Rs 2,000 – 3,000", "Rs 3,000+"];
export const START = ["As soon as possible", "Within a week", "Within a month", "Just exploring"];
export const FREQ = ["1–2 days a week", "3–4 days a week", "Every day", "Not sure yet"];
export const GENDER = ["No preference", "Female tutor", "Male tutor"];

export type Errors = Record<string, string>;

/** Label + control + inline error. Pass `error` to flag the control. */
export const Field = ({ label, error, optional, help, required, children }: { label: ReactNode; error?: string; optional?: boolean; help?: string; required?: boolean; children: ReactNode }) => (
  <label className={`pfld${error ? " bad" : ""}`}>
    <span>{label}{required && <span className="req-star" aria-hidden> *</span>}{optional && <span className="opt"> (optional)</span>}</span>
    {children}
    {help && !error && <small className="help">{help}</small>}
    {error && <span className="errmsg" role="alert">{error}</span>}
  </label>
);

/** Group of Pick buttons with a label and error line. */
export const Group = ({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: ReactNode }) => (
  <div className={`grp${error ? " bad" : ""}`} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
    <div className="sub">{label}</div>
    {hint && <div className="hint" style={{ marginTop: -4, fontSize: 14, color: "#55627A" }}>{hint}</div>}
    {children}
    {error && <span className="errmsg block" role="alert">{error}</span>}
  </div>
);

export const EMAIL = /^\S+@\S+\.\S+$/;
export const PHONE = /^\+?[0-9\s-]{10,16}$/;

/** Type a value, press Enter / comma / Add, and it becomes a removable chip. */
export const TagInput = ({ label, value, onChange, placeholder, error, help, required }: { label: string; value: string[]; onChange: (v: string[]) => void; placeholder: string; error?: string; help?: string; required?: boolean }) => {
  const [text, setText] = useState("");
  const add = (raw = text) => {
    const next = [...value];
    for (const t of splitList(raw)) if (!next.some((x) => x.toLowerCase() === t.toLowerCase())) next.push(t);
    if (next.length !== value.length) onChange(next);
    setText("");
  };
  return (
    <div className={`pfld${error ? " bad" : ""} other-reveal`}>
      <label htmlFor={`tag-${label}`}>{label}{required && <span className="req-star" aria-hidden> *</span>}</label>
      <div className="tagrow">
        <input id={`tag-${label}`} type="text" autoFocus value={text} placeholder={placeholder} aria-invalid={!!error}
          onChange={(e) => (e.target.value.endsWith(",") ? add(e.target.value) : setText(e.target.value))}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } else if (e.key === "Backspace" && !text && value.length) onChange(value.slice(0, -1)); }}
          onBlur={() => text.trim() && add()} />
        <button type="button" onClick={() => add()}>Add</button>
      </div>
      {value.length > 0 && (
        <div className="tags" role="list">
          {value.map((t) => (
            <span className="tg" role="listitem" key={t}>{t}<button type="button" aria-label={`Remove ${t}`} onClick={() => onChange(value.filter((x) => x !== t))}>×</button></span>
          ))}
        </div>
      )}
      {help && !error && <small className="help">{help}</small>}
      {error && <span className="errmsg" role="alert">{error}</span>}
    </div>
  );
};
