# DESKTOP LAYOUT REFINEMENT

## Purpose

Refine the desktop experience after the placeholder-based Watchman Universe redesign.

The current direction is visually aligned, but the desktop rhythm is too image-heavy. Section titles and archetype cards dominate too much of the viewport, reducing visual momentum.

This refinement preserves the cinematic atmosphere while making the page feel more like a dense Remnant division roster.

---

## Problems Identified

1. Section headlines are oversized on desktop.
2. Archetype cards are too large.
3. Too few archetypes are visible at once.
4. Large images slow the page's visual momentum.
5. The Watchman needs special visual emphasis.
6. The archetype section should feel like rostered divisions within The Remnant.

---

## Refinement Strategy

### Desktop Headlines

Reduce non-hero section headings so they feel like chapter headers rather than hero statements.

Target:

- Keep the homepage hero large and cinematic.
- Reduce section `h2` scale on desktop.
- Keep page/section headings ceremonial, but less viewport-consuming.

### Archetype Roster

Convert the archetype section from oversized portrait cards into a tighter roster.

Target:

- 4 archetypes per row on the current desktop content width.
- 5 archetypes per row only if the roster expands enough to avoid an orphan final row.
- 3 per row on tablet.
- 1-2 per row on mobile depending on width.

### Card Scale

Reduce archetype image height and text block height.

Target:

- Preserve 2:3 placeholder aspect ratio.
- Visually crop cards through CSS height/object-fit on desktop.
- Reduce card padding and title size.
- Make more cards visible without clutter.

### Watchman Emphasis

The Watchman should receive special visual treatment because he is the primary visual anchor of the universe.

Target:

- Add a dedicated `is-watchman` class.
- Give the Watchman card stronger gold border and subtle glow.
- Add an "Primera Vigilia" division marker.
- Keep the emphasis restrained, not flashy.

### Momentum

Reduce vertical section weight.

Target:

- Tighter desktop section padding for roster sections.
- Smaller gap between heading and cards.
- More compact card text.
- Maintain dark cinematic atmosphere.

---

## Implementation Scope

Allowed:

- CSS layout refinements.
- Add semantic class to Watchman card.
- Add small division/roster labels in archetype cards.
- Adjust desktop-only and responsive breakpoints.

Not allowed:

- Changing MailerLite.
- Changing form actions.
- Changing routes.
- Changing funnel behavior.
- Adding final imagery.
- Replacing placeholders with real art.

---

## Expected Outcome

The desktop homepage should feel less like a stack of giant posters and more like entering a classified Watchman roster:

- denser
- sharper
- more disciplined
- still cinematic
- still premium
- more scannable
- stronger Watchman hierarchy

Mobile responsiveness must remain intact.
