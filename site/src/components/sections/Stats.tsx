import { motion } from "framer-motion";
import { Award, Smile, Target, Users } from "lucide-react";
import { site } from "../../content/site";
import { ease, viewport, useReducedMotion } from "../../lib/animations";
import { CountUp } from "../ui/CountUp";

const icons = [Users, Smile, Award, Target];

export function Stats() {
  const reduced = useReducedMotion();
  return (
    <div className="stats">
      <div className="container">
        <motion.div className="band noise" initial={{ opacity: 0, y: reduced ? 0 : 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewport} transition={{ duration: 0.7, ease }}>
          {site.stats.map((s, i) => {
            const Icon = icons[i];
            return (
              <div className="stat" key={s.label}>
                <svg className="ring" viewBox="0 0 64 64" aria-hidden>
                  <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="4" />
                  <motion.circle cx="32" cy="32" r="28" fill="none" stroke="#9FE3D2" strokeWidth="4" strokeLinecap="round" transform="rotate(-90 32 32)"
                    initial={{ pathLength: reduced ? s.pct : 0 }} whileInView={{ pathLength: s.pct }} viewport={viewport} transition={{ duration: reduced ? 0 : 1.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }} />
                  <g transform="translate(20 20)" style={{ color: "#FBF8F3" }}><Icon size={24} strokeWidth={1.75} /></g>
                </svg>
                <div>
                  <div className="n"><CountUp to={s.value} suffix={s.suffix} delay={i * 0.15} /></div>
                  <div className="t">{s.label}</div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
