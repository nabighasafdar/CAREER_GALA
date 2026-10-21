# Master Prompt: Career Gala Website Redesign

> Paste everything below the line into your AI builder (v0, Lovable, Bolt, Cursor, Claude, Hostinger Horizons, etc.). The content comes from the live careergala.com site (scraped Oct 21, 2026). Do not change it except where marked **[FIX]**.

---

## 1. Role and goal

Act as a senior creative frontend developer and brand designer. Build a modern, premium, highly animated **single-page marketing website** for **Career Gala**, a career counselling service for Pakistani students.

The current site looks like a generic AI-builder template: a stock hero photo, identical fade-in animations on everything and plain white cards. The new site should feel like a **premium edtech brand**: warm, trustworthy, optimistic and clearly made for Pakistani students and parents.

**Core creative concept: "From confusion to clarity."** Every visual and motion decision should support the idea of a tangled, uncertain path turning into a clear, guided road. The recurring motif is a **path line** (an SVG stroke) that appears in the hero, connects the "How it works" steps and leads the eye to the booking form.

**Primary conversion goal:** get visitors to book a free consultation (form or WhatsApp).

---

## 2. Tech stack

- **Framework:** Next.js 14+ (App Router) with TypeScript, or React + Vite if the platform requires it
- **Styling:** Tailwind CSS, with design tokens as CSS variables
- **Animation:**
  - Framer Motion for component and UI motion
  - GSAP + ScrollTrigger for scroll-driven and pinned sections
  - Lenis for smooth scrolling (sync it with ScrollTrigger)
- **Icons:** Lucide React, 1.75px stroke
- **Forms:** React Hook Form + Zod validation
- **Components:** shadcn/ui primitives (Accordion, Select, Dialog), fully restyled
- **Fonts:** load via `next/font`

---

## 3. Design system

### 3.1 Colour palette

The palette is built from the logo's blue and green, plus a warm saffron accent for optimism and calls to action. Avoid pure white page backgrounds; use warm off-white.

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#0B1B34` | Headings, dark sections, footer |
| `--ink-soft` | `#1C2E4A` | Cards on dark sections |
| `--royal` | `#2453E6` | Primary brand, links, focus rings |
| `--royal-50` | `#EEF3FF` | Tinted backgrounds, icon chips |
| `--growth` | `#16A36A` | Success, checkmarks, the "clarity" end of gradients |
| `--growth-50` | `#E8F7EF` | Tinted backgrounds |
| `--saffron` | `#F5A524` | Primary CTA buttons, highlights, path accents |
| `--saffron-50` | `#FFF5E3` | Highlight backgrounds |
| `--cream` | `#FBF8F3` | Main page background |
| `--mist` | `#F1F4F9` | Alternate section background |
| `--slate` | `#55627A` | Body text |
| `--line` | `#E3E8F0` | Borders, dividers |

**Signature gradient ("clarity gradient"):** `linear-gradient(120deg, #2453E6 0%, #16A36A 100%)`. Use it for the path line, the stat ring strokes, the highlighted word in headings and the active step in the roadmap.

**Rules:**
- The primary CTA uses saffron with ink text (`#0B1B34` on `#F5A524`, contrast ≈ 9:1).
- The secondary CTA is a ghost button: ink text with a 1.5px `--line` border, which turns royal on hover.
- All text must meet WCAG AA contrast.
- Add dark-mode tokens: ink `#0B1B34` becomes the background, cream becomes the text, and the accents stay the same.

### 3.2 Typography

- **Display and headings:** "Plus Jakarta Sans", weights 700/800, letter-spacing `-0.02em`
- **Body:** "Inter", weights 400/500
- **Accent:** "Instrument Serif" italic, used for one highlighted word per major heading. Example: "Transform your *career* & life path", with the italic word filled with the clarity gradient via `background-clip: text`.
- **Fluid type scale:**
  - H1: `clamp(2.5rem, 6vw, 4.75rem)`
  - H2: `clamp(2rem, 4vw, 3.25rem)`
  - H3: `1.375rem`
  - Body: `1.0625rem` with a 1.65 line height
  - Eyebrow labels: 0.8125rem, uppercase, +0.12em tracking, royal colour, preceded by a 24px saffron dash

### 3.3 Shape, spacing and depth

- **Radius:** 24px for large cards, 16px for small cards and inputs, 999px for buttons and chips
- **Shadows:** soft and layered, never harsh. Example: `0 1px 2px rgba(11,27,52,.04), 0 12px 32px -12px rgba(11,27,52,.12)`
- **Spacing:** sections use 120px vertical padding on desktop and 72px on mobile. Container max width is 1200px with a 20px side gutter on mobile.
- **Texture:** a very subtle noise overlay (2–3% opacity) on dark sections, plus soft blurred gradient "blobs" (royal and green at 15% opacity) behind key sections

### 3.4 Global motion principles

- **Easing:** `cubic-bezier(0.22, 1, 0.36, 1)` (easeOutQuint) for entrances. Use spring `{ stiffness: 260, damping: 24 }` for interactive elements.
- **Durations:** micro-interactions 150–250ms, entrances 500–700ms. Never longer than 900ms, except for scroll-scrubbed animations.
- **Only animate `transform`, `opacity`, `filter` and `stroke-dashoffset`.** Never animate layout properties.
- **Reveals trigger early,** with `viewport={{ once: true, margin: "0px 0px -15% 0px" }}`, so content never looks blank when someone scrolls fast. Content must be visible without JavaScript; use progressive enhancement.
- **Do not use the same fade-up everywhere.** Each section gets its own motion, as specified in section 4.
- **Respect `prefers-reduced-motion`:** disable parallax, pinning, marquee and counters (show final values), and replace movement with a simple 200ms opacity fade.
- On touch devices, disable tilt and magnetic effects.

---

## 4. Page structure, section by section

### 4.0 Global header (sticky)

**Layout:**
- Logo on the left (supply an SVG; the current logo is a WhatsApp JPEG). Wordmark "Career Gala", with "Career" in ink and "Gala" in growth green.
- Centre nav: Home · Services · How it works · Stories · FAQ
- Right side: a ghost "WhatsApp us" button and a saffron "Book free consultation" button
- On mobile, a hamburger opens a full-screen sheet

**Animation:**
- On page load, the header slides down from `y:-100%` over 600ms, with nav items staggered by 60ms.
- After 40px of scroll, the header becomes a floating pill. It shrinks from full width to a 1100px container with 999px radius, `backdrop-filter: blur(14px)` and a background of `rgba(251,248,243,.75)`, and gains a shadow. This transition takes 300ms.
- The header hides on scroll down and reappears on scroll up.
- A 2px **scroll-progress bar** along the bottom edge fills with the clarity gradient (`scaleX` bound to scroll progress).
- **Active nav link:** a pill background slides between links using Framer Motion `layoutId` and an IntersectionObserver scroll-spy.
- **Mobile menu:** a full-screen ink overlay that opens with a `clip-path: circle()` reveal from the hamburger's position. Links stagger in from `y:40`, 70ms apart.

### 4.1 Hero (`#home`)

**Content:**
- Eyebrow: "Career counselling for Pakistani students"
- H1: "Transform your *career* & life path"
- Sub-headline: "Personalized guidance for Pakistani students"
- Body: "Expert career counselling, personalized roadmaps, and life skills training tailored to your unique journey"
- Primary CTA: "Book your free consultation" (scrolls to `#contact`)
- Secondary CTA: "See how it works" (replaces the vague "Learn more"; scrolls to `#how-it-works`)
- Trust row under the CTAs: a stack of 4 overlapping avatar circles, followed by "500+ students guided · Online & in-person in Karachi, Lahore, Islamabad"

**Layout:**
- Split layout on desktop: text on the left (55%), visual on the right (45%). Stacked on mobile.
- Background: cream, with two blurred gradient blobs (royal at top right, green at bottom left) that drift slowly in a 20s infinite loop.
- **Remove the 2.7 MB stock photo.**

**Hero visual, "The Path":** an SVG illustration on the right.
- A **tangled, looping scribble line** in slate starts at the bottom left and **untangles into a smooth curved road** in the clarity gradient, ending at a glowing destination pin at the top right.
- Along the road sit 3 floating **glassmorphism mini-cards** (white at 70% opacity, blur, 16px radius):
  - "🎓 University chosen"
  - "🧭 Roadmap ready"
  - "💼 Internship secured"
- Optionally, use one real cut-out photo of a Pakistani student (provided by the client) in a rounded-blob mask behind the path.

**Hero animation sequence (total ≈ 1.8s, plays on load):**
1. **0ms:** the eyebrow fades in and slides from `x:-12`.
2. **100ms:** the H1 reveals word by word with a mask (each word slides up from `y:110%` inside `overflow:hidden`, 70ms stagger). The italic word "career" gets a gradient shimmer sweep 400ms after it lands.
3. **500ms:** the sub-headline and body fade up (`y:16 → 0`).
4. **700ms:** the CTAs pop in with a spring (`scale .9 → 1`).
5. **0–1600ms:** the SVG path draws itself (`stroke-dashoffset` from full length to 0). The tangled section draws fast, then the smooth road draws slower (custom ease).
6. As the line passes each mini-card's position, that card pops in (`scale .8 → 1`, `opacity 0 → 1`, spring), then **floats** continuously (`y ±6px`, 4–6s yoyo, each card on a different phase).
7. The destination pin pulses with an expanding ring (`scale 1 → 2.2`, `opacity .6 → 0`, 2s loop).

**Interactions:**
- **Mouse parallax:** the mini-cards and blobs shift by up to 12px opposite the cursor (desktop only).
- **Magnetic primary CTA:** the button follows the cursor by up to 8px within a 60px radius and springs back on leave. On hover, an arrow icon slides right by 4px.
- **Scroll-out:** as the hero scrolls away, the visual scales to 0.95 and fades to 0.6 (scrubbed).

### 4.2 Stats strip (impact numbers)

**Content:**
- 500+ Students guided
- 95% Career satisfaction
- 10+ Years experience
- 98% Goal achievement

**[FIX]** Ask the client to confirm these numbers. Add a small footnote, for example "Based on 2024–25 student feedback survey", or drop any figure they can't back up.

**Design:** don't use a plain row of numbers. Use a **floating ink-coloured band** that overlaps the bottom of the hero by -60px:
- Container: 24px radius, ink background, noise texture
- Inside: 4 columns separated by thin vertical dividers at 10% white opacity
- Each stat is a **progress ring** (a 64px SVG circle, gradient stroke) with the icon in the centre. The big number sits beside it in cream (Plus Jakarta, 800) and the label sits underneath in slate-300.
- On mobile, the band becomes a 2×2 grid.

**Animation:**
- The band rises from `y:60` with opacity 0 → 1 when it enters view.
- **Count-up:** numbers animate from 0 to their target over 1.6s (easeOutExpo), staggered 150ms. Use Framer Motion `animate()` with `useInView`, and format with the "+" or "%" suffix.
- **Ring fill:** each ring's `stroke-dashoffset` animates in sync with the count. Use 95% and 98% for the percentage stats, and a full ring for the others.
- On hover, the ring rotates 90° and the number lifts by 2px.

### 4.3 Services (`#services`): bento grid

**Content (verbatim):**
- Eyebrow: "What we do"
- H2: "Our *services*"
- Sub: "Comprehensive support to help you discover, plan, and achieve your career goals"

1. **Career counselling.** One-on-one sessions with experienced counselors who understand the Pakistani education system and job market.
   - Personalized assessment of your strengths and interests
   - Industry insights and career path exploration
   - University and program selection guidance
   - Interview preparation and resume building
2. **Personalized career roadmap.** A comprehensive action plan tailored to your unique goals, skills, and circumstances.
   - Step-by-step milestones and timelines
   - Skill development recommendations
   - Networking and mentorship opportunities
   - Regular progress tracking and adjustments
3. **Life skills training.** Essential soft skills and personal development training to help you succeed in any career.
   - Communication and presentation skills
   - Time management and productivity
   - Leadership and teamwork abilities
   - Emotional intelligence and resilience

**Design: an asymmetric bento grid** instead of three identical cards. Desktop uses a 12-column grid.

- **Card A, Career counselling** (7 columns, tall):
  - royal-50 background
  - A large illustration area at the top: an animated mock "session" UI with two chat bubbles between counselor and student, typing in on a loop
  - Title, description and the 4 bullets below, with growth-green check icons
- **Card B, Personalized roadmap** (5 columns, tall):
  - ink background, cream text
  - A mini vertical timeline showing the 4 bullets as milestones with dots connected by a gradient line
- **Card C, Life skills training** (12 columns, wide and short):
  - saffron-50 background
  - The title and description on the left; the 4 skills on the right as **chips/pills**, each with an icon (Mic, Clock, Users, Heart)
- **Small Card D (new, fills a gap): "Free first consultation"**, a saffron CTA card with an arrow. Put it inside the grid as 5 columns next to a 7-column Card C on desktop.
- **Card footer:** each card ends with a "Learn more →" text link that opens a **Dialog/drawer** with a fuller description.

**Animation:**
- **Entrance:** cards reveal with a **clip-path wipe** (`inset(100% 0 0 0)` → `inset(0)`) plus a slight `y:24` lift, 600ms, staggered 120ms in grid order. Inner content (icon, then title, then bullets) staggers 60ms after each card's wipe.
- **Hover (desktop):**
  - 3D tilt up to 4° following the cursor (`perspective: 1000px`)
  - A radial **spotlight** gradient follows the cursor inside the card (CSS variables `--x` / `--y`, `radial-gradient(400px at var(--x) var(--y), rgba(36,83,230,.10), transparent)`)
  - The icon chip rotates -8° and scales to 1.1
  - The border colour shifts to royal
- **Card A loop:** chat bubbles appear one after another, with a three-dot "typing" indicator in between, on a 6s loop that pauses when off-screen.
- **Card B timeline:** the gradient line draws downward when the card enters view, and each milestone dot pops in as the line reaches it.
- **Card C chips:** on hover, a chip lifts by 2px and its icon wiggles (a ±8° rotate keyframe).
- **Mobile:** single column. Cards C and B collapse their bullets into an accordion ("Show what's included").

### 4.4 How it works (`#how-it-works`): pinned scroll roadmap (signature section)

**Content (verbatim):**
- Eyebrow: "The process"
- H2: "How it *works*"
- Sub: "A simple, proven process to guide you from confusion to clarity"

1. **Discovery call.** We start with a free consultation to understand your goals, interests, and current situation. This helps us tailor our approach to your unique needs.
2. **Assessment.** Through comprehensive evaluations, we identify your strengths, skills, personality traits, and career preferences to build a complete profile.
3. **Personalized roadmap.** We create a detailed action plan with clear milestones, recommended courses, skill development areas, and career opportunities aligned with your goals.
4. **Ongoing support.** Your journey doesn't end with the roadmap. We provide continuous mentorship, answer questions, and adjust your plan as you grow and evolve.

**Design (desktop):**
- Mist background.
- **Left column (40%, sticky):** the heading, the subtitle and a large step counter ("01 / 04") in an outlined display font. Below it, a 4-segment progress indicator.
- **Right column (60%):** a winding SVG **road/path** runs vertically, with 4 **step cards** placed alternately left and right of the path. Each card is white with a 24px radius and has a large faded number ("01") in the background at 8% opacity, an icon chip, a title and body text.
- Icons: PhoneCall, ClipboardCheck, Map, LifeBuoy.

**Animation (GSAP ScrollTrigger, scrubbed):**
- Pin the section for about 250vh of scroll on desktop (`pin: true`, `scrub: 0.6`).
- The **path draws** progressively as the user scrolls (`stroke-dashoffset` tied to scroll progress, clarity gradient stroke).
- A **glowing traveller dot** (a saffron circle with a soft glow) moves along the path using MotionPathPlugin, `align` to the path.
- When the dot reaches each step node:
  - The node fills with the gradient, scales 1 → 1.3 → 1 and emits a ripple ring.
  - The matching card animates from `opacity .35, blur(4px), scale .96` to `opacity 1, blur(0), scale 1`. Steps already passed stay lit; upcoming steps stay dimmed.
  - The sticky counter flips to the new number (vertical slot-machine roll, 400ms) and the progress segment fills.
- At the end of the path, the dot turns into a small check icon, then a pill appears: "Ready to start? Book your discovery call →".

**Mobile and reduced motion:** no pinning. Use a vertical timeline with a line on the left that fills (scaleY) as you scroll past, and cards that slide in from `x:24`.

### 4.5 Success stories (`#testimonials`)

**Content (verbatim):**
- Eyebrow: "Real stories"
- H2: "Success *stories*"
- Sub: "Hear from students who transformed their careers with Career Gala"

1. **Ayesha Khan, Software Engineering.** "Career Gala helped me navigate the confusing world of tech careers. Their guidance on choosing the right university and building my portfolio was invaluable. I'm now working at a leading software company in Karachi."
2. **Hassan Ali, Business Administration.** "I was torn between family expectations and my own interests. The counselors at Career Gala helped me find a path that honored both. Their personalized approach made all the difference."
3. **Fatima Malik, Graphic Design.** "As a creative person, I struggled to see how I could build a stable career. Career Gala showed me the opportunities in design and helped me develop a portfolio that landed me freelance clients."
4. **Usman Ahmed, Medicine.** "The roadmap they created for my medical career was incredibly detailed. From MCAT prep to residency planning, they covered everything. I felt supported every step of the way."
5. **Zainab Raza, Civil Engineering.** "Career Gala didn't just help me choose engineering - they helped me understand which specialization would suit my strengths. Their industry connections also helped me secure an internship."

**[FIX]** The current site uses stock headshots. Use **real student photos with their consent**, or use **initial-based gradient avatars** (for example "AK" on a royal-to-green gradient). Never use stock faces presented as real students.

**Design: a "Before → After" featured card plus a marquee.**

**Top: featured story card** (full width, ink background, 32px radius):
- **Left side:** a large quote, with an oversized saffron quotation mark (") at 120px and 20% opacity behind the text.
- **Right side:** a **"Before / After" transformation panel**:
  - "Before: Torn between family expectations and own interests" (shown with a muted, scribbled underline)
  - An arrow
  - "After: A path that honours both" (shown with a green check and gradient text)
- Below it, the student's name, field chip and avatar.
- Arrow buttons and dots cycle through all 5 stories. Each story needs a short before/after summary written from its quote.

**Below: an infinite marquee** of compact testimonial cards in 2 rows moving in opposite directions:
- Each card: white, 20px radius, 340px wide
- A 5-star rating in saffron, the first two lines of the quote, then the avatar, name and a **field chip** coloured by domain (Tech = royal, Business = saffron, Design = pink `#E8579A`, Medicine = green, Engineering = cyan `#0EA5C6`)

**Animation:**
- **Featured card transitions:**
  - The outgoing quote slides out to `x:-40` and blurs; the incoming one slides in from `x:40`, using AnimatePresence with `mode="wait"`.
  - The before/after panel animates in sequence: "Before" appears, a strike-through line draws across it, the arrow slides, "After" pops in with a spring, then the check draws (SVG path).
  - Autoplay every 7s, paused on hover or focus. A thin progress bar under the dots shows the time to the next slide.
- **Marquee:**
  - Built with CSS `@keyframes translateX` on duplicated content, 40s for row 1 and 48s for row 2 in the reverse direction.
  - Pauses on hover.
  - Edges fade out using `mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)`.
- Keep the whole section under about 900px tall on desktop.

### 4.6 FAQ (`#faq`)

**Content (verbatim Q&A):**

1. **How much does career counselling cost?**
   We offer a free initial consultation to understand your needs. Our full counselling packages start from PKR 15,000 and vary based on the level of support you need. We also offer flexible payment plans to make our services accessible to all students.
2. **How long does the career counselling process take?**
   The initial assessment and roadmap creation typically takes 2-3 weeks. However, we provide ongoing support for as long as you need it. Most students work with us for 3-6 months to see significant progress in their career journey.
3. **Do you provide guidance for all career domains?**
   Yes, we have experienced counselors across all major fields including engineering, medicine, business, arts, IT, social sciences, and more. Our team stays updated on industry trends and educational requirements in Pakistan and abroad.
4. **Is the counselling available online or in-person?**
   We offer both online and in-person sessions to accommodate your preferences. Our online sessions are conducted via video call and are just as effective as in-person meetings. We have physical offices in Karachi, Lahore, and Islamabad.
5. **What is your success rate?**
   Over 95% of our students report high satisfaction with their career choices after working with us. We've helped over 500 students gain admission to top universities, secure internships, and land their dream jobs. Our success is measured by your success.
6. **Who is eligible for your services?**
   Our services are designed for Pakistani students at all stages - from high school students choosing their A-levels subjects to university graduates planning their next career move. We also help professionals looking to switch careers or advance in their current field.
7. **How do you create personalized roadmaps?**
   We use a combination of psychometric assessments, one-on-one interviews, skills evaluations, and market research to create your roadmap. Each plan is unique and considers your personality, strengths, interests, financial situation, and long-term goals.
8. **Can you help with university applications and admissions?**
   Absolutely. We provide comprehensive support for university applications including essay writing, interview preparation, scholarship guidance, and application strategy. We have experience with both local Pakistani universities and international institutions.

**Design: a two-column layout.**

- **Left (sticky, 35%):**
  - Heading "Frequently asked *questions*" and the sub "Everything you need to know about our services"
  - A **"Still have questions?" card** with a WhatsApp button and the phone number
  - Category filter chips: All · Pricing · Process · Eligibility · Admissions
- **Right (65%):** the accordion.
  - Each item is a 16px-radius card with a mist background; when open, it switches to a white background with a royal left border.
  - The question number ("01") appears in muted text before each question.
  - The cost answer gets a highlighted **price pill**: "From PKR 15,000".
- **Category mapping:**
  - Pricing: Q1
  - Process: Q2, Q4, Q7
  - Eligibility: Q3, Q5, Q6
  - Admissions: Q8

**Animation:**
- Accordion height animates smoothly (Framer Motion `height: auto`, 350ms easeOutQuint). Answer text fades and slides from `y:-6` 80ms after the height starts.
- The icon is a **plus that morphs into a minus**: the vertical bar rotates 90° and fades.
- Filtering by category uses `layout` animations, so items reflow smoothly and hidden ones fade and scale to 0.96.
- Entrance: items stagger in from `x:20`, 50ms apart.

### 4.7 Contact / booking (`#contact`): multi-step "Find your path" form

**Content:**
- H2: "Schedule your free *consultation*"
- Sub: "Take the first step towards your dream career. Fill out the form below and we'll get back to you within 24 hours."
- Fields (same as now): Full name *, Email address *, Phone number * (placeholder "+92 300 1234567"), Domain of interest (Engineering, Business, Arts, Medicine, Information Technology, Other), Message (optional, placeholder "Tell us about your career goals and any specific questions you have...")
- Submit button: "Schedule your free consultation"

**Design:** a large split card with a 32px radius.

- **Left panel** (ink background, noise texture, 40%):
  - A reassurance list with animated icons: "Free first session", "Reply within 24 hours", "Online or in Karachi · Lahore · Islamabad"
  - Contact details: info@careergala.com, +92 310 1178268 (opens WhatsApp)
  - The hero path motif ends here as a small glowing pin, so the journey visually finishes at the form.
- **Right panel** (white, 60%): the form as a **3-step wizard** with a top progress bar.
  - **Step 1, "What are you interested in?":** the Domain of interest as **large selectable tiles** with icons instead of a dropdown. Icons: Engineering (Cog), Business (Briefcase), Arts (Palette), Medicine (Stethoscope), IT (Code), Other (Sparkles). Add an optional row of stage chips: "Matric / O-Levels", "FSc / A-Levels", "University", "Professional".
  - **Step 2, "About you":** name, email and phone.
  - **Step 3, "Anything else?":** the message, then submit.
  - Every input has a proper `<label>` and floating-label style.

**Animation:**
- Step transitions slide horizontally (the outgoing step goes to `x:-30` and fades; the incoming one comes from `x:30`). The progress bar fills with the gradient.
- **Domain tile select:** the tile scales 0.97 → 1 with a spring, the border becomes royal, a check badge pops into the corner and the icon bounces.
- **Input focus:** the label floats up and shrinks, and a 2px royal underline grows from the centre (`scaleX 0 → 1`).
- **Validation errors:** the field does a horizontal shake (`x: [0,-6,6,-4,4,0]`, 350ms) and the error text slides down.
- **Submit:** the button changes to a spinner, then morphs into a green circle with a drawn check. The form is replaced by a success state with **confetti** (canvas-confetti in brand colours, 1 burst) and the text "You're on your way! We'll contact you within 24 hours." plus a "Chat on WhatsApp now" button.

### 4.8 Footer

**Content:**
- **[FIX]** Replace the current text ("a global online tutoring platform…") with: "Career Gala helps Pakistani students and professionals discover, plan and achieve their career goals through expert counselling, personalized roadmaps and life skills training."
- Quick links: Home, Services, How it works, Stories, FAQ, Contact. **[FIX]** Remove the dead "About" link, or add an About section.
- Contact: info@careergala.com · +92 310 1178268 (WhatsApp) · Offices: Karachi, Lahore, Islamabad
- Social:
  - Facebook: https://www.facebook.com/careergala
  - Instagram: https://instagram.com/careergala
  - WhatsApp: https://wa.me/923101178268
  - WhatsApp Channel: https://whatsapp.com/channel/0029VafYRkF3WHTekL3kc81u
  - Every icon needs an `aria-label`. **[FIX]** Remove the empty `#` link.
- Bottom line: "© 2026 Career Gala. All rights reserved." · Privacy Policy · Terms of Service. **[FIX]** Link these to real pages instead of dead anchors.

**Design:**
- Ink background.
- A **huge outlined wordmark "CAREER GALA"** across the bottom: transparent fill, a 1px cream stroke at 15% opacity, about 18vw wide.
- A final CTA band above the footer columns: "Your future won't plan itself." plus a saffron button.

**Animation:**
- The giant wordmark reveals letter by letter, rising from `y:100%` with a 40ms stagger, when the footer enters view.
- On hover, a social icon lifts by 3px and fills with its brand colour.
- A "Back to top" button rotates its arrow and smooth-scrolls (Lenis) to the top.

### 4.9 Floating elements

- **WhatsApp floating button** (bottom right, green `#25D366`, 56px):
  - Appears after 30% scroll with a scale spring.
  - Every 8s, it shows a gentle attention pulse ring.
  - On hover (desktop), it expands into a pill reading "Chat with a counselor".
- **Mobile sticky bottom bar** (below 768px): a "Book free consultation" button plus a WhatsApp icon. It slides up after the hero and hides when the contact section is in view.

---

## 5. Micro-interactions checklist

- **Buttons:**
  - Hover: `translateY(-2px)` plus a deeper shadow.
  - Active: `scale(.97)`.
  - The primary button gets a diagonal shine sweep (pseudo-element gradient moving left to right, 700ms) on hover.
- **Links:** the underline grows from left to right on hover.
- **Section headings:** the saffron eyebrow dash draws from `width 0 → 24px` before the heading reveals.
- **Cursor (desktop, optional):** a small 10px royal dot plus a 36px trailing ring (lerp follow). The ring scales to 1.6 over interactive elements and shows "View" over cards. Hide it on touch devices and with reduced motion.
- **Page load:** no full-screen loader. The hero sequence is the intro.

---

## 6. Responsive rules

- Breakpoints: 375, 768, 1024, 1280, 1536.
- Never allow horizontal scroll. Use a 20px gutter on mobile.
- Touch targets must be at least 44px.
- Bento becomes a single column. The pinned roadmap becomes a simple timeline. The marquee becomes one row (swipeable). The FAQ left column stacks on top.
- Test on low-end Android: keep animations at 60fps and disable blur-heavy effects below 768px if needed.

---

## 7. Performance, SEO and accessibility

- **Performance:**
  - Lighthouse 90+ on mobile.
  - Total page weight under 1 MB; LCP under 2.5s on 4G.
  - All images in AVIF/WebP via `next/image` with `sizes`, lazy-loaded below the fold.
  - Logo as an inline SVG.
  - Code-split GSAP so it loads only for the How it works section.
- **SEO:**
  - Title: "Career Gala | Career Counselling for Pakistani Students"
  - Meta description: "Expert career counselling, personalized roadmaps, and life skills training tailored for Pakistani students. Book your free consultation today."
  - **[FIX]** Add `og:image` (1200×630 branded card) and Twitter card tags so WhatsApp and Facebook shares show a preview.
  - Add JSON-LD: `EducationalOrganization` plus `FAQPage` schema using the 8 Q&As.
- **Accessibility:**
  - Semantic landmarks, one H1, logical heading order.
  - Visible focus rings (2px royal, 2px offset) and a skip-to-content link.
  - Everything works by keyboard: carousel arrows, accordion, form tiles as a radio group.
  - Respect `prefers-reduced-motion` everywhere, as specified in section 3.4.
  - All decorative SVGs get `aria-hidden`.

---

## 8. Deliverables

1. A complete, runnable project with a clear folder structure:
   - `components/sections/*`
   - `components/ui/*`
   - `lib/animations.ts` (shared variants and easings)
   - `content/site.ts` (all copy above in one typed object, so the client can edit text without touching components)
2. Design tokens in `globals.css` (light and dark).
3. A reusable `<Reveal>` wrapper, `<CountUp>`, `<MagneticButton>`, `<TiltCard>`, `<Marquee>` and `<PathDraw>` components.
4. A README with setup steps and a list of all **[FIX]** items the client must confirm (stats source, real testimonial photos and consent, SVG logo, privacy and terms pages).

Build it section by section, and make sure each section's animation matches this spec exactly before moving on to the next.
