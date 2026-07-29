# ClothifyHer Website

Scaffold for the ClothifyHer storefront — React 19 + TypeScript + Vite 6 +
Tailwind CSS v4, with Redux Toolkit and an Axios-backed RTK Query base query.

The folder layout mirrors the Pooja Samagri website so the two projects stay
navigable side by side. Only the plumbing is in place — pages, components and
feature APIs are yet to be built.

## Getting started

```bash
npm install
```

```bash
cp .env.example .env
```

```bash
npm run dev
```

| Script            | What it does                               |
| ----------------- | ------------------------------------------ |
| `npm run dev`     | Vite dev server (`--host`, LAN accessible) |
| `npm run build`   | `tsc -b` project build + `vite build`      |
| `npm run preview` | Serve the production build locally         |
| `npm run lint`    | ESLint across the repo                     |

## Project structure

```
src/
├── api/            Axios instance + RTK Query base queries  ✅ ready
│   ├── axiosConfig.ts           baseURL, credentials, auth interceptor
│   ├── baseQueryWithAxios.ts    plain base query (public endpoints)
│   └── baseQueryWithReauth.ts   base query + refresh-token retry (mutex guarded)
├── app/            Redux store + typed hooks               ✅ ready
├── assets/         Static images imported by components
├── components/
│   ├── bits/           Small presentational primitives
│   ├── bottomsheet/    Mobile bottom sheets
│   ├── common/         Cross-page pieces (SEO, search, nav bars)
│   ├── custom/         Project-specific button/ and card/ variants
│   ├── dialog/         Modal dialogs
│   ├── error/          NotFound / ErrorScreen / SomethingWentWrong
│   ├── layout/         Route layout wrappers
│   ├── loader/         Spinners
│   ├── navigation/     Navbar
│   ├── skeletons/      Per-page loading skeletons
│   └── ui/             shadcn/ui primitives (added on demand, see below)
├── config/         Non-secret runtime constants
├── env/            Typed access to import.meta.env
├── features/       One folder per domain — address, auth, cart, category,
│                   configuration, coupon, orders, product, sub-category, user
├── hooks/          Shared React hooks
├── interfaces/     Shared prop / model types
├── lib/            utils.ts (`cn` helper)                  ✅ ready
├── pages/          Route-level screens, one folder per route
└── utils/          Pure helpers (constants, slug builders)
```

Empty folders carry a `.gitkeep` so the structure survives in git — delete it
once real files land there.

### Feature folder convention

Each domain under `src/features/` follows the same three-file shape:

- `xAPI.ts` — an RTK Query `createApi` slice
- `xAPI.type.ts` — request/response types for those endpoints
- `xSlice.ts` — a `createSlice` reducer, only when the domain holds client state

Pick the base query per domain: `axiosBaseQuery()` for public endpoints,
`axiosBaseQueryWithReauth` for anything behind a login.

Every new API slice must be registered in **both** `reducer` and `middleware`
in [src/app/store.ts](src/app/store.ts) — `auth` is wired up as the reference.

### Adding UI components

`components.json` is configured (new-york style, neutral base, `lucide` icons),
so shadcn components install straight into `src/components/ui/`:

```bash
npx shadcn@latest add button card input skeleton
```

That pulls in the Radix / vaul / embla peer deps only when a component
actually needs them.

## Path alias

`@/*` maps to `src/*` — configured in `tsconfig.json`, `tsconfig.app.json` and
`vite.config.ts`. Keep all three in sync.

## Deployment

- `vercel.json` — SPA rewrite so client-side routes resolve.
- `amplify.yml` — AWS Amplify build spec (`dist` as the artifact directory).
- `vite.config.ts` — `vite-plugin-sitemap` emits `dist/sitemap.xml`; add public
  routes to `STATIC_ROUTES` and user-specific ones to `exclude` as pages land.
