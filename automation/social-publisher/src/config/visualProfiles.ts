export type VisualKey =
  | 'the-watchman'
  | 'lone-wolf'
  | 'the-fire-warrior'
  | 'the-tempted-saint'
  | 'the-conqueror'
  | 'the-builder'
  | 'the-wounded-protector'
  | 'the-mad-prophet'
  | 'the-whisperer'
  | 'the-scarlet-queen'
  | 'the-usurper'
  | 'leviathan'
  | 'generic';

export interface VisualProfile {
  key: VisualKey;
  label: string;
  identity: string;
  palette: string;
  lighting: string;
  atmosphere: string;
  sceneRules: string;
  negative: string;
  referenceKey?: string;
}

export const STYLE_REFERENCE_KEY = 'references/style/watchman-universe-style.png';

export const UNIVERSE_FOUNDATION = `
THE WATCHMAN UNIVERSE — CANONICAL VISUAL FOUNDATION

Dark cinematic realism. Live-action film-frame quality.
Grounded modern mythology, never fantasy spectacle.
Human-scale environments and believable materials.
Emotionally restrained subjects. Quiet intensity over theatrical posing.
Weathered textures, atmospheric depth, controlled contrast.
Deep black, charcoal, ash, cold steel blue, muted silver,
faded gold and restrained ember tones.
Visual storytelling through posture, environment, distance, weather and light.
No text, typography, logo or watermark inside the raw image.
`.trim();

export const GLOBAL_NEGATIVE = `
superhero styling, Marvel aesthetic, DC aesthetic, anime, manga,
comic-book rendering, fantasy-game armor, RPG character design,
magical spell effects, neon overload, cyberpunk excess,
exaggerated heroic pose, rage screaming, glossy CGI,
plastic skin, pristine costume, oversaturated fire,
cartoon proportions, game UI, text, typography, logo, watermark
`.trim();

export const VISUAL_PROFILES: Record<VisualKey, VisualProfile> = {
  'the-watchman': {
    key: 'the-watchman',
    label: 'The Watchman',
    identity: `
A solitary hooded male watchman. Weathered dark coat or cloak.
A practical lantern is part of his visual identity.
Modern vigilance, burden, discernment, restraint.
He never poses like a superhero and never appears theatrical.
His presence is quiet, observant and serious.
    `.trim(),
    palette: 'deep black, charcoal, cold steel blue, muted gray, faded gold',
    lighting: 'low-key cinematic light, practical lantern glow, distant ambient city light',
    atmosphere: 'rain, fog, night air, urban silence, restrained tension',
    sceneRules: 'Present-day urban vigilance: rooftops, streets, bridges, stations, apartments, churches, offices, rain or fog. Lantern may appear. No medieval weapons, castles or fantasy battlefields.',
    negative: GLOBAL_NEGATIVE,
    referenceKey: 'references/archetypes/the-watchman.png',
  },

  'lone-wolf': {
    key: 'lone-wolf',
    label: 'Lone Wolf',
    identity: `
A hardened male scout, pathfinder, rescuer and guide who left Babylon after refusing compromise.
He operates independently through the frozen Wilderness: snow-covered forests, abandoned roads,
mountain passes, ruined settlements, cabins and old rail lines.
Weathered dark cloak, layered survival garments, rugged boots and battle-worn realism.
A massive black wolf travels with him as an angelic companion sent by God:
silent, vigilant, loyal, ancient and protective.
Lone Wolf is restrained, observant, hyper-independent and spiritually awake.
Never fantasy-ranger cosplay, never a generic medieval hero.
    `.trim(),
    palette: 'ash gray, black, cold blue-gray, muted silver, restrained moonlit white',
    lighting: 'cold natural light, moonlight, overcast dawn or dusk, restrained lantern or firelight',
    atmosphere: 'snow, frozen wind, wilderness silence, isolation, vigilance, survival, covenant',
    sceneRules: 'Snowy Wilderness continuity: frozen mountains, pine forests, fog valleys, abandoned roads, ruined towns, cabins, rail lines and storm-battered trails. The massive black wolf may accompany him naturally and should feel intelligent, vigilant and protective. Lone Wolf functions as scout, pathfinder, rescuer and guide. No generic fantasy ranger styling, magic spell effects, ornate medieval hero gear or triumphant superhero posing.',
    negative: GLOBAL_NEGATIVE,
    referenceKey: 'references/archetypes/lone-wolf.png',
  },

  'the-fire-warrior': {
    key: 'the-fire-warrior',
    label: 'The Fire Warrior',
    identity: `
A battle-worn masculine warrior shaped by refinement through adversity.
Dark layered weathered garments and practical armor.
Burned cloak edges, subtle ember cracks, ash and scarred materials.
Calm, dangerous, emotionally controlled expression.
No fantasy-paladin design. No ornate game armor. No rage pose.
    `.trim(),
    palette: 'charcoal black, burnt ash gray, deep ember orange, dark metallic, faded gold',
    lighting: 'ember backlight through smoke, restrained warm highlights, sacred light through darkness',
    atmosphere: 'ash, smoke, aftermath, ruined ground, disciplined intensity',
    sceneRules: 'Aftermath, ash, heat, industrial ruins, burned structures or hard training environments. Fire is restrained and physical. No magic fire, giant swords, medieval battlefield or fantasy armor spectacle.',
    negative: GLOBAL_NEGATIVE,
    referenceKey: 'references/archetypes/the-fire-warrior.png',
  },

  'the-tempted-saint': {
    key: 'the-tempted-saint',
    label: 'The Tempted Saint',
    identity: `
A modern masculine subject caught in an internal moral conflict.
Conviction versus desire, spirit versus appetite, purpose versus impulse.
The tension is visible through expression and posture, not melodrama.
    `.trim(),
    palette: 'black, soft gray, muted crimson accents, dim silver',
    lighting: 'shadow-heavy interior light, selective highlights, intimate cinematic contrast',
    atmosphere: 'private war, secrecy, temptation, psychological tension',
    sceneRules: 'Present-day private environments: apartment, hallway, car, hotel room, city street, church corridor. Temptation is psychological and believable. No supernatural seduction effects or fantasy imagery.',
    negative: GLOBAL_NEGATIVE,
    referenceKey: 'references/archetypes/the-tempted-saint.png',
  },

  'the-conqueror': {
    key: 'the-conqueror',
    label: 'The Conqueror',
    identity: `
A disciplined masculine warrior-athlete defined by self-mastery.
Strong, stoic, composed and purposeful.
A restrained crown may appear only when symbolically appropriate.
No vanity, no superhero stance, no bodybuilding-poster exaggeration.
    `.trim(),
    palette: 'black, steel gray, faded gold, muted white',
    lighting: 'hard directional cinematic light with disciplined contrast',
    atmosphere: 'self-mastery, battle-readiness, discipline, controlled strength',
    sceneRules: 'Present-day discipline and self-mastery: gym, early-morning apartment, rain-soaked street, stairs, training space, empty arena or austere room. No swords, shields, medieval battlefield or superhero staging. Crown only if subtle and symbolically justified.',
    negative: GLOBAL_NEGATIVE,
    referenceKey: 'references/archetypes/the-conqueror.png',
  },

  'the-builder': {
    key: 'the-builder',
    label: 'The Builder',
    identity: `
A masculine figure of purpose, construction, responsibility and endurance.
Practical strength. Work-worn clothing and believable tools or materials when relevant.
Mission-oriented rather than glamorous.
    `.trim(),
    palette: 'slate, black, dark earth, muted gold',
    lighting: 'grounded work light or subdued morning light with cinematic depth',
    atmosphere: 'work, structure, responsibility, legacy, resilience',
    sceneRules: 'Present-day construction, workshop, desk, jobsite, warehouse, home project or city infrastructure. Use believable tools and materials. No medieval forge, fantasy architecture or ceremonial weapons.',
    negative: GLOBAL_NEGATIVE,
    referenceKey: 'references/archetypes/the-builder.png',
  },

  'the-wounded-protector': {
    key: 'the-wounded-protector',
    label: 'The Wounded Protector',
    identity: `
A protective masculine figure who carries visible cost without collapse.
Battle-worn and burdened. Strength exists in service of responsibility.
His posture communicates endurance, protection and sacrifice.
    `.trim(),
    palette: 'black, gray, deep muted bronze, faded gold',
    lighting: 'somber low-key light with restrained warm highlights',
    atmosphere: 'responsibility, pain, protection, sacrifice, endurance',
    sceneRules: 'Present-day protective responsibility: apartment, hospital corridor, rainy street, home doorway, vehicle, rooftop observation or family environment. No sword, shield, medieval armor, fantasy warrior pose or miniature family symbolism. Protection should be shown through posture, distance, wear, environment and believable human stakes.',
    negative: GLOBAL_NEGATIVE,
    referenceKey: 'references/archetypes/the-wounded-protector.png',
  },

  'the-mad-prophet': {
    key: 'the-mad-prophet',
    label: 'The Mad Prophet',
    identity: `
A gaunt, intense, unsettling prophetic masculine figure.
Wild but believable realism. Hard eyes, weathered face, disruptive presence.
Dark and disturbing without demonic caricature or supernatural spectacle.
    `.trim(),
    palette: 'deep black, sickly gray, muted ember, dirty faded gold',
    lighting: 'harsh chiaroscuro and directional practical light',
    atmosphere: 'warning, confrontation, dread, uncompromising truth',
    sceneRules: 'Present-day unsettling realism: alley, abandoned room, rooftop, empty church, street corner, industrial interior. Disturbing through expression and atmosphere, not monsters, occult ritual or supernatural spectacle.',
    negative: GLOBAL_NEGATIVE,
    referenceKey: 'references/archetypes/the-mad-prophet.png',
  },

  'the-whisperer': {
    key: 'the-whisperer',
    label: 'The Whisperer',
    identity: `
A subtle manipulative presence representing corruption of the mind.
Persuasive, shadowed and psychologically invasive rather than monstrous.
Its danger feels intimate and plausible.
    `.trim(),
    palette: 'black, smoke gray, cold silver-blue',
    lighting: 'low visibility, soft-edged shadows, minimal cold highlights',
    atmosphere: 'deception, suggestion, mental fog, delay, uncertainty',
    sceneRules: 'Present-day psychological intrusion: office, bedroom, transit, mirror, phone-lit room, hallway or crowd. Threat is subtle and human-scale. No demon form, horns, magic smoke or fantasy creature design.',
    negative: GLOBAL_NEGATIVE,
    referenceKey: 'references/enemies/the-whisperer.png',
  },

  'the-scarlet-queen': {
    key: 'the-scarlet-queen',
    label: 'The Scarlet Queen',
    identity: `
Elegant counterfeit beauty representing corrupted desire.
Controlled, sophisticated, dangerous and psychologically seductive.
Never tacky, never fantasy cosplay, never exaggerated pin-up styling.
    `.trim(),
    palette: 'black, scarlet, muted crimson, dim gold',
    lighting: 'soft dangerous glamour light constrained by deep shadow',
    atmosphere: 'desire, seduction, counterfeit intimacy, quiet danger',
    sceneRules: 'Present-day luxury or intimate spaces: hotel, lounge, apartment, restaurant, car, corridor. Default the human target to an adult man under subtle pressure from The Scarlet Queen. Her presence may be direct, reflected, partially obscured or implied through proximity, but she remains the active corrupting force. Seduction is elegant and plausible. No second unrelated woman as the primary tempted subject, no fantasy throne room, sorceress costume, magical aura or pin-up exaggeration.',
    negative: GLOBAL_NEGATIVE,
    referenceKey: 'references/enemies/the-scarlet-queen.png',
  },

  'the-usurper': {
    key: 'the-usurper',
    label: 'The Usurper',
    identity: `
A human-scale representation of false identity and stolen purpose.
Controlled, intelligent, manipulative and imitative.
The threat is replacement and distortion rather than brute force.
    `.trim(),
    palette: 'black, gunmetal, dim silver, shadow blue',
    lighting: 'cold dramatic light with identity-distorting shadow',
    atmosphere: 'identity attack, imitation, confusion, counterfeit purpose',
    sceneRules: 'Present-day identity conflict: mirror, boardroom, office, apartment, stage, hallway, city street. Use doubles, reflections, replacement or social power subtly. No fantasy king, medieval throne or magical transformation.',
    negative: GLOBAL_NEGATIVE,
    referenceKey: 'references/enemies/the-usurper.png',
  },

  leviathan: {
    key: 'leviathan',
    label: 'Leviathan',
    identity: `
An oppressive symbolic embodiment of pride and self-exaltation.
May appear as a vast dark serpentine or oceanic presence,
but must remain grounded in cinematic realism and atmosphere.
It should feel ancient, heavy and overwhelming, not like a fantasy boss creature.
    `.trim(),
    palette: 'black, abyssal blue, dark metallic gray, cold silver',
    lighting: 'storm light, oppressive cloud mass, narrow cold highlights',
    atmosphere: 'pride, scale, oppression, elevation, impending collapse',
    sceneRules: 'Leviathan may be symbolic and immense, but integrate it into realistic storm, sea, skyline or architectural scale. Avoid fantasy-boss staging, glowing eyes, magic attacks or game-monster composition.',
    negative: GLOBAL_NEGATIVE,
    referenceKey: 'references/enemies/leviathan.png',
  },

  generic: {
    key: 'generic',
    label: 'Watchman Universe Subject',
    identity: `
A grounded masculine subject inside The Watchman Universe.
Quiet confrontation, moral weight, believable clothing and materials.
No spectacle and no generic fantasy imagery.
    `.trim(),
    palette: 'black, charcoal, steel blue, muted gray, faded gold',
    lighting: 'low-key cinematic realism',
    atmosphere: 'moody, restrained, symbolic, vigilant',
    sceneRules: 'Default to present-day 2026 environments. Human-scale, plausible, cinematic situations. No medieval weapons, fantasy architecture, magical effects, superhero posing or literal miniature metaphors.',
    negative: GLOBAL_NEGATIVE,
  },
};

export function normalizeVisualKey(value: string | null | undefined): VisualKey | null {
  const normalized = (value ?? '').trim().toLowerCase();
  const map: Record<string, VisualKey> = {
    'the watchman': 'the-watchman',
    'watchman': 'the-watchman',
    'lone wolf': 'lone-wolf',
    'the lone wolf': 'lone-wolf',
    'the exile': 'lone-wolf',
    'exile': 'lone-wolf',
    'the fire warrior': 'the-fire-warrior',
    'fire warrior': 'the-fire-warrior',
    'the tempted saint': 'the-tempted-saint',
    'tempted saint': 'the-tempted-saint',
    'the conqueror': 'the-conqueror',
    'conqueror': 'the-conqueror',
    'the builder': 'the-builder',
    'builder': 'the-builder',
    'the wounded protector': 'the-wounded-protector',
    'wounded protector': 'the-wounded-protector',
    'the guardian': 'the-wounded-protector',
    'guardian': 'the-wounded-protector',
    'the mad prophet': 'the-mad-prophet',
    'mad prophet': 'the-mad-prophet',
    'the whisperer': 'the-whisperer',
    'whisperer': 'the-whisperer',
    'the scarlet queen': 'the-scarlet-queen',
    'scarlet queen': 'the-scarlet-queen',
    'the usurper': 'the-usurper',
    'usurper': 'the-usurper',
    'leviathan': 'leviathan',
  };
  return map[normalized] ?? null;
}
