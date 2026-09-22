# Canonical image references

The Worker automatically checks R2 for canonical subject references at these keys:

## Archetypes

- `references/archetypes/the-watchman.png`
- `references/archetypes/the-exile.png`
- `references/archetypes/the-fire-warrior.png`
- `references/archetypes/the-tempted-saint.png`
- `references/archetypes/the-conqueror.png`
- `references/archetypes/the-builder.png`
- `references/archetypes/the-wounded-protector.png`
- `references/archetypes/the-mad-prophet.png`

## Enemy forces

- `references/enemies/the-whisperer.png`
- `references/enemies/the-scarlet-queen.png`
- `references/enemies/the-usurper.png`
- `references/enemies/leviathan.png`

## Optional global style reference

- `references/style/watchman-universe-style.png`

Cloudflare FLUX.2 reference inputs must be smaller than 512x512. Keep the longest side at 511px or less.

The system works without the reference files, using locked canonical text profiles. As soon as a matching file exists in R2, the Worker automatically supplies it to FLUX as `input_image_0`. If the global style reference exists, it is supplied as `input_image_1`.

After placing resized files in this directory, upload them with:

```bash
bash scripts/upload-references.sh
```
