# Codebase Review

> Multi-agent review of the strichliste-web-frontend codebase after the
> CRA→Vite, React 16→19, Redux→TanStack Query, and accessibility passes.
> Five focused reviews were run in parallel (architecture, components,
> bricks/a11y, build/tooling, security). Findings are compiled below.

## Executive Summary

The post-migration codebase is in good shape: React 19 + Vite + TanStack
Query is correctly wired, the Redux removal is clean, accessibility has a real
foundation (skip link, focus-managed modal, decorative-icon hygiene, AA
contrast on light theme, axe-in-CI), and the test/build/CI pipelines are
modern. The major weak spots are concentrated in three places:

- **The thin `fetch` wrapper.** `src/services/api.ts` has no `res.ok` check,
  no `AbortSignal`, no URL encoding for free-form inputs, no auth/CSRF
  scaffolding, and turns non-2xx into silent `undefined`s. Flagged by both
  the architecture and security reviewers as the single biggest correctness
  gap.
- **Imperative write-path helpers.** `createTransaction`, `addArticle`,
  `addBarcode`, `updateUser`, etc. are bare `async` functions. Consequences:
  no per-call-site `isLoading`/`error` state, no double-submit guard
  (realistic operational bug, especially in split-invoice and the barcode
  scanner), no optimistic UI, and silent `undefined`-on-error returns. Should
  be `useMutation` (or at least `useMutation`-fronted) with `mutationKey`
  dedupe.
- **Living debt that's hidden by the lint config.** `no-explicit-any: 'off'`,
  `no-unused-vars: 'warn'`, `reportUnusedDisableDirectives: false`, and
  `tsconfig.json`'s `useUnknownInCatchVariables: false` together let
  CRA-era rot persist invisibly. The class components (`CurrencyInput`,
  `Scanner`, `Toast`, `CreateUserTransactionForm`), the 8 `eslint-disable
  react-hooks/exhaustive-deps` comments, dead-code stubs, and the latent
  `User.id: string` vs API `number` type lie all live in these blind spots.

Beyond those: CI Playwright hits the **live demo API**, the release
pipeline (`package.yml`) **skips lint/E2E**, the dark theme **wasn't
contrast-audited** (inactive nav links fail AA), and `.fab` touch targets
are **36×36 on the mobile breakpoint** despite the kiosk target.

### Top 10 prioritized actions

1. **Harden `services/api.ts`** — check `res.ok`, throw a typed `ApiError`,
   accept `AbortSignal`, encode free-form path/query inputs (e.g. barcode),
   narrow `any` to a generic `<T>`. Fixes silent failures + URL injection.
2. **Wrap mutations in `useMutation` with `mutationKey`** and disable submit
   buttons while pending. Eliminates the double-submit bug (most likely
   real-world defect) and gives every call site free `isLoading`/`error`.
3. **Mock the API in PR-gate Playwright** (MSW or Playwright route mocking);
   keep a nightly job against the demo API. Removes the cross-team
   fragility.
4. **Make `package.yml` reuse the `quality` job** (lint, typecheck, E2E)
   from `ci.yml` so releases can't ship unlinted/untypechecked artifacts.
5. **Fix `User.id` at the API boundary** — either change the type to
   `number` or normalize to `string` in `queryFn`. End the half-and-half.
6. **Don't swallow errors inside `queryFn`** for reads. Let TanStack Query
   see rejections so `retry`/`isError` work; bridge to the toast via
   `QueryCache.onError` instead of in-line `errorHandler` on the read path.
7. **Bump touch targets** on the mobile breakpoint (`.fab` ≥ 2.75rem,
   `.button`/`.tab` padding ≥ 0.75rem 1rem) and **audit dark-theme
   contrast** (start with `--textSubtile` on dark `--mainBackground`,
   currently ~3.1:1).
8. **Localize the Modal `backDropTile` (typo: should be `backDropTitle`)
   default** and the `label="Dialog"` default via `useIntl`. Pass `label`
   from `user-selection.tsx`. Rethink the backdrop as a `<button>`.
9. **Tighten ESLint and TS**: scope `no-explicit-any: 'off'` to a `legacy/`
   overrides block, flip `no-unused-vars` to `error`, turn
   `reportUnusedDisableDirectives` back on, drop
   `useUnknownInCatchVariables: false`. Then sweep the resulting findings.
10. **Convert the four class components to hooks** (priority order: `Toast`,
    `Scanner`, `CurrencyInput`, `CreateUserTransactionForm`). The last
    converts the double-submit risk into a one-line `useMutation` guard.

---

## Architecture & Data Layer

### Summary
The post-Redux migration is in good shape: TanStack Query carries server
state cleanly, the query-key factory centralises cache identity, and a small
`useSyncExternalStore` singleton replaces the old error slice without
ceremony. The main weaknesses are around mutations (hand-rolled imperative
helpers that bypass `useMutation` and silently swallow errors as
`undefined`), an under-typed/under-defended `fetch` wrapper, and a handful
of latent type lies — most importantly `User.id: string` while the API
returns `number`. `src/store/` is correctly gone.

### Strengths
- Single source of truth for query keys (`src/queries/keys.ts`) with explicit
  `id` coercion to string, and tests reuse the same factory
  (`src/spec-configs/render.tsx:24-26`).
- Sensible global `QueryClient` defaults for a kiosk: `staleTime: 15s`,
  `refetchOnWindowFocus: false`, `retry: 1`
  (`src/services/query-client.ts:7-17`).
- The `initialData: defaultSettings` pattern in `useSettings` lets the rest
  of the app treat settings as always-present, which is pragmatic for an app
  where every screen reads them.
- Subscribable global-error singleton is idiomatic React 18+
  (`useSyncExternalStore` with identical `getSnapshot`/`getServerSnapshot`),
  and `ErrorMessage` uses `role="alert"`/`aria-live="assertive"`.
- Co-located domain types under `src/types/` with a clean barrel; queries
  re-export them so consumers have one import surface.
- Provider order in `app.tsx` is correct: `ThemeProvider` →
  `QueryClientProvider` → `IntlProvider` (depends on settings query) →
  `HashRouter`.
- Routing v5→v7 shim is small, well-commented, and bounded to one file
  (`src/routing.tsx`).

### Findings

#### High
- **API client is dangerously thin.** `src/services/api.ts:6-31` calls
  `res.json()` unconditionally — non-2xx responses are treated as success,
  network errors only surface through `fetch` rejection, and there's no
  `res.ok` check, no status propagation, no abort signal, no auth/CSRF
  headers, no JSON parse guard. `errorHandler` then only catches when the
  API happens to return `{ error: { class } }`. A real 500 with an HTML body
  throws inside `json()`, which is the only way errors reach the `catch`.
  This is the single biggest correctness gap.
- **Mutations bypass `useMutation`.** `createTransaction`, `addArticle`,
  `addBarcode`, `updateUser`, etc. (`src/queries/transactions.ts:63`,
  `articles.ts:74-161`, `users.ts:74-102`) are bare `async` functions.
  Consequences: every call site re-invents `isLoading`/`isSubmitting` state
  (see `split-invoice.tsx:60-66`, `create-user-transaction-form.tsx:50-58`),
  there is no per-mutation error state — errors are folded into a global
  toast and a `undefined` return value — no `onMutate`/optimistic updates,
  no `mutationKey` for dedupe, and double-clicks can fire concurrent
  in-flight POSTs. Article forms (`article-form.tsx:148-176`) further
  compound this by maintaining a parallel local `useState` mirror of
  `barcodes`/`tags`, which can drift from the cache after invalidation.
- **`User.id` typed as `string` but API returns `number`.**
  `src/types/user.ts:5` — already known to have caused a bug. There are
  still loose-equality comparisons that depend on it
  (`split-invoice.tsx:153` uses `==`), and `useUser(id: string)` is fed
  `user.id` from API responses with no normalisation at the API boundary.
  The coercion in `queryKeys.user` masks the lie at the cache layer but not
  in any downstream comparison or URL build.
- **`error.class` substring match is too loose.** `error-handler.ts:19-23`
  does `error.class.includes(key)`. If the backend ever introduces e.g.
  `ArticleTagAlreadyExistsExceptionV2` or
  `ArticleBarcodeAlreadyExistsExceptionStrict`, both keys would match and
  `Object.keys(...).filter(...)[0]` would silently pick the first by
  iteration order. Use exact `===` (or fully-qualified class names).

#### Medium
- **Concurrent error toasts clobber each other.** `setGlobalError('')` is
  called at the start of `errorHandler` (`error-handler.ts:39`), so a
  successful request that resolves while another is failing wipes the
  visible error. Two failures in flight also race — only the last write
  wins, with no queueing.
- **Prefix invalidation in `articles.ts:70-71` is correct but inconsistent
  with `users.ts`.** `invalidateUsers` invalidates `['users']` only, not
  `['user']`, so after `createUser` the individual `useUser(id)` caches keep
  stale `isDisabled`/balance until next refetch. `updateUser` does
  invalidate the single user but not other users that could reference them;
  `createTransaction` does invalidate both, which is the right model —
  `users.ts:70-72` should match.
- **`useArticle(id ?? 0)` builds a key with id=0** when disabled
  (`articles.ts:59`). Harmless because `enabled: false`, but it pollutes the
  cache key namespace and makes the call site read oddly; passing the id
  directly and gating with `enabled: Boolean(id)` would be cleaner.
- **`['tags']` and `['metrics']` and `['metrics','user',userId]` bypass the
  key factory** (`articles.ts:51`, `metrics/resource.ts:26`,
  `user-metrics/resource.ts:8`). `queryKeys.metrics` and
  `queryKeys.userMetrics` exist in the factory but are unused.
  `userMetrics(userId: string)` also doesn't coerce, unlike its sibling
  `user(id)`.
- **No `staleTime` on per-resource queries.** Only the global 15s applies.
  Settings overrides to 5 min (good), but `useArticles`, `useUsers`,
  `useUserTransactions` will refetch aggressively. Likely fine for a kiosk;
  flag for awareness.
- **`fetchArticleByBarcode` calls `invalidateArticles()` on success**
  (`articles.ts:163-173`) even though it's a read. That triggers a refetch
  storm whenever a barcode scan resolves. Should be a plain query (or
  `queryClient.fetchQuery`) without side effects.
- **`playCashSound` is called before the network request resolves**
  (`transactions.ts:67`). Users hear "ka-ching" even when the backend
  rejects. Move into the success branch.
- **`useSettings` traps the loading error inside its `queryFn`.** Because
  `errorHandler` returns `undefined`, the query "resolves" with
  `defaultSettings`, so TanStack Query never sees a failure — it won't
  retry past `queryFn`'s first call (the `retry: 1` policy never engages),
  and `isError` stays false. The same pattern in every other query module
  hides query-level error state from consumers.

#### Low / Nit
- **`useEffectAsync` lives in `services/api.ts:34`** with disabled-deps
  lint, unrelated to API concerns. Dead-adjacent (only `useUser` etc. use
  hooks) — and currently has zero callers in the tree. Delete it.
- **`Tooltip as any` in `metrics.tsx:20`** as `FixedTooltip`. Recharts/React
  19 types issue, but should at least carry a `// TODO` comment with link.
- **`useActiveArticles = useArticles`** alias (`articles.ts:40`) is
  misleading — callers pass `isActive` themselves, so the rename buys
  nothing.
- **`useUserArray = () => useUsers()`** (`users.ts:49-51`) is a no-op alias.
- **`ROUTE_TITLES` in `app.tsx:39-46`** are hard-coded English; not driven
  through `react-intl`. `document.title` should localise via the active
  locale.
- **`SettingsResponse.error`** is duplicated rather than reusing
  `MaybeResponse` (`settings.ts:12-15`).
- **`api.ts` uses `any` pervasively** with eslint-disable; would benefit
  from a generic `<T>` return type even without full validation.
- **`ErrorMessageProps` and its `OwnProps`/`StateProps`/`ActionProps`**
  scaffolding in `error-message.tsx:6-14` is Redux-era cruft — the
  component takes no props.
- **`HashRouter`** is unusual for a modern SPA; if intentional (static
  hosting/kiosk), worth a comment in `app.tsx`.
- **Type coupling**: `transaction.ts` imports `User` and `Article` (fine),
  but `Transaction.user: User` means every transaction list response is
  forced to satisfy the full `User` shape, which can mask API drift.
  Consider a `TransactionUser` projection.
- **No dependency cycles** between `queries/*` and `services/*`: services
  don't import queries, so the graph is clean. Test render imports
  `queries/keys` only, also clean.

### Recommendations
1. **Harden `services/api.ts`**: check `res.ok`, throw a typed `ApiError`
   carrying status + parsed body, accept an `AbortSignal`, narrow `any` to
   `<T>`. This unlocks meaningful `retry`/`isError` behaviour everywhere.
2. **Migrate write-path helpers to `useMutation`** with `mutationKey` and
   `onSuccess: () => queryClient.invalidateQueries(...)`. Start with
   `createTransaction` (highest contention, double-click risk), then
   `addArticle`/`addBarcode`/`addTag`. Keep the imperative wrapper
   temporarily as a thin facade if needed.
3. **Fix `User.id` at the boundary**: either change the type to `number`
   and update consumers, or normalise to `string` in the `queryFn`
   (`String(res.user.id)`). The current half-and-half is fragile.
4. **Replace `error.class.includes(key)` with `===`** and consider a
   discriminated union for known error classes.
5. **Don't swallow errors inside `queryFn`** for read queries — let
   TanStack Query see the rejection so `retry`, `isError`, and `error`
   work. Keep the toast bridge by using a `QueryCache` global `onError`
   instead of in-line `errorHandler` on the read path. The mutation path
   keeps `errorHandler` (or moves into `mutationCache.onError`).
6. **Queue or last-write-stable the global error**: at minimum, drop the
   `setGlobalError('')` reset at the top of `errorHandler` so a successful
   concurrent request doesn't hide a pending failure.
7. **Route every key through `queryKeys`**: drop the three ad-hoc keys
   (`['tags']`, `['metrics']`, `['metrics','user',userId]`), and have
   `userMetrics` coerce `userId` like `user` does.
8. **Move `playCashSound` into the success branch** of `createTransaction`.
9. **Delete `useEffectAsync` and the Redux-era
   `OwnProps/StateProps/ActionProps` scaffolding** in `error-message.tsx`;
   rename misleading aliases (`useActiveArticles`, `useUserArray`).
10. **Localise `document.title`** via `intl.formatMessage` and route message
    ids, instead of the English string table in `app.tsx`.

---

## Components & React Patterns

### Summary
The component layer is mid-migration: server state is on TanStack Query,
routing is on react-router v7 via a v5 shim, but several long-lived
components still feel pre-2020 — class components, ad-hoc inline styles,
render-prop validators, and a number of `eslint-disable
react-hooks/exhaustive-deps` workarounds. Architecture is fine for a
kiosk-scale app; the main risks are stale-closure bugs around mutations and
the cumulative cognitive cost of the routing shim leaking everywhere.

### Strengths
- React 19 is set up correctly: `createRoot` only in `src/index.tsx:18`,
  no `findDOMNode`, no FC `defaultProps`, real `useSyncExternalStore` in
  `src/services/global-error.ts:27`.
- Lazy-loaded metrics with proper `Suspense` boundaries
  (`src/components/metrics/metrics-view.tsx`,
  `src/components/metrics/user-metrics/metrics-view.tsx`).
- `UserCard` and `TransactionListItem` already take whole domain objects,
  removing the previous double-fetch / drilling.
- The accessibility skip-link, `<main id="main-content" tabIndex={-1}>`,
  dynamic document title (`RouteTitle` in `src/app.tsx:49`) and
  `role="alert" aria-live="assertive"` on `ErrorMessage` are well-placed.
- `bricks/Input` uses `React.forwardRef` correctly with `displayName`.
- The shim itself (`src/routing.tsx`) is small, well-commented, and
  preserves a stable `history` object via `useMemo`.

### Findings

#### High
- **`CreateUserTransactionForm` is a class with multiple bugs that
  conversion would fix** —
  `src/components/transaction/create-user-transaction-form.tsx:42`. Inside
  `createTransaction` (line 50) the closure reads
  `this.props.match.params.id`, but more importantly `handleSubmit` already
  gates on `selectedAmount && selectedUser.id` and then calls
  `createTransaction` which re-checks the same thing — fine, but there is
  **no double-submit guard**: rapid Enter on a barcode scanner will fire the
  mutation twice. A hooks version with an `isSubmitting` flag (or
  `useMutation`) is the right fix; nothing about this component requires
  class state.
- **`CurrencyInput` (class) drives state from props with an anti-pattern**
  — `src/components/currency/currency-input.tsx:57`. `componentDidUpdate`
  compares `lastPropValue` to `props.value` to copy props into state. This
  is exactly the case React docs warn against; it loses parent control,
  plus the `// @ts-expect-error` ref forwarding on the `Input` brick (line
  91) only works because `Input` is a `forwardRef`. Convert to a controlled
  component with a single source of truth, or memoise a derived display
  value via `useMemo` — no need for state at all.
- **`useArticleValidator` is called conditionally** —
  `src/components/article/article-form.tsx:140`:
  `disabled={!useArticleValidator(params.amount)}` is inside a child
  render, fine; but in `ArticleValidator`
  (`src/components/article/validator.tsx:28`) the hook is called once per
  render-prop instance inside an array `.map` in
  `ArticleSelectionBubbles` — one hook call per article *every render*.
  That's allowed because the count is stable for a given list, but if
  `usePopularArticles()` returns a different length it breaks the rules of
  hooks. The render-prop wrapper exists only to dodge that — replace with
  a direct `useArticleValidator(item.amount, props.userId)` call in a
  sibling component to make the dependency explicit.
- **Unhandled mutation rejections everywhere** — every call site does
  `await createTransaction(...)` and inspects the return value, but
  `errorHandler` swallows errors and dispatches to the global toast. The
  risk: any `then`/`await` chain that re-runs side effects (navigation,
  state reset) on success will sometimes do nothing silently.
  `PayPalTransaction` (`src/components/paypal/paypal-transaction.tsx:23`)
  is the worst — the effect deps array is `[paidAmount]` with a disable
  comment; if the user revisits the route with the same amount, the side
  effect won't re-run, and there's no `isSubmitting` guard.

#### Medium
- **`Scanner` class is reasonable but stale-closure-prone** —
  `src/components/common/scanner.tsx:30`. `detection` reads
  `this.state.barcode` *after* `setState`, so `onChange` is called with the
  previous `barcode` value, not `maybeBarcode`. Either move `onChange`
  into the `setState` callback or call it with `state.maybeBarcode`
  directly. Could be a hooks component using `useRef` for the rolling
  buffer; document listener registration is the only class-shaped thing
  here.
- **`Toast` is a class for no real reason** —
  `src/components/common/toast.tsx:16`. Pure timer-driven visibility; a
  ~15-line hooks version with `useEffect` cleanup is strictly better and
  avoids storing the timer in state (which triggers a needless re-render
  on mount).
- **Routing shim has metastasised** — 20 files import from `../../routing`
  (count above). `ScrollToTop`, `BackButton`, `CreateUserTransactionLink`,
  `UserDetailsSeparator`, `IdleTimer`, `UserDetailsHeader` all use
  `withRouter` purely to read `location.pathname` or call `navigate(-1)`.
  Each of those is a 2-line hook in v7. The shim is fine as a *bridge*,
  but new code (and trivial leaf components) shouldn't be consuming it.
  Particularly egregious: `src/components/common/scroll-to-top.ts` is a
  one-liner that needs only `useLocation`.
- **`UserDetailsSeparator` types as `any`** —
  `src/components/user-details/user-details-separator.tsx:8` returns `any`
  to silence the early-null return — the typed return is
  `React.JSX.Element | null`.
- **`useEffect` stale-deps disables in mutation-adjacent code** —
  `src/components/paypal/paypal-transaction.tsx:36`,
  `src/components/article/article-tag-filter.tsx:27`,
  `src/components/transaction/split-invoice/split-invoice.tsx:79`,
  `src/components/user/edit-user-form.tsx:49`,
  `src/components/settings/scaling-buttons.tsx:29`. Most are benign
  (initialising state from props once), but they hide real bugs from the
  linter. The `edit-user-form` reset on `userId` change is fine, but
  should use a `key` prop instead.
- **`UserDetails` shows raw `LOADING...`** —
  `src/components/user/user-details.tsx:41`. Kiosk UX is fine without a
  spinner, but a raw English string with no `FormattedMessage` is a
  localisation regression. Either render `null` (cached settings make the
  flash trivial) or use a translated skeleton.
- **`FormField` generates IDs via `Date.now()`** —
  `src/bricks/input/input.tsx:28`. Out of scope, but it leaks into
  `article-form.tsx` form labels; React 19's `useId()` is the right
  primitive and avoids hydration mismatches.
- **Heading hierarchy skips levels** — Layout has no `<h1>`.
  `UserDetailsHeader` starts at `<h2>`, `metrics.tsx` is all `<h2>`, only
  `user-metrics/metrics.tsx:65` and `split-invoice.tsx:194` use `<h1>`.
  Screen readers can't navigate. Each routed view should own exactly one
  `<h1>` (probably driven by `RouteTitle`).
- **Inline styles for repeated layout** — 43 inline `style={{}}` blocks.
  The high-frequency offenders (margins on `<NavLink>`, the rotate-180
  arrow, fixed-position toast) appear in 3+ places. These are CSS classes
  waiting to happen. `header-menu.tsx` alone has six inline style objects,
  two duplicated. Not a correctness issue, but `bricks/*.module.css`
  already exists — extend that pattern.

#### Low / Nit
- **`ArticleEditFormView` and `ArticleScanner` swallow errors** —
  `src/components/article/article-scanner.tsx:31` catches and writes
  `':('` to the toast. Funny, not localised.
- **Dead-ish exports** — `BackButton`
  (`src/components/common/back-button.tsx`) and
  `CreateUserTransactionLink`
  (`src/components/user/create-user-transaction-link.tsx`) have no
  consumers (`grep` returns only their own file).
  `UserArticleTransactionLink` in `user-router.tsx:75` is also unused
  outside of definition. Delete or wire up.
- **`UserSelection` ignores `disabled` and `getString`** — declared in
  `Props` (`src/components/user/user-selection.tsx:8`) but never read.
- **`ConnectedCreateCustomTransactionForm`** — the exported name is
  misleading; the underlying class is `CreateUserTransactionForm`
  (user-to-user), not "custom transaction". And `CreateCustomTransactionForm`
  is a separate component. Confusing.
- **`PayPalTransactionForm` is `React.memo`'d with no measurable benefit**
  — `src/components/paypal/paypal-transaction-form.tsx:15`; props are
  primitives, and its parent re-renders only on route change.
- **`useUserArray` is just `useUsers()`** — `src/queries/users.ts:49`. Dead
  alias.
- **`TransactionListItem` accepts `first` prop nobody uses** —
  `src/components/transaction/transaction-list-item.tsx:55`, callers pass
  it (`transaction-table.tsx:43`, `user-details.tsx:71`) but the component
  ignores it.
- **`MetricsView` Suspense fallback is the string `"..."`** — fine for a
  kiosk but un-styled and un-localised.
- **`ArticleScanner` calls `createTransaction` without `await`** —
  `src/components/article/article-scanner.tsx:26`. Fire-and-forget is
  intentional for the kiosk flow, but means the toast says "fetched"
  before the transaction lands; on failure the user sees a success toast
  followed by the global error.
- **Form `onSubmit` patterns are mostly idiomatic** — good. One nit:
  `ListInput` (`src/components/article/article-form.tsx:262`) submits an
  empty value when `item` is empty, which is then validated server-side
  only.

### Recommendations
1. Convert the four class components (`Scanner`, `Toast`, `CurrencyInput`,
   `CreateUserTransactionForm`) to hooks. `Toast` and `Scanner` are quick
   wins. `CurrencyInput` should go controlled while doing so.
   `CreateUserTransactionForm` should adopt a `useMutation` (or at minimum
   an `isSubmitting` ref) to fix the double-submit hole.
2. Stop using `withRouter`/`RouteComponentProps` in *new* code and migrate
   the trivial leaf consumers (`ScrollToTop`, `BackButton`,
   `UserDetailsSeparator`, `IdleTimer`, `CreateUserTransactionLink`) to
   direct v7 hooks. Keep the shim for `CreateUserTransactionForm`,
   `PayPalTransaction`, `UserDetails`, and the routers until those are
   rewritten.
3. Audit the eight `eslint-disable` deps comments — at least
   `paypal-transaction.tsx`, `edit-user-form.tsx`, `article-tag-filter.tsx`,
   and `split-invoice.tsx` are hiding effects that should be replaced with
   event-handler-driven updates or `key`-based remounts.
4. Pick one of (a) cached query data fronted by
   `placeholderData`/`keepPreviousData`, or (b) explicit `isLoading`
   branches, then apply consistently. The current `data ?? []` pattern
   works for the active-user list but shows blank panes on first
   navigation to user details.
5. Decide on inline-styles vs CSS modules and convert at least the
   duplicate patterns (`navLinkStyle`, rotated-arrow style, the
   fixed-position toast wrapper). Leaving 43 ad-hoc style objects
   scattered will keep biting.
6. Delete confirmed dead code: `BackButton`, `CreateUserTransactionLink`,
   `UserArticleTransactionLink`, `useUserArray`, `TransactionListItem`'s
   `first` prop, unused `UserSelection` props.
7. Heading audit: each routed view gets one `<h1>`; demote current
   `<h2>`s. This is a 10-minute fix that materially improves SR
   navigation.
8. Replace `FormField`'s `Date.now()` ID with `useId()` (small bricks
   change, outside review scope but feeds article form).

---

## Design System (bricks) & Accessibility

### Summary
The bricks layer has a solid accessibility foundation: every SVG is
decorative-correct (`aria-hidden`/`focusable="false"`), the global
`:focus-visible`, skip-link, and reduced-motion rules are in place, the
Modal does focus-trap + restoration with the right ARIA, and icon-only
buttons have a thoughtful title/aria-label precedence helper. The biggest
soft spots are component API discipline (`React.FC<any>`, dead/inaccessible
`Tag`, lax `ButtonProps`), the Modal Backdrop being a tabbable `<button>`
outside the dialog with a hardcoded English title (plus a `backDropTile`
typo), touch-target sizes well below 44 px on the mobile/kiosk breakpoint,
and unaudited dark-theme contrast (notably nav inactive links).

### Strengths
- Decorative SVG hygiene is 100%: every `<svg>` in `src/bricks/icons/**`
  and `src/bricks/theme/{dayMode,nightMode}.tsx` carries
  `aria-hidden="true" focusable="false"`.
- `useIconButtonLabel` (`src/bricks/button/button.tsx:63-73`) gets
  title-precedence right: a consumer `title` wins, otherwise falls back to
  an intl-localized default. Prevents the common "title plus aria-label
  both read out" footgun.
- Modal focus trap is honest: remembers `previouslyFocused`, tabs to first
  focusable (or the dialog itself via `tabIndex={-1}`), wraps Shift+Tab,
  restores focus on unmount, and listens for Escape and `popstate`.
- Global `prefers-reduced-motion` block (`theme.css:35-44`) covers
  `*`/`::before`/`::after` and forces `scroll-behavior: auto`, which
  correctly neutralizes the only authored transition (`.skip-link`).
- Contrast pass on light theme is real, not cosmetic: `--textSubtile`,
  `--buttonGreenFont`, `--buttonRedFont`, `--redText`/`--greenText`, and
  `--buttonHighlightBackground` are all explicitly chosen for ≥4.5:1, with
  comments documenting the intent.
- a11y strings are in `src/locales/en.ts` (`SKIP_TO_CONTENT`,
  `MAIN_NAVIGATION`, `THEME_TOGGLE`, `ACCEPT`, `CANCEL`, `CLOSE_DIALOG`),
  and the `ThemeSwitcher` and Accept/Cancel buttons resolve them via
  `useIntl`.
- E2E suite covers six routes including dynamically-created user
  detail/edit/send-money/article-form, and a real skip-link keyboard test
  (`e2e/a11y.spec.ts:68-75`).

### Findings

#### High
- **Modal Backdrop is a bare `<button>` with a hardcoded English `title`
  as its only accessible name.** Default `backDropTile = 'close'`
  (`src/bricks/modal/modal.tsx:72`), and the only consumer that passes it
  does so as the literal string `"close"`
  (`src/components/user/create-user-inline-form.tsx:45`). The element has
  no visible text and no `aria-label`. Screen readers will announce
  `"close, button"` in English regardless of locale, and the second Modal
  consumer (`src/components/user/user-selection.tsx:51`) doesn't pass
  `backDropTile` at all. Localize via intl (`CLOSE_DIALOG` already exists)
  and consider `<div role="button">` + Esc handling, or an explicitly
  labelled close button inside the dialog — a backdrop button is also
  conceptually wrong (clicking outside the dialog isn't a button
  activation).
- **Touch targets below 44 × 44 CSS px on the mobile breakpoint.** `.fab`
  is `2rem × 2rem` (`src/bricks/button/button.module.css:51-52`); with the
  base `font-size: 18px` for screens <75em (`theme.css:133`), that's
  **36 × 36 px**. AcceptButton/CancelButton, the add-user FAB, and any
  other `fab` instance fail WCAG 2.5.5 (and the new 2.5.8 AA minimum
  target of 24 px is met, but the 44 px kiosk-grade target is the real
  bar here). `.tab` and `.button` padding (`0.5rem`) likewise yield ~26 px
  text height; only the laptop/kiosk breakpoint (`min-width: 75em` → 24px
  base) brings FABs to 48 px.
- **Modal `label` defaults to literal English `'Dialog'`**
  (`src/bricks/modal/modal.tsx:73`), and
  `src/components/user/user-selection.tsx:51` renders
  `<Modal {...modalProps} id="user-selection">` with no `label`. That's an
  unlocalized, generic `aria-label="Dialog"` on a real dialog. Either
  require `label` (make the prop non-optional) or default to
  `intl.formatMessage({id: 'CLOSE_DIALOG'})` / a dedicated `DIALOG` id.
- **Dark-theme contrast regressions.** Spot-checking `theme.css:93-118`:
  `--textSubtile: #59687c` on `--mainBackground: #25333f` ≈ **3.1 : 1** —
  used in `header-nav` for inactive nav links/icons
  (`header-nav.module.css:18-32`), so this fails AA 4.5:1 for normal text.
  `--buttonRedFont: #f54963` on `--buttonRedBackground: #544052` is also
  borderline (~3.2:1). The conformance doc already flags dark theme as a
  follow-up, but the *inactive nav links on every page* are the loud one
  to fix first.

#### Medium
- **`Tab: React.FC<any>`** (`src/bricks/button/button.tsx:109`). Loses all
  typing (the `to`, `style`, `className`, `active`, `activeClassName`
  props, plus `NavLink`'s own props are unchecked). Replace with
  `React.ComponentProps<typeof NavLink> & { active?: boolean;
  activeClassName?: string }`. Same `any` problem in `FormField`
  (`src/bricks/input/input.tsx:22`) and `FlexProps.grow?: any`
  (`src/bricks/layout/layout.tsx:14`).
- **Dead/inaccessible `Tag` brick.** `src/bricks/button/button.tsx:136-152`
  renders two bare `<button>` elements with only `<CancelIcon />` and
  children. The first button has no accessible name at all; the second
  relies on string children that may or may not be text. It's not used
  anywhere in the app and not exported from `src/bricks/index.ts`. Delete
  it, or fix it before someone wires it up.
- **Conformance doc drift on a11y test counts and scope.**
  `specs/accessibility-conformance.md:8-15` lists four scanned screens,
  but `e2e/a11y.spec.ts:38-66` adds *four more* (user detail, edit user,
  send money, article form) via the feature-screens test. The doc
  undersells coverage and doesn't mention that scans don't currently run
  against the dark theme — minor but a real drift.
- **E2E suite uses `waitForTimeout(1500)` / `(800)` as the loading
  signal** (`e2e/a11y.spec.ts:21, 50, 56, 60, 64`). Flaky and slow. Wait
  on a network-idle, route element, or `expect(...).toBeVisible()`
  instead. The suite also never exercises dark theme, modal-open state,
  keyboard nav beyond the skip link, or any tab-focus traversal — all
  explicitly listed as targets in the brief.
- **`Modal` focus restoration has no fallback.**
  `previouslyFocused.current?.focus?.()`
  (`src/bricks/modal/modal.tsx:110`) silently no-ops when the previous
  element was unmounted (e.g. a list row that re-rendered while the modal
  was open). Focus then lands on `<body>`. Falling back to
  `document.getElementById('main-content')?.focus()` would be cheap
  insurance.
- **`Modal` doesn't guard against multiple stacked instances.** Each
  mounted modal attaches its own keydown trap and Esc listener via
  `useModal`; with two open modals, Escape will close *both* (`useModal`
  instances both call `handleHide`). Not exercised in this codebase
  today, but the design allows it.

#### Low / Nit
- **`backDropTile` typo** (`modal.tsx:64, 72`) for `backDropTitle`. Also
  the default is the literal string `'close'`, not an intl id.
- **`useModal.handleEsc` uses `e.keyCode === 27`** (`modal.tsx:34-37`).
  `keyCode` is deprecated; use `e.key === 'Escape'`.
- **`handleHide` accidentally receives the click MouseEvent** when used
  as `onClick={handleHide}` (`modal.tsx:131`). `popState` becomes truthy
  (the event object), which happens to be the intended default — but it's
  a footgun. Prefer `onClick={() => handleHide()}`.
- **`Button` types `ref?: any`** (`button.tsx:20`) even though the file
  already uses `forwardRef<HTMLButtonElement, ButtonProps>`. The explicit
  `ref` prop is unused and `any`-typed; remove it.
- **`FormField` id uses `Date.now() + 'di'`** (`input.tsx:28`). Works but
  two FormFields mounted in the same tick share an id. `React.useId()` is
  the correct primitive on React 19.
- **`!important` color overrides in `header-nav.module.css:19-32` and
  `button.module.css:86`.** Both override `a:visited/hover` color rules
  from `theme.css:317-322`. Cleaner to scope the theme `a` rule (e.g.
  `:where(a)`) so brick CSS doesn't need `!important`.
- **`bricks/index.ts` exports `ThemeProvider` via the
  `theme/theme-provider` glob (line 2) but doesn't export `ThemeSwitcher`
  or `Tag` explicitly.** Actually `ThemeSwitcher` *is* exported through
  the `*` re-export. The barrel mixes named and `*` re-exports — consider
  one style. `Backdrop` is exported as a side effect of `useModal`'s file
  but not via the barrel, so it can't be accidentally rendered outside
  `Modal`.
- **`ScrollContainer` is a horizontal `overflow-x: auto` div with no
  keyboard affordance and no `tabIndex` / `role`**
  (`scroll-container/scroll-container.tsx`, `.module.css`). On the
  nav-tab bar it's fine because the children are focusable NavLinks; if
  used elsewhere for non-interactive content it'd be a keyboard trap-out.
  Document the constraint or add `tabIndex={0}` when no focusable
  descendants exist.
- **`AlertText` uses positive/negative *color alone* to convey balance
  sign** (`text/text.tsx:23-33`). Color-vision-deficient users get no
  other cue. Pair with a sign symbol or screen-reader-only text
  ("negative balance").
- **`Logo` `<svg aria-hidden="true">`** is correct for the small inline
  logo, but the main brand logo in the header almost certainly wants a
  real accessible name (`role="img"` + `aria-label="Strichliste"`). Worth
  checking the one in `HeaderMenu`.
- **`backDropTile = 'close'` and `label = 'Dialog'` defaults bypass i18n**
  entirely if a consumer forgets the prop. Either require both or default
  them via `useIntl` inside `Modal`.

### Recommendations
1. Fix Modal labelling end-to-end: rename `backDropTile` → `backDropTitle`,
   drop the English defaults, default `label` and the backdrop title to
   `intl.formatMessage` calls, and remove the `Backdrop` as a `<button>`
   (use a `<div>` with a discrete labelled close button inside the dialog,
   or `role="presentation"` + Esc-only dismissal). Also pass `label` from
   `user-selection.tsx`.
2. Bump touch targets on the mobile breakpoint: `.fab` to ≥2.75rem,
   `.button`/`.tab` padding to ≥0.75rem 1rem, so kiosks and tablets at
   the 18 px base meet 44 × 44.
3. Run the contrast audit against `html[data-theme='dark']` and fix
   `--textSubtile` (used for inactive nav links — most visible failure)
   and `--buttonRedFont`/`--buttonRedBackground`. Add `--buttonDisabled`
   to the dark palette while there.
4. Replace `React.FC<any>` (Tab, FormField) and `grow?: any` with real
   types; drop `ref?: any` on `ButtonProps`. Delete the unused `Tag` brick
   (or rewrite both buttons with intl labels and proper roles before
   re-exporting).
5. Stabilize `e2e/a11y.spec.ts`: replace `waitForTimeout` with
   element/network waits; add a dark-theme scan loop (toggle
   `localStorage.SELECTED_THEME='dark'` before `goto`); add a modal-open
   scan; add a Tab-traversal test that confirms focus stays within an
   open modal.
6. Use `React.useId()` for `FormField`, switch Modal's `keyCode` to
   `e.key`, wrap modal `onClick={handleHide}` callbacks to drop the event
   arg, and add a `document.getElementById('main-content')` focus
   fallback in Modal's cleanup.
7. Sync `specs/accessibility-conformance.md`: list all eight scanned
   screens, the keyboard test, the `Tag` brick as a known gap, and the
   dark-theme audit as still outstanding with the specific tokens that
   need work.

---

## Build, Tooling, Tests & CI

### Summary
A clean, modern Vite + Vitest + Playwright setup that does the basics right
but stops short of senior-grade rigor. Several CRA-era escape hatches are
still in place (lint debt suppressed, `useUnknownInCatchVariables: false`,
`_initialState` Redux vestige), and a few real risks are unaddressed —
chiefly Playwright pointed at a live shared API in CI, no PWA/bundle-analyzer
despite a manifest, and a tag-release pipeline that ships unlinted,
untypechecked artifacts.

### Strengths
- Single source of truth for tooling: ESLint flat config, Prettier inline
  in `package.json`, Husky + lint-staged, all consistent.
- Vitest config piggy-backs on `vite.config.ts` (one config, one resolver,
  CSS true, jsdom, RTL cleanup), and explicitly excludes `e2e/` so the two
  runners do not collide.
- CI is properly gated (`ci.yml`): lint → typecheck → unit → build, plus a
  parallel Playwright job with `--with-deps chromium` and an uploaded
  `playwright-report` artifact. `concurrency.cancel-in-progress` is set.
- Playwright config is honest about its environment: comments explain the
  shared demo backend, retries=2 on CI, `trace: 'on-first-retry'`,
  `forbidOnly` in CI, separate `github`/`html` reporters.
- `base: './'` is correct for an HMR/sub-path-deployable hash-routed SPA,
  and the lazy-loaded metrics view
  (`src/components/metrics/metrics-view.tsx:3`) keeps recharts out of the
  initial bundle.
- a11y is wired into CI via `@axe-core/playwright` with WCAG 2.1 A/AA
  tags, plus a keyboard skip-link check (`e2e/a11y.spec.ts:68`).

### Findings

#### High
- **Playwright in CI hits the live demo API** —
  `playwright.config.ts:43` hardcodes `https://demo.strichliste.org/api/`.
  Any demo outage, schema change, or rate-limit fails master PRs unrelated
  to the change. `fullyParallel: false`, `workers: 1` already concede this
  is a stateful shared backend. Recommend a recorded/mocked tier (MSW or
  Playwright route mocking) for CI gating and keep live-API runs as a
  nightly job or manual workflow_dispatch.
- **`package.yml` release pipeline skips quality gates** —
  `.github/workflows/package.yml:29-33` runs only `npm test` and
  `npm run build`. No `lint`, no `typecheck` (build does
  `tsc --noEmit && vite build`, but lint is skipped), no E2E. A tag push
  can ship a release that would fail PR CI. Either call the reusable
  quality job or copy its steps.
- **`reportUnusedDisableDirectives: false` + `no-explicit-any: 'off'` +
  `no-unused-vars: 'warn'`** — `eslint.config.js:18,55,59` together mean:
  `any` is unrestricted, unused vars never fail the build, and stale
  `eslint-disable` comments are invisible. The comment is honest about
  why, but this is a permanent hole. At minimum, scope the `any`
  allowance to legacy folders via a second config block, and flip
  `no-unused-vars` to `error` for new files.

#### Medium
- **`useUnknownInCatchVariables: false`** — `tsconfig.json:19` reverts TS
  4.4+ safety. This exists because the catch sites assume `Error`-shaped
  values (likely Redux-era thunks / axios). It hides real bugs where a
  `string` or unknown rejection bypasses `.message` access. Flip to
  default and narrow the few real catches; it is a one-afternoon cleanup.
- **`build: tsc --noEmit && vite build`** runs the typechecker serially
  in the build script while a separate `typecheck` step also runs in CI
  — duplicate work on every PR. Either drop `tsc --noEmit` from `build`
  (CI already typechecks) or drop the dedicated step.
- **No bundle analyzer / size budget** — recharts + react-intl + howler
  are heavy; only metrics is split. `vite.config.ts` has no
  `rollup-plugin-visualizer` and `build.chunkSizeWarningLimit` is
  default. Worth adding given the kiosk target.
- **`sourcemap: true` in production** — `vite.config.ts:12` ships full
  sourcemaps to the public CDN. Fine for a self-hosted strichliste, but
  document the choice or switch to `hidden` and upload to error tracking.
- **Playwright a11y uses `waitForTimeout`** —
  `e2e/a11y.spec.ts:21,49,57,61,64` sleeps 800-1500ms instead of awaiting
  a network-idle or a visible landmark. Flaky on slow CI; replace with
  `waitForLoadState('networkidle')` or specific locator waits.
- **`spec-configs/render.tsx` carries a dead `_initialState` parameter**
  — `src/spec-configs/render.tsx:35`. Every call site still passes it.
  The comment acknowledges the debt; a one-PR codemod removes ~33 call
  sites and the underscore.
- **No `coverage` config in Vitest** and no `--coverage` step in CI. For
  a financial-balance app with 46 unit tests over ~8 specs, coverage
  visibility is cheap insurance.
- **Test count claim is off** — there are 46 unit `it`/`test` calls
  across 8 spec files (transaction/validator alone has 12), not 33. E2E
  is 5 explicit + 4 from the route loop = 9. Worth fixing the
  README/roadmap if it cites the old number.

> **Note from the compiler:** Vitest's runner reports `Tests 33 passed (33)`
> on the current main; the reviewer's higher count likely includes
> nested/skipped `it` calls. Either way, **coverage visibility is the
> actionable item**, not the count.

#### Low / Nit
- **`index.html` is bare** — `index.html:1-20` has no description meta,
  no `og:*`, no apple-touch-icon link, and the favicon points to a
  128x128 png rather than `/favicon.ico` (which exists). The
  `manifest.json` lacks `theme_color`/`background_color`/`name`
  localization; it is a CRA-era dump of every icon size.
- **No `.env.example`** — `VITE_API` is documented only in
  `src/vite-env.d.ts:4`. A `.env.example` with both demo and self-hosted
  (`/api/`) variants would help new contributors. `.env.development`
  hardcoding the demo API also means `npm run dev` silently talks to a
  public stateful backend; at least add a one-line README warning.
- **`.npmrc` is just the public registry** — fine, but if
  `legacy-peer-deps` was needed for React 19 / react-intl 7 / recharts 2
  it should be a deliberate, commented entry rather than rediscovered on
  the next upgrade.
- **`.gitignore`** missing `.vite/`, `*.log`, `.env`,
  `stats.html` (if analyzer added), and OS files beyond `.DS_Store`.
  Minor.
- **`workers: 1`** in Playwright config is defensible against the shared
  API but means E2E wall-clock grows linearly with the suite; once
  mocked, raise this.
- **`recharts ^2.13.0`** — v3 has been out for some time; the user
  already flagged this. `react-intl 7` is current. `@axe-core/react
  ^4.11` is dev-only and dynamically imported in `src/index.tsx:1` —
  good.
- **CI uses Node 20** in both workflows — fine, but no `engines` field in
  `package.json` to enforce it locally.
- **`noUnusedLocals: false`** in `tsconfig.json:21` overlaps with the
  lint-warn for `no-unused-vars`. Pick one signal.
- **`react-intl` `IntlProvider` with `locale="en"`** in
  `src/spec-configs/render.tsx:42` — fine for unit tests but masks
  plural/format bugs in non-English locales; consider a
  `renderWithIntl(locale)` variant.
- **No `headers`/CSP** set anywhere; `vite preview` is the prod-like
  server in E2E but no `Cache-Control` discipline is documented for the
  static host.

### Recommendations
1. Replace the live-API Playwright dependency with mocked routes for the
   PR gate; keep a separate nightly job against the demo API. Single
   biggest fragility reduction.
2. Make `package.yml` reuse the `quality` job from `ci.yml` (or convert
   it into a reusable workflow) so releases cannot bypass lint/E2E.
3. Tighten ESLint: scope `no-explicit-any: 'off'` to a `legacy/`
   overrides block, flip `no-unused-vars` to `error`, turn
   `reportUnusedDisableDirectives` back on, and do a one-pass cleanup.
4. Remove `useUnknownInCatchVariables: false` and the duplicate
   `tsc --noEmit` in the `build` script in the same PR; both are
   CRA-era artifacts.
5. Drop the `_initialState` parameter from `renderWithContext` and its
   ~33 call sites; trivial, removes ongoing confusion.
6. Add `rollup-plugin-visualizer`, a Vitest `--coverage` step, and a
   `.env.example`. Consider `vite-plugin-pwa` given the existing
   manifest and kiosk target.
7. Replace `page.waitForTimeout` calls in `e2e/a11y.spec.ts` with
   deterministic waits before raising Playwright workers.

---

## Security & Risk Surface

### Summary
Read-only kiosk-style SPA with a thin fetch wrapper to a same-origin JSON
backend. No `dangerouslySetInnerHTML`, no auth/credentials handling in the
client, all rendering goes through React text nodes or `react-intl`.
**Low overall, with ~3 medium and several low findings**; nothing
exploitable from the network in a typical kiosk deployment, but several
robustness gaps (no HTTP status check, unencoded path params, double-submit)
deserve cleanup.

### Strengths
- No `dangerouslySetInnerHTML` or `innerHTML` writes anywhere in `src/`
  (`src/components/transaction/__tests__/user-to-user-validator.spec.tsx`
  matches are test-only).
- All user/article/comment strings go through React text rendering or
  `<FormattedMessage>` — safe from HTML injection.
- `react-intl` falls back to the raw `id` on missing messages, but the
  IDs that flow into `setGlobalError` are all hard-coded string literals
  in `src/queries/*.ts`, never derived from the backend body — so
  missing-key fallback only ever renders a developer-controlled token.
- `@axe-core/react` is properly behind `import.meta.env.DEV` in
  `src/index.tsx:12`; verified absent from `build/assets/*.js`.
- No service worker remnants in `src/`, `public/`, or `index.html` — the
  CRA registration was cleanly removed.
- TanStack Query keys are centralised (`src/queries/keys.ts`) and
  invalidations are consistent; mutations correctly invalidate both the
  user list and the user-detail/transactions caches
  (`src/queries/transactions.ts:52`).
- Modal uses `history.pushState(null, document.title,
  window.location.href)` (`src/bricks/modal/modal.tsx:25`) — pushes the
  *current* URL, so `back()` cannot navigate away from the SPA. Safe.
- E2E tests create uniquely-named users
  (`e2e-${Date.now()}-rand`) and only mutate their own balance
  (`e2e/smoke.spec.ts:11`) — non-destructive to existing demo data.
- No sensitive data in `localStorage` — only `SELECTED_THEME`
  (`light`/`dark`) and `strichliste_ui_scaling` (numeric); both parsed
  defensively (`Number(...)`, default `16`).

### Findings

#### High
- *(none)*

#### Medium
- **No HTTP status check; `res.json()` on any response** —
  `src/services/api.ts:10,20,24,30`. A 500/502/HTML error page or a proxy
  login page will throw a `SyntaxError` during JSON parsing, which
  `errorHandler` catches and converts to `defaultError`. Acceptable, but:
  a 200 with a non-error JSON body that lacks `error` *and* the expected
  payload key (e.g. `{}`) silently returns `undefined` to callers, which
  then read `data?.article`/`data?.user` and quietly do nothing without
  surfacing any toast. **Risk:** confusing silent failure during backend
  outages; cashier may believe a transaction succeeded.
- **Unencoded path/query parameters** — barcode and tag/name strings are
  interpolated raw into URLs:
  - `src/queries/articles.ts:165` `get(\`article/search?barcode=${barcode}\`)`
  - `src/queries/articles.ts:108,138` POST URLs use `${id}` (numeric, fine).
  - `src/queries/transactions.ts:40`
    `user/${userId}/transaction?offset=${offset}&limit=${limit}` —
    numeric, fine.
  A barcode containing `&`, `#`, `?`, or `+` will corrupt the query
  string (e.g. `123&active=false` ends up adding a second query param).
  The backend is unlikely to act on injected params destructively for
  `GET /article/search`, but the request semantics change. **Risk:**
  functional (wrong/no article returned, scanner misbehaves); not a
  security exploit given no auth model. Fix: `encodeURIComponent(barcode)`
  and same for any other free-form path/query input. `src/queries/users.ts:17`
  already uses `URLSearchParams` correctly — apply that pattern elsewhere.
- **No double-submit / debounce on transaction POSTs** —
  `createTransaction` and the split-invoice loop
  (`src/components/transaction/split-invoice/split-invoice.tsx:53-67`)
  have no idempotency key and no per-submit disabled latch.
  `submitSplitInvoice` awaits sequentially (good), but `AcceptButton` is
  only `disabled={!submitIsValid()}` (`split-invoice.tsx:293`) —
  `submitIsValid` does not flip while the loop is running, so a second
  click during the await will start a second loop and double-debit every
  participant. `ArticleScanner` also fires `createTransaction` per Enter
  keypress with no in-flight guard (`article-scanner.tsx:19-33`).
  **Risk:** duplicate transactions on rapid second click / repeated scan;
  this is the most likely real-world bug on the list. Fix: disable while
  `isLoading`, or guard with a React ref / mutation state.

#### Low / Nit
- **Source maps ship to production** — `vite.config.ts:12`
  `build.sourcemap: true`; verified `build/assets/*.js.map` exists. Fine
  for a self-hosted kiosk LAN, but on any internet-reachable deployment
  it exposes original TS source and comments. Document the tradeoff or
  gate behind `mode === 'development'`.
- **`errorHandler` substring match on `error.class`** —
  `src/services/error-handler.ts:19-21` uses `error.class.includes(key)`.
  If two error keys are substrings of each other (e.g. a future
  `ArticleTagException` vs `ArticleTagAlreadyExistsException`) and
  `Object.keys` returns them in the wrong order, the wrong message could
  fire. Also, the iteration order is insertion order so a hostile/buggy
  backend could choose any `error.class` containing one of the keys to
  force a message of its choosing. Impact: cosmetic — messages are all
  hard-coded translation IDs that the operator might find misleading.
  Prefer exact equality.
- **Global error singleton state** — `src/services/global-error.ts` is
  module-level. In production this is fine; under Vite HMR the module
  may be re-evaluated and listeners orphaned (stale subscriptions). No
  leak between sessions (it's per browser tab), but consider
  `import.meta.hot?.invalidate()` or
  `if (import.meta.hot) import.meta.hot.dispose(...)` if HMR errors
  appear in dev.
- **`scanner.tsx` listens on `document` keydown globally** —
  `src/components/common/scanner.tsx:23,30`. It accepts any printable
  `[a-zA-Z0-9]` keystroke and on Enter (after >6 chars) fires
  `onChange`. While the user is on `/user/:id`, a long manually-typed
  sequence ending in Enter will trigger `fetchArticleByBarcode` and then
  `createTransaction(userId, {articleId})`. This is the documented kiosk
  UX (hardware barcode reader), but anyone with physical keyboard access
  can synthesise a "scan" by typing fast. Out-of-scope for a kiosk
  threat model; flagging for awareness.
- **PayPal route trusts URL params** —
  `src/components/paypal/paypal-transaction.tsx:18-19`. `userId` and
  `amount` come straight from the route; anyone who can craft
  `#/.../paypal/.../<amount>` and reach that view fires a deposit. The
  backend is the actual authority, but document that this assumes the
  PayPal redirect URL is signed/verified server-side.
- **`@formatjs/intl` raw-id fallback** — confirmed in
  `node_modules/@formatjs/intl/lib/src/message.js:74` that missing keys
  render the raw `id` as text. All IDs in `setGlobalError(...)` are
  hard-coded literals — safe today, but if a future refactor passes a
  backend string into `setGlobalError` directly, it would appear as a
  banner. Worth a comment.
- **5 moderate npm-audit advisories are all dev-only**
  (`vite`/`esbuild`/`vitest`/`@vitest/mocker`/`vite-node`) — not
  recharts. Fix requires Vite 6+/Vitest 4 (semver-major). Zero runtime
  exposure; only affects the dev server. Track but no urgency.
- **`window.localStorage.getItem('SELECTED_THEME')` in `metrics.tsx:23`**
  duplicates the theme-context lookup — minor coupling, not a security
  issue.

### Recommendations
1. **Fix double-submit on transactions** — disable `AcceptButton` while
   `isLoading`, and add an in-flight guard in `ArticleScanner`
   (`article-scanner.tsx`). This is the only finding with realistic
   operational impact.
2. **Encode path/query inputs** — switch `src/queries/articles.ts:165`
   to `URLSearchParams` (matching `users.ts:17`); add
   `encodeURIComponent` for any free-form ID interpolated into paths.
3. **Add an HTTP status check to `fetchJson`/`get`/`post`/`restDelete`**
   in `src/services/api.ts` — throw on non-2xx so `errorHandler.catch`
   surfaces a real banner instead of silent `undefined`. Optionally
   `mode: 'cors'` and `credentials: 'same-origin'` on all four
   (currently only `post` sets `mode`).
4. **Exact-match `error.class`** in `src/services/error-handler.ts:19`
   (or document the substring-match contract with the backend).
5. **Decide on sourcemaps**: keep for kiosk LAN deploys, disable for any
   public-facing build (gate by env).
6. **Schedule a Vite 6 / Vitest 4 bump** to clear the moderate audit
   advisories — purely dev-server hygiene, no rush.
7. **Optional**: add a tiny `setGlobalError` type guard so only known
   literal IDs can be passed (template-literal type or const-enum),
   preventing the "backend string leaks into banner" footgun.

---

## Appendix: Review methodology

Five `general-purpose` agents were dispatched in parallel, each with a
fixed scope (paths only, no overlap), a structured Markdown output format,
and explicit instructions to read-only review (no code changes). The
sections above are each agent's verbatim output; the executive summary
and prioritized action list at the top of this document are a compilation
synthesised from the cross-cutting themes across the five reviews.
