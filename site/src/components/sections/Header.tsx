import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { site } from "../../content/site";
import { ease, useReducedMotion } from "../../lib/animations";
import { Logo } from "../ui/Brand";

export function Header({ path }: { path: string }) {
  const [pill, setPill] = useState(false);
  const [hide, setHide] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const prog = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setPill(y > 40);
    setHide(y > 200 && y > prev && !open);
  });

  const active = path === "/" ? "/home" : path;

  return (
    <>
      <motion.header className={`hdr${pill ? " float" : ""}${hide ? " hide" : ""}`}
        initial={{ y: reduced ? 0 : "-100%" }} animate={{ y: 0 }} transition={{ duration: 0.6, ease }}>
        <div className="hdr-in">
          <Logo />
          <nav className="nav" aria-label="Primary">
            {site.nav.map((n, i) => (
              <motion.a key={n.path} href={n.path} aria-current={active === n.path ? "page" : undefined}
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.06, duration: 0.4, ease }}>
                {active === n.path && <motion.span layoutId="navpill" className="bg" transition={{ type: "spring", stiffness: 260, damping: 24 }} />}
                <span>{n.label}</span>
              </motion.a>
            ))}
            <a href="/subjects"><span>Subjects</span></a>
          </nav>
          <div className="hdr-cta">
            <a className="btn btn-sm" href="/login">Log in</a>
            <a className="btn btn-ghost btn-sm" href="/signup">Sign up</a>
            <a className="btn btn-primary btn-sm" href="/get-started">Get started</a>
          </div>
          <button className="burger" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}><Menu /></button>
          <motion.div className="progress" style={{ scaleX: prog }} aria-hidden />
        </div>
      </motion.header>
      <AnimatePresence>
        {open && (
          <motion.div className="sheet" role="dialog" aria-modal="true" aria-label="Menu"
            initial={{ clipPath: "circle(0px at calc(100% - 40px) 40px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 40px) 40px)" }}
            exit={{ clipPath: "circle(0px at calc(100% - 40px) 40px)" }}
            transition={{ duration: 0.6, ease }}>
            <button className="x" aria-label="Close menu" onClick={() => setOpen(false)}><X /></button>
            {site.nav.map((n, i) => (
              <motion.a key={n.path} className="l" href={n.path} onClick={() => setOpen(false)}
                initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 + i * 0.07, duration: 0.5, ease }}>{n.label}</motion.a>
            ))}
            <motion.a className="l" href="/subjects" onClick={() => setOpen(false)} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7, duration: 0.5, ease }}>Subjects</motion.a>
            <motion.a className="l" href="/get-started" onClick={() => setOpen(false)} style={{ color: "#FF6342" }} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.74, duration: 0.5, ease }}>Get started</motion.a>
            <motion.a className="l" href="/login" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8, duration: 0.5, ease }}>Log in</motion.a>
            <motion.a className="l" href="/signup" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.87, duration: 0.5, ease }}>Sign up</motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
