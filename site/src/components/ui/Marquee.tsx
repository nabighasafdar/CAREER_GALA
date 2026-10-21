import type { ReactNode } from "react";

export function Marquee({ children, reverse = false, label }: { children: ReactNode; reverse?: boolean; label?: string }) {
  return (
    <div className={`track${reverse ? " rev" : ""}`} aria-label={label}>
      {children}
      <div style={{ display: "contents" }} aria-hidden>{children}</div>
    </div>
  );
}
