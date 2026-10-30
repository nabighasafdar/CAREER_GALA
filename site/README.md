# Career Gala website

React + Vite + TypeScript single-page site built from `../career-gala-website-prompt.md`.
Framer Motion (UI motion), GSAP ScrollTrigger (pinned "How it works", lazy-loaded), Lenis (smooth scroll), React Hook Form + Zod (booking form).

## Run
```
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
```

## Pages
`/` is the landing page (`src/landing/`, with its own content file and stylesheet). It links into the site:
`/home`, `/services`, `/how-it-works`, `/stories`, `/faq` and `/contact`, plus the existing `/subjects`, `/login` and `/signup` pages.
The host must serve `index.html` for every route.

## Edit content
All copy lives in `src/content/site.ts`. Design tokens are at the top of `src/styles.css`.

## Test logins
- **Admin:** `admin@gmail.com` / `12345` at `/login`, then `/admin`.
- **Student:** `student@gmail.com` with any password, or sign up with "I want to learn".

Data lives in `localStorage` (`src/lib/store.ts`), so students and the admin must use the same browser. Two tabs work and update each other live.

## Before launch (the [FIX] items)
- **Backend and auth:** replace `src/lib/store.ts` and `src/lib/auth.ts` with a real database and server auth. Until then, requests stay in one browser, student passwords aren't checked, and the admin password ships in the public JS.
- **Form delivery:** set `VITE_FORM_ENDPOINT` (any JSON POST endpoint). Without it the form only *simulates* success and no lead is sent.
- **Stats** (500+, 95%, 10+, 98%): confirm with the client and add a source, or remove.
- **Testimonials:** currently initial-based avatars. Replace with real photos only with student consent.
- **Logo:** `LogoMark` in `src/components/ui/Brand.tsx` is a placeholder mark. Swap in the real SVG logo.
- **Privacy / Terms:** `public/privacy.html` and `public/terms.html` are short drafts. Replace with reviewed legal text.
- **og:image:** `public/og.svg` is a simple card. Many platforms need a PNG/JPG (1200x630), so export one.
- Pricing "From PKR 15,000" and office cities come from the old site; confirm they are current.
