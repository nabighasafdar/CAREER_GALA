
import { useEffect, useState } from "react";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource/handjet/400.css";
import "@fontsource/handjet/500.css";
import "@fontsource/handjet/600.css";
import "@fontsource/anton/400.css";
import "@fontsource/pacifico/400.css";
import "./landing.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Preloader from "./Preloader";
import Header from "./Header";
import Hero from "./Hero";
import { Intro, Domains, About, Focus, Services, Band, HowItWorks, Manifesto, Power, Why, Contact } from "./Sections";
import { Stats, WhatsAppFloat } from "./Career";

gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
  const [ready, setReady] = useState(false);

  // Smooth scrolling (Lenis) driven by GSAP's ticker so ScrollTrigger stays in sync.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    window.lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      window.lenis = undefined;
    };
  }, []);

  // Unlock scroll once the intro has played, and wire up generic scroll reveals.
  useEffect(() => {
    if (!ready) return;
    document.documentElement.classList.remove("is-loading");
    window.lenis?.start();

    const ctx = gsap.context(() => {
      // Text lines slide up from a mask
      gsap.utils.toArray("[data-reveal='lines']").forEach((el) => {
        gsap.from(el.querySelectorAll(".line > span"), {
          yPercent: 115,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });
      // Blocks fade up, batched so siblings stagger together
      gsap.set("[data-reveal='fade']", { y: 50, opacity: 0 });
      ScrollTrigger.batch("[data-reveal='fade']", {
        start: "top 90%",
        once: true,
        onEnter: (els) => gsap.to(els, { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.12 }),
      });
    });

    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    const t = setTimeout(() => ScrollTrigger.refresh(), 600);
    return () => {
      clearTimeout(t);
      ctx.revert();
    };
  }, [ready]);

  return (
    <>
      <div className="silk-bg" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
      <Preloader onDone={() => setReady(true)} />
      <Header ready={ready} />
      <main>
        <Hero ready={ready} />
        <Intro />
        <Domains />
        <Stats />
        <About />
        <Focus />
        <Services />
        <Band />
        <HowItWorks />
        <Manifesto />
        <div className="wrap"><Power /></div>
        <Why />
        <Contact />
      </main>
      <WhatsAppFloat />
    </>
  );
}
