# ClothifyHer — Development Plan

Derived from *CLOTHIFYHER Final Website Flow* (12pp, 35 sections). This file is
the working plan; update it as phases close rather than letting it go stale.

---

## 1. Where we actually are

| Repo | State |
|---|---|
| `ClothifyHer-Website` | Vite 6 + React 19 + TS + Tailwind v4 + RTK Query **scaffold**. Home page built with 6 sections against mock data. One route (`/`). No API calls anywhere. |
| `ClothifyHer-backend` | Express 5 + Sequelize + Postgres **scaffold**. Infrastructure only: JWT, OTP generation, S3 upload, pagination, error handling, zod validation. **Zero models, zero routes, zero controllers.** |

Both ends are pre-feature. Nothing talks to anything yet. The single most
valuable next artifact is a written API contract both sides build against.

### Brand — settled

Logo masters live outside this repo (see `src/assets/brand/` for the rendered
web set). Colours sampled from the artwork, already in `src/index.css`:

| Token | Hex | Use |
|---|---|---|
| `maroon-800` | `#5A1D29` | primary — buttons, wordmark, footer |
| `gold-500` | `#B39769` | ornaments, hairlines, badges |
| `cream-100` | `#F3EEE4` | reversed logo, page ground |

Keep any maroon surface behind `logo-lockup-reversed.png` at exactly `#5A1D29`
— that image has the background baked in.

---

## 2. Decisions still blocking work

These change what gets built. Resolve before Phase 1 closes.

1. ~~**Catalog taxonomy**~~ — **settled**: the flow doc wins. Kurtas / Dresses /
   Co-ord Sets / Tops / Bottom Wear, applied in `src/config/navigation.ts`.
2. **Guest vs. gated** — doc §10 gates wishlist behind login. Is cart also
   gated? Is guest checkout allowed? Gating early costs conversion.
3. **PLP paging** — doc §7 asks for infinite scroll, doc §23 asks for SEO.
   These conflict. Recommendation: real paginated URLs, "Load more" on top.
4. **Admin** (§18) — separate repo, or a route group here? Roughly the same
   effort as the whole storefront.
5. **Reviews** (§21) — build, or integrate Judge.me / Yotpo?
6. **Blog** (§22) — CMS, or MDX in-repo?
7. **Wallet + Loyalty** (§17, §28) — real scope or deferred?
8. ~~**Instagram feed**~~ — **settled**: dropped from scope.

### Build order

Mock front-end first, backend second. Every screen is built against
`src/utils/mockData.ts`, then swapped to real endpoints once the contract and
Sequelize models exist. Keep all mock imports confined to page-level components
so the swap is a one-line change per screen.

---

## 3. Phase 0 — Foundations

Nothing user-facing. Unblocks everything after it.

- [x] **Taxonomy applied** — Kurtas / Dresses / Co-ord Sets / Tops / Bottom
      Wear now drive `src/config/navigation.ts`, the single source every nav,
      mega menu and footer column reads from.
- [x] **Brand assets wired** — `Logo` component in navbar, mobile drawer and
      footer; cream variant on maroon grounds. Exact brand ramp
      (`#5A1D29` / `#B39769` / `#F3EEE4`) in `src/index.css`.
- [x] **Metadata** — favicon set, `site.webmanifest`, theme-color, OG/Twitter
      cards, Organization + WebSite + SiteNavigation JSON-LD in `index.html`.
      All `VIRAASAT` references removed.
- [ ] **API contract doc** — endpoints, payloads, error envelope, pagination
      shape, auth flow. Written once, consumed by both repos. **Next up.**
- [ ] **Data model** — Users, Addresses, Categories, SubCategories, Products,
      ProductVariants, Carts, CartItems, Wishlists, Orders, OrderItems,
      Payments, Coupons, Reviews. Sequelize migrations.
- [ ] **Env + CORS** between the two repos.
- [ ] Error boundary, 404 route, route-level code splitting.

---

## 4. Phase 1 — Catalog browsing

Everything a logged-out visitor can do. Ship this before touching auth.

**Complete the Home page** (see §7 below for the gap list).

- [ ] **PLP** (doc §7) — one parameterised template serving New Arrivals, Best
      Sellers, Sale, Collections and all category routes. Filters and sort in
      the URL. Zero-results state that offers an escape.
- [x] **PDP** (doc §8) — gallery with **mixed image + video**, click-to-zoom
      that tracks the cursor, size picker, size guide, pincode checker,
      accordions, reviews, similar products, sticky mobile buy-bar.
      Size-not-selected blocks Add to Bag and scrolls the picker into view.
      Route: `/products/:productId`.
- [x] **Product media model** — `ProductMedia` is a discriminated union so a
      video can't exist without a poster. `product.image` stays the primary
      still for cards, cart snapshots and OG tags. Cards upgrade to video via
      `ProductCardMedia`: hover-to-play on pointer devices, IntersectionObserver
      autoplay at 60% visibility on touch, still + badge under reduced motion.
- [ ] **Search** (doc §9) — overlay with trending/recent, predictive results,
      results page, no-results page.
- [ ] **Mega menu** (doc §5) — Women + Collections panels on desktop; the
      mobile drawer already exists.
- [ ] Skeletons for every async surface.

---

## 5. Phase 2 — Transact

- [ ] **Auth** (doc §25) — OTP modal, not a page. Must resume the interrupted
      intent (wishlist / cart / checkout) after login.
- [ ] **Cart** (doc §11) — coupon, shipping estimate, gift wrap,
      recommendations. Surface price-changed and went-out-of-stock rather than
      silently updating.
- [ ] **Wishlist** (doc §10) — guest wishlist in localStorage, merged on login.
- [ ] **Checkout** (doc §12) — address → delivery → payment → review.
- [ ] **Payment** (doc §13) — Razorpay: UPI, cards, net banking, wallet, COD.
      The dangerous case is *pending/timeout*: money left, no confirmation.
      Needs webhook reconciliation, not just a client callback.
- [ ] **Order Success** (doc §14) — idempotent on refresh.
- [ ] **Order Tracking** (doc §15) — plus the states the doc omits: cancelled,
      RTO, partial shipment, delayed.

---

## 6. Phase 3 → 5

**Phase 3 — Account & service:** Dashboard shell + 7 panels (doc §17), Returns
& Exchange (§16), Coupon engine (§20), Reviews (§21), Notifications (§27).
Every panel needs a designed empty state.

**Phase 4 — Growth:** Blog (§22), Loyalty (§28), Analytics dashboard (§33).
Instagram feed is out of scope by decision.

**Phase 5 — Admin** (§18, §19): Products, Orders, Inventory, Customers,
Coupons, Reports, Analytics. Can run parallel to Phases 2–3 with a second pair
of hands.

---

## 7. Home page — status

Doc §3 specifies 12 sections. **Instagram Feed is dropped by decision**, so 11
are in scope and all 11 are built.

| # | Section | Component |
|---|---|---|
| 1 | Announcement Bar | ✅ `AnnouncementBar` — rotating, dismiss persisted |
| 2 | Header | ✅ `TopNavBar` |
| 3 | Mega Menu | ✅ `TopNavBar` — Women + Collections panels (doc §5) |
| 4 | Hero Banner | ✅ `HeroCarousel` |
| 5 | Category Icons | ✅ `CategoryStories` |
| 6 | Featured Collection | ✅ `FeaturedCollection` |
| 7 | Trending Products | ✅ `TrendingNow` |
| 8 | Shop by Occasion | ✅ `OccasionGrid` |
| 9 | Testimonials | ✅ `Testimonials` |
| — | ~~Instagram Feed~~ | ⛔ dropped from scope |
| 11 | Newsletter | ✅ `Newsletter` |
| 12 | Footer | ✅ `SiteFooter` |

`TrustStrip` is an extra, not in the doc — kept.

### Still outstanding on Home

The layout is complete; it is still a **mock front-end**:

- Every link 404s — `/` is the only route that exists.
- All content comes from `src/utils/mockData.ts`. No API is called.
- Images are seeded picsum placeholders, not garment photography. Swap the
  `img()` helper in `mockData.ts` for CDN URLs.
- Cart badge is hardcoded `bagCount={3}` in `App.tsx`.
- Wishlist state is local to `Home` and dies on unmount.
- Newsletter submit is a fake 700 ms delay.
- Sitemap lists `/categories` and `/privacy-policy`; neither route exists.
- No skeletons, error states or empty states.

---

## 8. Conventions

**Feature folders** — `src/features/<domain>/`:
`xAPI.ts` (RTK Query slice) · `xAPI.type.ts` (request/response types) ·
`xSlice.ts` (only when the domain holds client state).

Pick the base query per domain: `axiosBaseQuery()` for public endpoints,
`axiosBaseQueryWithReauth` for anything behind login. Register every new slice
in **both** `reducer` and `middleware` in `src/app/store.ts` — `auth` is the
reference.

**Path alias** `@/*` → `src/*`, declared in `tsconfig.json`,
`tsconfig.app.json` and `vite.config.ts`. Keep all three in sync.

**Definition of done** for any screen: loading state · empty state · error
state · mobile + desktop · keyboard reachable · real API, no mock imports ·
meta tags via `<Helmet>`.

**Cross-cutting** (doc §§23–28, 30) are constraints on every screen, not a
phase: SEO, Core Web Vitals, security, responsive, notifications. Retrofitting
these costs several times more than building them in.
