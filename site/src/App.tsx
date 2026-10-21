import Lenis from "lenis";
import { useEffect } from "react";
import { site } from "./content/site";
import { useReducedMotion } from "./lib/animations";
import { Contact } from "./components/sections/Contact";
import { Faq } from "./components/sections/Faq";
import { Floating } from "./components/sections/Floating";
import { Footer } from "./components/sections/Footer";
import { Header } from "./components/sections/Header";
import { Hero } from "./components/sections/Hero";
import { HowItWorks } from "./components/sections/HowItWorks";
import { Services } from "./components/sections/Services";
import { Stats } from "./components/sections/Stats";
import { Stories } from "./components/sections/Stories";
import { GlobalDefs } from "./components/ui/PathDraw";

const jsonLd = [
  { "@context": "https://schema.org", "@type": "EducationalOrganization", name: "Career Gala", email: site.email, telephone: site.phone, sameAs: [site.social.facebook, site.social.instagram, site.social.channel], areaServed: ["Karachi", "Lahore", "Islamabad"] },
  { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: site.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
];

export default function App() {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis();
    (window as any).__lenis = lenis;
    let raf = requestAnimationFrame(function loop(t) { lenis.raf(t); raf = requestAnimationFrame(loop); });
    return () => { cancelAnimationFrame(raf); lenis.destroy(); (window as any).__lenis = undefined; };
  }, [reduced]);

  const top = () => { const l = (window as any).__lenis; l ? l.scrollTo(0) : window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <>
      <GlobalDefs />
      <a className="skip" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <Hero />
        <Stats />
        <Services />
        <HowItWorks />
        <Stories />
        <Faq />
        <Contact />
      </main>
      <Footer lenisTop={top} />
      <Floating />
      {jsonLd.map((j, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />)}
    </>
  );
}
