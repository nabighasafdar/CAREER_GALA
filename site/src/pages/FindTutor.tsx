import { useMemo, useState } from "react";
import { tutors } from "../content/site";
import { Eyebrow } from "./SiteLayout";

const SUBJECTS = ["All", "Maths", "Science", "English", "IELTS", "MDCAT"];
const MODES = ["Any", "Online", "Home"];
const LEVELS = ["Any level", "Matric", "FSc", "O Level", "A Level", "University"];
const PRICES = ["Any price", "Under Rs 1,500", "Rs 1,500 – 2,500", "Rs 2,500+"];
const CITIES = ["Any city", "Lahore", "Karachi", "Islamabad", "Faisalabad"];
const SORTS = ["Recommended", "Highest rated", "Price: low to high", "Newest"];

const inPrice = (rate: number, p: string) => p === PRICES[1] ? rate < 1500 : p === PRICES[2] ? rate >= 1500 && rate < 2500 : p === PRICES[3] ? rate >= 2500 : true;
const modeLabel = (m: string) => (m === "Both" ? "Online · Home" : m === "Home" ? "Home tuition" : "Online");

const Select = ({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) => (
  <label className="ft-sel">{label}<select value={value} onChange={(e) => onChange(e.target.value)}>{options.map((o) => <option key={o}>{o}</option>)}</select></label>
);

export default function FindTutor() {
  const [q, setQ] = useState("");
  const [subject, setSubject] = useState("All");
  const [mode, setMode] = useState("Any");
  const [level, setLevel] = useState(LEVELS[0]);
  const [price, setPrice] = useState(PRICES[0]);
  const [city, setCity] = useState(CITIES[0]);
  const [sort, setSort] = useState(SORTS[0]);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    const found = tutors
      .filter((t) => !term || `${t.name} ${t.subj} ${t.cat}`.toLowerCase().includes(term))
      .filter((t) => subject === "All" || t.cat === subject)
      .filter((t) => mode === "Any" || t.mode === mode || t.mode === "Both")
      .filter((t) => level === LEVELS[0] || t.level === level)
      .filter((t) => inPrice(t.rate, price))
      .filter((t) => city === CITIES[0] || t.city === city);
    if (sort === SORTS[1]) return [...found].sort((a, b) => b.rating - a.rating);
    if (sort === SORTS[2]) return [...found].sort((a, b) => a.rate - b.rate);
    if (sort === SORTS[3]) return [...found].reverse();
    return found;
  }, [q, subject, mode, level, price, city, sort]);

  return (
    <>
      <section className="s-wrap ft-top">
        <Eyebrow>Verified tutors</Eyebrow>
        <h1>Find a <span className="serif">tutor</span></h1>
        <form className="ft-search" role="search" onSubmit={(e) => e.preventDefault()}>
          <label>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#55627A" strokeWidth="2" aria-hidden><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.5-4.5" /></svg>
            <span className="s-sr">Search</span>
            <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by subject, exam or tutor name" />
          </label>
          <button className="s-btn s-coral" type="submit">Search</button>
        </form>
      </section>

      <section className="s-wrap ft-body">
        <aside className="ft-filters">
          <div>
            <div className="fl">Subject</div>
            <div className="ft-chips">{SUBJECTS.map((s) => <button key={s} type="button" aria-pressed={subject === s} onClick={() => setSubject(s)}>{s}</button>)}</div>
          </div>
          <div>
            <div className="fl">Lesson type</div>
            <div className="ft-seg">{MODES.map((m) => <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}>{m}</button>)}</div>
          </div>
          <Select label="Level" value={level} options={LEVELS} onChange={setLevel} />
          <Select label="Price per hour" value={price} options={PRICES} onChange={setPrice} />
          <Select label="City" value={city} options={CITIES} onChange={setCity} />
        </aside>

        <div className="ft-main">
          <div className="ft-bar">
            <div aria-live="polite"><b>{list.length}</b> tutor{list.length === 1 ? "" : "s"} found</div>
            <label>Sort by<select value={sort} onChange={(e) => setSort(e.target.value)}>{SORTS.map((o) => <option key={o}>{o}</option>)}</select></label>
          </div>

          {list.length ? (
            <div className="ft-grid">
              {list.map((t) => (
                <article key={t.ini} className="lift">
                  <div className="who">
                    <span className="av" style={{ background: t.bg }}>{t.ini}</span>
                    <div>
                      <div className="nm">{t.name} <svg width="15" height="15" viewBox="0 0 24 24" role="img" aria-label="Verified"><circle cx="12" cy="12" r="10" fill="#1F8F7A" /><path d="M7.5 12.5l3 3 6-6.5" stroke="#FFFFFF" strokeWidth="2.4" fill="none" /></svg></div>
                      <div className="sj">{t.subj}</div>
                    </div>
                  </div>
                  <div className="tags"><span>{t.exp}</span><span>{modeLabel(t.mode)}</span></div>
                  <div className="meta">
                    <span><i>★</i> {t.rating} <em>({t.reviews})</em></span>
                    <span>Rs [{t.rate.toLocaleString("en-PK")}]<em>/hr</em></span>
                  </div>
                  <div className="acts">
                    <a className="s-btn s-ghost sm" href="/tutor/profile">View profile</a>
                    <a className="s-btn s-coral sm" href="/tutor/profile">Book trial</a>
                  </div>
                </article>
              ))}
            </div>
          ) : <div className="ft-none">No tutors match these filters yet.</div>}

          <div className="s-banner">
            <div><b>Can't find the right tutor?</b><span>Tell us what you need and we'll match you within 24 hours.</span></div>
            <a className="s-btn s-dark" href="/get-started">Get matched →</a>
          </div>
        </div>
      </section>
    </>
  );
}
