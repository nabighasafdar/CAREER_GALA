// ─────────────────────────────────────────────────────────────
//  ALL SITE CONTENT LIVES HERE. Edit this file to change text,
//  services, stories, FAQs, links and images — no need to touch
//  the components.
//  Images: drop files in /public and set e.g.  image: "/me.jpg"
//  Anything left as null shows a generated art panel instead.
// ─────────────────────────────────────────────────────────────

const whatsapp = "https://wa.me/923101178268";

export const site = {
  name: "Career Gala",
  firstName: "Career Gala", // the big glass word in the hero
  initials: "CG",
  role: "Career Counselling for Pakistani Students",
  email: "info@careergala.com",
  phone: "+92 310 1178268",
  whatsapp,
  url: "https://www.careergala.com",
  hashtags: ["#Karachi", "#Lahore", "#Islamabad"],

  description:
    "Expert career counselling, personalized roadmaps, and life skills training tailored for Pakistani students. Book your free consultation today.",

  badge: { top: "Shaping careers", text: "Personalized guidance for Pakistani students" },
  heroLine: "Expert career counselling, personalized roadmaps, and life skills training tailored to your unique journey",

  nav: [
    { label: "Home", href: "/home" },
    { label: "Services", href: "/services" },
    { label: "How it works", href: "/how-it-works" },
    { label: "Stories", href: "/stories" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],

  socials: [
    { label: "Facebook", href: "https://www.facebook.com/careergala" },
    { label: "Instagram", href: "https://instagram.com/careergala" },
    { label: "WhatsApp", href: whatsapp },
    { label: "WhatsApp Channel", href: "https://whatsapp.com/channel/0029VafYRkF3WHTekL3kc81u" },
  ],

  contactLinks: [
    { label: "info@careergala.com", href: "mailto:info@careergala.com" },
    { label: "+92 310 1178268 (WhatsApp)", href: whatsapp },
    { label: "Offices: Karachi, Lahore, Islamabad" },
  ],

  legal: [
    { label: "Privacy Policy", href: "/privacy.html" },
    { label: "Terms of Service", href: "/terms.html" },
  ],

  headline: {
    label: "Transform your career & life path",
    a: "Transform your",
    pixel: "career",
    c: "&",
    display: "Life",
    pill: "Path",
    primary: "Book your free consultation",
    secondary: "See how it works",
  },

  featured: {
    eyebrow: "Start here",
    title: "Free discovery call",
    blurb: "We start with a free consultation to understand your goals, interests, and current situation.",
    tags: ["Free", "Online", "In-person"],
    href: "/contact",
    link: "Book now",
  },

  points: [
    "One-on-one sessions with experienced counselors who understand the Pakistani education system and job market.",
    "A comprehensive action plan tailored to your unique goals, skills, and circumstances.",
    "Essential soft skills and personal development training to help you succeed in any career.",
  ],

  // Scrolling strip: the fields covered in the FAQ
  domains: ["Engineering", "Medicine", "Business", "Arts", "IT", "Social Sciences"],

  // [FIX] Confirm these with the client and add a source, or remove any that can't be backed up.
  stats: [
    { value: 500, suffix: "+", label: "Students guided" },
    { value: 95, suffix: "%", label: "Career satisfaction" },
    { value: 10, suffix: "+", label: "Years experience" },
    { value: 98, suffix: "%", label: "Goal achievement" },
  ],

  about: {
    title: ["Shaping careers.", "Defining futures."],
    text: "Career Gala helps Pakistani students and professionals discover, plan and achieve their career goals through expert counselling, personalized roadmaps and life skills training.",
    imageA: null, // e.g. "/session.jpg"
    imageB: null, // e.g. "/team.jpg"
    artTitle: "Your roadmap",
  },

  focus: {
    title: ["Designed for Pakistani", "students at all stages."],
    text: "From high school students choosing their A-levels subjects to university graduates planning their next career move. We also help professionals looking to switch careers or advance in their current field.",
  },

  services: {
    title: "Our services",
    intro: "Comprehensive support to help you discover, plan, and achieve your career goals",
    items: [
      {
        name: "Career counselling",
        text: "One-on-one sessions with experienced counselors who understand the Pakistani education system and job market.",
        points: [
          "Personalized assessment of your strengths and interests",
          "Industry insights and career path exploration",
          "University and program selection guidance",
          "Interview preparation and resume building",
        ],
        hue: 225,
        image: null,
      },
      {
        name: "Personalized career roadmap",
        text: "A comprehensive action plan tailored to your unique goals, skills, and circumstances.",
        points: [
          "Step-by-step milestones and timelines",
          "Skill development recommendations",
          "Networking and mentorship opportunities",
          "Regular progress tracking and adjustments",
        ],
        hue: 155,
        image: null,
      },
      {
        name: "Life skills training",
        text: "Essential soft skills and personal development training to help you succeed in any career.",
        points: [
          "Communication and presentation skills",
          "Time management and productivity",
          "Leadership and teamwork abilities",
          "Emotional intelligence and resilience",
        ],
        hue: 32,
        image: null,
      },
    ],
    workCard: { kicker: "From confusion to clarity, one step at a time.", title: "How it works." },
    aboutCard: { kicker: "Take the first step towards your dream career.", title: "Book free." },
  },

  marquee: "Book your free consultation",

  process: {
    kicker: "The process",
    title: "How it works",
    intro: "A simple, proven process to guide you from confusion to clarity",
    items: [
      { title: "Discovery call", text: "We start with a free consultation to understand your goals, interests, and current situation. This helps us tailor our approach to your unique needs.", hue: 225, image: null },
      { title: "Assessment", text: "Through comprehensive evaluations, we identify your strengths, skills, personality traits, and career preferences to build a complete profile.", hue: 195, image: null },
      { title: "Personalized roadmap", text: "We create a detailed action plan with clear milestones, recommended courses, skill development areas, and career opportunities aligned with your goals.", hue: 155, image: null },
      { title: "Ongoing support", text: "Your journey doesn’t end with the roadmap. We provide continuous mentorship, answer questions, and adjust your plan as you grow and evolve.", hue: 38, image: null },
    ],
  },

  manifesto:
    "We use a combination of psychometric assessments, one-on-one interviews, skills evaluations, and market research to create your roadmap. Each plan is unique and considers your personality, strengths, interests, financial situation, and long-term goals.",

  power: {
    lines: ["From confusion", "to clarity"],
    video: { before: "Build your", words: ["Confidence", "Roadmap", "Skills", "Future"], after: "" },
  },

  why: {
    kicker: "Why choose",
    title: "Career Gala?",
    text: "We offer both online and in-person sessions to accommodate your preferences. Our online sessions are conducted via video call and are just as effective as in-person meetings.",
    cards: [
      { title: "Free first session", text: "We offer a free initial consultation to understand your needs, with flexible payment plans after that." },
      { title: "Reply within 24 hours", text: "Fill out the form and we’ll get back to you within 24 hours." },
      { title: "Online or in-person", text: "Video call from anywhere, or visit our offices in Karachi, Lahore, and Islamabad." },
    ],
  },

  cta: { lines: ["Your future", "won’t plan"], big: "itself." },

  footerTagline: "Career Gala helps Pakistani students and professionals discover, plan and achieve their career goals through expert counselling, personalized roadmaps and life skills training.",
};
