# Frontend Modernization & Accessibility Roadmap

> Status: draft roadmap (big picture). Each epic will get its own refinement
> spec before implementation. **No code is written from this document.**

## Goal

Bring `strichliste-web-frontend` to a current, state-of-the-art React stack and
make the entire application accessible (WCAG 2.1 AA), without ever leaving the
app in a broken state.

## Guiding principles

- **Every epic is independently shippable and verifiable in a browser.** After
  each epic the full app must build, run, and behave correctly for end users.
  There are no "half-migrated" intermediate releases.
- **Playwright end-to-end tests are the verification loop.** A Playwright suite
  runs the real app in a browser against the live demo API
  (`https://demo.strichliste.org/api/`). It is established in Epic 1 and then
  run on every epic and in CI, so "verifiable in the browser" means an
  automated, repeatable check — not a manual one. See
  [Continuous verification loop](#continuous-verification-loop).
- **One concern per epic.** Build tooling, the React upgrade, the data/state
  architecture, and accessibility are separated so each change can be validated
  in isolation and rolled back independently if needed.
- **Behavior is preserved** through epics 1–3 (same features, same screens).
  Epics 4–5 add accessibility; they should not change existing functionality.
- **Refinement later.** This document is the big picture only. Concrete file
  changes, library versions, and step-by-step plans are decided per epic during
  refinement.

## Decisions (agreed during brainstorming)

| Topic | Decision |
| --- | --- |
| Modernization scope | Full modernization (tooling + React + libraries + data/state architecture) |
| Build system | **Vite** (stays a static-file SPA, closest replacement for CRA) |
| Test framework | **Vitest** (migrate the existing Jest tests) for unit/component tests |
| End-to-end tests | **Playwright**, run against the live demo API (`https://demo.strichliste.org/api/`); part of the implementation loop and the CI gate |
| Server state | **TanStack Query** for server data (users, transactions, articles, settings, search) |
| Client/UI state | **Redux Toolkit** for remaining UI/client state |
| Component library | Keep the custom **`bricks`** library and make it accessible in place |
| Accessibility target | **WCAG 2.1 AA**, enforced via automated (axe) checks + manual keyboard/screen-reader testing |
| CI | Add a **PR quality gate** (lint, typecheck, test, build, axe); keep the existing tag-based release flow; bump Node |
| Target devices | **Touch kiosk + desktop**, modern evergreen browsers (prioritize large touch targets and keyboard support) |

## Current state (baseline)

- Create React App (`react-scripts` 3.4.3), React 16.13, TypeScript 4.0.
- State in Redux + react-redux 7; data fetched manually in `src/services/api.ts`
  and stored in Redux reducers.
- Routing react-router 5, i18n react-intl 5, charts recharts 1.
- Custom `bricks` component library (button, input, card, modal, header-nav,
  layout, text, icons, scroll-container, theme).
- 19 Jest test files (mostly reducer specs). ESLint + Prettier + Husky.
- CI (`.github/workflows/package.yml`) runs **only on tag push**: Node 14,
  `yarn test`, `yarn build`, then packages a static `tar.gz` GitHub release.

## Target state

A Vite-built React 19 SPA in TypeScript 5, with server state in TanStack Query
and UI state in Redux Toolkit, an accessible `bricks` library, full WCAG 2.1 AA
conformance across all screens, a Vitest unit/component suite plus a Playwright
end-to-end suite run against the live demo API, and a CI pipeline that gates
every PR on lint/typecheck/unit tests/E2E/build/accessibility while still
producing the static release artifact on tag.

## Continuous verification loop

Across all five epics, **Playwright** is the primary "does it actually work in a
browser" check. It is set up in Epic 1 and then grows with each epic.

- **What it tests:** the built app running in a real browser, driving the
  primary user flows end to end (browse users, open a user, add a transaction /
  buy an article, check balance updates, settings, metrics, search).
- **Where the data comes from:** the live demo backend at
  `https://demo.strichliste.org/api/`. The app is pointed at it via the API
  base-URL env var (`REACT_APP_API` → `VITE_API` → now simply `API`), so no
  backend is run locally.
- **How it fits the loop:** during each epic, Playwright is run locally while
  implementing, and in CI as part of the **PR quality gate**. An epic is "done"
  only when its Playwright suite is green against the demo API.
- **Per-epic growth:**
  - Epics 1–3 (behavior preserved): the same E2E flows must keep passing,
    proving the migration/refactor didn't change user-facing behavior.
  - Epics 4–5 (accessibility): add accessibility-oriented E2E coverage —
    keyboard-only navigation, focus order, and Playwright + axe scans per route.
- **Demo-API considerations (to handle during refinement):** the demo server is
  shared, stateful, and externally hosted. Tests should create their own unique,
  ephemeral data (e.g. uniquely named users) and avoid destructive assumptions
  about global state. CI must tolerate demo-server downtime/latency (sensible
  timeouts, retries, and a clear failure signal that distinguishes "app broke"
  from "demo API unavailable").

---

## Epic 1 — Build system migration: CRA → Vite

**Outcome:** the app is built and served by Vite instead of `react-scripts`,
with tests on Vitest and a CI quality gate — while staying on React 16 so build
risk is isolated from framework risk.

**In scope**
- Replace `react-scripts` with Vite; move/adjust `index.html`, entry point, and
  environment variables (`REACT_APP_*` → `VITE_*`, `.env.*`).
- Upgrade TypeScript to 5.x; update `tsconfig` for Vite/bundler resolution.
- Migrate the 19 test files from Jest to **Vitest** (+ React Testing Library
  update), including snapshot handling.
- Stand up the **Playwright** harness against `https://demo.strichliste.org/api/`
  with an initial smoke suite covering the primary flows (see
  [Continuous verification loop](#continuous-verification-loop)). This is the
  baseline that epics 2–3 must keep green.
- Modernize lint/format tooling (ESLint flat config, Prettier, Husky/lint-staged).
- CI: add a **PR quality gate** workflow (lint, typecheck, unit tests,
  **Playwright E2E**, build); bump Node to a current LTS; update the tag-release
  workflow to use the Vite build output (static artifact unchanged in shape).

**Out of scope:** React version bump, library upgrades, accessibility, data layer.

**Verifiable in browser:** `dev` server runs, production build serves as static
files, and every existing feature works exactly as before. The new **Playwright
smoke suite passes against the demo API**, and the CI gate (incl. Playwright) is
green on PR.

**Key risks:** env-var renaming, CRA-implicit behaviors (SVG/asset imports,
public path), test-runner differences (globals, jsdom, snapshots).

---

## Epic 2 — React 19 upgrade + library modernization

**Outcome:** the app runs on React 19 with all React-coupled libraries on their
current, compatible versions.

**In scope**
- React 16 → **19** (`react`, `react-dom`, new `createRoot` entry, types).
- Bring React-coupled libraries current and compatible: react-redux,
  react-router (5 → current), react-intl, recharts (1 → current), and supporting
  `@types/*`.
- Apply official codemods; resolve deprecations and breaking API changes.
- Remove/replace anything React-16-only (e.g. dev-only `react-axe` is revisited
  in Epic 4 with a current equivalent).

**Out of scope:** changing how data is fetched/stored (Epic 3); accessibility
behavior (Epics 4–5).

**Verifiable in browser:** the full app renders and all flows work on React 19;
the **Playwright suite still passes unchanged** against the demo API (proving no
behavior regressed), and the test suite and CI gate are green.

**Key risks:** react-router 5→7 routing API changes, react-intl message/format
changes, recharts API changes, StrictMode double-invoke effects.

---

## Epic 3 — State & data architecture modernization

**Outcome:** server data is managed by TanStack Query; remaining UI/client state
runs on Redux Toolkit. Same screens, better loading/caching/refetch behavior.

**In scope**
- Introduce **TanStack Query**; move server data (users, transactions, articles,
  settings, search) from manual `api.ts` fetch + Redux reducers into query and
  mutation hooks (caching, loading/error states, refetch, invalidation).
- Migrate remaining state to **Redux Toolkit** slices (UI/client concerns:
  loaders, errors, search UI, etc.).
- Refactor `services/api.ts` into a typed query/mutation client layer.
- Update tests for the new data/state layer.

**Out of scope:** visual/feature changes; accessibility.

**Verifiable in browser:** all screens load and mutate data correctly, with
proper loading and error states; behavior matches the previous app and the
**Playwright suite still passes** against the demo API (data create/read/update
flows verified end to end).

**Key risks:** correctly classifying server vs. client state, cache
invalidation after mutations (e.g. adding a transaction updates balances),
keeping optimistic/refresh behavior consistent with current UX.

---

## Epic 4 — Accessibility foundation (`bricks` + global)

**Outcome:** the shared `bricks` components and global app shell meet WCAG 2.1
AA, and accessibility is continuously enforced in tooling and CI.

**In scope**
- Make each `bricks` component accessible: semantic HTML, ARIA roles/labels,
  keyboard interaction, visible focus indicators, and **focus management** (e.g.
  modal focus trap + restore, header-nav, button, input, card, scroll-container,
  icons, text).
- Theme-level: color-contrast review, focus-visible styling, **touch-target
  sizing** for kiosk use, reduced-motion support.
- App shell globals: `lang` attribute, document `<title>` per route, skip link,
  landmark regions.
- Tooling: integrate **axe** (dev runtime + CI), enforce `eslint-plugin-jsx-a11y`.

**Out of scope:** screen-by-screen feature accessibility (Epic 5).

**Verifiable in browser:** core navigation is fully keyboard-operable, bricks
announce correctly to a screen reader, focus is visible and managed, and axe
reports no violations on shared components. **Playwright gains keyboard-navigation
and axe-scan coverage** that runs against the demo API in the CI gate.

**Key risks:** focus management regressions, contrast changes affecting visual
design, balancing kiosk touch-target sizes with current layout.

---

## Epic 5 — Accessibility across all feature screens + conformance

**Outcome:** every feature screen meets WCAG 2.1 AA; conformance is verified
both automatically and manually.

**In scope**
- Apply accessibility to all feature areas: user list/grid, user-details,
  transaction, article, settings, metrics (**recharts** accessibility / data
  alternative such as an accessible table), paypal, currency, footer, modals.
- **Live regions / announcements** for async outcomes (drink added, errors,
  validation) and accessible form validation messaging.
- **Internationalize all accessibility text** (labels, announcements,
  `error-handler` messages) via react-intl.
- Manual screen-reader + keyboard-only test pass against a WCAG 2.1 AA checklist;
  document the conformance result.

**Out of scope:** new features; further architectural change.

**Verifiable in browser:** complete keyboard-only and screen-reader walkthrough
of every primary flow passes; the **full Playwright suite (functional +
keyboard + per-route axe scans) is green** against the demo API in CI; documented
WCAG 2.1 AA conformance.

**Key risks:** charting accessibility (recharts), announcing the rapid
transaction flow without overwhelming screen-reader users, full i18n coverage of
a11y strings.

---

## Sequencing & dependencies

```
Epic 1 (Vite + Vitest + CI)
   └─> Epic 2 (React 19 + libs)
          └─> Epic 3 (TanStack Query + Redux Toolkit)
                 └─> Epic 4 (a11y foundation: bricks + global)
                        └─> Epic 5 (a11y across all screens + conformance)
```

Epics are strictly ordered: each builds on the previous and each ends with a
fully working, browser-verifiable app. Accessibility is deliberately last
(Epics 4–5) so it is applied to the final, modern stack rather than to code that
is about to be replaced.
