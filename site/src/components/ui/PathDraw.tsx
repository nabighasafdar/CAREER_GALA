import { motion, type MotionValue } from "framer-motion";
import { useReducedMotion } from "../../lib/animations";

/** Draws an SVG path via pathLength, either on a timer or bound to a scroll MotionValue. */
export function PathDraw({ d, stroke = "url(#clarity)", width = 6, duration = 1, delay = 0, progress, opacity = 1 }: {
  d: string; stroke?: string; width?: number; duration?: number; delay?: number; progress?: MotionValue<number>; opacity?: number;
}) {
  const reduced = useReducedMotion();
  if (progress) return <motion.path d={d} fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" style={{ pathLength: progress }} opacity={opacity} />;
  return (
    <motion.path d={d} fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" opacity={opacity}
      initial={{ pathLength: reduced ? 1 : 0 }} animate={{ pathLength: 1 }}
      transition={{ duration: reduced ? 0 : duration, delay, ease: [0.45, 0, 0.2, 1] }} />
  );
}

/** Mounted once in App so every SVG can reference url(#clarity). */
export const GlobalDefs = () => (
  <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden focusable="false">
    <defs>
      <linearGradient id="clarity" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="500" y2="500"><stop offset="0" stopColor="#157A67" /><stop offset="1" stopColor="#1F8F7A" /></linearGradient>
    </defs>
  </svg>
);
