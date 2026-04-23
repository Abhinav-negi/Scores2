# Project Changelog

All completed development phases and file modifications will be tracked here.

## Phase 1: Project Scaffold (2026-04-23)
- Initialized Next.js 15 (App Router) project with Tailwind CSS v4.
- Added dependencies: `mongoose`, `zustand`, `@tanstack/react-query`, `jsonwebtoken`, `jose`, `bcryptjs`, and `lucide-react`.
- Created environment templates (`.env.local`).
- Created Mongoose singleton: `/lib/db/mongoose.js`.
- Configured Node & Edge JWT helpers: `/lib/auth/jwt.js`.
- Configured Next.js Edge middleware to protect internal routes: `/middleware.js`.
- Set up base typography and layout structure in `/app/globals.css`.

## Phase 2: Models (2026-04-23)
- Created the **User** Mongoose model (`/models/User.js`).
- Created the **Favourite** Mongoose model (`/models/Favourite.js`) with unique compound indexing.

## Phase 3: Auth API Routes (2026-04-23)
- Created `/api/auth/signup` for account creation.
- Created `/api/auth/login` for session generation.
- Created `/api/auth/logout` to clear cookies.
- Created `/api/auth/me` to verify active sessions.

## Phase 4: Sports API Routes & Normalisers (2026-04-23)
- **Cricket**: Implemented `lib/apis/cricket.js` with CricAPI mock integration and `/api/sports/cricket/route.js`.
- **F1**: Implemented `lib/apis/f1.js` with OpenF1 mock integration and `/api/sports/f1/route.js`.
- **Basketball**: Implemented `lib/apis/basketball.js` with API-NBA mock integration and `/api/sports/basketball/route.js`.
- **Tennis**: Implemented `lib/apis/tennis.js` with API-Tennis mock integration and `/api/sports/tennis/route.js`.
- **Chess**: Implemented `lib/apis/chess.js` with Chess.com mock integration and `/api/sports/chess/route.js`.
- Implemented **Mock Fallback Logic** to ensure seamless local development without needing valid API keys or hitting rate limits.
- Implemented the **24h Results Window Logic** inside the route handlers to automatically filter matches completed more than 24 hours ago when `type=results` is passed.

## Phase 5: Favourites API Route (2026-04-23)
- Created `GET /api/favourites`: Fetches all favorites for the currently authenticated user.
- Created `POST /api/favourites`: Creates a new favorite. Utilizes the compound unique index in MongoDB to automatically prevent duplicates.
- Created `DELETE /api/favourites/[id]`: Removes a specific favorite, strictly scoped to ensure users can only delete their own favorites.

## Phase 6 & 7: Stores and Hooks (2026-04-23)
- **Zustand Stores**:
  - Created `store/useAuthStore.js`: Global state for the authenticated user, integrating with the `/api/auth/me` endpoint.
  - Created `store/useSportsStore.js`: State for user's dashboard preferences, using Zustand's `persist` middleware to save selected sports to `localStorage`.
- **Custom Hooks**:
  - Created `hooks/useLiveScore.js`: A TanStack Query hook that polls the `/api/sports/[sport]?type=live` endpoint every 30 seconds.
  - Created `hooks/useFavourites.js`: A TanStack Query wrapper hook that cleanly manages fetching, adding, and removing favourites with automatic query invalidation.

## Phase 8: Layout & Shared Components (2026-04-23)
- **Layout Components**:
  - `Navbar.jsx`: Clean top navigation with login/logout state and the bold SportsFeed logo.
  - `Sidebar.jsx`: Clean left-side canvas holding the filter navigation.
  - `SportFilter.jsx`: Typography-focused component allowing users to toggle their preferred sports using the Zustand `useSportsStore`.
- **Shared UI Components**:
  - `SportBadge.jsx`: Tiny, elegant badge indicating the sport type.
  - `FavouriteToggle.jsx`: Optimistic UI button using `lucide-react` star icon to instantly toggle favourites via the `useFavourites` hook.
  - `MatchCard.jsx`: Generic container for sports matches, showing home/away scores, live status ping indicator, and extra metadata.
  - `ResultCard.jsx`: Specialized MatchCard wrapper that displays the completed timestamp.

## Phase 9: Auth Pages (2026-04-23)
- Created `app/(auth)/login/page.js`: Centered form connecting to the `/api/auth/login` route. On success, updates global Zustand auth state and routes the user to their Dashboard.
- Created `app/(auth)/signup/page.js`: Identical clean aesthetic, routing to `/api/auth/signup` to streamline immediate user onboarding without external verification layers.

## Phase 10: Sport-Specific Components (2026-04-23)
- **Mock Data Indicator**: Augmented all 5 data normalizers in `lib/apis/` to pass down an `isMock: true` boolean. Updated `MatchCard.jsx` to dynamically render a tiny, transparent `MOCK` tag next to the Live status when testing locally.
- **Cricket**: Created `CricketScorecard.jsx` and a clean, responsive `CricketStandings.jsx` table.
- **F1**: Created `F1DriverTable.jsx` and `F1ConstructorTable.jsx` to neatly organize constructor points.
- **Basketball**: Created `BasketballBoxScore.jsx` and `BasketballStandings.jsx` (Eastern Conference mock example).
- **Tennis**: Created `TennisMatchCard.jsx` and `TennisRankings.jsx` showing ATP top 5 mocks.
- **Chess**: Created `ChessResultsCard.jsx` and `ChessTournamentTable.jsx` showing formats and time controls.
- All mock tables utilize "The Athletic" styling: no heavy borders, strong typography, and tabular-nums for scores/times.

## Phase 11: The Core Pages (2026-04-23)
- **Root Layout & Providers**:
  - Created `components/providers/ReactQueryProvider.jsx` to initialize the global `QueryClient` with a 60-second `staleTime`.
  - Updated `app/layout.js` to mount the `ReactQueryProvider` and `Navbar` at the root, ensuring persistent UI and cache across page navigations.
- **Pages**:
  - `/dashboard`: Built the personalized feed. Loops through the user's `useSportsStore` selections and dynamically mounts the corresponding sport's live feed and standings table. Uses a responsive grid mapping the sport-specific components.
  - `/tracker`: Built a high-density, full-width page utilizing `?type=live`. It maps through all sports simultaneously, acting as an un-filtered live ticker.
  - `/results`: Built the 24-hour recap page. Leverages a direct `useQuery` fetch to hit the `?type=results` endpoint for all sports and renders them elegantly into `ResultCard` components.
  - `/settings`: Built the user preferences hub. Displays authenticated email/ID and allows users to view and delete their Favourites.
  - `/[sport]`: Built the dynamic sport hub (e.g., `/f1` or `/cricket`). Combines live data, recent results, and specific standings tables into a dedicated dashboard for a single sport.
