# Source of Truth Map

## Rule

La Última Vigilia has several valid sources of truth because different components own different facts.

"Source of truth" means the authoritative editing home for a specific kind of information.

## Precedence by domain

### Theology / eschatology

1. Scripture.
2. Current explicit owner decision.
3. Private Watchman brain:
   - `governance/eschatology/ESCHATOLOGY_MASTER_FOUNDATION.md`
   - `governance/eschatology/MASTER_PROPHETIC_TIMELINE.md`
   - `governance/eschatology/DOCTRINE_CLASSIFICATION_MATRIX.md`
   - topic-specific eschatology files.
4. Story adaptation.
5. Historical imports/research.

A story or visual cannot create doctrine.

### Canon / characters / world / story

1. Current explicit owner decision.
2. Private brain owner-decision ledger and interpretation/source-of-truth governance.
3. Relevant current canon/domain file.
4. Private production standards.
5. Historical source evidence.
6. Older public website canon summaries.
7. Legacy material.

### Published Field Manuals

Editing home:

`ericescolero/la-ultima-vigilia:main/content/field-manuals/`

Private production rules can constrain how a new manual is written, but do not create an independent second editable copy.

### Website

Implementation truth:

`ericescolero/la-ultima-vigilia:main/website/`

Deployment truth:

- `CLOUDFLARE_DEPLOYMENT_SETTINGS.md`
- `website/docs/DEPLOYMENT.md`

### Public website content

Use the relevant files under:

- `content/`
- `website/content/`
- generated website output where the build system explicitly owns it.

Do not hand-edit generated output when the documented build pipeline says the source file should be edited instead.

### Social automation

Implementation truth:

`social-automation-bootstrap:automation/social-publisher/`

Inspect:

- `wrangler.jsonc`;
- current source code;
- migrations;
- current reference README;
- queue/log/reference admin endpoints;
- deployed environment state when accessible.

Do not infer runtime state only from an old README.

### Visual canon

For character/world identity:

private brain current visual/canon files.

For website layout/style implementation:

public repo website design documents/CSS/assets.

For social Worker prompt-lock implementation:

social branch `src/config/visualProfiles.ts` and R2 reference conventions.

## Older public canon documents

Files such as `docs/CANON_GOVERNANCE.md` remain useful public-era guidance, especially for mission and website consistency.

However, where they conflict with the later private Watchman brain, use the private brain for current canon/theology/story truth.

Do not delete historical governance merely because newer authority exists.

## Legacy rule

`pyrokryptic_ai/La Ultima Vigilia/` is evidence, not default current instruction.

## Conflict handling

If two current sources appear to disagree:

1. identify their domains;
2. determine which file owns the disputed fact;
3. check current owner decisions;
4. preserve unresolved conflict rather than inventing a synthesis;
5. ask Eric only if the conflict cannot be resolved from current governance.
