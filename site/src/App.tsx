import Lenis from "lenis";
import { lazy, Suspense, useEffect } from "react";
import type { ComponentType } from "react";
import { site } from "./content/site";
import { useReducedMotion } from "./lib/animations";
import { Floating } from "./components/sections/Floating";
import { Explore } from "./components/sections/Explore";
import { Footer } from "./components/sections/Footer";
import { Header } from "./components/sections/Header";
import { Hero } from "./components/sections/Hero";
import { Stats } from "./components/sections/Stats";
import { GlobalDefs } from "./components/ui/PathDraw";

const Services = lazy(() => import("./components/sections/Services").then((m) => ({ default: m.Services })));
const HowItWorks = lazy(() => import("./components/sections/HowItWorks").then((m) => ({ default: m.HowItWorks })));
const Stories = lazy(() => import("./components/sections/Stories").then((m) => ({ default: m.Stories })));
const Faq = lazy(() => import("./components/sections/Faq").then((m) => ({ default: m.Faq })));
const Contact = lazy(() => import("./components/sections/Contact").then((m) => ({ default: m.Contact })));

const sections: Record<string, { title: string; Page: ComponentType }> = {
  "/services": { title: "Services", Page: Services },
  "/how-it-works": { title: "How it works", Page: HowItWorks },
  "/stories": { title: "Success stories", Page: Stories },
  "/faq": { title: "FAQ", Page: Faq },
  "/contact": { title: "Contact", Page: Contact },
};

const jsonLd = [
  { "@context": "https://schema.org", "@type": "EducationalOrganization", name: "Career Gala", email: site.email, telephone: site.phone, sameAs: [site.social.facebook, site.social.instagram, site.social.channel], areaServed: ["Karachi", "Lahore", "Islamabad"] },
  { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: site.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
];

export default function App({ path }: { path: string }) {
  const reduced = useReducedMotion();
  const section = sections[path];
  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis();
    (window as any).__lenis = lenis;
    let raf = requestAnimationFrame(function loop(t) { lenis.raf(t); raf = requestAnimationFrame(loop); });
    return () => { cancelAnimationFrame(raf); lenis.destroy(); (window as any).__lenis = undefined; };
  }, [reduced]);

  useEffect(() => {
    document.title = section ? `${section.title} | Career Gala` : "Career Gala | Career Counselling for Pakistani Students";
    (window as any).__lenis?.scrollTo(0, { immediate: true });
  }, [section]);

  const top = () => { const l = (window as any).__lenis; l ? l.scrollTo(0) : window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <>
      <GlobalDefs />
      <a className="skip" href="#main">Skip to content</a>
      <Header path={path} />
      <main id="main" className={section ? "subpage" : undefined}>
        {section ? <Suspense fallback={null}><section.Page /></Suspense> : <><Hero /><Stats /><Explore /></>}
      </main>
      <Footer lenisTop={top} />
      <Floating key={path} />
      {jsonLd.map((j, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />)}
    </>
  );
}
