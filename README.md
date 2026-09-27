# Dota Stats

A Dota 2 player stats viewer built on the public [OpenDota API](https://docs.opendota.com/). It shows the top-ranked players, lets you search for any player, and opens a detailed stats page for each account.

**Live site:** https://dotaboost-assignment.vercel.app/

## Features

- **Leaderboard**: the 10 highest-rated players by MMR, with rank medals.
- **Player search**: search by persona name, or paste a Steam32 account ID or a Steam64 ID (converted automatically).
- **Player page** (`/players/[id]`):
  - Profile header with rank and overall / recent (last 20) win rate
  - Average stats across all matches
  - Performance trend and lane-role breakdown charts
  - The 5 most recent matches and the 10 most-played heroes
  - Stat distribution histograms (kills, deaths, assists, GPM, XPM, …)
- Loading skeletons, error states with retry, and a not-found page for unknown accounts.
- Light/dark theme toggle and staggered entry animations.

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

```
src/
├── app/                  # Routes: home page and /players/[id]
├── components/
│   ├── player/           # Player page sections (header, stats, charts, matches, heroes)
│   └── ui/               # shadcn/ui primitives
├── hooks/                # Shared React hooks (useDebounce)
├── lib/
│   ├── api/              # API client, endpoints, response types, query hooks
│   ├── dota.ts           # Win rate, formatting, hero image and lane-role helpers
│   ├── rank.ts           # Rank tier → medal label and icon
│   └── steam.ts          # Steam32/Steam64 ID parsing
└── providers/            # React Query provider
docs/
└── OPENDOTA_API_CONTRACTS.md   # OpenDota OpenAPI spec (JSON) for reference
```

## Data source

All data comes from `https://api.opendota.com/api` and is fetched on the client. Endpoints used:

- `GET /topPlayers`
- `GET /search?q=`
- `GET /players/{id}` and `/wl`, `/recentMatches`, `/heroes`, `/totals`, `/counts`, `/histograms/{field}`
- `GET /constants/heroes`

The free OpenDota tier is rate-limited, so heavy use can return errors. The retry buttons cover this.

## Contributing

- A pre-commit hook runs `pnpm format && pnpm lint`.
- Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org) (for example `feat: add hero filter`).
