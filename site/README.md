# Career Gala website

React + Vite + TypeScript single-page site built from `../career-gala-website-prompt.md`.
Framer Motion (UI motion), GSAP ScrollTrigger (pinned "How it works", lazy-loaded), Lenis (smooth scroll), React Hook Form + Zod (booking form).

## Run
```
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
```

## Edit content
All copy lives in `src/content/site.ts`. Design tokens are at the top of `src/styles.css`.

## Before launch (the [FIX] items)
- **Form delivery:** set `VITE_FORM_ENDPOINT` (any JSON POST endpoint). Without it the form only *simulates* success and no lead is sent.
- **Stats** (500+, 95%, 10+, 98%): confirm with the client and add a source, or remove.
- **Testimonials:** currently initial-based avatars. Replace with real photos only with student consent.
- **Logo:** `LogoMark` in `src/components/ui/Brand.tsx` is a placeholder mark. Swap in the real SVG logo.
- **Privacy / Terms:** `public/privacy.html` and `public/terms.html` are short drafts. Replace with reviewed legal text.
- **og:image:** `public/og.svg` is a simple card. Many platforms need a PNG/JPG (1200x630), so export one.
- Pricing "From PKR 15,000" and office cities come from the old site; confirm they are current.
