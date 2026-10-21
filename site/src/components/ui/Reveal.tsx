import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { ease, viewport, useReducedMotion } from "../../lib/animations";

export function Reveal({ children, delay = 0, x = 0, y = 24, className, as = "div" }: {
  children: ReactNode; delay?: number; x?: number; y?: number; className?: string; as?: "div" | "li" | "p";
}) {
  const reduced = useReducedMotion();
  const M = motion[as] as typeof motion.div;
  return (
    <M className={className}
      initial={{ opacity: 0, x: reduced ? 0 : x, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={viewport}
      transition={{ duration: reduced ? 0.2 : 0.6, delay, ease }}>
      {children}
    </M>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow"><i aria-hidden />{children}</div>;
}
