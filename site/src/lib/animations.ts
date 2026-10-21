import { useEffect, useState } from "react";
export const ease = [0.22, 1, 0.36, 1] as const;
export const spring = { type: "spring", stiffness: 260, damping: 24 } as const;
export const viewport = { once: true, margin: "0px 0px -15% 0px" } as const;

export function useMedia(q: string, initial = false) {
  const [m, set] = useState(initial);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const f = () => set(mq.matches);
    f();
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, [q]);
  return m;
}
export const useReducedMotion = () => useMedia("(prefers-reduced-motion: reduce)");
export const useDesktopHover = () => useMedia("(hover: hover) and (min-width: 1024px)");

export const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const l = (window as any).__lenis;
  if (l) l.scrollTo(el, { offset: -70 });
  else el.scrollIntoView({ behavior: "smooth" });
};
