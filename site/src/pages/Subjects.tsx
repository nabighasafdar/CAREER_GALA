import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Atom, Award, Backpack, BookOpen, Check, GraduationCap, Library, Plus, Search, Sparkles, Stethoscope, Target, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Brand, Eyebrow } from "./Shell";
import { toggle } from "./ui";
import { byId, courses, paths, tracks, type Course, type TrackId } from "../content/subjects";
import { site } from "../content/site";
import { navigate } from "../lib/router";

const icons: Record<TrackId, LucideIcon> = {
  school: Backpack, matric: BookOpen, fsc: Atom, olevel: Library, alevel: Award, test: Target, medical: Stethoscope, university: GraduationCap, skills: Sparkles,
};
const trackOf = (id: TrackId) => tracks.find((t) => t.id === id)!;
const TRY = ["MDCAT", "IELTS band 7", "O Level physics", "MBBS anatomy", "Python"];
const spring = { type: "spring", stiffness: 300, damping: 28 } as const;

type Item = { id: string; name: string; track: TrackId | "custom" };

export default function Subjects() {
  const [q, setQ] = useState("");
  const [track, setTrack] = useState<TrackId | null>(null);
  const [flt, setFlt] = useState<Record<string, string>>({});
  const [plan, setPlan] = useState<string[]>([]);
  const [custom, setCustom] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const results = useRef<HTMLDivElement>(null);

  const searching = q.trim().length > 0;
  const t = track ? trackOf(track) : null;

  const shown = useMemo<Course[]>(() => {
    if (searching) {
      const words = q.toLowerCase().split(/\s+/).filter(Boolean);
      return courses.filter((c) => {
        const tr = trackOf(c.track);
        const hay = `${c.name} ${c.blurb} ${c.kw} ${c.tags.join(" ")} ${tr.name}`.toLowerCase();
        return words.every((w) => hay.includes(w));
      });
    }
    if (!t) return [];
    return courses.filter((c) => c.track === t.id && t.filters.every((f) => !flt[f.key] || c.tags.includes(flt[f.key])));
  }, [q, searching, t, flt]);

  const items: Item[] = [
    ...plan.map((id) => { const c = byId.get(id)!; return { id, name: c.name, track: c.track }; }),
    ...custom.map((n) => ({ id: `custom:${n}`, name: n, track: "custom" as const })),
  ];
  const total = items.length;

  const pickTrack = (id: TrackId) => {
    setQ(""); setFlt({}); setTrack(id);
    requestAnimationFrame(() => results.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  const addPath = (ids: string[]) => setPlan((p) => (ids.every((i) => p.includes(i)) ? p.filter((i) => !ids.includes(i)) : [...new Set([...p, ...ids])]));
  const addCustom = () => {
    const n = draft.trim();
    if (n && !custom.some((x) => x.toLowerCase() === n.toLowerCase())) setCustom((c) => [...c, n]);
    setDraft("");
  };
  const remove = (it: Item) => (it.track === "custom" ? setCustom((c) => c.filter((x) => x !== it.name)) : setPlan((p) => p.filter((x) => x !== it.id)));
  const clearAll = () => { setPlan([]); setCustom([]); };

  const go = () => {
    const names = [...new Set(items.map((i) => i.name))];
    const lvl = items.map((i) => (i.track === "custom" ? undefined : trackOf(i.track).level)).find(Boolean);
    navigate(`/get-started?subjects=${encodeURIComponent(names.join(","))}${lvl ? `&level=${encodeURIComponent(lvl)}` : ""}`);
  };

  const groups = tracks.map((tr) => ({ tr, list: items.filter((i) => i.track === tr.id) })).filter((g) => g.list.length);
  const customItems = items.filter((i) => i.track === "custom");

  return (
    <MotionConfig reducedMotion="user">
      <div className="pg wiz-page subj-page" style={{ paddingTop: 28 }}>
        <div aria-hidden className="orb" style={{ width: 460, height: 460, left: "4%", top: 200, background: "#9FE3D2", opacity: .5, filter: "blur(90px)" }} />
        <div aria-hidden className="orb" style={{ width: 400, height: 400, right: "4%", top: 520, background: "#FFC2B3", opacity: .45, filter: "blur(100px)" }} />
        <div className="wiz-top"><Brand /><a className="pg-btn pg-ghost" style={{ fontSize: 15, minHeight: 44 }} href="/">Back to home</a></div>

        <main id="main" className="cf-wrap">
          <div className="inq-head">
            <Eyebrow>Course finder</Eyebrow>
            <h1>Find the right <span className="serif">course</span></h1>
            <p>From school to MBBS, O and A Level to IELTS, ECAT and MDCAT. Search, browse by level, or start from a popular path, then mix courses from any level.</p>
          </div>

          <div className="cf-search">
            <Search size={20} aria-hidden />
            <input type="search" aria-label="Search courses" value={q} placeholder="Search anything: “MDCAT biology”, “IELTS”, “A Level maths”…" onChange={(e) => setQ(e.target.value)} />
            {q && <button type="button" aria-label="Clear search" onClick={() => setQ("")}><X size={18} /></button>}
          </div>
          <div className="cf-try"><span>Try</span>{TRY.map((s) => <button key={s} type="button" onClick={() => setQ(s)}>{s}</button>)}</div>

          <section aria-labelledby="cf-paths">
            <h2 className="cf-h" id="cf-paths">Popular paths <small>One click adds the whole set</small></h2>
            <div className="cf-paths">
              {paths.map((p) => {
                const Ic = icons[p.track], tr = trackOf(p.track), on = p.ids.every((i) => plan.includes(i));
                return (
                  <button key={p.name} type="button" className={`cf-path${on ? " on" : ""}`} aria-pressed={on} style={{ "--ac": tr.accent } as React.CSSProperties} onClick={() => addPath(p.ids)}>
                    <span className="ic"><Ic size={20} /></span>
                    <b>{p.name}</b><small>{p.sub}</small>
                    <span className="add">{on ? <><Check size={14} /> Added</> : <><Plus size={14} /> Add {p.ids.length} courses</>}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="cf-levels">
            <h2 className="cf-h" id="cf-levels">Browse by level</h2>
            <div className="cf-tracks">
              {tracks.map((tr) => {
                const Ic = icons[tr.id], on = !searching && track === tr.id, n = courses.filter((c) => c.track === tr.id).length;
                const sel = items.filter((i) => i.track === tr.id).length;
                return (
                  <button key={tr.id} type="button" className={`cf-track${on ? " on" : ""}`} aria-pressed={on} style={{ "--ac": tr.accent } as React.CSSProperties} onClick={() => pickTrack(tr.id)}>
                    <span className="ic"><Ic size={22} strokeWidth={1.75} /></span>
                    <b>{tr.name}</b><small>{tr.sub}</small>
                    <span className="n">{sel ? `${sel} selected` : `${n} courses`}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="cf-body" ref={results}>
            <section className="cf-main" aria-label="Courses">
              {!searching && t && (
                <div className="cf-filters">
                  {t.filters.map((f) => (
                    <div className="flt-row" role="radiogroup" aria-label={f.label} key={f.key}>
                      <span className="flt-lbl">{f.label}</span>
                      {["All", ...f.options].map((o) => {
                        const on = (flt[f.key] ?? "All") === o;
                        return <button key={o} type="button" role="radio" aria-checked={on} className="cf-chip" onClick={() => setFlt((s) => ({ ...s, [f.key]: o === "All" ? "" : o }))}>{o}</button>;
                      })}
                    </div>
                  ))}
                </div>
              )}

              <div className="subj-count" role="status" aria-live="polite">
                {searching ? <>{shown.length} {shown.length === 1 ? "result" : "results"} for “{q.trim()}”</> : t ? <>{shown.length} {t.name} {shown.length === 1 ? "course" : "courses"}</> : "Pick a level above or search to see courses"}
              </div>

              {shown.length > 0 ? (
                <ul className="cf-grid">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {shown.map((c) => {
                      const on = plan.includes(c.id), tr = trackOf(c.track), Ic = icons[c.track];
                      return (
                        <motion.li key={c.id} layout initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .96, transition: { duration: .12 } }} transition={{ layout: spring, duration: .2 }}>
                          <button type="button" className={`cf-card${on ? " on" : ""}`} aria-pressed={on} style={{ "--ac": tr.accent } as React.CSSProperties} onClick={() => setPlan((p) => toggle(p, c.id))}>
                            <span className="top">
                              <span className="lv"><Ic size={13} />{tr.name}</span>
                              <span className="tick" aria-hidden>{on ? <Check size={14} strokeWidth={3} /> : <Plus size={14} strokeWidth={2.5} />}</span>
                            </span>
                            <b>{c.name}</b>
                            <small>{c.blurb}</small>
                            {c.tags.length > 0 && <span className="tags">{c.tags.map((x) => <i key={x}>{x}</i>)}</span>}
                          </button>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              ) : (
                <div className="cf-empty">
                  {searching ? (
                    <>
                      <p>Nothing matches “{q.trim()}”. We still teach more than we list.</p>
                      <button type="button" className="pg-btn pg-ghost" onClick={() => { setCustom((c) => (c.some((x) => x.toLowerCase() === q.trim().toLowerCase()) ? c : [...c, q.trim()])); setQ(""); }}><Plus size={16} /> Add “{q.trim()}” to my plan</button>
                    </>
                  ) : !t ? (
                    <p>Start with a level, or search for any subject, exam or skill. You can combine courses from different levels in one plan.</p>
                  ) : <p>No courses for that filter.</p>}
                </div>
              )}
            </section>

            <aside className="cf-plan" aria-label="Your plan">
              <div className="cf-plan-in">
                <div className="cf-plan-h"><h2>Your plan</h2>{total > 0 && <button type="button" className="linkbtn" onClick={clearAll}>Clear</button>}</div>
                {total === 0 ? <p className="cf-plan-empty">Nothing selected yet. Add courses from any level and they’ll collect here.</p> : (
                  <div className="cf-plan-list">
                    <AnimatePresence initial={false}>
                      {groups.map(({ tr, list }) => (
                        <motion.div key={tr.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="g" style={{ "--ac": tr.accent } as React.CSSProperties}>
                          <div className="gl"><i />{tr.name}</div>
                          {list.map((it) => <PlanChip key={it.id} it={it} onRemove={remove} />)}
                        </motion.div>
                      ))}
                      {customItems.length > 0 && (
                        <motion.div key="custom" layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="g" style={{ "--ac": "#55627A" } as React.CSSProperties}>
                          <div className="gl"><i />My own</div>
                          {customItems.map((it) => <PlanChip key={it.id} it={it} onRemove={remove} />)}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
                <form className="cf-custom" onSubmit={(e) => { e.preventDefault(); addCustom(); }}>
                  <label className="sr" htmlFor="cf-custom">Add a course that isn’t listed</label>
                  <input id="cf-custom" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Not listed? Add your own" />
                  <button type="submit" aria-label="Add course" disabled={!draft.trim()}><Plus size={18} /></button>
                </form>
                <button type="button" className="pg-btn btn-coral full" disabled={!total} onClick={go}>
                  {total ? <>Find tutors for {total} {total === 1 ? "course" : "courses"} <ArrowRight size={18} /></> : "Select a course to continue"}
                </button>
                <p className="cf-help">Not sure where to start? <a href={site.whatsapp} target="_blank" rel="noopener noreferrer">Ask a counsellor on WhatsApp</a></p>
              </div>
            </aside>
          </div>
        </main>

        <div className={`subj-bar${total ? " show" : ""}`} aria-hidden={!total}>
          <span className="cnt"><b>{total}</b> {total === 1 ? "course" : "courses"} selected</span>
          <button type="button" className="pg-btn btn-coral" tabIndex={total ? 0 : -1} onClick={go}>Continue <ArrowRight size={18} /></button>
        </div>
      </div>
    </MotionConfig>
  );
}

function PlanChip({ it, onRemove }: { it: Item; onRemove: (i: Item) => void }) {
  return (
    <motion.span layout initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .9 }} transition={spring} className="pc">
      {it.name}<button type="button" aria-label={`Remove ${it.name}`} onClick={() => onRemove(it)}><X size={13} /></button>
    </motion.span>
  );
}
