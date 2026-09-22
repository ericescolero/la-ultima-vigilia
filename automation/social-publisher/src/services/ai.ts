import type { ContentItem, Env, GeneratedPost } from '../types';

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

Return ONLY valid JSON:
{
  "hook": "short hard-hitting opening",
  "quote_text": "1-2 sentence original derivative quote",
  "instagram_caption": "caption with CTA; do not append hashtags",
  "facebook_caption": "slightly deeper caption with a discussion question; do not append hashtags",
  "tiktok_title": "short title under 90 characters",
  "tiktok_description": "short caption; do not append hashtags",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
  "image_prompt": "English image prompt for a realistic Watchman Universe 4:5 image, no text"
}
`;

  const result = await env.AI.run(env.TEXT_MODEL as any, {
    messages: [
      { role: 'system', content: 'Return strict JSON only. No markdown fences.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.75,
    max_completion_tokens: 1800,
  } as any) as any;

  const raw = extractText(result);
  const parsed = parseJsonObject(raw) as Record<string, unknown>;

  if (!Array.isArray(parsed.hashtags)) {
    throw new Error('AI hashtags must be an array');
  }

  return {
    hook: String(parsed.hook ?? ''),
    quote_text: String(parsed.quote_text ?? ''),
    instagram_caption: String(parsed.instagram_caption ?? ''),
    facebook_caption: String(parsed.facebook_caption ?? ''),
    tiktok_title: String(parsed.tiktok_title ?? '').slice(0, 90),
    tiktok_description: String(parsed.tiktok_description ?? ''),
    hashtags: (parsed.hashtags as unknown[]).slice(0, 5).map(String),
    image_prompt: String(parsed.image_prompt ?? ''),
  };
}

function extractText(result: any): string {
  if (typeof result?.response === 'string') return result.response;

  const openAiStyle = result?.choices?.[0]?.message?.content;
  if (typeof openAiStyle === 'string') return openAiStyle;

  if (Array.isArray(openAiStyle)) {
    const text = openAiStyle
      .map((part: any) => typeof part?.text === 'string' ? part.text : '')
      .filter(Boolean)
      .join('\n');
    if (text) return text;
  }

  throw new Error(`Unexpected text-model response: ${JSON.stringify(result).slice(0, 1000)}`);
}

function parseJsonObject(input: string): unknown {
  const trimmed = input
    .trim()
    .replace(/^\`\`\`json\s*/i, '')
    .replace(/\`\`\`$/i, '')
    .trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) {
      throw new Error('AI did not return JSON');
    }
    return JSON.parse(trimmed.slice(start, end + 1));
  }
}
