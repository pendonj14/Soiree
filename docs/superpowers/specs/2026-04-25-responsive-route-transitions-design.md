# Responsive Layout & Route Transitions Design

**Date:** 2026-04-25
**Status:** Approved

## Overview

Add full multi-device responsiveness (phone, tablet, laptop, desktop) and animated route transitions to the Soirée restaurant frontend. No existing functionality changes — purely layout and animation work.

## Route Transitions

**Library:** `framer-motion`

**Behavior:** Right-to-left wipe. When navigating between routes, the outgoing page slides out to the left while the incoming page enters from the right simultaneously, producing a true wipe effect

**Implementation:**
- Install `framer-motion` as a production dependency.
- Create `src/components/PageTransition.jsx` — a reusable wrapper that applies `motion.div` with enter/exit variants.
  - `initial`: `{ x: '100%', opacity: 0 }`
  - `animate`: `{ x: 0, opacity: 1 }`
  - `exit`: `{ x: '-100%', opacity: 0 }`
  - `transition`: `{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }`
  - The `motion.div` must use `position: absolute; width: 100%; min-height: 100%` so the entering and exiting pages can coexist in the DOM simultaneously during the animation without stacking vertically and doubling the page height.
- In `App.jsx`, the content wrapper div (the one that currently wraps `<Navbar>` and `<Routes>`) must have `position: relative; overflow: hidden` to clip pages sliding in/out. Import `AnimatePresence` from framer-motion and `useLocation` from react-router-dom. Key `AnimatePresence` on the current `location.pathname` so it detects route changes and plays exit/enter animations.
- Wrap every page's root element with `<PageTransition>`.

## Mobile Navigation

**Pattern:** Bottom navigation bar, visible on screens below `md` breakpoint only. The existing `NavBar` remains on `md+` screens unchanged.

**New component:** `src/components/BottomNav.jsx`

**Layout:** Fixed bar at bottom of viewport (`position: fixed`, `bottom: 0`, `z-index: 50`). Full-width with four evenly-spaced items: Home, Menu, Book, About.

**Styling:**
- Background: `bg-black/70 backdrop-blur-md` — frosted glass matching the existing NavBar aesthetic.
- Border top: `border-t border-white/10`.
- Each item: icon (SVG) + label in `text-[9px] tracking-widest uppercase`.
- Active route: icon and label colored `#d4ccb6`. Inactive: `text-white/40`.
- Active detection via `useLocation` comparing `pathname`.
- The "Book" item uses the same auth guard as the desktop NavBar: if the user is authenticated, navigate to `/reservation`; if not, open the `AuthModal`. Import `useAuth` and reuse the same `handleBookTable` pattern already in `NavBar.jsx`.

**Page padding:** All pages receive `pb-20 md:pb-0` so content is never obscured by the bottom bar.

**NavBar adjustment:** The NavBar's nav links and Book button are already `hidden md:flex` — no change needed. On mobile, the NavBar shows only the logo and profile icon, which is acceptable since the BottomNav handles primary navigation.

## Responsive Page Layouts

All layout changes use Tailwind breakpoints only — no structural logic changes.

### LandingPage

Current state is mostly responsive (`lg:grid-cols-4`, text scales with breakpoints). Minor fixes:
- The outer wrapper uses `h-screen` with a fixed `min-h-[800px]`. On short mobile screens this causes overflow. Change to `min-h-screen` and allow the grid to scroll naturally on very small viewports.
- SideCards column: add `grid-cols-3 lg:flex lg:flex-col` so the three side cards display as a horizontal row on `sm`/`md` and a vertical column on `lg+`.
- Hero section: ensure the bottom text and `h1` don't get clipped on mobile by adjusting padding from `p-12 lg:p-16` to `p-6 sm:p-10 lg:p-16`.

### MenuPage

Current state: rigid `grid grid-cols-4 grid-rows-4` with no mobile breakpoints — breaks on anything below `lg`.

Target layout:
- **Mobile (default):** Single column, stacked. Hero image on top at `h-[40vh]`, scrollable menu list below. Remove `h-screen` constraint so the page can scroll.
- **`md`:** Two-column flex row, `flex-row`. Left hero image fills half, right menu panel fills half, both `h-screen`.
- **`lg`:** Current 4-col CSS Grid layout.

The category button row wraps on small screens (`flex-wrap`). Menu items inner padding reduces on mobile (`px-4` instead of `px-25`).

### AboutPage

Current state: complex 6-column 6-row bento grid with no mobile breakpoints.

Target layout:
- **Mobile (default):** Single column flex stack. Order: hero image (ABOUT), story text, awards row (Trip Advisor, Michelin, Start Dining in a 3-col grid), carousels.
- **`md`:** Two-column grid. Hero spans full width at top, remaining cards fill a 2-col grid below.
- **`lg`:** Current 6-col bento grid restored.

Remove `h-screen` on mobile and tablet — the stacked content needs to scroll.

### ReservationPage

Current state: `flex` row with two `w-1/2` panels — breaks on narrow screens.

Target layout:
- **Mobile (default):** Single column stack. Image panel on top at `h-[35vh]`, form panel below. `h1` font size reduces (`text-5xl` on mobile vs `text-7xl` on desktop).
- **`md+`:** Current side-by-side `flex-row` layout, restored.

## File Change Summary

| File | Change |
|------|--------|
| `package.json` | Add `framer-motion` |
| `src/components/PageTransition.jsx` | New — motion wrapper |
| `src/components/BottomNav.jsx` | New — mobile nav bar |
| `src/App.jsx` | Add `AnimatePresence` + `useLocation` keying |
| `src/pages/LandingPage.jsx` | Responsive breakpoints, SideCard row layout |
| `src/pages/MenuPage.jsx` | Responsive stacking, remove fixed grid |
| `src/pages/AboutPage.jsx` | Responsive stacking, remove fixed grid |
| `src/pages/ReservationPage.jsx` | Responsive stacking |

## What Does Not Change

- All backend services and API calls.
- Auth flow, AuthModal, AuthContext.
- Desktop NavBar (already responsive for `md+`).
- All existing Tailwind theme variables and CSS custom properties.
- Carousel, MenuItem, MenuSectionTitle, SideCard component logic.
