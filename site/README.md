# Career Gala website

React + Vite + TypeScript site built from the Career Gala design canvas.

## Run
```
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
```

## Pages
`/` is the landing page. The navigation bar sits in `src/pages/SiteLayout.tsx` and stays on `/`, `/home`, `/find-tutor`, `/counselling`, `/become-tutor` and `/pricing`.
The host must serve `index.html` for every route.

## Edit content
Nav links and sample tutors are in `src/content/site.ts`. Page copy is in `src/pages/`, and site styles are in `src/pages/site.css`.

## Test logins
- **Admin:** `admin@gmail.com` / `12345` at `/login`, then `/admin`.
- **Student:** `student@gmail.com` with any password, or sign up with "I want to learn".

Data lives in `localStorage` (`src/lib/store.ts`), so students and the admin must use the same browser. Two tabs work and update each other live.

## Before launch (the [FIX] items)
- **Backend and auth:** replace `src/lib/store.ts` and `src/lib/auth.ts` with a real database and server auth. Until then, requests stay in one browser, student passwords aren't checked, and the admin password ships in the public JS.
- **Form delivery:** set `VITE_FORM_ENDPOINT` (any JSON POST endpoint). Without it the form only *simulates* success and no lead is sent.
- **Stats** (500+, 10+): confirm with the client and add a source, or remove.
- **Sample tutors:** the tutors, ratings, reviews and rates in `src/content/site.ts` are design samples. Replace them with real data.
- **[Bracketed text]:** anything in square brackets on the public pages (prices, fees, the student quote, FAQ answers, tutor count) is waiting for a real value.
- **Logo:** `Mark` in `src/pages/Shell.tsx` is a placeholder mark. Swap in the real SVG logo.
- **Privacy / Terms:** `public/privacy.html` and `public/terms.html` are short drafts. Replace with reviewed legal text.
- **og:image:** `public/og.svg` is a simple card. Many platforms need a PNG/JPG (1200x630), so export one.
- The cities on the landing page are placeholders; confirm them.
