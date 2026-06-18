# Homepage Spacing Depth Refinement Report

## Scope

Refined homepage spacing, hero depth, desktop navbar sizing, parallax speed, and archetype/enemy card description spacing.

This refinement preserves:

- MailerLite integration
- Existing routes
- Current images
- Active nav underline behavior
- Mobile responsiveness
- Existing scroll animation system

## Hero Section

Updated desktop hero spacing:

- Reduced empty vertical space above the hero content.
- Moved desktop hero content upward.
- Changed desktop hero grid alignment so the left hero copy starts visually aligned with the top of the form card.
- Kept mobile hero spacing under the existing mobile rules so the layout does not become cramped.

Updated hero form card depth:

- Added a deeper cinematic shadow.
- Added subtle outer gold glow.
- Added a faint layered inner border.
- Preserved a dark, premium, non-glossy finish.

## Parallax

Reduced hero parallax intensity:

- Previous movement: `28px`
- New movement: `12px`

This reduces movement by roughly 57%, keeping the effect cinematic and less distracting.

## Navbar

Updated desktop navbar sizing:

- Increased desktop nav height to `84px`.
- Increased desktop logo scale to `clamp(210px, 25vw, 300px)`.
- Preserved vertical centering for nav links.
- Preserved existing mobile header behavior.
- Applied through shared CSS, so navbar sizing is consistent across pages.

## Archetype And Enemy Cards

Updated card description treatment:

- Reduced vertical gap between card titles and descriptions.
- Tightened description font size and line height.
- Converted archetype and enemy descriptions to uppercase.
- Preserved centered card layout.
- Preserved icons, images, and enemy button overlays.

## Files Updated

- `website/assets/css/styles.css`
- `website/assets/js/scroll-animations.js`

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

### Static Verification

Passed:

- Desktop nav height rule is present.
- Desktop logo scale rule is present.
- Desktop hero grid uses top alignment.
- Hero form card has deeper shadow and layered border treatment.
- Parallax multiplier is reduced to `12px`.
- Archetype and enemy descriptions are uppercase and tighter.
- Mobile header rules remain scoped to the existing mobile breakpoint.

### Browser QA

Blocked:

- Desktop/mobile rendered QA could not be completed because the in-app browser failed to attach to the browser-use page during the localhost QA attempt.
- No alternate browser workaround was used.

## Final Status

The homepage now has tighter hero spacing, stronger form-card depth, a slightly taller premium desktop navbar, slower parallax motion, and cleaner uppercase dossier descriptions for archetype and enemy cards.
