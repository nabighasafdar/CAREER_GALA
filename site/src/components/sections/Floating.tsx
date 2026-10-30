import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { site } from "../../content/site";
import { scrollToId, spring } from "../../lib/animations";
import { Wa } from "./Footer";

export function Floating() {
  const [show, setShow] = useState(false);
  const [past, setPast] = useState(false);
  const [atForm, setAtForm] = useState(false);

  useEffect(() => {
    const f = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      setShow(scrollY > max * 0.3);
      const h = document.getElementById("home");
      setPast(!h || scrollY > h.offsetHeight * 0.8);
    };
    f(); addEventListener("scroll", f, { passive: true });
    const c = document.getElementById("contact");
    const io = new IntersectionObserver(([e]) => setAtForm(e.isIntersecting), { threshold: 0.15 });
    c && io.observe(c);
    return () => { removeEventListener("scroll", f); io.disconnect(); };
  }, []);

  return (
    <>
      <AnimatePresence>
        {show && (
          <>
            <div className="wa-ring" aria-hidden />
            <motion.a className="wa" href={site.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Chat with a counselor on WhatsApp"
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={spring}>
              <Wa size={28} /><span className="lbl">Chat with a counselor</span>
            </motion.a>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {past && !atForm && (
          <motion.div className="mbar" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
            <button className="btn btn-primary" onClick={() => scrollToId("contact")}>Book free consultation</button>
            <a className="btn wa-i" href={site.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><Wa size={24} /></a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
