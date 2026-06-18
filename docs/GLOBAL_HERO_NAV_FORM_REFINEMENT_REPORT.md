# Global Hero Nav Form Refinement Report

## Scope

Refined the global hero headline treatment, homepage form card, La Guerra Silenciosa form card, header navigation, and Telegram/Facebook community icon system.

This refinement preserves:

- Existing routes
- Existing forms
- MailerLite endpoint and redirect behavior
- Current images
- Mobile responsiveness
- Global header/footer consistency

## Hero Typography

- Removed the period from the homepage hero headline:
  - `Nunca descubre la guerra`
- Added a cleaner hero serif stack for hero and page-hero H1 elements.
- Preserved metallic gold styling while reducing the heavy block-like feel.
- Applied the refined H1 treatment globally to `.hero h1` and `.page-hero h1`.

## Hero Form Card

Updated the homepage form card:

- Added stronger top spacing and card balance.
- Replaced the old fine-print line with a compact benefits list.
- Added small CSS-only gold check icons for each benefit.
- Preserved full-width email input and full-width submit button.

Benefits added:

- PDF gratuito
- 7 batallas invisibles expuestas
- Alertas y recursos del Remanente
- Sin motivación barata

## La Guerra Silenciosa Form Card

Updated the form card on `/la-guerra-silenciosa/` to match the homepage form card:

- Same `watchpost` card styling.
- Same headline.
- Same short description.
- Same button layout.
- Same benefits list.
- Same visual spacing system.

Preserved original lead page form attributes:

- `data-source="lead-magnet-page"`
- `data-interest="la-guerra-silenciosa"`
- `name="fields[email]"`
- MailerLite endpoint

## Navbar

- Preserved the main header categories:
  - Inicio
  - Mision
  - La Guerra Silenciosa
  - El Remanente
  - Blog
- Added `El Arsenal` as a submenu item under `El Remanente`.
- Used `href="#"` because no merch route exists yet.
- Applied the header submenu across all 10 HTML pages.
- Preserved active nav underline behavior.
- Restored footer links to remain flat and consistent.

## Telegram And Facebook Icons

- Replaced the `TG` and `FB` text badges in the recruitment cards.
- Used existing replaceable placeholder icon assets:
  - `ICON_SOCIAL_TELEGRAM.svg`
  - `ICON_SOCIAL_FACEBOOK.svg`
- Styled icons with a subtle metallic-gold treatment.
- Preserved the current card layout and button text.

## Files Updated

- `website/index.html`
- `website/la-guerra-silenciosa/index.html`
- All HTML page headers
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

- Homepage loaded correctly.
- Hero H1 renders as `Nunca descubre la guerra`.
- Hero H1 uses the refined hero serif stack.
- Homepage form contains all four benefits.
- Homepage form retains MailerLite action, method, and `fields[email]`.
- La Guerra Silenciosa form contains matching card content and benefits.
- La Guerra Silenciosa form retains MailerLite action, method, and `fields[email]`.
- Header nav shows `El Arsenal` under `El Remanente`.
- `El Arsenal` uses `href="#"`.
- Active nav state remains correct on homepage and La Guerra Silenciosa.
- Telegram and Facebook recruitment badges use icon assets.
- No footer submenu wrappers remain.
- No horizontal overflow detected.
- No console warnings or errors detected.

### Mobile QA

Viewport tested: `390x844`

Passed:

- Homepage hero H1 scales to mobile.
- Mobile nav behavior remains unchanged.
- Homepage form card fits within viewport.
- La Guerra Silenciosa form card fits within viewport.
- Benefits lists render on both target forms.
- Telegram and Facebook icon assets remain present.
- No horizontal overflow detected.

## MailerLite Preservation

Confirmed unchanged:

- Endpoint: `https://assets.mailerlite.com/jsonp/2374679/forms/190533263957165697/subscribe`
- Method: `post`
- Email field name: `fields[email]`
- Redirect logic: `/gracias/?source=mailerlite`

## Final Status

The global hero, navbar, form cards, and community icon system now feel more balanced, premium, and aligned with the Watchman Universe visual direction while preserving all launch-critical functionality.
