# ENEMY CARD REFINEMENT REPORT

## Scope

Refined the homepage `Forces of Corruption` cards to feel closer to a premium classified archive dossier.

Preserved without changes:

- MailerLite endpoint
- form action
- form method
- `fields[email]`
- redirect behavior
- public routes
- future enemy page hrefs
- icon placeholder assets

## Changes Implemented

### Card Structure

Each enemy card now follows this hierarchy:

- centered icon placeholder
- centered battlefield label
- centered enemy name
- centered description
- large cinematic image
- centered `Ver filosofia` button over the image

### Visual Treatment

- Added enemy-specific archive card styling.
- Centered the icon, label, title, and description.
- Kept enemy names on one line at desktop and mobile QA sizes:
  - `The Whisperer`
  - `The Scarlet Queen`
  - `The Usurper`
  - `Leviathan`
- Created a dedicated `.enemy-image-frame`.
- Moved `Ver filosofia` inside the image frame.
- Added a bottom dark gradient over each image for button readability.
- Kept the image large and cinematic.
- Preserved the desktop 4-column grid.
- Preserved mobile responsiveness with single-column enemy cards.

## Enemy Links

Future enemy page links remain:

- `/enemigos/the-whisperer.html`
- `/enemigos/the-scarlet-queen.html`
- `/enemigos/the-usurper.html`
- `/enemigos/leviathan.html`

No enemy pages were created in this pass.

## QA Results

- `npm run check`: passed.
- Desktop browser QA: passed at 1440x900.
- Mobile browser QA: passed at 390x844.
- Desktop enemy grid confirmed as 4 columns.
- Mobile enemy grid confirmed as 1 column.
- All 4 enemy icons are centered.
- All 4 enemy titles remain on one line in QA measurements.
- All 4 `Ver filosofia` buttons are centered inside the image area.
- No horizontal overflow detected.
- No console warnings/errors detected.

## MailerLite Confirmation

MailerLite remains unchanged:

- endpoint: `https://assets.mailerlite.com/jsonp/2374679/forms/190533263957165697/subscribe`
- email field: `fields[email]`
- redirect: `/gracias/?source=mailerlite`

## Final Status

Enemy card refinement is ready for the current MVP visual pass.
