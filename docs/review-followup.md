# Follow-up Review — Post-Refactor Verification

A second multi-agent review, this time stratified by **expertise level** rather than by code area:

- **Junior FE** — fresh-eyes peer review (readability, surface bugs)
- **Senior FE** — design and patterns (mutation seams, hook idioms, types)
- **Principal** — strategic / systems-level (contracts, debt, next bets)
- **A11y specialist** — WCAG 2.1 AA audit (focus, announcements, contrast, kiosk)

Scope: the 10 most recent commits on `upgrade`, with `docs/review.md` as the prior baseline.

> Note: the panel includes one factual error — Principal said `.github/workflows/package.yml` skips lint/typecheck. It actually runs lint, typecheck, unit tests, and build; only **E2E is skipped on release**. The risk is real but smaller than stated.

---

## Bottom line

Healthy. The refactor cycle did the hard work in the right order, the seams are honest, the tests pass, and the new lint baseline is `0/0`. None of the four reviewers found a blocker that breaks the app today.

What they *did* find is two categories of real concern that the green CI gate cannot see:

1. **Half-built bridges** — the mutation layer wraps imperative helpers but swallows errors, so `useMutation`'s native `isError`/`error`/`onError` are permanently dead. The codebase has two routing patterns (v5 shim + v7 hooks), two error funnels (per-query `meta.defaultError` + `errorHandler.setGlobalError`), and a half-normalised `User.id`. None of these are bugs; all three are *latent debt* the next 10 PRs will trip over.
2. **A11y gaps that an axe scan won't catch** — heading hierarchy holes inside views, duplicate `<h1>` on `/metrics` and `/split-invoice`, no programmatic focus on route change, sound played without a user-mute toggle, balance=0 announced as "positive balance", multi-modal Esc handling, and placeholders used as the only label on ~7 inputs.

Shippable as-is for the kiosk's current scope. **Not** shippable as a WCAG 2.1 AA conformance claim until the items in §A11y → Blockers land.

---

## Cross-reviewer consensus (high confidence — multiple reviewers flagged)

| # | Issue | Flagged by | Where |
|---|---|---|---|
| 1 | **Mutations swallow errors** — `useMutation`'s `isError`/`error`/`onError` never fire because the imperative helpers call `errorHandler()` and resolve to `undefined`. Consumers must truthy-check the return value. | Senior, Principal | `src/queries/{articles,transactions,users}.ts`, all `useXxx` mutations |
| 2 | **Hook-deps cause unnecessary effect churn** — Toast's `setTimeout` and Scanner's `keydown` listener are re-bound on every parent render because `onFadeOut` / `onChange` are recreated each render. | Junior, Senior | `src/components/common/{toast,scanner}.tsx`, `src/components/article/article-scanner.tsx` |
| 3 | **`useTags` uses wrong i18n key** — falls back to `ARTICLES_COULD_NOT_BE_LOADED`. There's no `TAGS_COULD_NOT_BE_LOADED` in `locales/en.ts`. | Junior | `src/queries/articles.ts:57` |
| 4 | **"Two patterns" everywhere** — imperative+hook mutations, v5+v7 routing, multiple error writers into one global store. All intentional bridges; all overdue for convergence. | Senior, Principal | systemic |
| 5 | **No schema validation at the API boundary** — implicit assumptions about `error.class` FQCN shape, response envelopes, numeric vs string ids. `User.id` is half-normalised. | Principal | `src/services/api.ts`, all `queries/*` |
| 6 | **`docs/review.md` is checked in (968 lines)** — already stale on arrival; same commit that introduced it fixed half its findings. | Junior, Principal | `docs/review.md` |

These six are the high-leverage targets. Fixing #1 by itself dissolves several downstream complaints (#4 in part, several Senior medium-priority items, and the A11y "transaction silent to AT" item all unblock).

---

## Junior FE — surface findings

**Liked:** commit messages explain *why*, `URLSearchParams`+encoding everywhere, the `errorHandler` "don't reset on entry" comment, E2E deflakes (`waitForTimeout` → role-based waits).

**Would block on:**
1. `docs/review.md` shouldn't be in the repo.
2. `Toast` / `Scanner` effect dep churn (consensus #2).
3. `useTags` wrong i18n key (consensus #3).
4. `useModal` cleanup reads stale `handleHide`; the `eslint-disable` for `react-hooks/exhaustive-deps` was removed in the lint pass, so the rule is technically violated even though the linter accepts it. — `src/bricks/modal/modal.tsx:39`.
5. `Tab.active` prop is dead-on-arrival (kept "for source compat" — but no callers pass it). — `src/bricks/button/button.tsx:122`.
6. `ConnectedCreateCustomTransactionForm` is an identity re-export with one consumer. Rename and delete the alias. — `create-user-transaction-form.tsx:141`.
7. `RouteTitle` has `match` in its deps → re-runs every render. — `src/app.tsx:60`.
8. `Modal`'s default `aria-label` is computed even when not shown.

**Tiny nits:** `deleteBarcode`/`deleteTag` have no `meta.defaultError`; `noUnusedParameters: false` un-commented in `tsconfig.json` without a note; `Scanner` regex `/[a-zA-Z0-9]/` rejects `-` and `.` (pre-existing, but the new comment doesn't mention it).

---

## Senior FE — design findings

**Well-designed:** `ApiError` shape, `AbortSignal` plumbing into read queries, the `pickErrorMessage` short-class lookup, `queryKeys` with `String(id)` coercion, `useSettings`'s `initialData: defaultSettings`, `useGlobalError` via `useSyncExternalStore`, the `useIconButtonLabel` precedence ladder.

**High-priority pushback:**
1. **Asymmetric error funnels** (consensus #1). Reads → `QueryCache.onError`; writes → `errorHandler` inside the imperative helper. The fix is to make mutations *throw* and add a symmetric `mutationCache.onError` reading `meta.defaultError`. Then `useMutation` semantics actually work and `errorHandler` can shrink.
2. **`useMutation` wrappers don't earn their cost yet** — every wrapper is `useMutation({ mutationKey, mutationFn })` with no `onSuccess` / no optimistic update / no shared invalidation (still inside the imperative helper). They give you `isPending` and nothing else. Either move invalidation into the hook (and delete the imperative export) or replace the hook with a one-liner `useMutation(addArticle)`. `mutationKey: ['addArticle']` etc. are purely decorative — nothing keys off them.
3. **`mutate` (fire-and-forget) silently swallows failures**. Because the underlying `mutationFn` resolves with `undefined`, `useMutation` thinks success. A future maintainer wiring `onError` will spend a long time figuring out why it never fires.

**Medium:**
- `fetchArticleByBarcode` doesn't forward `signal` → barcode scanner can race itself.
- `ArticleDetails`'s `extractParams` effect clobbers user edits when `article` reference identity changes (key on `article.id` instead).
- `useArticleValidator` called inside a JSX prop expression — hoist.
- `SplitInvoiceForm`'s `validation` effect has a suppressed deps array → should be `useMemo`.
- `CurrencyInput`'s prop-sync hazard (controlled/uncontrolled half-decision).
- `Modal` initial focus only fires once → async content (loading→form) leaves first focusable un-focused.

**Specific suggestions:**
1. Move mutations onto `mutationCache.onError`; let `ApiError` bubble.
2. Collapse imperative+hook duplication (consensus #4).
3. Cancel in-flight barcode lookups with an `AbortController`.
4. Promote `meta.defaultError` to a typed enum of locale message ids.
5. Add unit tests for `pickErrorMessage`, the `QueryCache.onError` bridge, `Scanner`'s 200ms reset, and `Modal`'s focus-restore-to-detached-node fallback.

---

## Principal — strategic findings

**Gets right:** visible boundaries (`services/queries/types/bricks/components`), centralised query keys, honest service-level comments, deliberate provider order in `app.tsx`, minimal CI gate.

**Critical (would block 1.0):**
1. ~~Release pipeline does not match PR pipeline.~~ **Correction:** `package.yml` runs lint/typecheck/test/build; only E2E is skipped on release. The remaining risk is "tag-pushed release can ship without E2E passing" — real but smaller. Fix: extract `quality` as a reusable workflow and add E2E to the release call.
2. **Implicit backend contract** (consensus #5). No Zod, no contract test. Failure mode for any backend evolution is silent `undefined`s downstream. The contract is encoded across `errorHandler`, `MaybeResponse & {…}` intersections, and `normalizeUser`.

**Important (12-month horizon):**
3. The "two patterns" problem (consensus #4) — three instances: routing v5/v7, imperative+hook mutations, multiple error writers.
4. **Single QueryClient + `retry: 1` + no offline strategy** — kiosk should survive a flaky LAN or restarting backend. First 30-second outage during a busy evening = silent failures + repeated transactions.
5. **`User.id` half-fix** — `normalizeUser` runs in two places, the lie persists elsewhere.
6. **Onboarding cost is medium-high** for the implicit-contract knowledge specifically.

**Watch-list:** `HashRouter` in 2026 deserves a one-line comment; sourcemaps in prod (LAN kiosk, fine — but the GH release asset ships `.map` files); CI E2E hits the live demo (intentional but flake-prone); Recharts/Vite/Vitest one major behind.

**Next bets (in priority order):**
1. **Codify the backend contract at the boundary.** Zod (or valibot) schemas for the four response envelopes + one shared `ErrorEnvelope`, parsed inside `queryFn` *and* the mutation helpers. Single change, four concerns dissolve (User.id type lie, silent-undefined failure mode, FQCN-substring fragility, missing onboarding doc).
2. **Decide & document the mutation pattern, then converge.** Pick one: either imperative goes away and components consume `useMutation` directly with `mutationCache.onError`, or imperative stays and the wrappers die. Either is fine; the *both* state is the highest cognitive tax in the codebase.

**Intentionally-accepted debt** (call it out so it's not mistaken for oversight): live demo API in CI, `HashRouter`, `retry: 1` + no offline persistence, sourcemaps in prod, v5 routing shim as bridge, imperative mutation helpers as facade, global-error singleton.

---

## A11y specialist — WCAG 2.1 AA audit

**Verified passing:** Modal `role="dialog"` + `aria-modal` + `aria-label` + focus trap (incl. empty-content case); skip link first tab stop focusing `#main-content`; global `:focus-visible` ring at >3:1 against every surface; `FormField` uses `useId()`; all icon SVGs `aria-hidden`; `prefers-reduced-motion` block neutralises animation/transition/scroll-behavior; all touch targets ≥ 44×44 CSS px on the touch breakpoint (2.75rem × 18px = 49.5px); landmark roles present.

**Contrast (computed manually):**
- Light: `--textSubtile #6b6b6b` on white **5.3:1** ✓ · `--greenText #15803d` on white **4.6:1** ✓ (tight) · `--redText #c62828` on white **4.5:1** ✓ borderline · `--buttonRedFont #b3001b` on `#ffdce0` **5.3:1** ✓ · `--buttonHighlightFont #e8eaeb` on `#213440` **11:1** ✓
- Dark: `--textSubtile #a8b3c0` on `#1d2832` **7.8:1** ✓ · `--greenText #5dd07e` on `#2e3d4d` **5.7:1** ✓ · `--redText #ffb3be` on `#2e3d4d` **7.8:1** ✓ · `--buttonGreenFont #7be09a` on `#155949` **5.5:1** ✓

**Blockers (would fail an audit):**
1. **AlertText labels balance=0 as "positive balance"** — SC 1.1.1/1.3.1. `src/bricks/text/text.tsx:32-39`. Three-way: negative / zero / positive.
2. **Sound autoplay with no mute control** — SC 1.4.2. `src/services/sound.ts:4-10` + `transactions.ts:80`. Add a setting + footer mute toggle; default to off or respect `prefers-reduced-motion`.
3. **Heading-hierarchy gaps**: routes that jump straight from sr-only `<h1>` to content with no `<h2>` (user list, articles list, search, send-money). Plus competing **double `<h1>`** on `/metrics` and `/split-invoice` (RouteTitle injects one, the view renders another). — SC 1.3.1/2.4.6.

**Important:**
4. **No programmatic focus on route change** — `RouteTitle` updates `document.title` but doesn't focus `#main-content`. Keyboard users tabbing after navigation resume from a now-unmounted node → focus falls to `<body>`.
5. **Transaction success silent to AT** — sound is not an AT signal; balance update isn't in a live region. Add `role="status"` polite live region.
6. **Two open modals: Esc dismisses both** — `useModal` registers per-instance listeners; both fire. Maintain a module-level open-modal stack.
7. **`ErrorMessage` assertive + role="alert"** — redundant and over-loud for non-critical messages. Drop `aria-live`; consider `role="status"` for non-urgent.
8. **Placeholders as only label** — 7 call sites: `create-custom-transaction-form.tsx:59`, `create-user-inline-form.tsx:54`, `edit-user-form.tsx:59,75`, `split-invoice.tsx:200,219`, `article-form.tsx:201`, `search-list.tsx:74`, `article-selection-bubbles.tsx:26`. Route through `FormField` or add explicit `aria-label`.

**Minor:** duplicated `.sr-only` rule (theme.css) and `.srOnly` (text.module.css) — drift risk; "positive/negative balance: " sr-only strings not i18n'd; footer GitHub SVG missing `aria-hidden`; modal default `aria-label="Dialog"` could warn in dev when `label` missing; `Backdrop role="presentation"` is the **right** call (matches WAI dialog pattern).

**Test gaps:** route-change focus, error-toast announcement, multi-modal Esc stack, sound preference, `prefers-reduced-motion` runtime, dark scan only covers `/user/active`, no heading-outline assertion, no touch-target assertion, no idle-timer warning before redirect (kiosk SC 2.2.1 concern).

**Doc drift:** `specs/accessibility-conformance.md:43-44` says dark theme isn't scanned — but commit `264f175` added a dark-theme scan. Update. Also: doc doesn't yet mention AlertText sign cues or per-route sr-only `<h1>`; add them with the zero-balance caveat.

---

## Recommended sequencing

If you do nothing else this cycle, do these three — they each dissolve multiple consensus items:

1. **Make mutations throw + add `mutationCache.onError`** (Senior #1 + Principal #2 in part + A11y "transaction silent" unblocks). The single highest-leverage refactor.
2. **Fix the four A11y blockers** (AlertText zero, sound mute, heading-hierarchy/duplicate-h1, programmatic focus on route change). Two of these are one-liners.
3. **Delete `docs/review.md`** (Junior + Principal) or move it out of the repo; replace with this followup or a living `specs/known-debt.md` summarising the intentionally-accepted items Principal called out.

Second tier (worthwhile, ~1 sprint together):
- Codify backend contract with Zod at the four envelopes (Principal #1).
- Stabilise effect-dep churn in Toast/Scanner/Article-Scanner + cancel in-flight barcode reads.
- Fix `useTags` i18n key + add `TAGS_COULD_NOT_BE_LOADED`.
- Add the four unit tests Senior named (`pickErrorMessage`, `QueryCache.onError` bridge, Scanner reset, Modal focus-restore).
- Drop `Tab.active` dead prop; rename `ConnectedCreateCustomTransactionForm` consumer; key `RouteTitle` effect on `pathname`.

Strategic (multi-sprint, intentional bets):
- Converge on one routing pattern (kill the v5 shim).
- Decide kiosk offline posture (`retry` + `mutationCache` queue + `onlineManager`?).
- Reusable CI quality workflow, called from both `ci.yml` and `package.yml` *with* E2E.
