# Visual and Asset Routing

## Three visual layers

### 1. Canonical Watchman visual identity

Primary home: private Watchman brain.

Read:

- `production/VISUAL_RULES.md`;
- relevant character/force profile;
- relevant location/world file;
- asset registry;
- owner decisions where applicable.

This controls subject identity and canon consistency.

### 2. Website visual implementation

Primary home: public LUV repo.

Useful sources include:

- `docs/VISUAL_REFERENCE.md`;
- design/reference documents;
- `website/docs/DESIGN_SYSTEM.md`;
- website CSS/assets.

Website implementation may adapt canon to responsive UI needs but must not redefine the character/world.

### 3. Social automation visual implementation

Primary home:

`social-automation-bootstrap:automation/social-publisher/`

Important files:

- `src/config/visualProfiles.ts`;
- `references/README.md`;
- R2 reference keys;
- image/prompt services.

The Worker currently locks a visual foundation after the text-generation step.

## Current broad direction

The current social visual foundation emphasizes:

- dark cinematic realism;
- live-action film-frame quality;
- grounded modern mythology;
- believable human-scale spaces/materials;
- emotional restraint;
- weather/atmosphere;
- no superhero/comic/game styling;
- no generic fantasy spectacle;
- raw image without embedded text/logo/watermark.

Character-specific rules override generic style preferences.

## Reference images

A reference image is not automatically the complete canon definition.

Use it together with:

- current character profile;
- current visual rules;
- current negative rules.

## R2 social references

The social Worker expects canonical reference keys for archetypes/enemies plus an optional global style reference.

Reference readiness is an operational concern, not a canon definition.

If a reference is missing, determine whether the Worker has a text-profile fallback before declaring the entire generator broken.

## Asset modifications

Do not replace canonical references merely because a new generated image looks better.

A canonical-reference replacement should be intentional and checked against current canon.

## Text overlays

The automated raw-image generator currently treats typography/logo/watermark as excluded from the raw image prompt.

If a later workflow adds branded overlays, treat overlay composition as a separate post-production layer unless the implementation has explicitly changed.
