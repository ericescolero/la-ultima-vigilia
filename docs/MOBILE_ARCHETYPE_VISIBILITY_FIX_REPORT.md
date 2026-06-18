# Mobile Archetype Visibility Fix Report

## Summary

Fixed the mobile homepage flow so the Hero Archetypes section appears directly after the hero and all 8 archetype cards render visibly on mobile.

The desktop 4 + 4 archetype layout was preserved.

## Issue Found

The homepage mobile flow had two problems:

1. The recruitment section appeared before the Hero Archetypes section in the homepage HTML flow, so the archetype roster was not immediately after the hero on mobile.
2. The scroll reveal system could leave archetype cards invisible if the mobile observer timing failed or if the cards had not yet received `is-visible`.

## Implementation

### Homepage Flow

Added `home-recruitment-section` to the recruitment block and hid it on mobile only.

This keeps the desktop homepage intact while making the mobile sequence:

1. Hero section
2. Hero Archetypes / The Remnant
3. Enemy Forces / Forces of Corruption
4. Ecosystem section
5. Final CTA
6. Footer

### Mobile Archetype Layout

Added mobile-specific rules for:

- `.archetype-grid`
- `.archetype-card`
- `.archetype-image-frame`
- `.card-image`
- `.card-icon`

Mobile now uses a clean one-column archetype roster at 390px width.

The cards explicitly preserve:

- Visible card container
- Visible image area
- Visible title
- Visible description
- Visible icon overlay
- No height collapse
- No overflow clipping

### Scroll Reveal Fallback

Updated `website/assets/js/scroll-animations.js` with a mobile-safe fallback.

On screens `719px` and below, the archetype grid and its child reveal elements are forced visible after a short delay if the observer has not already revealed them.

This preserves scroll animation behavior while preventing the mobile archetype section from staying hidden.

## Files Updated

- `website/index.html`
- `website/assets/css/styles.css`
- `website/assets/js/scroll-animations.js`

## QA Results

### Automated Checks

Passed:

- `npm run check`
- `node --check website/assets/js/scroll-animations.js`
- `node --check website/assets/js/navigation.js`
- `node --check website/assets/js/email-capture.js`
- `git diff --check`

Foundation result:

`Foundation OK: 10 HTML pages, 8 email forms.`

### Mobile Browser QA

Tested at `390px` width.

Passed:

- Hero section appears first
- Archetype section appears immediately after hero
- Recruitment block is hidden on mobile
- Archetype grid uses one column
- All 8 archetype cards render
- Archetype images render
- Archetype titles render
- Archetype descriptions render
- Archetype icon overlays render
- Enemy Forces section appears after archetypes
- Ecosystem appears after enemies
- Final CTA appears after ecosystem
- No horizontal overflow
- Mobile nav still opens
- El Arsenal remains visible in mobile nav
- No console warnings or errors

### Desktop Browser QA

Passed:

- Archetype grid remains 4 + 4
- All 8 archetype cards reveal after scrolling
- Enemy cards remain intact
- No horizontal overflow
- No console warnings or errors

## Final Status

Complete.

The mobile homepage now displays the archetype roster immediately after the hero, all 8 archetype cards are visible, and the desktop layout remains unchanged.
