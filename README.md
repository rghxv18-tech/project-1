# FOCUS MODE
React + TypeScript + Vite productivity app. All data stays in your browser (localStorage, unencrypted; clearing browser data deletes it).

## Run
    npm install
    npm run dev        # http://localhost:5173
    npm run build      # type-check + production build

## Architecture
- `src/storage.ts` – only file touching localStorage (swap for a DB/API later). `seed()` makes editable example data.
- `src/lib.ts` – date helpers (local timezone), streak/rate/score calculations.
- `src/App.tsx` – state owner, hash navigation, autosave. Pages in `src/pages/` receive `{d, up, go}`; `up(fn)` mutates a cloned copy.
- Timers use end-timestamps, so they stay correct across tab switches.

## Limitations
No ambient sound, browser notifications, light-mode polish, or habit-category filters yet. Not a medical device: medication entries are your own reminders; never change or double doses based on this app.
