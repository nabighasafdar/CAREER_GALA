import { zodResolver } from "@hookform/resolvers/zod";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, Check, Clock, Code, Cog, Loader2, Mail, MapPin, MessageCircle, Palette, Sparkles, Stethoscope, type LucideIcon } from "lucide-react";
import { forwardRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { site } from "../../content/site";
import { ease, spring, useReducedMotion } from "../../lib/animations";
import { submitLead } from "../../lib/submit";
import { Eyebrow, Reveal } from "../ui/Reveal";

const schema = z.object({
  domain: z.string().optional(),
  stage: z.string().optional(),
  name: z.string().trim().min(2, "Please enter your full name"),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z.string().trim().regex(/^\+?[0-9\s-]{10,16}$/, "Please enter a valid phone number, e.g. +92 300 1234567"),
  message: z.string().optional(),
});
type F = z.infer<typeof schema>;

const domainIcons: Record<string, LucideIcon> = { Engineering: Cog, Business: Briefcase, Arts: Palette, Medicine: Stethoscope, "Information Technology": Code, Other: Sparkles };
const titles = ["What are you interested in?", "About you", "Anything else?"];

const Field = forwardRef<HTMLInputElement & HTMLTextAreaElement, { id: string; label: string; error?: string; area?: boolean } & Record<string, any>>(function Field({ id, label, error, area, ...rest }, ref) {
  const P: any = area ? "textarea" : "input";
  return (
    <motion.div className={`fld${error ? " err" : ""}`} animate={error ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }} transition={{ duration: 0.35 }}>
      <P ref={ref} id={id} placeholder=" " aria-invalid={!!error} aria-describedby={error ? `${id}-e` : undefined} {...rest} />
      <label htmlFor={id}>{label}</label>
      <span className="ul" aria-hidden />
      <AnimatePresence>{error && <motion.p id={`${id}-e`} role="alert" className="em" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{error}</motion.p>}</AnimatePresence>
    </motion.div>
  );
});

export function Contact() {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const { register, handleSubmit, trigger, setValue, watch, formState: { errors } } = useForm<F>({ resolver: zodResolver(schema), mode: "onTouched" });
  const domain = watch("domain"), stage = watch("stage");

  const go = async (to: number) => {
    if (to > step && step === 1 && !(await trigger(["name", "email", "phone"]))) return;
    setDir(to > step ? 1 : -1); setStep(to);
  };
  const onSubmit = async (v: F) => {
    setStatus("sending");
    try {
      await submitLead(v);
      setStatus("done");
      if (!reduced) confetti({ particleCount: 120, spread: 80, origin: { y: 0.7 }, colors: ["#1F8F7A", "#1F8F7A", "#FF6342", "#FBF8F3"] });
    } catch { setStatus("error"); }
  };

  return (
    <section id="contact" className="sec">
      <div className="container">
        <div className="sec-head center">
          <Eyebrow>Get started</Eyebrow>
          <Reveal><h2>Schedule your free <em className="acc">consultation</em></h2></Reveal>
          <Reveal delay={0.1}><p>Take the first step towards your dream career. Fill out the form below and we'll get back to you within 24 hours.</p></Reveal>
        </div>
        <Reveal>
          <div className="split">
            <div className="left noise">
              <h3 style={{ color: "#fff" }}>Your journey ends here, and begins here.</h3>
              <ul>
                <li><Check size={20} />Free first session</li>
                <li><Clock size={20} />Reply within 24 hours</li>
                <li><MapPin size={20} />Online or in Karachi · Lahore · Islamabad</li>
              </ul>
              <div style={{ display: "grid", gap: 8 }}>
                <a href={`mailto:${site.email}`} className="ulink" style={{ display: "inline-flex", gap: 10, alignItems: "center" }}><Mail size={18} />{site.email}</a>
                <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="ulink" style={{ display: "inline-flex", gap: 10, alignItems: "center" }}><MessageCircle size={18} />{site.phone}</a>
              </div>
              <svg viewBox="0 0 200 80" width="200" aria-hidden style={{ marginTop: "auto" }}>
                <motion.path d="M0 70C50 70 60 20 110 30S160 14 184 16" fill="none" stroke="url(#clarity)" strokeWidth="4" strokeLinecap="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.4 }} />
                <circle cx="184" cy="16" r="9" fill="#FF6342" /><circle className="pinring" cx="184" cy="16" r="9" fill="#FF6342" />
              </svg>
            </div>

            <div className="right">
              {status === "done" ? (
                <motion.div className="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={spring}>
                  <svg className="big" width="72" height="72" viewBox="0 0 72 72" aria-hidden><circle cx="36" cy="36" r="34" fill="#1F8F7A" /><motion.path d="M20 37l11 11 21-22" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.5 }} /></svg>
                  <h3 style={{ marginBottom: 8 }} role="status">You're on your way!</h3>
                  <p style={{ marginBottom: 22 }}>We'll contact you within 24 hours.</p>
                  <a className="btn btn-primary" href={`${site.whatsapp}?text=${encodeURIComponent("Hi Career Gala, I just booked a free consultation.")}`} target="_blank" rel="noopener noreferrer">Chat on WhatsApp now</a>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <div className="wiz-bar" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={step + 1} aria-label="Form progress"><motion.i animate={{ scaleX: (step + 1) / 3 }} transition={{ duration: 0.5, ease }} style={{ transformOrigin: "left" }} /></div>
                  <AnimatePresence mode="wait" custom={dir} initial={false}>
                    <motion.div key={step} custom={dir}
                      initial={{ opacity: 0, x: reduced ? 0 : 30 * dir }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reduced ? 0 : -30 * dir }} transition={{ duration: 0.3, ease }}>
                      <h3>{titles[step]}</h3>
                      {step === 0 && (
                        <>
                          <div className="tiles" role="radiogroup" aria-label="Domain of interest">
                            {site.domains.map((d) => { const I = domainIcons[d]; const on = domain === d; return (
                              <motion.button type="button" key={d} role="radio" aria-checked={on} className="tile" onClick={() => setValue("domain", on ? undefined : d)} animate={on ? { scale: [0.97, 1] } : { scale: 1 }} transition={spring}>
                                <motion.span className="ic" animate={on ? { y: [0, -6, 0] } : {}}><I className="ic" size={26} /></motion.span>{d}
                                <AnimatePresence>{on && <motion.span className="ck" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={spring}><Check size={13} strokeWidth={3} /></motion.span>}</AnimatePresence>
                              </motion.button>); })}
                          </div>
                          <div className="stagechips" role="group" aria-label="Your current stage (optional)">
                            {site.stages.map((s) => <button type="button" key={s} aria-pressed={stage === s} onClick={() => setValue("stage", stage === s ? undefined : s)}>{s}</button>)}
                          </div>
                        </>
                      )}
                      {step === 1 && (
                        <>
                          <Field id="name" label="Full name *" error={errors.name?.message} autoComplete="name" {...register("name")} />
                          <Field id="email" label="Email address *" type="email" error={errors.email?.message} autoComplete="email" {...register("email")} />
                          <Field id="phone" label="Phone number * (e.g. +92 300 1234567)" type="tel" error={errors.phone?.message} autoComplete="tel" {...register("phone")} />
                        </>
                      )}
                      {step === 2 && <Field id="message" area label="Tell us about your career goals (optional)" {...register("message")} />}
                    </motion.div>
                  </AnimatePresence>
                  {status === "error" && <p role="alert" className="em" style={{ color: "#d93a3a", marginBottom: 12 }}>Something went wrong. Please try again or message us on WhatsApp.</p>}
                  <div className="wiz-nav">
                    {step > 0 ? <button type="button" className="btn btn-ghost" onClick={() => go(step - 1)}>Back</button> : <span />}
                    {step < 2
                      ? <button type="button" className="btn btn-primary" onClick={() => go(step + 1)}>Next</button>
                      : <button type="submit" className="btn btn-primary" disabled={status === "sending"}>{status === "sending" ? <><Loader2 className="spin" size={18} style={{ animation: "spin 1s linear infinite" }} /> Sending…</> : "Schedule your free consultation"}</button>}
                  </div>
                </form>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
