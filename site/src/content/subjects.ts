export type TrackId = "school" | "matric" | "fsc" | "olevel" | "alevel" | "test" | "medical" | "university" | "skills";
export type Filter = { key: string; label: string; options: string[] };
export type Track = { id: TrackId; name: string; sub: string; accent: string; level?: string; filters: Filter[] };
export type Course = { id: string; track: TrackId; name: string; blurb: string; tags: string[]; kw?: string };

/** Learner levels. `level` maps to the enquiry form's level list. */
export const tracks: Track[] = [
  { id: "school", name: "School", sub: "Grades 1–8", accent: "#C27A00", level: "Primary / Middle", filters: [{ key: "g", label: "Grade", options: ["Grades 1–5", "Grades 6–8"] }] },
  { id: "matric", name: "Matric", sub: "Grades 9–10", accent: "#157A67", level: "Matric", filters: [{ key: "g", label: "Group", options: ["Science", "Arts", "Computer Science"] }] },
  { id: "fsc", name: "FSc / Intermediate", sub: "Grades 11–12", accent: "#2453E6", level: "FSc", filters: [{ key: "s", label: "Stream", options: ["Pre-Medical", "Pre-Engineering", "ICS", "FA / I.Com"] }] },
  { id: "olevel", name: "O Level", sub: "Cambridge · Edexcel", accent: "#E8579A", level: "O Level", filters: [{ key: "a", label: "Area", options: ["Sciences", "Maths", "Languages", "Business & Humanities"] }] },
  { id: "alevel", name: "A Level", sub: "AS & A2", accent: "#7C5CFF", level: "A Level", filters: [{ key: "a", label: "Area", options: ["Sciences", "Maths", "Business & Humanities"] }] },
  { id: "test", name: "Test prep", sub: "IELTS · ECAT · MDCAT · SAT", accent: "#FF6342", filters: [{ key: "t", label: "Goal", options: ["Study abroad", "Engineering entry", "Medical entry"] }] },
  { id: "medical", name: "Medical", sub: "MBBS · BDS · Pharm-D · Nursing", accent: "#059669", level: "University", filters: [{ key: "p", label: "Program", options: ["MBBS", "BDS", "Pharm-D", "Nursing & Allied", "Licensing exams"] }] },
  { id: "university", name: "University", sub: "Degree courses", accent: "#0EA5C6", level: "University", filters: [{ key: "f", label: "Field", options: ["Computing", "Engineering & Maths", "Business"] }] },
  { id: "skills", name: "Skills & languages", sub: "English · Arabic · Quran · Tech", accent: "#B45309", filters: [{ key: "k", label: "Type", options: ["Languages", "Quran & Islamic studies", "Tech & creative"] }] },
];

const c = (track: TrackId, name: string, blurb: string, tags: string[], kw = ""): Course => ({ id: `${track}:${name}`, track, name, blurb, tags, kw });
const G1 = "Grades 1–5", G2 = "Grades 6–8";
const SCI = "Science", ART = "Arts", CS = "Computer Science";
const PM = "Pre-Medical", PE = "Pre-Engineering", ICS = "ICS", FA = "FA / I.Com";

export const courses: Course[] = [
  // School
  c("school", "Maths", "Number sense, fractions, geometry and word problems.", [G1, G2], "math"),
  c("school", "English", "Reading, writing, grammar and confident speaking.", [G1, G2]),
  c("school", "Urdu", "Reading, writing and comprehension in Urdu.", [G1, G2]),
  c("school", "General Science", "Plants, animals, matter and energy, made hands-on.", [G1, G2], "science"),
  c("school", "Phonics & Early Reading", "Sounds, spelling and first reading skills.", [G1]),
  c("school", "Islamiyat", "Core Islamic knowledge for school level.", [G1, G2]),
  c("school", "Social Studies", "Geography, history and civics.", [G2]),
  c("school", "Computer Basics", "Typing, safe internet use, first coding ideas.", [G1, G2], "computer"),
  // Matric
  c("matric", "Maths", "Algebra, geometry and trigonometry for board exams.", [SCI, CS], "math mathematics"),
  c("matric", "General Maths", "Arts-group maths with exam-focused practice.", [ART], "math"),
  c("matric", "Physics", "Concepts, numericals and practicals.", [SCI, CS]),
  c("matric", "Chemistry", "Reactions, equations and lab work.", [SCI, CS]),
  c("matric", "Biology", "Diagrams, definitions and exam technique.", [SCI]),
  c("matric", "Computer Science", "Programming logic, databases and web basics.", [CS, SCI], "computer"),
  c("matric", "English", "Grammar, composition and textbook prep.", [SCI, ART, CS]),
  c("matric", "Urdu", "Textbook prep, essays and grammar.", [SCI, ART, CS]),
  c("matric", "Islamiyat", "Board syllabus coverage.", [SCI, ART, CS]),
  c("matric", "Pakistan Studies", "History, geography and key dates.", [SCI, ART, CS]),
  c("matric", "General Science", "Arts-group science, simply explained.", [ART]),
  // FSc
  c("fsc", "Physics", "Mechanics to modern physics with numerical drills.", [PM, PE, ICS]),
  c("fsc", "Chemistry", "Organic, physical and inorganic chemistry.", [PM, PE]),
  c("fsc", "Biology", "Full syllabus with diagram and MCQ practice.", [PM]),
  c("fsc", "Maths", "Calculus, algebra and trigonometry.", [PE, ICS], "math mathematics"),
  c("fsc", "Computer Science", "Programming, data and networks.", [ICS], "computer"),
  c("fsc", "Statistics", "Probability and data analysis.", [ICS, FA]),
  c("fsc", "English", "Grammar, composition and board prep.", [PM, PE, ICS, FA]),
  c("fsc", "Urdu", "Board syllabus coverage.", [PM, PE, ICS, FA]),
  c("fsc", "Islamiyat / Pakistan Studies", "Compulsory subjects, covered efficiently.", [PM, PE, ICS, FA]),
  c("fsc", "Economics", "Micro and macro basics.", [FA]),
  c("fsc", "Principles of Accounting", "Ledgers, trial balance and final accounts.", [FA], "accounting"),
  c("fsc", "Business Mathematics", "Ratios, interest and business calculations.", [FA], "math"),
  // O Level
  c("olevel", "Mathematics D", "Cambridge 4024 and Edexcel Maths A practice.", ["Maths"], "math 4024"),
  c("olevel", "Additional Mathematics", "Calculus, functions and vectors.", ["Maths"], "add maths 4037"),
  c("olevel", "Physics", "Theory, papers 2 and 4, practicals.", ["Sciences"], "5054"),
  c("olevel", "Chemistry", "Theory, papers 2 and 4, practicals.", ["Sciences"], "5070"),
  c("olevel", "Biology", "Theory, papers 2 and 4, practicals.", ["Sciences"], "5090"),
  c("olevel", "Computer Science", "Algorithms, programming and theory.", ["Sciences"], "2210 computer"),
  c("olevel", "English Language", "Reading, writing and exam strategy.", ["Languages"], "1123"),
  c("olevel", "English Literature", "Set texts, essays and analysis.", ["Languages"], "2010"),
  c("olevel", "Urdu", "Second-language Urdu.", ["Languages"], "3248"),
  c("olevel", "Islamiyat", "Paper 1 and 2 preparation.", ["Business & Humanities"], "2058"),
  c("olevel", "Pakistan Studies", "History and environment papers.", ["Business & Humanities"], "2059"),
  c("olevel", "Accounting", "Financial statements and ratios.", ["Business & Humanities"], "7707"),
  c("olevel", "Business Studies", "Case studies and exam technique.", ["Business & Humanities"], "7115"),
  c("olevel", "Economics", "Concepts, graphs and data response.", ["Business & Humanities"], "2281"),
  c("olevel", "Sociology", "Core themes and essay writing.", ["Business & Humanities"], "2251"),
  // A Level
  c("alevel", "Maths", "Pure, mechanics and statistics.", ["Maths"], "math 9709"),
  c("alevel", "Further Maths", "Matrices, complex numbers and beyond.", ["Maths"], "9231"),
  c("alevel", "Physics", "AS and A2 theory plus practical skills.", ["Sciences"], "9702"),
  c("alevel", "Chemistry", "AS and A2 with calculations focus.", ["Sciences"], "9701"),
  c("alevel", "Biology", "AS and A2, data and essay papers.", ["Sciences"], "9700"),
  c("alevel", "Computer Science", "Theory, programming and problem solving.", ["Sciences"], "9618 computer"),
  c("alevel", "Economics", "Micro, macro and essay technique.", ["Business & Humanities"], "9708"),
  c("alevel", "Accounting", "Financial and cost accounting.", ["Business & Humanities"], "9706"),
  c("alevel", "Business", "Strategy, finance and case studies.", ["Business & Humanities"], "9609"),
  c("alevel", "Psychology", "Core studies and research methods.", ["Business & Humanities"], "9990"),
  c("alevel", "Law", "Legal system and key cases.", ["Business & Humanities"], "9084"),
  // Test prep
  c("test", "IELTS Academic", "All four modules with band-score targets.", ["Study abroad"], "ielts band university"),
  c("test", "IELTS General Training", "For work and migration pathways.", ["Study abroad"], "ielts band migration"),
  c("test", "IELTS Speaking Practice", "Mock interviews with detailed feedback.", ["Study abroad"], "ielts"),
  c("test", "TOEFL iBT", "Reading, listening, speaking and writing.", ["Study abroad"], "toefl"),
  c("test", "PTE Academic", "Computer-based English test prep.", ["Study abroad"], "pte"),
  c("test", "SAT", "Digital SAT maths and reading.", ["Study abroad", "Engineering entry"], "sat"),
  c("test", "GRE", "Quant, verbal and analytical writing.", ["Study abroad"], "gre masters"),
  c("test", "ECAT Full Prep", "Engineering entry test, all sections.", ["Engineering entry"], "ecat engineering uet"),
  c("test", "ECAT Maths", "High-yield maths for ECAT.", ["Engineering entry"], "ecat math"),
  c("test", "ECAT Physics", "Concept and MCQ practice.", ["Engineering entry"], "ecat"),
  c("test", "NUST NET", "NET test strategy and past papers.", ["Engineering entry"], "net nust"),
  c("test", "MDCAT Full Prep", "Complete medical entry preparation.", ["Medical entry"], "mdcat medical mbbs"),
  c("test", "MDCAT Biology", "The biggest section, covered chapter by chapter.", ["Medical entry"], "mdcat"),
  c("test", "MDCAT Chemistry", "Concept clarity plus MCQ drills.", ["Medical entry"], "mdcat"),
  c("test", "MDCAT Physics", "Formula-driven problem solving.", ["Medical entry"], "mdcat"),
  c("test", "MDCAT English & Logical Reasoning", "Vocabulary, grammar and logic.", ["Medical entry"], "mdcat"),
  // Medical
  c("medical", "Anatomy", "Gross anatomy, histology and embryology.", ["MBBS", "BDS", "Nursing & Allied"]),
  c("medical", "Physiology", "Systems physiology with clinical links.", ["MBBS", "BDS", "Nursing & Allied"]),
  c("medical", "Biochemistry", "Metabolism, enzymes and molecular biology.", ["MBBS", "BDS", "Pharm-D"]),
  c("medical", "Pathology", "General and systemic pathology.", ["MBBS", "BDS"]),
  c("medical", "Pharmacology", "Drug classes, mechanisms and side effects.", ["MBBS", "BDS", "Pharm-D"]),
  c("medical", "Microbiology", "Bacteria, viruses and immunology.", ["MBBS", "BDS", "Pharm-D", "Nursing & Allied"]),
  c("medical", "Forensic Medicine", "Toxicology and medico-legal topics.", ["MBBS"]),
  c("medical", "Community Medicine", "Public health and biostatistics.", ["MBBS"]),
  c("medical", "Medicine & Allied", "Clinical medicine for final-year exams.", ["MBBS"]),
  c("medical", "Surgery & Allied", "Clinical surgery for final-year exams.", ["MBBS"]),
  c("medical", "Gynae & Obstetrics", "Clinical cases and viva preparation.", ["MBBS"]),
  c("medical", "Paediatrics", "Clinical cases and viva preparation.", ["MBBS"]),
  c("medical", "Pharmaceutics", "Dosage forms and formulation.", ["Pharm-D"]),
  c("medical", "Pharmaceutical Chemistry", "Drug structure and synthesis.", ["Pharm-D"]),
  c("medical", "Fundamentals of Nursing", "Clinical skills and patient care basics.", ["Nursing & Allied"]),
  c("medical", "USMLE Step 1", "Basic science question banks and strategy.", ["Licensing exams"], "usmle"),
  c("medical", "USMLE Step 2 CK", "Clinical knowledge and question practice.", ["Licensing exams"], "usmle"),
  c("medical", "PLAB", "UK licensing exam preparation.", ["Licensing exams"], "plab uk"),
  c("medical", "National Licensing Exam (NLE)", "Pakistan's final-year licensing exam.", ["Licensing exams"], "nle"),
  // University
  c("university", "Calculus", "Limits to multivariable calculus.", ["Engineering & Maths", "Computing"], "math"),
  c("university", "Linear Algebra", "Vectors, matrices and eigenvalues.", ["Engineering & Maths", "Computing"], "math"),
  c("university", "Probability & Statistics", "Distributions, tests and inference.", ["Engineering & Maths", "Computing", "Business"]),
  c("university", "Programming Fundamentals", "C++ and problem solving from scratch.", ["Computing"], "c++ programming cs"),
  c("university", "Python Programming", "From basics to projects.", ["Computing"], "python"),
  c("university", "Data Structures & Algorithms", "Complexity, trees, graphs and more.", ["Computing"], "dsa"),
  c("university", "Databases (SQL)", "Design, queries and normalisation.", ["Computing"], "sql database"),
  c("university", "Physics (University)", "Mechanics, waves and electricity.", ["Engineering & Maths"]),
  c("university", "Financial Accounting", "Statements, adjustments and analysis.", ["Business"], "accounting"),
  c("university", "Microeconomics", "Markets, firms and welfare.", ["Business"], "economics"),
  // Skills
  c("skills", "Spoken English", "Fluency, pronunciation and confidence.", ["Languages"], "english speaking"),
  c("skills", "Business English", "Emails, meetings and presentations.", ["Languages"], "english"),
  c("skills", "Arabic", "Reading, speaking and grammar.", ["Languages"]),
  c("skills", "German", "A1 to B1 for study and work abroad.", ["Languages"], "deutsch"),
  c("skills", "Quran Nazra & Tajweed", "Correct recitation, step by step.", ["Quran & Islamic studies"], "quran"),
  c("skills", "Islamic Studies", "Seerah, fiqh basics and daily practice.", ["Quran & Islamic studies"]),
  c("skills", "Web Development", "HTML, CSS, JavaScript and projects.", ["Tech & creative"], "coding"),
  c("skills", "Graphic Design", "Design basics and portfolio work.", ["Tech & creative"]),
  c("skills", "Excel & Data Skills", "Formulas, pivots and dashboards.", ["Tech & creative"]),
];

export const byId = new Map(courses.map((x) => [x.id, x]));

/** One-click starting points. */
export const paths: { name: string; sub: string; track: TrackId; ids: string[] }[] = [
  { name: "FSc Pre-Medical core", sub: "Physics · Chemistry · Biology · English", track: "fsc", ids: ["fsc:Physics", "fsc:Chemistry", "fsc:Biology", "fsc:English"] },
  { name: "MDCAT full prep", sub: "All four sections", track: "test", ids: ["test:MDCAT Biology", "test:MDCAT Chemistry", "test:MDCAT Physics", "test:MDCAT English & Logical Reasoning"] },
  { name: "ECAT & Engineering", sub: "Full prep · Maths · Physics", track: "test", ids: ["test:ECAT Full Prep", "test:ECAT Maths", "test:ECAT Physics"] },
  { name: "O Level sciences", sub: "Maths · Physics · Chemistry · Biology", track: "olevel", ids: ["olevel:Mathematics D", "olevel:Physics", "olevel:Chemistry", "olevel:Biology"] },
  { name: "IELTS band 7+", sub: "Academic · Speaking practice", track: "test", ids: ["test:IELTS Academic", "test:IELTS Speaking Practice"] },
  { name: "MBBS first year", sub: "Anatomy · Physiology · Biochemistry", track: "medical", ids: ["medical:Anatomy", "medical:Physiology", "medical:Biochemistry"] },
  { name: "Matric science group", sub: "Maths · Physics · Chemistry · Biology", track: "matric", ids: ["matric:Maths", "matric:Physics", "matric:Chemistry", "matric:Biology"] },
  { name: "A Level Maths track", sub: "Maths · Further Maths · Physics", track: "alevel", ids: ["alevel:Maths", "alevel:Further Maths", "alevel:Physics"] },
];
