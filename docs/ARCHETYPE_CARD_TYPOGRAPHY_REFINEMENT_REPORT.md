# Archetype Card Typography Refinement Report

## Scope

Implemented the final hero archetype card and global typography refinement for the public MVP homepage.

This refinement preserves:

- MailerLite endpoint and form behavior
- Existing routes
- Existing image filenames
- Existing icon filenames
- Existing enemy card structure
- Existing SEO metadata

## Archetype Card Changes

- Rebuilt each Hero Archetype card to match the current classified archive direction used by the enemy cards.
- Centered the division label, archetype name, and description in the dossier area.
- Removed archetype icons from the top-left title layout.
- Moved each archetype icon into the image area as a small centered bottom overlay.
- Added a subtle bottom image gradient so the icon remains readable without becoming the focal point.
- Preserved the large cinematic archetype images and all asset replacement filenames.
- Preserved the desktop 4 + 4 roster layout.
- Preserved responsive mobile behavior.

## Typography Changes

- Strengthened the global cinematic serif stack for headings and title-like UI.
- Increased heading and card title weight to feel more masculine, archival, and Watchman Universe aligned.
- Applied tighter uppercase treatment and controlled letter spacing to H2 headers and card titles.
- Kept body copy on the existing clean sans-serif system for readability.
- Tuned desktop H2 sizing so section headers feel premium without becoming oversized.

## Files Updated

- `website/index.html`
- `website/assets/css/styles.css`

## QA Results

### Project Check

Passed:

```text
npm run check
Foundation OK: 10 HTML pages, 7 email forms.
```

### Desktop QA

Viewport tested: `1440x900`

Passed:

- Homepage loads with correct title.
- No console warnings or errors.
- Archetype grid renders as four columns.
- Eight archetype cards render in a 4 + 4 structure.
- Archetype labels, titles, and descriptions are centered.
- Archetype icons are no longer inside the headline layout.
- Archetype icons render inside the image frame at 36px.
- All archetype titles fit on one line at desktop width.
- Enemy card buttons and future links remain intact.
- No horizontal overflow detected.

### Mobile QA

Viewport tested: `390x844`

Passed:

- Archetype cards collapse to one column.
- No horizontal overflow detected.
- Archetype titles fit within card width.
- Archetype icons remain in the image area.
- Mobile H2 headers remain responsive and readable.

## MailerLite Preservation

Confirmed unchanged:

- Form endpoint: `https://assets.mailerlite.com/jsonp/2374679/forms/190533263957165697/subscribe`
- Form method: `post`
- Email field name: `fields[email]`
- Redirect logic: `/gracias/?source=mailerlite`

## Final Status

The Hero Archetype cards now match the stronger classified dossier direction established by the enemy cards while preserving functionality, routes, assets, and responsive behavior.
