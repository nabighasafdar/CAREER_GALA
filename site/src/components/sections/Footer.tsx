import { motion } from "framer-motion";
import { ArrowUp, Megaphone, MessageCircle } from "lucide-react";
import { site } from "../../content/site";
import { ease, scrollToId, viewport, useReducedMotion } from "../../lib/animations";
import { MagneticButton } from "../ui/MagneticButton";
import { Logo } from "../ui/Brand";

const Fb = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z" /></svg>;
const Ig = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>;
export const Wa = ({ size = 20 }: { size?: number }) => <MessageCircle size={size} aria-hidden />;

const socials = [
  { label: "Facebook", href: site.social.facebook, c: "#1877F2", I: Fb },
  { label: "Instagram", href: site.social.instagram, c: "#E4405F", I: Ig },
  { label: "WhatsApp", href: site.whatsapp, c: "#25D366", I: Wa },
  { label: "WhatsApp Channel", href: site.social.channel, c: "#25D366", I: () => <Megaphone size={20} /> },
];
const links = [...site.nav.map((n) => [n.label, n.id]), ["Contact", "contact"]];

export function Footer({ lenisTop }: { lenisTop: () => void }) {
  const reduced = useReducedMotion();
  const letters = "CAREER GALA".split("");
  return (
    <>
      <div className="cta-band">
        <div className="container">
          <h2>Your future won't <em className="acc">plan itself.</em></h2>
          <MagneticButton className="btn-primary" onClick={() => scrollToId("contact")}>Book your free consultation</MagneticButton>
        </div>
      </div>
      <footer>
        <div className="container">
          <div className="fcols">
            <div>
              <Logo />
              <p style={{ maxWidth: 420 }}>{site.footerAbout}</p>
              <div className="soc">
                {socials.map(({ label, href, c, I }) => <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer" style={{ ["--b" as any]: c }}><I /></a>)}
              </div>
            </div>
            <div>
              <h4>Quick links</h4>
              <ul>{links.map(([l, id]) => <li key={id}><a className="ulink" href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollToId(id); }}>{l}</a></li>)}</ul>
            </div>
            <div>
              <h4>Contact</h4>
              <ul>
                <li><a className="ulink" href={`mailto:${site.email}`}>{site.email}</a></li>
                <li><a className="ulink" href={site.whatsapp} target="_blank" rel="noopener noreferrer">{site.phone} (WhatsApp)</a></li>
                <li>Offices: Karachi, Lahore, Islamabad</li>
              </ul>
            </div>
          </div>
          <div className="bottom">
            <span>© 2026 Career Gala. All rights reserved.</span>
            <span style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <a className="ulink" href="/privacy.html">Privacy Policy</a>
              <a className="ulink" href="/terms.html">Terms of Service</a>
              <button className="top" onClick={lenisTop}><ArrowUp size={18} />Back to top</button>
            </span>
          </div>
        </div>
        <motion.div className="word" aria-hidden initial="h" whileInView="v" viewport={viewport} transition={{ staggerChildren: 0.04 }}>
          {letters.map((l, i) => (
            <motion.span key={i} variants={{ h: { y: reduced ? 0 : "100%", opacity: reduced ? 0 : 1 }, v: { y: 0, opacity: 1 } }} transition={{ duration: 0.7, ease }}>{l}</motion.span>
          ))}
        </motion.div>
      </footer>
    </>
  );
}
