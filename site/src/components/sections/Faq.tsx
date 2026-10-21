import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { site } from "../../content/site";
import { ease, viewport } from "../../lib/animations";
import { Eyebrow, Reveal } from "../ui/Reveal";

const cats = ["All", "Pricing", "Process", "Eligibility", "Admissions"];

export function Faq() {
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState<number | null>(0);
  const items = site.faq.map((f, i) => ({ ...f, i })).filter((f) => cat === "All" || f.cat === cat);
  return (
    <section id="faq" className="sec faq">
      <div className="container faq-grid">
        <div className="faq-side">
          <Eyebrow>FAQ</Eyebrow>
          <Reveal><h2>Frequently asked <em className="acc">questions</em></h2></Reveal>
          <Reveal delay={0.1}><p>Everything you need to know about our services</p></Reveal>
          <div className="cats" role="group" aria-label="Filter questions">
            {cats.map((c) => <button key={c} className="cat" aria-pressed={cat === c} onClick={() => { setCat(c); setOpen(null); }}>{c}</button>)}
          </div>
          <div className="askcard">
            <h4>Still have questions?</h4>
            <p style={{ margin: 0, fontSize: ".95rem" }}>Chat with a counselor on WhatsApp: {site.phone}</p>
            <a className="btn btn-primary btn-sm" href={site.whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /> WhatsApp us</a>
          </div>
        </div>
        <div>
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((f, k) => {
              const isOpen = open === f.i;
              return (
                <motion.div layout key={f.q} className={`fi${isOpen ? " open" : ""}`}
                  initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={viewport}
                  exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.35, delay: k * 0.05, ease }}>
                  <h3 style={{ fontSize: "inherit" }}>
                    <button className="fq" aria-expanded={isOpen} aria-controls={`fa-${f.i}`} onClick={() => setOpen(isOpen ? null : f.i)}>
                      <span className="no">{String(f.i + 1).padStart(2, "0")}</span><span className="t">{f.q}</span><span className="pm" aria-hidden />
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div id={`fa-${f.i}`} role="region" initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.35, ease }} style={{ overflow: "hidden" }}>
                        <motion.div className="fa" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.3 }}>
                          {f.a}
                          {"price" in f && f.price && <div><span className="price">{f.price}</span></div>}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
