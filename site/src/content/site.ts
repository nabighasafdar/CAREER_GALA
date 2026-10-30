export const site = {
  brand: "Career Gala",
  email: "info@careergala.com",
  phone: "+92 310 1178268",
  whatsapp: "https://wa.me/923101178268",
  nav: [
    { path: "/home", label: "Home" },
    { path: "/find-tutor", label: "Find a Tutor" },
    { path: "/counselling", label: "Counselling" },
    { path: "/become-tutor", label: "Become a Tutor" },
    { path: "/pricing", label: "Pricing" },
  ],
};

export type SampleTutor = {
  ini: string; name: string; subj: string; short?: string; cat: string; mode: "Online" | "Home" | "Both";
  exp: string; rating: number; reviews: number; rate: number; bg: string; level: string; city: string;
};

/** [FIX] Sample tutors from the design. Replace with real approved tutors, public prices and real reviews. */
export const tutors: SampleTutor[] = [
  { ini: "AK", name: "Ayesha K.", subj: "O Level Maths", cat: "Maths", mode: "Both", exp: "6 yrs", rating: 4.9, reviews: 48, rate: 1800, bg: "#1F8F7A", level: "O Level", city: "Lahore" },
  { ini: "HR", name: "Hamza R.", subj: "IELTS Speaking & Writing", short: "IELTS", cat: "IELTS", mode: "Online", exp: "4 yrs", rating: 4.8, reviews: 61, rate: 2000, bg: "#1C9AB0", level: "University", city: "Karachi" },
  { ini: "SN", name: "Sana N.", subj: "MDCAT Biology", cat: "MDCAT", mode: "Online", exp: "5 yrs", rating: 4.9, reviews: 37, rate: 2200, bg: "#E2536F", level: "FSc", city: "Islamabad" },
  { ini: "UA", name: "Usman A.", subj: "FSc Physics", cat: "Science", mode: "Home", exp: "8 yrs", rating: 4.7, reviews: 29, rate: 1500, bg: "#6E5B8F", level: "FSc", city: "Lahore" },
  { ini: "MF", name: "Maryam F.", subj: "Spoken English", cat: "English", mode: "Online", exp: "3 yrs", rating: 4.9, reviews: 52, rate: 1200, bg: "#1F8F7A", level: "University", city: "Karachi" },
  { ini: "BT", name: "Bilal T.", subj: "A Level Chemistry", cat: "Science", mode: "Online", exp: "7 yrs", rating: 4.8, reviews: 33, rate: 2500, bg: "#1C9AB0", level: "A Level", city: "Islamabad" },
  { ini: "ZH", name: "Zara H.", subj: "Matric Maths", cat: "Maths", mode: "Home", exp: "2 yrs", rating: 4.6, reviews: 18, rate: 1000, bg: "#E2536F", level: "Matric", city: "Faisalabad" },
  { ini: "OS", name: "Omer S.", subj: "IELTS Academic", cat: "IELTS", mode: "Both", exp: "9 yrs", rating: 4.9, reviews: 44, rate: 2100, bg: "#6E5B8F", level: "University", city: "Lahore" },
];
