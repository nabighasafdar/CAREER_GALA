import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../../lib/animations";

export function CountUp({ to, suffix = "", delay = 0, duration = 1.6 }: { to: number; suffix?: string; delay?: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduced = useReducedMotion();
  const [v, setV] = useState(reduced ? to : 0);
  useEffect(() => {
    if (!inView) return;
    if (reduced) { setV(to); return; }
    const c = animate(0, to, { duration, delay, ease: [0.16, 1, 0.3, 1], onUpdate: (n) => setV(Math.round(n)) });
    return () => c.stop();
  }, [inView, to, reduced, delay, duration]);
  return <span ref={ref}>{v}{suffix}</span>;
}
