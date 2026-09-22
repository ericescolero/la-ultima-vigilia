import type { ContentItem, Env, GeneratedPost } from '../types';

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
    image_prompt: { type: 'string' },
  },
  required: [
    'hook',
    'quote_text',
    'instagram_caption',
    'facebook_caption',
    'tiktok_title',
    'tiktok_description',
    'hashtags',
    'image_prompt',
  ],
} as const;

export async function generatePostPackage(env: Env, item: ContentItem): Promise<GeneratedPost> {
  const identity = [item.archetype, item.enemy_force].filter(Boolean).join(' vs ');

  const prompt = `
You are the content engine for ${env.BRAND_NAME}, inside The Watchman Universe.
Create ONE Spanish social-media post package derived from the provided canonical source.

CANONICAL SOURCE
Source type: ${item.source_type}
Archetype/enemy: ${identity || 'general Watchman Universe'}
Battlefield: ${item.battlefield || 'unspecified'}
Theme: ${item.theme}
Source: ${item.source_text}

VOICE
- Spanish public-facing copy.
- Psychologically precise, spiritually intense, masculine, disciplined, direct.
- Confrontation over generic motivation.
- No politics.
- No fabricated Bible quotations or verse references.
- Do not claim the mythology is literal demonology.
- Avoid therapy/influencer/corporate language.

VISUAL RULES
- Dark cinematic realism; live-action film frame.
- Emotionally restrained; realistic textures; atmospheric depth.
- Deep black, charcoal, ash, cold steel blue, muted silver, ember orange or faded gold.
- No superhero look, no comic/anime, no neon overload, no occult/satanic symbols, no watermark.
- No text rendered inside the generated image.
- Compose for a 4:5 social feed image.

CONTENT RULES
- hook: short and hard-hitting.
- quote_text: 1-2 sentence original derivative quote.
- instagram_caption: useful caption with CTA; no hashtags inside.
- facebook_caption: slightly deeper; include a discussion question; no hashtags inside.
- tiktok_title: under 90 characters.
- tiktok_description: concise, hook-driven; no hashtags inside.
- hashtags: exactly 5 relevant hashtags.
- image_prompt: English prompt for a realistic Watchman Universe 4:5 image, no text.
`;

  const result = await env.AI.run(env.TEXT_MODEL as any, {
    messages: [
      {
        role: 'system',
        content: 'Create the requested social package. Follow the supplied JSON schema exactly.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    max_completion_tokens: 1600,
    response_format: {
      type: 'json_schema',
      json_schema: POST_SCHEMA,
    },
  } as any) as any;

  const parsed = extractStructuredObject(result);

  return {
    hook: requireString(parsed, 'hook'),
    quote_text: requireString(parsed, 'quote_text'),
    instagram_caption: requireString(parsed, 'instagram_caption'),
    facebook_caption: requireString(parsed, 'facebook_caption'),
    tiktok_title: requireString(parsed, 'tiktok_title').slice(0, 90),
    tiktok_description: requireString(parsed, 'tiktok_description'),
    hashtags: requireStringArray(parsed, 'hashtags').slice(0, 5),
    image_prompt: requireString(parsed, 'image_prompt'),
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
      // Fall through to diagnostic error below.
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
