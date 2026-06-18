# ARCHETYPE SECTION REFINEMENT REPORT

## Status

Implemented the Archetypes and Enemy Forces refinement.

The homepage now treats these sections more like a mythological codex / military dossier / classified archive instead of an icon gallery or asset browser.

---

## Files Updated

- `website/index.html`
- `website/assets/css/styles.css`
- `docs/ASSET_REPLACEMENT_GUIDE.md`

New placeholder assets:

- `website/assets/img/placeholders/ARCHETYPE_BUILDER.svg`
- `website/assets/img/placeholders/ARCHETYPE_GUARDIAN.svg`

---

## Archetype Section Changes

Updated section identity:

- Section kicker: `The Remnant`
- Heading: `Hero Archetypes`

Expanded roster to eight archetypes:

- The Watchman
- The Exile
- The Fire Warrior
- The Tempted Saint
- The Conqueror
- The Builder
- The Guardian
- The Mad Prophet

Desktop layout:

- 4 cards per row.
- 8 total archetype cards render as `4 + 4`.
- Better density and less scrolling.

Card hierarchy:

1. Archetype name and division label.
2. Description.
3. Image placeholder.
4. Small icon placeholder.

The image placeholders remain visible and preserve filename/dimension/usage text for future asset replacement.

---

## Icon Placeholder Changes

All archetype and enemy icon placeholders remain present.

Icon display was redesigned:

- 36px rendered size.
- Positioned beside title/division label.
- Treated as badge / insignia / military patch.
- Never centered.
- Never focal point.
- Never larger than the archetype title.

QA confirmed visible icons render at `36x36` on desktop and mobile.

---

## Enemy Forces Changes

Updated section identity:

- Section kicker: `Forces of Corruption`
- Heading: `Las cuatro corrupciones`

Enemy cards now use the same dossier structure as archetypes:

- Small icon badge beside title.
- Description before image placeholder.
- Image placeholder remains visible.
- Darker, more threatening panel treatment.

Enemy forces:

- The Whisperer
- The Scarlet Queen
- The Usurper
- Leviathan

---

## Recruitment Section Changes

Removed the weak Telegram/Facebook buttons from the hero capture panel.

Added dedicated recruitment section:

- Section kicker: `Join The Remnant`
- Heading: `Canales de reclutamiento`

Created two premium recruitment cards:

- `Telegram Channel`
- `Private Facebook Group`

Both use `href="#"` placeholders with comments in the HTML indicating where final URLs should go later.

No external links were connected.

---

## Functionality Preserved

No changes were made to:

- MailerLite endpoint.
- Email form action.
- Email form method.
- `fields[email]`.
- Redirect behavior.
- Routes.
- SEO canonicals.

---

## QA Results

### Static Check

Command:

```bash
npm run check
```

Result:

```text
Foundation OK: 10 HTML pages, 7 email forms.
```

Status: Passed.

### Form Verification

Confirmed homepage forms still use:

- MailerLite public subscribe endpoint.
- `method="post"`.
- `name="fields[email]"`.

Confirmed email capture script still contains:

- `fields[email]`.
- `/gracias/?source=mailerlite`.

### Desktop QA

Tested at 1440px width.

Confirmed:

- 8 archetype cards.
- 4 enemy cards.
- Archetype layout renders as `4 + 4`.
- All visible icons render at `36x36`.
- New Builder and Guardian placeholders load.
- No broken images.
- No horizontal overflow.
- Recruitment cards render.
- Forms remain unchanged.

### Mobile QA

Tested at 390px width.

Confirmed:

- All checked icons render at `36x36`.
- No broken images.
- No horizontal overflow.
- Mobile hero now uses `WATCHMAN_HERO_MOBILE.jpg`.
- Recruitment cards render in a mobile-safe stack.

---

## Notes

The placeholder image cards intentionally retain visible filename/dimension/usage references because they are part of the future artwork replacement workflow.

Final artwork can now be replaced later without changing the dossier layout.
