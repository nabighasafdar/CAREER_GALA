import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { site } from "../../content/site";
import { ease, viewport, useReducedMotion } from "../../lib/animations";

export function Explore() {
  const reduced = useReducedMotion();
  return (
    <section className="sec" aria-label="Explore Career Gala">
      <div className="container explore">
        {site.explore.map((c, i) => (
          <motion.a key={c.path} href={c.path} className="explore-card" initial={{ opacity: 0, y: reduced ? 0 : 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewport} transition={{ delay: reduced ? 0 : i * 0.08, duration: 0.6, ease }}>
            <h3>{c.title}</h3>
            <p>{c.text}</p>
            <ArrowUpRight size={22} aria-hidden />
          </motion.a>
        ))}
      </div>
    </section>
  );
}
