# HERO SECTION REFINEMENT REPORT

## Scope

This refinement focused only on the homepage hero section.

Preserved without changes:

- MailerLite endpoint
- form action
- form method
- `fields[email]`
- redirect behavior
- public routes

## Changes Implemented

### Hero Image Visibility

- Increased hero artwork visibility by raising image brightness from `.78` to `.94`.
- Reduced the primary dark overlay strength.
- Reduced the atmospheric overlay opacity to `.44`.
- Kept enough dark gradient behind the copy and capture card to preserve readability.

### Hero Form Layout

- Changed the hero email capture row to a vertical layout.
- Email input now spans the full hero form width.
- Submit button now sits directly below the input and also spans the full width.
- Kept the form card dark, metallic, and restrained.

### Hero Topic Pills

Removed the non-clickable hero topic pills:

- `Distraccion`
- `Lujuria`
- `Agotamiento`
- `Proposito perdido`

Also removed the unused `signal-row` CSS rules.

### Hero Body Text

- Refined the hero lead paragraph with smaller sizing, improved line height, softer color, and stronger text shadow.
- Adjusted spacing so the paragraph reads more like a serious manifesto introduction.

### Typography Audit

- Kept major headings in the cinematic serif system.
- Smoothed body rendering for a more polished text surface.
- Strengthened nav text weight.
- Reduced hero H1 scale so desktop remains cinematic while mobile avoids oversized/clipped text.
- Removed an older small-screen override that made mobile hero typography too large.

## QA Results

- `npm run check`: passed.
- Browser desktop QA: passed at 1440x900.
- Browser mobile QA: passed at 390x844.
- Homepage loaded with meaningful content.
- No framework or runtime overlay found.
- Console warnings/errors: none.
- No horizontal overflow detected on desktop or mobile.
- Hero pills confirmed removed: `0` hero `signal-row` elements.
- Hero form confirmed stacked:
  - input full width
  - button full width
  - button below input
- Mobile hero image source confirmed: `WATCHMAN_HERO_MOBILE.jpg`.
- Desktop hero image source confirmed: `WATCHMAN_HERO_DESKTOP.jpg`.

## MailerLite Confirmation

Hero form remains unchanged:

- action: `https://assets.mailerlite.com/jsonp/2374679/forms/190533263957165697/subscribe`
- method: `post`
- email field: `fields[email]`

The JavaScript success redirect remains:

- `/gracias/?source=mailerlite`

## Final Status

Hero refinement is ready for the current MVP UI freeze.
