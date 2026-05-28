# Accessibility Conformance — WCAG 2.1 AA

> Status: target **WCAG 2.1 AA**. Automated conformance is enforced in CI; this
> document records what is covered and the known follow-ups.

## How conformance is verified

- **Automated (CI gate):** [`e2e/a11y.spec.ts`](../e2e/a11y.spec.ts) runs
  `@axe-core/playwright` against the live demo API with the
  `wcag2a, wcag2aa, wcag21a, wcag21aa` rule tags. Scanned screens:
  - Active users list, Articles list, Metrics, Search results
  - User detail, Edit user, Send money, Article form (create/edit)
  - **Dark theme:** `/user/active`, `/articles/active`, `/metrics`
  - All scans currently report **zero violations**.
- **Heading outline:** an E2E assertion ensures every route renders exactly
  one `<h1>` (the per-route sr-only title from `RouteTitle`).
- **Keyboard:** an E2E test verifies the skip link is the first tab stop and
  moves focus to `<main>`. Modal dialogs trap focus and restore it on close;
  Escape and history-back only dismiss the topmost dialog when modals stack.
- **Dev runtime:** `@axe-core/react` logs violations to the console in `dev`.
- **Lint:** `eslint-plugin-jsx-a11y` (recommended ruleset) runs on every build.

## What was implemented (Epics 4–5 + review follow-up)

- **Landmarks & structure:** `<main id="main-content">`, labelled `<nav>`,
  per-route document titles, sr-only `<h1>` per route via `RouteTitle`, and
  sr-only `<h2>`s on user list / articles list / search / send-money so
  heading nav has something between page-title and content.
- **Skip link:** visible on focus, jumps to main content.
- **Route-change focus:** after a user-initiated navigation (`navigationType
  === 'PUSH'`), focus moves to `#main-content` so keyboard/AT users land on
  the new view's landmark instead of a stale or unmounted element. Initial
  loads, the root→`/user/active` redirect (REPLACE), and browser back/forward
  (POP) leave focus alone so the natural first-Tab target (skip link) stays
  reachable.
- **Keyboard & focus:** app-wide `:focus-visible` outline; modal focus trap +
  focus restoration with main-content fallback if the original element was
  unmounted; `role="dialog"` / `aria-modal` / `aria-label` on modals; a
  MutationObserver inside the modal moves focus to the first focusable as
  soon as async content arrives.
- **Modal stack:** Esc and popstate are claimed only by the topmost open
  modal, so nested dialogs no longer both close on a single Esc.
- **Names:** decorative SVG icons are `aria-hidden`; icon-only controls
  (add-user FAB, accept/cancel, theme switcher, text-scaling, sound toggle)
  have accessible names; placeholder-only inputs on send-money / split
  invoice / edit user / create user / search / article form / article
  selection bubbles now also carry an explicit `aria-label`. Hidden
  scanner/focus-hack inputs are removed from the a11y tree.
- **Contrast (AA, ≥ 4.5:1 on light *and* dark theme):** nav links, positive
  /negative balance text, deposit/dispense step buttons, input placeholders
  audited and bumped to meet threshold in both palettes.
- **Color isn't the only signal:** `AlertText` pairs colour with an sr-only
  three-way sign cue (`BALANCE_SIGN_POSITIVE` / `_NEGATIVE` / `_ZERO`) so a
  balance of 0 doesn't lie as "positive".
- **Announcements:**
  - Global error toast is a `role="alert"` live region (drops the redundant
    `aria-live="assertive"` since `role="alert"` implies it).
  - **Transaction success** is announced through a `role="status"` polite
    live region in `<StatusMessage>` — the ka-ching sound is hearing-only,
    the live region is the AT signal.
- **Audio control (SC 1.4.2):** the transaction sound is gated behind a
  persistent user preference (`services/sound-preference.ts`) with a footer
  `SoundToggle` button, and additionally respects `prefers-reduced-motion`
  even if the explicit preference is on.
- **Motion:** `prefers-reduced-motion` disables animations/transitions.
- **i18n:** all a11y strings — skip link, nav label, button labels, sign
  cues, status messages — go through react-intl (`src/locales/en.ts`).

## Known follow-ups

- **Charts (recharts):** the metrics charts are decorative SVGs without a
  tabular text alternative. The surrounding numeric summaries are accessible;
  an explicit data-table fallback is a recommended enhancement.
- **Touch-target E2E assertion:** computed via `getBoundingClientRect()` for
  every interactive role would lock the kiosk-grade 44×44 contract in CI.
- **Reduced-motion E2E assertion:** `page.emulateMedia({ reducedMotion:
  'reduce' })` + asserting no element animates would catch regressions on
  third-party components (recharts, inter-ui).
- **Idle-timeout warning:** `WrappedIdleTimer` redirects after 30s with no
  pre-warning — SC 2.2.1 is satisfied for kiosks if the user is informed
  *before* the timeout; an unobtrusive "session ending" announcement would
  close that gap.
- **Manual screen-reader pass:** automated tooling catches ~30–40% of issues.
  A manual VoiceOver pass on the kiosk target (iPadOS) of the primary flows
  is recommended before claiming full conformance.
