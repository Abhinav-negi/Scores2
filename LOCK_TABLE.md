# Lock Table — SportsFeed Progress Tracker

> Left column = Done | Right column = Remaining
> Update this file after every coding session.
> Format: [DATE] beside each completed item.

---

## PHASE 0 — Planning & Architecture

| ✅ Done | ⏳ Remaining |
|---|---|
| [2026-04-23] Requirements gathered | — |
| [2026-04-23] Sports selected (Cricket, F1, Basketball, Tennis, Chess) | — |
| [2026-04-23] API map finalised | — |
| [2026-04-23] Auth strategy decided (JWT + httpOnly cookies) | — |
| [2026-04-23] Folder structure defined | — |
| [2026-04-23] ARCHITECTURE.md written | — |
| [2026-04-23] README.md written | — |
| [2026-04-23] LOCK_TABLE.md created | — |

---

## PHASE 1 — Project Scaffold

| ✅ Done | ⏳ Remaining |
|---|---|
| [2026-04-23] | Initialise Next.js 15 project |
| [2026-04-23] | Install all dependencies |
| [2026-04-23] | Configure Tailwind CSS |
| [2026-04-23] | Set up `.env.local` + `.env.example` |
| [2026-04-23] | Configure `next.config.js` |
| [2026-04-23] | Set up MongoDB connection singleton (`/lib/db/mongoose.js`) |
| [2026-04-23] | Set up JWT helpers (`/lib/auth/jwt.js`) |
| [2026-04-23] | Write Next.js edge middleware (`/middleware.js`) |

---

## PHASE 2 — Models

| ✅ Done | ⏳ Remaining |
|---|---|
| [2026-04-23] | `User.js` model (email, passwordHash, createdAt) |
| [2026-04-23] | `Favourite.js` model (userId, sport, type, externalId, name) |

---

## PHASE 3 — Auth API Routes

| ✅ Done | ⏳ Remaining |
|---|---|
| [2026-04-23] | POST `/api/auth/signup` |
| [2026-04-23] | POST `/api/auth/login` |
| [2026-04-23] | POST `/api/auth/logout` |
| [2026-04-23] | GET `/api/auth/me` |

---

## PHASE 4 — Sports API Routes + Normalisers

| ✅ Done | ⏳ Remaining |
|---|---|
| [2026-04-23] | Cricket API route + normaliser |
| [2026-04-23] | F1 API route + normaliser |
| [2026-04-23] | Basketball API route + normaliser |
| [2026-04-23] | Tennis API route + normaliser |
| [2026-04-23] | Chess API route + normaliser |

---

## PHASE 5 — Favourites API Route

| ✅ Done | ⏳ Remaining |
|---|---|
| [2026-04-23] | GET `/api/favourites` |
| [2026-04-23] | POST `/api/favourites` |
| [2026-04-23] | DELETE `/api/favourites/[id]` |

---

## PHASE 6 — Zustand Stores

| ✅ Done | ⏳ Remaining |
|---|---|
| [2026-04-23] | `useAuthStore.js` |
| [2026-04-23] | `useSportsStore.js` |

---

## PHASE 7 — Custom Hooks

| ✅ Done | ⏳ Remaining |
|---|---|
| [2026-04-23] | `useLiveScore.js` (TanStack Query + 30s polling) |
| [2026-04-23] | `useFavourites.js` (CRUD wrapper) |

---

## PHASE 8 — Layout & Shared Components

| ✅ Done | ⏳ Remaining |
|---|---|
| [2026-04-23] | `Navbar.jsx` |
| [2026-04-23] | `Sidebar.jsx` (sport filter) |
| [2026-04-23] | `SportBadge.jsx` |
| [2026-04-23] | `MatchCard.jsx` (generic) |
| [2026-04-23] | `ResultCard.jsx` |
| [2026-04-23] | `FavouriteToggle.jsx` |

---

## PHASE 9 — Auth Pages

| ✅ Done | ⏳ Remaining |
|---|---|
| [2026-04-23] | `/login` page |
| [2026-04-23] | `/signup` page |

---

## PHASE 10 — Sport-Specific Components

### Cricket
| ✅ Done | ⏳ Remaining |
|---|---|
| [2026-04-23] | `CricketScorecard.jsx` |
| [2026-04-23] | `CricketStandings.jsx` |

### Formula 1
| ✅ Done | ⏳ Remaining |
|---|---|
| [2026-04-23] | `F1DriverTable.jsx` |
| [2026-04-23] | `F1ConstructorTable.jsx` |

### Basketball
| ✅ Done | ⏳ Remaining |
|---|---|
| [2026-04-23] | `BasketballBoxScore.jsx` |
| [2026-04-23] | `BasketballStandings.jsx` |

### Tennis
| ✅ Done | ⏳ Remaining |
|---|---|
| [2026-04-23] | `TennisMatchCard.jsx` |
| [2026-04-23] | `TennisRankings.jsx` |

### Chess
| ✅ Done | ⏳ Remaining |
|---|---|
| [2026-04-23] | `ChessResultsCard.jsx` |
| [2026-04-23] | `ChessTournamentTable.jsx` |

---

## PHASE 11 — Pages (Dashboard Layer)

| ✅ Done | ⏳ Remaining |
|---|---|
| [2026-04-23] | `/dashboard` page |
| [2026-04-23] | `/tracker` page |
| [2026-04-23] | `/results` page (24h filter) |
| [2026-04-23] | `/settings` page |
| [2026-04-23] | `/[sport]` dynamic page |

---

## PHASE 12 — Polish & QA

| ✅ Done | ⏳ Remaining |
|---|---|
| — | Responsive layout check (mobile + desktop) |
| — | Loading states on all data-fetching components |
| — | Error states + fallback UI |
| — | Empty state (no favourites set) |
| — | Rate limit handling for RapidAPI routes |
| — | 24h results window final testing |
| — | Auth redirect flows (protected routes) |

---

## Notes Log

| Date | Note |
|---|---|
| 2026-04-23 | Project planning complete. Ready to scaffold. |
