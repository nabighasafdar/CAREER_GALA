import { useState } from "react";
import { Eyebrow, Faq, Packages, useHashScroll } from "./SiteLayout";

const rates = ["School subjects", "O / A Levels", "English", "IELTS / TOEFL", "MDCAT & Medical", "Professional"];
const pay = ["JazzCash", "Easypaisa", "Bank transfer", "Debit / credit card"];

export default function Pricing() {
  const [tab, setTab] = useState<"tutoring" | "counselling">("tutoring");
  useHashScroll();
  return (
    <>
      <section className="s-wrap pr-top">
        <div className="eyewrap"><Eyebrow>Pricing</Eyebrow></div>
        <h1>Simple, clear <span className="serif">pricing</span></h1>
        <p>No sign-up fees. Your first lesson is a free demo, and you only pay for the lessons you take.</p>
        <div className="pr-tabs" role="tablist" aria-label="Pricing type">
          <button type="button" role="tab" aria-selected={tab === "tutoring"} onClick={() => setTab("tutoring")}>Tutoring</button>
          <button type="button" role="tab" aria-selected={tab === "counselling"} onClick={() => setTab("counselling")}>Counselling</button>
        </div>
      </section>

      {tab === "tutoring" ? (
        <section className="s-wrap pr-sec fade">
          <div className="pr-how">
            <div className="dark"><span>Step 1</span><b>Free demo</b><p>Try any tutor before you pay.</p></div>
            <div><span>Step 2</span><b>Pay per lesson</b><p>Or save with a [monthly bundle].</p></div>
            <div><span>Always</span><b>No hidden fees</b><p>The price on the profile is what you pay.</p></div>
          </div>
          <h2 className="pr-h">Typical hourly rates</h2>
          <p className="pr-note">Each tutor sets their own rate. These ranges help you plan.</p>
          <div className="pr-rates">{rates.map((r) => <div key={r} className="lift"><span>{r}</span><b>Rs [—]</b></div>)}</div>
          <div className="s-center"><a className="s-btn s-coral" href="/find-tutor">Find a Tutor</a></div>
        </section>
      ) : (
        <section className="s-wrap pr-sec fade"><Packages /></section>
      )}

      <section className="s-wrap pr-sec">
        <div className="s-banner">
          <div><b>Easy ways to pay</b><span>Full refund if a lesson is cancelled by the tutor. <a href="/terms.html">Refund policy</a></span></div>
          <div className="pr-pay">{pay.map((p) => <span key={p}>{p}</span>)}</div>
        </div>
      </section>

      <section id="faq" className="s-narrow pr-faq">
        <h2 className="s-h2 sm c">Pricing <span className="serif">questions</span></h2>
        <Faq items={[
          ["Is the demo lesson really free?", "Yes — every tutor gives one free demo lesson to new students. [Confirm length.]"],
          ["When do I pay?", "[Before each lesson, or monthly in advance — to be confirmed by the client.]"],
          ["What if I need to cancel?", "[Cancellation window and refund rules.]"],
        ]} />
      </section>
    </>
  );
}
