# Cinematic Luxury Wedding Invitation

A premium, Apple-inspired wedding invitation website built with Next.js (App Router), Tailwind CSS, GSAP, Framer Motion, and Lenis.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- GSAP + ScrollTrigger
- Framer Motion
- Lenis smooth scrolling

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run development server:

```bash
npm run dev
```

3. Open:

```text
http://localhost:3000
```

## Build

```bash
npm run build
npm run start
```

## Deployment (Vercel)

1. Push the project to GitHub.
2. Go to Vercel and click **Add New Project**.
3. Import the GitHub repository.
4. Keep framework preset as **Next.js**.
5. Click **Deploy**.

## Notes

- Add your real portraits inside `public/images`:
  - `bride.jpg`
  - `groom.jpg`
  - `noise.png` (optional texture)
- Add your background audio at `public/music/ambient.mp3`.
- RSVP API is currently in-memory for demo (`app/api/rsvp/route.ts`). Replace with Firebase or database for production.
"# wedding_invitation" 
