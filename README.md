# Dota Stats

A Dota 2 stats site built on the public [OpenDota API](https://docs.opendota.com/). Every player, match, hero, team and league has its own page, and each one links to the others.

**Live site:** https://dotaboost-assignment.vercel.app/

## Features

- **Home** (`/`): the top 10 players by ranked MMR or Turbo rating, plus live games, the latest pro matches and the strongest heroes.
- **Search**: by persona name, Steam32 account ID or Steam64 ID (converted automatically). A number short enough to be a match ID also offers to open that match.
- **Player** (`/players/[id]`), with filters for period, patch, hero, game mode, lobby, lane, side and result that are kept in the URL:
  - Overview: rank, win rates, average stats, farm trend, lanes, recent matches, top heroes and stat histograms
  - Matches: paginated match history
  - Heroes: sortable stats as, with and against each hero
  - Peers: players and pros played with or against
  - Rankings: hero percentiles and rank history
  - Activity: observer/sentry ward heatmaps and chat word clouds
  - A button to ask OpenDota to refresh the player's history
- **Match** (`/matches/[id]`): scoreboards with items, draft, gold/XP advantage graphs, item builds and chat. Unparsed matches can request a replay parse.
- **Matches** (`/matches`): pro and public match feeds with load-more paging.
- **Live** (`/live`): games in progress, refreshed every 30 seconds.
- **Heroes** (`/heroes`, `/heroes/[id]`): win and pick rates per rank bracket, and per-hero matchups, item popularity and timings, benchmarks, top players and pro matches.
- **Pro scene**: `/pros`, `/teams`, `/teams/[id]`, `/leagues` and `/leagues/[id]`.
- **Records** (`/records`): all-time single-match records.
- **Meta** (`/meta`): rank distribution, team scenario win rates and a hero combo match finder.
- Loading skeletons, error states with retry, not-found pages, light/dark theme and entry animations.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, React Compiler) and React 19
- [TanStack Query](https://tanstack.com/query) through [`react-query-ease`](https://www.npmjs.com/package/react-query-ease) (typed Axios client)
- Tailwind CSS 4, shadcn/ui on [Base UI](https://base-ui.com), Tabler icons
- [Recharts](https://recharts.org) for charts, [Motion](https://motion.dev) for animation, Day.js for dates
- Biome for linting and formatting, Husky and commitlint for git hooks

## Getting started

Requires Node.js 20+ and [pnpm](https://pnpm.io). No API key or environment variables are needed.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command       | What it does                        |
| ------------- | ----------------------------------- |
| `pnpm dev`    | Start the dev server                |
| `pnpm build`  | Production build                    |
| `pnpm start`  | Serve the production build          |
| `pnpm lint`   | Run Biome checks                    |
| `pnpm format` | Format the code with Biome          |

## Project structure

Components used by one route live next to it in a private `_components` folder. Anything shared by two or more routes lives in `src/components`.

```
src/
├── app/
│   ├── _components/          # Home page sections (leaderboard, strips)
│   ├── players/[id]/         # Player layout + tab routes, _components, _hooks (filters)
│   ├── matches/              # Feeds; [id]/ is the match page
│   ├── heroes/               # Hero meta; [id]/ is the hero page
│   ├── teams/ leagues/ pros/ # Pro scene pages
│   └── live/ records/ meta/
├── components/               # Shared components (links, tables, cards, nav)
│   └── ui/                   # shadcn/ui primitives
├── hooks/                    # Shared React hooks (useDebounce, useShowMore)
├── lib/
│   ├── api/                  # API client, endpoints, response types, query hooks
│   ├── dota.ts               # Win rate, formatting, image and lane-role helpers
│   ├── hero-stats.ts         # Picks and wins per rank bracket
│   ├── rank.ts               # Rank tier → medal label and icon
│   └── steam.ts              # Steam32/Steam64 ID parsing
└── providers/                # React Query provider
docs/
└── OPENDOTA_API_CONTRACTS.md # OpenDota OpenAPI spec (JSON) for reference
```

## Data source

All data comes from `https://api.opendota.com/api` and is fetched on the client. Endpoints used:

- Players: `/topPlayers`, `/search`, `/players/{id}` and its `/wl`, `/recentMatches`, `/matches`, `/heroes`, `/peers`, `/pros`, `/totals`, `/counts`, `/histograms/{field}`, `/wardmap`, `/wordcloud`, `/ratings`, `/rankings`, `POST /refresh`
- Matches: `/matches/{id}`, `/proMatches`, `/publicMatches`, `/findMatches`, `POST /request/{match_id}`, `/request/{jobId}`, `/live`
- Heroes: `/heroStats`, `/heroes/{id}/matchups`, `/heroes/{id}/durations`, `/heroes/{id}/itemPopularity`, `/heroes/{id}/matches`, plus `/rankings`, `/benchmarks`, `/scenarios/itemTimings` and `/scenarios/laneRoles` with `?hero_id=`
- Pro scene: `/proPlayers`, `/teams`, `/teams/{id}` and its `/matches`, `/players`, `/heroes`, `/leagues`, `/leagues/{id}` and its `/matches`, `/teams`
- Other: `/records/{field}`, `/distributions`, `/scenarios/misc`, `/constants/{resource}`

Not used: `/health`, `/schema`, `/explorer`, `/metadata`, `/parsedMatches`, `/heroes`, `/heroes/{id}/players` and `/leagues/{id}/matchIds`. They are infrastructure endpoints, return too little to show (`/parsedMatches` is only match IDs, `/heroes/{id}/players` has no names), or duplicate data from the endpoints above.

The free OpenDota tier is rate-limited, so heavy use can return errors. The retry buttons cover this.

## Contributing

- A pre-commit hook runs `pnpm format && pnpm lint`.
- Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org) (for example `feat: add hero filter`).
