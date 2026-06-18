# Scroll Animation System Report

## Scope

Added a premium cinematic scroll animation system across the La Ultima Vigilia website.

The system preserves:

- Existing layout
- Existing routes
- Existing forms
- MailerLite integration
- Current images
- Mobile responsiveness
- Accessibility through reduced-motion support

## Files Added

- `website/assets/js/scroll-animations.js`

## Files Updated

- `website/assets/css/styles.css`
- All 10 website HTML pages now load `/assets/js/scroll-animations.js`

## Hero Animations

Implemented:

- Subtle hero background parallax using a CSS variable updated on scroll.
- Hero eyebrow, headline, and lead fade up on page load.
- Homepage form card fades in from the right.
- Motion uses smooth cinematic easing and no bounce/spin/gimmick behavior.

## Section Reveals

Implemented:

- Scroll-triggered fade-up reveal animation.
- Initial state: `opacity: 0` and `translateY(28px)`.
- Visible state: `opacity: 1` and `translateY(0)`.
- Duration: `780ms`.
- Easing: `cubic-bezier(.16, 1, .3, 1)`.

Applied to:

- Standard sections
- Tight sections
- Page heroes
- Articles
- Archive items
- Oath items
- Briefing/ecosystem tiles
- Recruitment cards

## Card Staggering

Implemented staggered reveal timing for grouped cards:

- Archetype cards
- Enemy cards
- Ecosystem cards
- Recruitment cards
- Archive grids
- Oath grids

Timing:

- `90ms` between items
- Maximum delay capped at `540ms`

## Hover Motion

Implemented restrained image hover zoom:

- Card and framed images scale to `1.04`
- Smooth `760ms` transition
- Slight brightness/contrast refinement on hover

Applied to:

- Archetype and enemy card images
- Ecosystem/briefing tile images
- Artifact covers
- Visual frames

## Accessibility

Implemented:

- `prefers-reduced-motion: reduce` support.
- Reduced-motion users do not receive parallax, reveal translation, long transitions, or entrance animations.
- Content remains visible if JavaScript is disabled because reveal classes are only applied after the animation script loads.

## Performance

Implemented:

- IntersectionObserver for scroll reveal detection.
- `requestAnimationFrame` for hero parallax updates.
- Passive scroll and resize listeners.
- Limited transform-based motion for GPU-friendly animation.
- No layout-affecting animation properties.

## QA Results

### Project Check

Passed:

```text
npm run check
Foundation OK: 10 HTML pages, 7 email forms.
```

### JavaScript Syntax

Passed:

```text
node --check assets/js/scroll-animations.js
```

### Global Script Wiring

Passed:

- Confirmed all 10 HTML pages include `/assets/js/scroll-animations.js`.

### Static Implementation Checks

Passed:

- Hero parallax CSS variable exists.
- Hero fade-up animation exists.
- Form card right-side fade-in animation exists.
- Scroll reveal classes exist.
- Stagger delay logic exists.
- Hover image zoom exists.
- Reduced-motion safeguards exist.

### Browser QA

Blocked:

- The in-app browser refused the localhost visit due to its URL policy during this run.
- Because of that policy block, rendered desktop/mobile browser QA could not be completed in this pass.
- No workaround browser surface was used after the policy rejection.

## Final Status

The scroll animation system has been implemented globally with subtle cinematic motion, staggered card reveals, hero parallax, hover zooms, accessibility safeguards, and performance-conscious behavior.
