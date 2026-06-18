# VISUAL POLISH REFINEMENT

## Purpose

Refine the homepage against the reference concept image without adding final artwork.

This pass strengthens typography, metallic gold hierarchy, icon placeholders, social CTA structure, and premium UI details while preserving all existing functionality.

---

## Problems Addressed

1. Desktop headings still feel too large.
2. The interface needs stronger Cinzel-style typography across navigation, labels, cards, buttons, and section titles.
3. Gold typography should feel more metallic and engraved through CSS only.
4. Archetype and enemy cards need icon placeholders in addition to image placeholders.
5. Hero needs Telegram and Facebook Group buttons beneath the email CTA.
6. Sections need more premium UI detail: dividers, badges, gold linework, icon slots, and refined spacing.

---

## Implementation Rules

Preserve:

- MailerLite endpoint.
- Email form action and method.
- `fields[email]`.
- Redirect behavior.
- Routes.
- SEO canonicals.
- Placeholder-only artwork system.

Do not:

- Generate final images.
- Use stock photography.
- Replace placeholders with final art.
- Use image text for typography.

---

## Typography Refinement

Desktop type should be reduced another 20-30 percent:

- Hero `h1` remains cinematic but less oversized.
- Section `h2` becomes a premium chapter title, not another hero.
- Card titles, labels, nav, buttons, and section kickers use the Cinzel-style serif stack.
- Body copy remains readable sans-serif.

---

## Metallic Gold Treatment

Apply CSS-only metallic gold to:

- brand name
- hero `h1`
- section `h2`
- card titles
- important labels and badges

Use:

- gradient text
- background clipping
- subtle text-shadow
- restrained highlight

No image text.

---

## Icon Placeholder System

Add 256x256 SVG placeholders for:

- `ICON_WATCHMAN.svg`
- `ICON_EXILE.svg`
- `ICON_FIRE_WARRIOR.svg`
- `ICON_TEMPTED_SAINT.svg`
- `ICON_CONQUEROR.svg`
- `ICON_BUILDER.svg`
- `ICON_GUARDIAN.svg`
- `ICON_MAD_PROPHET.svg`
- `ICON_WHISPERER.svg`
- `ICON_SCARLET_QUEEN.svg`
- `ICON_USURPER.svg`
- `ICON_LEVIATHAN.svg`

Each placeholder should display:

- filename
- size
- usage

---

## Hero Social Buttons

Add two non-functional placeholder social buttons under the email CTA:

- Telegram
- Grupo privado Facebook

Use `href="#"` and comments indicating where final links should go.

Do not connect external URLs yet.

---

## UI Polish

Add:

- small gold divider ornaments
- thin metallic borders
- subtle section badges
- icon slots on cards
- sharper spacing rhythm
- premium linework around chambers and panels

The result should feel closer to a recovered Watchman archive page while remaining clean and usable.

---

## Expected Outcome

The homepage should feel:

- darker
- more premium
- more ceremonial
- more Cinzel-led
- more metallic
- less plain
- closer to the reference concept
- still mobile-safe
- still functionally unchanged
