# Accessibility Conformance — WCAG 2.1 AA

> Status: target **WCAG 2.1 AA**. Automated conformance is enforced in CI; this
> document records what is covered and the known follow-ups.

## How conformance is verified

- **Automated (CI gate):** [`e2e/a11y.spec.ts`](../e2e/a11y.spec.ts) runs
  `@axe-core/playwright` against the live demo API with the
  `wcag2a, wcag2aa, wcag21a, wcag21aa` rule tags. Scanned screens:
  - Active users list, Articles list, Metrics, Search results
  - User detail, Edit user, Send money, Article form (create/edit)
  - All scans currently report **zero violations**.
- **Keyboard:** an E2E test verifies the skip link is the first tab stop and
  moves focus to `<main>`. Modal dialogs trap focus and restore it on close.
- **Dev runtime:** `@axe-core/react` logs violations to the console in `dev`.
- **Lint:** `eslint-plugin-jsx-a11y` (recommended ruleset) runs on every build.

## What was implemented (Epics 4–5)

- **Landmarks & structure:** `<main id="main-content">`, labelled `<nav>`,
  per-route document titles.
- **Skip link:** visible on focus, jumps to main content.
- **Keyboard & focus:** app-wide `:focus-visible` outline; modal focus trap +
  focus restoration; `role="dialog"` / `aria-modal` / `aria-label` on modals.
- **Names:** decorative SVG icons are `aria-hidden`; icon-only controls
  (add-user FAB, accept/cancel, theme switcher, text-scaling) have accessible
  names; hidden scanner/focus-hack inputs are removed from the a11y tree.
- **Contrast (AA, ≥ 4.5:1 on light theme):** nav links, positive/negative
  balance text, deposit/dispense step buttons, and input placeholders were
  darkened to meet the threshold.
- **Announcements:** the global error toast is a `role="alert"` /
  `aria-live="assertive"` live region.
- **Motion:** `prefers-reduced-motion` disables animations/transitions.
- **i18n:** new a11y strings (skip link, nav label, button labels) go through
  react-intl (`src/locales/en.ts`).

## Known follow-ups

- **Charts (recharts):** the metrics charts are decorative SVGs without a
  tabular text alternative. The surrounding numeric summaries are accessible;
  an explicit data-table fallback is a recommended enhancement.
- **Dark theme contrast:** automated scans run against the default (light)
  theme. The dark theme palette should get the same contrast audit.
- **Manual screen-reader pass:** automated tooling catches ~30–40% of issues.
  A manual VoiceOver/NVDA walkthrough of the primary flows is recommended
  before claiming full conformance.
