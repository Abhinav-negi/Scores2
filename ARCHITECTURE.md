# Architecture Decision Record — Sports Tracker

## Project Overview
A personalised, clean-minimal sports tracker web app for 5 sports: Cricket, Formula 1, Basketball, Tennis, Chess.
Users log in, select favourite sports/teams/players, and get a custom feed with live scores, news, and results.

---

## Stack Decisions

### Framework — Next.js 15 (App Router, JavaScript)
**Why:** App Router gives us React Server Components for data-heavy pages (leaderboards, standings) 
and Client Components only where interactivity is needed (live score tickers, favourite toggles). 
This means less client JS shipped, faster initial loads. No separate Express server needed — 
Next.js API routes handle auth + data proxy cleanly. College project scope = one repo, one deploy.

### Database — MongoDB + Mongoose
**Why:** Users have a favourites array that varies per sport (a cricket fan stores teams + players, 
a chess fan stores player handles). MongoDB's flexible document model fits this better than a rigid 
SQL schema. Mongoose gives us validation and model structure without losing that flexibility.

### Auth — JWT in httpOnly cookies via Next.js API routes
**Why:** httpOnly cookies mean the token is never accessible to JavaScript on the client — 
XSS-proof by default. Next.js middleware can protect routes at the edge before any page renders. 
No separate auth service needed. Simple email + password, no OAuth. Signup → immediate access (no email verification — college project scope).

### Styling — Tailwind CSS
**Why:** Clean minimal design (The Athletic energy) = mostly typography + spacing decisions. 
Tailwind makes this fast without a component library imposing its aesthetic. Custom sport-specific 
accent colors are one config line each.

### Client State — Zustand
**Why:** User preferences (selected sports, favourites) need to be globally accessible but are 
lightweight. Zustand has no boilerplate and integrates cleanly with Next.js hydration patterns. 
No Redux complexity needed here.

### Server-Side Data Fetching — TanStack Query
**Why:** Sports data needs polling (live scores refresh every 30s), caching (don't re-fetch 
standings on every tab switch), and loading/error states. TanStack Query handles all three 
with minimal code. Works with React Server Components and Client Components.

---

## API Strategy

| Sport      | API                        | Base URL                              | Auth         | Cost  |
|------------|----------------------------|---------------------------------------|--------------|-------|
| Cricket    | CricAPI (RapidAPI)         | api-cricket.p.rapidapi.com           | RapidAPI key | Free tier |
| Formula 1  | OpenF1                     | api.openf1.org/v1                    | None         | Free  |
| Basketball | API-NBA (RapidAPI)         | api-nba.p.rapidapi.com               | RapidAPI key | Free tier |
| Tennis     | API-Tennis (RapidAPI)      | tennis-live-data.p.rapidapi.com      | RapidAPI key | Free tier |
| Chess      | Chess.com Public API       | api.chess.com/pub                    | None         | Free  |

**Key principle:** All external API calls go through Next.js `/api/sports/[sport]` routes — never 
called directly from the browser. This hides API keys, lets us add caching, and gives a single 
point to handle rate limit errors gracefully.

---

## Data Flow

```
Browser (Client Component)
    → TanStack Query calls /api/sports/cricket?type=live
        → Next.js API route fetches from CricAPI
            → Returns normalised response
                → TanStack Query caches + displays
```

Why normalise? Each sport's raw API response looks completely different. We normalise to a shared 
internal shape per sport so components stay predictable.

---

## Page Structure

```
/                        → Landing / Login redirect
/login                   → Auth
/signup                  → Auth
/dashboard               → Main feed (favourited sports news)
/tracker                 → Live match tracker (favourite teams/players)
/results                 → Last 24h match results only
/settings                → Manage favourite sports, teams, players
/[sport]                 → Individual sport page (custom layout per sport)
```

---

## Sport-Specific Display Components

| Sport      | Primary Display                          | Secondary Display              |
|------------|------------------------------------------|-------------------------------|
| Cricket    | Live scorecard (innings, overs, wickets) | Series standings table         |
| Formula 1  | Driver championship standings table      | Constructor standings + circuit info |
| Basketball | Live box score (pts/reb/ast per player)  | Conference standings           |
| Tennis     | Head-to-head match card + set scores     | ATP/WTA rankings table         |
| Chess      | Recent 24h results card                  | Live/upcoming tournaments table|

---

## Results Window Logic
- On every result fetch, server checks `match.endTime`
- If `Date.now() - match.endTime > 86400000` (24 hours in ms), result is excluded from response
- This check happens in the API route, not the frontend — keeps display logic clean
- MongoDB stores a `completedAt` timestamp on cached match documents for fast filtering

---

## Folder Structure

```
/app
  /api
    /auth
      /login/route.js
      /signup/route.js
      /logout/route.js
      /me/route.js
    /sports
      /cricket/route.js
      /f1/route.js
      /basketball/route.js
      /tennis/route.js
      /chess/route.js
    /favourites
      /route.js              ← GET + POST + DELETE
  /(auth)
    /login/page.js
    /signup/page.js
  /(dashboard)
    /dashboard/page.js
    /tracker/page.js
    /results/page.js
    /settings/page.js
  /[sport]/page.js           ← Dynamic sport pages

/components
  /sports
    /cricket/
      CricketScorecard.jsx
      CricketStandings.jsx
    /f1/
      F1DriverTable.jsx
      F1ConstructorTable.jsx
    /basketball/
      BasketballBoxScore.jsx
      BasketballStandings.jsx
    /tennis/
      TennisMatchCard.jsx
      TennisRankings.jsx
    /chess/
      ChessResultsCard.jsx
      ChessTournamentTable.jsx
  /shared/
    MatchCard.jsx            ← Generic wrapper
    ResultCard.jsx
    FavouriteToggle.jsx
    SportBadge.jsx
  /layout/
    Navbar.jsx
    Sidebar.jsx
    SportFilter.jsx

/lib
  /db
    mongoose.js              ← Connection singleton
  /auth
    jwt.js                   ← Sign + verify helpers
    middleware.js            ← Route protection
  /apis
    cricket.js               ← CricAPI fetch + normalise
    f1.js                    ← OpenF1 fetch + normalise
    basketball.js            ← API-NBA fetch + normalise
    tennis.js                ← API-Tennis fetch + normalise
    chess.js                 ← Chess.com fetch + normalise
  /normalise
    cricket.normalise.js
    f1.normalise.js
    basketball.normalise.js
    tennis.normalise.js
    chess.normalise.js

/models
  User.js                    ← email, passwordHash, favourites[]
  Favourite.js               ← userId, sport, type(team/player/league), externalId, name

/store
  useAuthStore.js            ← user, token, login(), logout()
  useSportsStore.js          ← selectedSports[], preferences

/hooks
  useLiveScore.js            ← TanStack Query wrapper with 30s polling
  useFavourites.js           ← CRUD for favourites

/middleware.js               ← Next.js edge middleware for route protection
```

---

## Environment Variables Required

```env
MONGODB_URI=
JWT_SECRET=
RAPIDAPI_KEY=
NEXT_PUBLIC_APP_URL=
```
