# Medifys — Your Health, Intelligently Connected

A working prototype of Medifys: an all-in-one health companion covering medications,
prescriptions, doctors, telemedicine, an AI assistant, emergency response, hospitals,
pharmacy price comparison, pet health, and a fully functional accessibility system.

## Running it

```bash
npm install
npm run dev      # start local dev server (Vite)
npm run build    # production build → dist/
npm run preview  # preview the production build
```

Requires Node.js 18+.

## What's real vs. simulated

This is a frontend prototype with **no backend** — everything runs client-side against a
typed, cross-referenced mock data layer (`src/lib/mock-data.ts`) and a persisted Zustand
store (`src/store/useStore.ts`). Data survives page refresh via `localStorage`.

Genuinely interactive and stateful:
- Marking medications taken/skipped/snoozed updates adherence %, stock counts, the
  dashboard, and the medication list simultaneously.
- Adding a doctor, pet, medication, or prescription immediately appears everywhere
  it's referenced (doctor profiles pull the medications/prescriptions tied to them).
- Accessibility settings (font scale, high contrast, reduced motion, color-blind
  simulation filters, large controls) apply live, app-wide, via CSS custom
  properties and classes on `<html>` — not just on a settings preview card.
- The command palette (⌘K / Ctrl+K) searches real store data.

Simulated, and clearly presented as such in the UI:
- Prescription OCR scanning (`Prescriptions`, `Medications` add flow) — a timed
  animation followed by pre-written extracted data you can edit before saving.
- The video consultation room, ambulance tracking, fall detection, and emergency
  activation sequence are state machines with timers, not real hardware/APIs.
- Hands-Free (gaze control) mode animates a cursor along a fixed path and highlights
  the nearest tile — a concept demo, not real eye-tracking.
- AI Assistant responses are pre-written and streamed character-by-character to
  simulate an LLM; there's no live model call.

## Architecture

```
src/
  types/            Shared data models (User, Medication, Doctor, Prescription, …)
  lib/
    mock-data.ts     Seed data with real cross-references (meds → doctors, etc.)
    medication-utils.ts   Next-dose / adherence calculations
    utils.ts, nanoid.ts
  store/useStore.ts   Single Zustand store; every page reads/writes through it
  hooks/              useCountUp, useApplyA11y
  components/
    ui/               Small custom design-system primitives (Button, Card, Dialog,
                       Sheet, Tabs, Form fields) — not shadcn/radix, but built to the
                       same spirit: consistent tokens, accessible by default.
    layout/           Sidebar, mobile nav, top bar, command palette, notifications
    dashboard/        HealthScoreRing
  pages/              One file per route (see below)
```

Routes: `/`, `/dashboard`, `/health`, `/medications`, `/prescriptions`, `/doctors`,
`/consultations`, `/ai`, `/analytics`, `/emergency`, `/hospitals`, `/pharmacy`,
`/pets`, `/accessibility`, `/accessibility/hands-free`, `/settings`.

## Swapping in real services later

Each "connected" feature is isolated enough to replace with a real integration
without touching UI code:
- **Google Fit / Apple Health** → replace the seed loop in `mock-data.ts`
  (`healthMetrics`) with a fetch in `MyHealth.tsx` / `Analytics.tsx`.
- **Gemini / an LLM API** → replace the `responses` map and `setTimeout` streaming
  in `AIAssistant.tsx` with a real streaming fetch.
- **Maps** → `Hospitals.tsx`'s stylized SVG map can be swapped for a real map SDK;
  hospital coordinates are already lat/lng-shaped (`x`/`y` as placeholders).
- **Firebase / cloud storage** → `Settings.tsx`'s sync/restore handlers are already
  isolated functions (`syncNow`, `runRestore`) ready to call real endpoints.
- **MCP-style pharmacy/ambulance APIs** → `Pharmacy.tsx` and `Hospitals.tsx` booking
  flows are state machines (`idle → searching → found`) that just need their
  `setTimeout` calls replaced with real async requests.

## Design system

Custom palette (not the default shadcn look): `ink` (neutral/background), `vital`
(primary blue), `clover` (success/health-positive), `amber` (caution), `coral`
(alerts/emergency). Type is Sora (display) + Inter (body) + IBM Plex Mono. Dark mode
via Tailwind's `class` strategy. Motion uses Framer Motion (`motion` package) for
layout/page/modal transitions and springs; heavier hand-authored SVG/keyframe
animation is used for the landing network visualization, health score ring, and
scanning/emergency sequences in place of Anime.js, to keep the dependency footprint
small — the visual effect (staggered entrances, SVG path draws, count-ups) is the
same.

## Known trade-offs

- No automated test suite — this is a design/interaction prototype.
- The production bundle is a single ~900KB chunk; a real product would code-split
  routes with `React.lazy`.
- AR/VR concepts from the original brief are represented by the Hands-Free Mode
  demo rather than a literal WebXR implementation, since that needs headset
  hardware to mean anything.
