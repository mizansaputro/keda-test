# Aliran — KeDA Tech frontend coding test

A landing page and login screen for a fictional ERP product. The product records
goods entering and leaving a warehouse and reports the profit those movements
produced, sold in three tiers (Basic, Business, Entrepreneur).

This repository is the submission for the KeDA Tech React frontend assignment.
The visual direction follows the reference artwork supplied with the brief — the
cyan header shape, the uppercase tracked navigation, the blue-to-violet gradient
wave and the outlined pill login control — rebuilt with a proper type scale,
spacing system and dark mode.

There is no backend. Form submissions validate and acknowledge locally, and the
analytics figures are static mock data.

---

## Getting started

Requires Node 20.19+ or 22.12+ (Vite 8).

```bash
npm install
```

### Development server

```bash
npm run dev
```

Serves on <http://localhost:5173>.

### Production build

```bash
npm run build
```

Runs `tsc -b` first, so a type error fails the build. Output goes to `dist/`.
Preview it with `npm run preview`.

### Tests

```bash
npm test           # single run
npm run test:watch # watch mode
npm run test:coverage
```

### Other checks

```bash
npm run typecheck
npm run lint
```

---

## Tech stack, and why

| Choice | Reason |
| --- | --- |
| **React 19** | Required by the brief. |
| **Vite 8** | The brief rules out Next.js, and there is no server-rendering requirement here — a static SPA build is the right shape. Vite gives instant HMR and a small, well-understood production pipeline. |
| **TypeScript** | Content is data-driven (pricing tiers, features, chart series). Typing those structures is what stops the pricing grid and the pricing cards from drifting apart. |
| **TanStack Router** (file-based) | Two routes only, but the brief asks for file-based routing. Its generated route tree gives fully typed `Link` targets — a typo in `to="/login"` fails the build — and the Vite plugin adds per-route code splitting for free. |
| **Tailwind CSS v4** | The CSS-first `@theme` directive lets the design tokens live in one stylesheet as real custom properties, which is exactly the token layer the brief asks for. No `tailwind.config.js` indirection. |
| **shadcn/ui approach** | The primitives in `src/components/ui/` follow shadcn's convention — CVA recipes over semantic CSS variables, components copied into the project rather than imported from a package. Nothing was pulled in that the project does not use. |
| **Motion** (Framer Motion) | Declarative `whileInView` reveals and `AnimatePresence` exits, with a built-in `prefers-reduced-motion` story. |
| **Vitest + React Testing Library** | Vitest shares the Vite config, so tests resolve the `@/` alias and transform TSX with no second build setup. RTL pushes tests toward roles and labels, which doubles as accessibility pressure. |
| **Apache ECharts** + **echarts-for-react** | Charting for the sales-analysis section. Registered through `echarts/core` with only the line chart, grid, tooltip and SVG renderer, so the rest of the library is tree-shaken away. |
| **lucide-react** | Tree-shaken SVG icons; only the ~15 used are bundled. |
| **CVA + tailwind-merge + clsx** | `cn()` makes a caller's class reliably beat a variant's class, so `className` overrides behave predictably. |

### On the chart library

The first version of this section was a hand-built SVG chart, on the argument
that a library would cost bundle weight and a second theming system. ECharts was
then chosen instead, and the weight turned out to be larger than that estimate:
even tree-shaken to four modules it is **180 kB gzipped**, not the ~50 kB a
lighter library would have cost.

Two things keep that from landing on the reader:

- The chart is **split into its own chunk** and fetched only as the section comes
  within 400 px of the viewport, so the initial landing payload is unchanged at
  ~163 kB gzipped.
- The **accessible table is deliberately not in that chunk**
  ([`revenue-table.tsx`](src/features/analytics/revenue-table.tsx)). A screen
  reader jumping straight to the section finds the figures whether or not the
  renderer has arrived. A test asserts the split has not been undone.

What the library buys in return: axis-triggered tooltips, hit testing, resize
handling and the smoothing maths, none of which had to be written or maintained.

### Deliberately not used

- **A form library.** Two short forms with three fields between them. React Hook
  Form plus a schema library would be more machinery than the problem needs; the
  validators in [`validation.ts`](src/lib/validation.ts) are about 30 lines.
- **A state manager.** Nothing here outlives a section. Theme uses a small
  context; billing period and form state are local `useState`.
- **SASS.** Optional in the brief, and redundant next to Tailwind v4's native
  nesting and custom properties.

---

## Project structure

```
src/
├── components/
│   ├── ui/           Primitives: Button, Card, Badge, Field, Switch, ThemeToggle
│   └── layout/       Navbar, Footer, Section, Container, Reveal, Logo
├── features/         One folder per landing-page section + login
│   ├── hero/         Hero copy, the gradient wave artwork, floating stat card
│   ├── features/     Bento grid of the three product capabilities
│   ├── about/        Narrative, reference pull-quote, company stats
│   ├── pricing/      Billing toggle + the three tiers
│   ├── analytics/    SVG revenue chart + headline metrics
│   ├── contact/      Contact channels + validated form
│   ├── cta/          Closing gradient call to action
│   └── login/        Split-screen login page and its form
├── data/             All copy and configuration, typed
├── hooks/            use-theme, use-scrolled
├── lib/              cn(), validators
├── routes/           __root.tsx, index.tsx, login.tsx (file-based)
├── test/             Vitest setup, render helpers
└── index.css         The entire design-token layer
```

The split is by *role*, not by file type: `components/ui` knows nothing about
ERP, `features/*` knows nothing about routing, and `data/*` holds every string a
reviewer might want to change.

---

## Design system

All tokens live in [`src/index.css`](src/index.css), in three layers:

1. **Brand ramp** — `--brand-cyan`, `--brand-blue`, `--brand-violet`, plus the
   two gradients, sampled from the reference artwork.
2. **Semantic aliases** — `--background`, `--card`, `--muted-foreground`,
   `--border-strong`, `--ring` and so on, mapped per theme. Components reference
   these, never the brand ramp directly.
3. **`@theme inline`** — republishes the semantic layer as Tailwind utilities, so
   `bg-card` and `text-muted-foreground` resolve to the same variables.

Colours are written in **OKLCH**, which keeps light and dark pairs perceptually
matched rather than numerically inverted.

Also tokenised: radii (`--radius` and derived steps), a five-step elevation ramp,
named easing curves and durations, and a fluid type scale
(`text-display`, `text-headline`, `text-title`, `text-lead`) built on `clamp()`
so headings scale continuously instead of snapping at breakpoints.

The hero's lattice is a token too: `--hero-line` sets the hairline colour per
theme, and the `hero-lattice` utility draws the 4×3 rule grid the mosaic sits on.

Two conventions do real work:

- Shadows are tinted with the **brand blue**, not neutral black, so cards sit in
  the same colour world as the artwork.
- `eyebrow` is a single utility for the uppercase, wide-tracked label used by the
  navbar and every section heading — the reference's navigation styling,
  generalised.

### Dark mode

Class-based (`.dark` on `<html>`), stored in `localStorage` with a
`prefers-color-scheme` fallback. It is designed rather than inverted:

- Surfaces are **navy-tinted** (`oklch(0.19 0.024 265)`), never pure black, and
  step up through `--surface` and `--card` for elevation.
- Borders **lift** with `white / 10%` instead of darkening.
- The brand ramp is **brightened** in dark so the blue keeps its contrast against
  deep backgrounds — the same hue would go muddy if left unchanged.
- Shadows switch from brand-tinted to true black, because a coloured shadow is
  invisible on a dark ground.

---

## Responsive approach

Mobile-first, and layouts change *shape* rather than shrinking:

- **Navbar** — inline links above `md`; below that a hamburger opening an
  animated drawer that locks page scroll and closes itself if the viewport grows
  past the breakpoint.
- **Hero** — a twelve-column mosaic on `lg` (audience 1–3, headline 4–8, then a
  tile band of 3 / 6 / 3); below that it stacks, and the headline is reordered
  above the audience figure so the page still leads with its message. The
  artwork switches from a right-hand panel to a band across the foot, where a
  side panel would leave the copy nowhere to sit.
- **Pricing** — 1 → 2 → 3 columns. The odd third card spans both columns in the
  two-column layout instead of sitting alone.
- **Features** — the wide bento card drops its side-by-side split and reflows.
- **Chart** — month labels thin out to every other month below `sm`; the SVG
  scales by `viewBox`.
- **Login** — the brand panel is hidden below `lg` and replaced by a compact
  header, rather than pushing the form off-screen.
- Fluid `clamp()` type and `text-wrap: balance` handle typographic scaling
  between those breakpoints.

---

## Animation approach

Motion is used where it clarifies structure, and kept out of the way otherwise.

Two easing curves, each with one job:

- `--ease-out-soft` (an easeOutQuint) for **entrances** — fast out of the gate,
  long settle, right for something arriving on screen.
- `--ease-hover` (a gentle easeOutQuad, no overshoot) for **hover and state
  changes**, at `--duration-hover: 320ms`. Leaving an element feels like the
  reverse of entering it, which the entrance curve does not give you.

The hover pair is registered as Tailwind's `--default-transition-duration` and
`--default-transition-timing-function`, so a bare `transition-colors` anywhere in
the app is already smooth — components opt *out* of that rather than in.

- **Hero** — one staggered entrance, ~80 ms between elements.
- **Sections** — every reveal goes through a single
  [`<Reveal>`](src/components/layout/reveal.tsx) component with `once: true`, so
  timing cannot drift between sections and nothing re-animates on scroll-back.
- **Cards** — a 2 px lift and one shadow step, as plain CSS transitions. Only
  cards that actually do something on click get it: a card that lifts under the
  cursor but ignores the press reads as a broken affordance, so the feature
  cards, metric tiles and the address card stay still.
- **Navbar** — background, blur and border cross-fade past a scroll threshold
  over 420 ms; links and their underline share the hover curve.
- **Mobile menu** — height and opacity, with the links staggered in.
- **Form errors** — validation messages expand from zero height rather than
  appearing at full size, so a failed submit does not snap the form taller.
  `FieldError` is shared by the `Field` input and the contact textarea.
- **Billing toggle** — the switch thumb travels on a spring (a switch is a
  physical metaphor, and a slight settle beats an abrupt stop), and each tier's
  price cross-fades with `mode="wait"` so no card doubles in height mid-swap.
- **Chart** — the revenue line draws once on entry; the dashed cost line fades
  instead, because animating `pathLength` overwrites `strokeDasharray`.
- **Login** — a short entrance, and a pending state on the submit button.

### Reduced motion

Handled in **both** layers, because they do not overlap. The stylesheet's
`prefers-reduced-motion` block covers CSS transitions; Motion animates through
inline styles and ignores it entirely, so [`AppProviders`](src/components/app-providers.tsx)
wraps the tree in `<MotionConfig reducedMotion="user">`. That drops transform and
layout animation while keeping opacity cross-fades — feedback without movement,
rather than no feedback at all.

Verified in Chrome by forcing the media query before boot: with reduced motion
on, the hero wave's drift reports `transform: none` across a 1.2 s sample while
opacity still settles at 1; with it off, the same element reports a changing
`translateY`. Worth stating because a jsdom test cannot tell the two apart —
Motion writes no transform under jsdom either way.

---

## Testing approach

91 tests across 11 files, aimed at behaviour a reviewer would care about rather
than a coverage number.

| Area | What is covered |
| --- | --- |
| `Button` | Variant and size classes, `className` override precedence, disabled blocks clicks, `buttonVariants` reusable on `<Link>` |
| `Field` | Label association, unique ids across instances, `aria-invalid` / `aria-describedby` wiring, no error state before submit |
| `Navbar` | Links match the data, `/login` target, mobile menu open/close, `aria-expanded` and `aria-controls`, scroll lock and restore, Escape closes and returns focus to the trigger, no link marked current above the first section |
| `PricingSection` | All three tiers render **from the data array in order**, the billing toggle swaps every price, exactly one figure stays visible per card through the cross-fade, exactly one tier is flagged popular, inheritance lines |
| `FeaturesSection` | One card per feature, points stay inside their own card, anchor id present |
| `LoginForm` | Empty submit reports both fields, malformed email reports *only* that field, password length, pending state, success, reveal toggle |
| `ContactSection` | Three-field validation, values survive a failed submit, success clears the form, textarea error wiring |
| `ThemeToggle` | Adds/removes `.dark`, persists to `localStorage`, restores a stored preference ahead of the system setting |
| `buildRevenueChartOption` | Both series come straight from the data, every month is labelled, the value axis is anchored at zero with headroom, **every colour comes from the injected palette and no hex or `oklch` literal survives**, the cost line sits dashed and behind revenue, animation follows the reduced-motion flag, and the tooltip formatter reports the month, both figures and the derived margin (returning empty rather than throwing on a bad index) |
| `RevenueTable` / `RevenueChart` | The figures are a real table with one row per month, the drawing is hidden from assistive technology, both series reach ECharts, and the table is asserted **not** to live in the lazily loaded chart module |
| `validation` | Table-driven cases for each validator |

Queries go through roles and labels, so a change that breaks accessibility tends
to break a test too. `src/test/setup.ts` stubs `matchMedia`,
`IntersectionObserver` and `scrollTo`, none of which jsdom implements.

---

## Implementation notes

**Pricing is rendered from data.** [`PRICING_TIERS`](src/data/pricing.ts) drives a
single `PricingCard`. The popular tier differs only by a `popular: boolean` in
the data — no second component, no duplicated feature lists. A test asserts the
rendered headings match the data array exactly, so the two cannot drift.

**`Section` owns vertical rhythm.** Band colour, padding and the scroll anchor
live in one component. No section sets its own `py-*`, which is most of why the
page reads as one document instead of stacked templates.

**`buttonVariants` instead of `asChild`.** Several controls are links, not
buttons. Rather than pulling in Radix's `Slot` for one case, the CVA recipe is
applied directly to `<Link>`. Same styling, no nested-interactive-element markup,
one fewer dependency.

**Tailwind v4 dropped the `[--var]` arbitrary-value form.** Utilities written as
`duration-[--duration-base]` compile to `transition-duration: --duration-base`,
which is invalid CSS and silently resolves to `0s` — so every transition that
used one was snapping instantly rather than easing. The v4 spelling is
`duration-(--duration-base)`. Worth knowing because it fails without any build
warning; the symptom is purely that the UI feels harsh.

**Getting OKLCH tokens into ECharts.** ECharts parses hex/rgb/hsl only, while
the browser returns `oklch(...)` from both `getPropertyValue` and
`getComputedStyle`; and several dark-theme tokens are translucent
(`oklch(1 0 0 / 10%)`), which ECharts silently drops when it writes SVG
attributes. [`chart-theme.ts`](src/features/analytics/chart-theme.ts) solves both
by painting each token over the card surface on a 1×1 canvas and reading the
composited pixel back — the browser does the colour-space maths, and the result
is the opaque colour the translucent token would have produced anyway.
Compositing rather than preserving alpha is deliberate: canvas stores
premultiplied alpha, so reading a 10%-opacity white back directly returns
`rgb(245, 255, 255)` instead of white.

**A React effect-ordering bug this surfaced.** The chart re-reads its tokens in
an effect keyed on the theme. React flushes **child** effects before **parent**
effects, so the chart sampled the CSS variables before `ThemeProvider` had put
`.dark` on the document — the grid lines stayed light-theme grey against the dark
card. `toggleTheme` now applies the class synchronously in the handler rather
than leaving it to an effect, and an inline script in `index.html` paints the
stored theme before first render, which also removes the flash of the wrong
palette on load.

**The login brand panel needed its own background.** Laying white copy directly
over the hero wave put it on the artwork's pale regions with almost no contrast.
The panel now sits on a solid brand gradient with the wave layered over it for
depth, plus a soft scrim behind the text.

**Scroll anchors over routes.** ABOUT / PRICING / CONTACT are in-page anchors
with `scroll-padding-top` set to clear the fixed navbar — they are sections of
one page, not separate routes.

**Accessibility.** Semantic landmarks throughout (`header`, `nav[aria-label]`,
`main`, `section[id]`, `footer`, `dl` for statistics), real `<button>` and
`<label>` elements, one global `:focus-visible` treatment, a skip link as the
first tab stop, Escape to dismiss the mobile menu with focus returned to its
trigger, and ARIA used only where the markup cannot express the state —
`role="switch"`, `aria-expanded`, `aria-controls`, `aria-current`,
`aria-invalid`, `aria-describedby`, `role="alert"`, `role="status"`.

**The chart is a table underneath.** Rather than describing the picture with an
`aria-label`, the SVG is `aria-hidden` and the accessible representation is a
visually hidden `<table>` carrying all twelve months — a screen reader gets the
actual figures instead of someone's summary of them.

**Where you are, not just where you hovered.** `useActiveSection` observes the
three navigation targets and marks the current one with `aria-current` plus a
persistent underline, reusing the hover indicator so both states share one
visual language. The observer accumulates the latest entry per section rather
than reading the callback argument alone — an IntersectionObserver reports only
what *changed*, so the naive version leaves the indicator a section behind.

**Tabular numerals on anything that changes.** Prices, metric values and stats
use `tabular-nums`; proportional digits shift width as the figure changes, which
made the price column jitter during the billing cross-fade.

**Bundle.** The landing route is ~163 kB gzipped; `/login` is code-split by the
router plugin into a further 2.4 kB, and the ECharts renderer into 180 kB
fetched on approach. Motion and the router account for most of the eager
weight, which is the trade accepted for declarative scroll reveals and typed
routes.
