import type { ContentItem, Env, GeneratedPost } from '../types';
import { VISUAL_PROFILES, normalizeVisualKey } from '../config/visualProfiles';

const POST_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    hook: { type: 'string' },
    quote_text: { type: 'string' },
    instagram_caption: { type: 'string' },
    facebook_caption: { type: 'string' },
    tiktok_title: { type: 'string' },
    tiktok_description: { type: 'string' },
    hashtags: {
      type: 'array',
      minItems: 5,
      maxItems: 5,
      items: { type: 'string' },
    },
    scene_concept: { type: 'string' },
    environment: { type: 'string' },
    composition: { type: 'string' },
    symbolic_detail: { type: 'string' },
  },
  required: [
    'hook',
    'quote_text',
    'instagram_caption',
    'facebook_caption',
    'tiktok_title',
    'tiktok_description',
    'hashtags',
    'scene_concept',
    'environment',
    'composition',
    'symbolic_detail',
  ],
} as const;

export async function generatePostPackage(env: Env, item: ContentItem): Promise<GeneratedPost> {
  const identity = [item.archetype, item.enemy_force].filter(Boolean).join(' vs ');
  const visualKey =
    normalizeVisualKey(item.archetype) ??
    normalizeVisualKey(item.enemy_force) ??
    'generic';
  const visualProfile = VISUAL_PROFILES[visualKey];
  const battlefieldSymbolRules = getBattlefieldSymbolRules(item.battlefield);
  const enemyStaging = item.enemy_force
    ? `
ENEMY-FORCE STAGING
This is an Enemy Force post.
The named force (${item.enemy_force}) must be visually perceptible in the scene.
It can appear directly, through silhouette, reflection, environmental scale,
human presence, or another grounded cinematic manifestation appropriate to its canon.
Do not omit the enemy force and do not reduce it to a random prop.
A human subject may also appear to show scale, temptation, pressure or consequence.
For the current Watchman Universe social system, default the human protagonist to an adult man unless the canonical source clearly requires a woman.
When the enemy force is The Scarlet Queen, show her exerting counterfeit desire, validation, temptation or seductive pressure on a male protagonist; do not make a second unrelated woman the primary tempted subject.
The battlefield (${item.battlefield || 'unspecified'}) and theme (${item.theme})
must be readable through the visual relationship between the human scene and the force.
`.trim()
    : '';

  const prompt = `
You are the content engine for ${env.BRAND_NAME}, inside The Watchman Universe.
Create ONE Spanish social-media post package derived from the provided canonical source.

CANONICAL SOURCE
Source type: ${item.source_type}
Archetype/enemy: ${identity || 'general Watchman Universe'}
Battlefield: ${item.battlefield || 'unspecified'}
Theme: ${item.theme}
Source: ${item.source_text}

LANGUAGE LOCK
- All public-facing copy must be natural, idiomatic Spanish.
- Never use Spanglish.
- Never substitute English nouns when a normal Spanish word exists.
- Grammar, gender and articles must be correct.
- Prefer clear Latin American Spanish suitable for Mexico.
- Proper Watchman Universe character names may remain in English.

VOICE
- Psychologically precise, spiritually intense, masculine, disciplined, direct.
- Confrontation over generic motivation.
- No politics.
- No fabricated Bible quotations or verse references.
- Do not claim the mythology is literal demonology.
- Avoid therapy/influencer/corporate language.

SOURCE FIDELITY LOCK
- Every public-facing line must remain directly anchored to the supplied Source, Theme and Battlefield.
- Do not drift into adjacent topics merely because they are emotionally related.
- The hook must confront the exact core lie, danger, discipline or consequence in the source.
- The quote must sharpen the source into an original Watchman-style statement, not turn it into generic inspiration.
- If the theme is "Counterfeit desire", the hook and quote must explicitly deal with false desire, appetite, validation, pleasure, compromise or counterfeit affection—not generic loneliness.
- If the theme is "Remember who you are", the hook and quote must directly deal with identity, direction, calling, imitation or replacement.
- If the theme is "Correction", the hook and quote must directly deal with pride, correction, humility, teachability or refusal to listen.

CONTENT RULES
- hook: short, hard-hitting, specific to the source; avoid vague motivational statements.
- quote_text: 1-2 sentence original derivative quote that preserves the source meaning.
- instagram_caption: useful caption with CTA; no hashtags inside.
- facebook_caption: slightly deeper; include a discussion question; no hashtags inside.
- tiktok_title: under 90 characters.
- tiktok_description: concise, hook-driven; no hashtags inside.
- hashtags: exactly 5 relevant hashtags.

SCENE-DESIGN RULES
${enemyStaging}

ARCHETYPE-SPECIFIC SCENE CONSTRAINTS:
${visualProfile.sceneRules}

GLOBAL SCENE GROUNDING:
- Default to a believable present-day 2026 setting unless the canonical source explicitly requires otherwise.
- Do not invent swords, shields, medieval weapons, fantasy armor, thrones, castles, magical objects or superhero action.
- Do not create miniature people, floating metaphor objects, staged allegorical props or impossible symbolic tableaux.
- Do not place isolated or solitary subjects on cliff edges, rooftop edges, bridge edges, rail tracks or other positions that could read as self-harm, imminent falling or reckless danger. Use secure ground such as a trail, broad ridge, clearing, road, room, platform interior or wide overlook.
- symbolic_detail must be a physically plausible environmental detail that DIRECTLY reinforces the battlefield and theme. Do not choose a generic symbol merely because it looks cinematic.

BATTLEFIELD-SPECIFIC SYMBOL RULES:
${battlefieldSymbolRules}
- Characters should be caught in a believable moment, not posing for a poster.
- Prefer ordinary modern spaces transformed by cinematography: apartment, street, rooftop, bridge, office, workshop, gym, church corridor, parking structure, industrial site, hospital corridor, transit platform.
- Keep symbolism restrained and secondary to the human scene.

You do NOT control the character design, universe style, palette, lighting system,
costume identity or negative prompt. Those are locked later by the Worker.
Only design a fresh cinematic scene that expresses the source meaning.
- scene_concept: what is physically happening in the frame.
- environment: a believable location and environmental conditions.
- composition: camera framing, subject placement and visual distance.
- symbolic_detail: one restrained, physically plausible visual symbol that specifically supports the battlefield and theme.
Do not mention typography or text overlays.
Do not redesign or describe the archetype costume.
`;

  const result = await env.AI.run(env.TEXT_MODEL as any, {
    messages: [
      {
        role: 'system',
        content:
          'Return the requested structured object. Public copy must be idiomatic Spanish with no Spanglish. Preserve the exact Source/Theme/Battlefield meaning and reject adjacent-topic drift. Proofread grammar, gender and agreement before returning. Scene ideas must obey the supplied modern grounded constraints and masculine protagonist default. Follow the JSON schema exactly.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.55,
    max_completion_tokens: 1600,
    response_format: {
      type: 'json_schema',
      json_schema: POST_SCHEMA,
    },
  } as any) as any;

  const parsed = extractStructuredObject(result);

  return normalizePost({
    hook: requireString(parsed, 'hook'),
    quote_text: requireString(parsed, 'quote_text'),
    instagram_caption: requireString(parsed, 'instagram_caption'),
    facebook_caption: requireString(parsed, 'facebook_caption'),
    tiktok_title: requireString(parsed, 'tiktok_title').slice(0, 90),
    tiktok_description: requireString(parsed, 'tiktok_description'),
    hashtags: requireStringArray(parsed, 'hashtags').slice(0, 5),
    scene_concept: requireString(parsed, 'scene_concept'),
    environment: requireString(parsed, 'environment'),
    composition: requireString(parsed, 'composition'),
    symbolic_detail: requireString(parsed, 'symbolic_detail'),
  });
}

function getBattlefieldSymbolRules(battlefield: string | null): string {
  const key = (battlefield ?? '').trim().toLowerCase();

  if (key === 'identity') {
    return [
      'Use identity-specific cues only: mirror, reflection, duplicated silhouette, replaced nameplate, discarded ID badge, altered clothing, empty chair at the subject\'s place, or another grounded sign of replacement/distortion.',
      'Do NOT use correction notes, generic broken chains, random shoes, or unrelated props.',
    ].join(' ');
  }

  if (key === 'pride') {
    return [
      'Use pride/correction cues only: unread correction note, ignored message, cracked mirror, elevated glass office, closed notebook/Bible, discarded work gloves, or another believable consequence of refusing correction.',
      'Do NOT use identity badges, romantic props, or generic abandonment symbols.',
    ].join(' ');
  }

  if (key === 'desire' || key === 'temptation') {
    return [
      'Use temptation/desire cues only: second glass, unread intimate message, open doorway, discarded ring, reflected figure, untouched family photo, or another believable cue tied to appetite and compromise.',
      'Do NOT use correction notes or identity badges unless the theme explicitly requires them.',
    ].join(' ');
  }

  if (key === 'mind' || key === 'delay') {
    return [
      'Use mental-deception/delay cues only: clock, repeated alarm, unfinished work, unread messages, dim screen, closed door, abandoned task, or another believable cue tied to hesitation and drift.',
      'Do NOT use unrelated romantic or identity props.',
    ].join(' ');
  }

  if (key === 'responsibility') {
    return [
      'Use responsibility/protection cues only: family photo, child\'s backpack, keys by the door, work gloves, unpaid bill, hospital wristband, wedding ring, empty dinner chair, or another believable responsibility-bearing object.',
      'Do NOT use swords, shields, miniature family figures, or fantasy symbols.',
    ].join(' ');
  }

  if (key === 'isolation') {
    return [
      'Use isolation/refinement cues only: a solitary trail, footprints in snow, distant cabin light, worn map, packed rucksack, campfire remains, black wolf companion, fork in the path, or another grounded sign of separation producing clarity.',
      'Keep the subject on secure ground. Do NOT use cliff edges, rooftop edges, bridge edges, rail tracks, abandoned shoes at an edge, or imagery that could imply self-harm or imminent falling.',
    ].join(' ');
  }

  if (key === 'discipline') {
    return [
      'Use discipline cues only: alarm clock, training shoes, packed gym bag, unfinished checklist, stairs, stopwatch, workbench, cold shower steam, or another believable object tied to repeated action and self-command.',
      'Do NOT use broken chains unless the source specifically calls for bondage/freedom imagery.',
    ].join(' ');
  }

  return 'Choose one restrained, physically plausible detail directly tied to the stated battlefield and theme. Avoid generic cinematic props.';
}

function normalizePost(post: GeneratedPost): GeneratedPost {
  const fixSpanish = (value: string): string =>
    value
      .replace(/\bel mission\b/gi, 'la misión')
      .replace(/\bmission\b/gi, 'misión')
      .replace(/\bpurpose\b/gi, 'propósito')
      .replace(/\bun espada\b/gi, 'una espada');

  return {
    ...post,
    hook: fixSpanish(post.hook),
    quote_text: fixSpanish(post.quote_text),
    instagram_caption: fixSpanish(post.instagram_caption),
    facebook_caption: fixSpanish(post.facebook_caption),
    tiktok_title: fixSpanish(post.tiktok_title),
    tiktok_description: fixSpanish(post.tiktok_description),
  };
}

function extractStructuredObject(result: any): Record<string, unknown> {
  if (result?.response && typeof result.response === 'object' && !Array.isArray(result.response)) {
    return result.response as Record<string, unknown>;
  }

  const parsedChoice = result?.choices?.[0]?.message?.parsed;
  if (parsedChoice && typeof parsedChoice === 'object' && !Array.isArray(parsedChoice)) {
    return parsedChoice as Record<string, unknown>;
  }

  const text =
    typeof result?.response === 'string'
      ? result.response
      : typeof result?.choices?.[0]?.message?.content === 'string'
        ? result.choices[0].message.content
        : null;

  if (text) {
    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      // Fall through.
    }
  }

  throw new Error(
    `Structured AI response missing or invalid: ${JSON.stringify(result).slice(0, 1200)}`,
  );
}

function requireString(value: Record<string, unknown>, key: string): string {
  const field = value[key];
  if (typeof field !== 'string' || !field.trim()) {
    throw new Error(`Structured AI response missing string field: ${key}`);
  }
  return field.trim();
}

function requireStringArray(value: Record<string, unknown>, key: string): string[] {
  const field = value[key];
  if (!Array.isArray(field) || field.some((item) => typeof item !== 'string')) {
    throw new Error(`Structured AI response missing string array field: ${key}`);
  }
  return field.map((item) => item.trim()).filter(Boolean);
}
