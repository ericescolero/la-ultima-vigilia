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

CONTENT RULES
- hook: short and hard-hitting.
- quote_text: 1-2 sentence original derivative quote.
- instagram_caption: useful caption with CTA; no hashtags inside.
- facebook_caption: slightly deeper; include a discussion question; no hashtags inside.
- tiktok_title: under 90 characters.
- tiktok_description: concise, hook-driven; no hashtags inside.
- hashtags: exactly 5 relevant hashtags.

SCENE-DESIGN RULES
ARCHETYPE-SPECIFIC SCENE CONSTRAINTS:
${visualProfile.sceneRules}

GLOBAL SCENE GROUNDING:
- Default to a believable present-day 2026 setting unless the canonical source explicitly requires otherwise.
- Do not invent swords, shields, medieval weapons, fantasy armor, thrones, castles, magical objects or superhero action.
- Do not create miniature people, floating metaphor objects, staged allegorical props or impossible symbolic tableaux.
- symbolic_detail must be a physically plausible environmental detail: an empty chair, worn family photo, child's backpack, unlit doorway, broken watch, wedding ring, work gloves, rain on glass, abandoned tool, etc.
- Characters should be caught in a believable moment, not posing for a poster.
- Prefer ordinary modern spaces transformed by cinematography: apartment, street, rooftop, bridge, office, workshop, gym, church corridor, parking structure, industrial site, hospital corridor, transit platform.
- Keep symbolism restrained and secondary to the human scene.

You do NOT control the character design, universe style, palette, lighting system,
costume identity or negative prompt. Those are locked later by the Worker.
Only design a fresh cinematic scene that expresses the source meaning.
- scene_concept: what is physically happening in the frame.
- environment: a believable location and environmental conditions.
- composition: camera framing, subject placement and visual distance.
- symbolic_detail: one restrained visual symbol supporting the theme.
Do not mention typography or text overlays.
Do not redesign or describe the archetype costume.
`;

  const result = await env.AI.run(env.TEXT_MODEL as any, {
    messages: [
      {
        role: 'system',
        content:
          'Return the requested structured object. Public copy must be idiomatic Spanish with no Spanglish. Proofread grammar, gender and agreement before returning. Scene ideas must obey the supplied modern grounded constraints. Follow the JSON schema exactly.',
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

function normalizePost(post: GeneratedPost): GeneratedPost {
  const fixSpanish = (value: string): string =>
    value
      .replace(/\bel mission\b/gi, 'la misión')
      .replace(/\bmission\b/gi, 'misión')
      .replace(/\bpurpose\b/gi, 'propósito');

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
