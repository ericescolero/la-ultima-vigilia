import type { ContentItem, ScenePackage } from '../types';
import {
  STYLE_REFERENCE_KEY,
  UNIVERSE_FOUNDATION,
  VISUAL_PROFILES,
  normalizeVisualKey,
  type VisualProfile,
} from '../config/visualProfiles';

export interface CanonicalImagePlan {
  prompt: string;
  referenceKeys: string[];
  profile: VisualProfile;
}

export function resolveVisualProfile(item: ContentItem): VisualProfile {
  const archetypeKey = normalizeVisualKey(item.archetype);
  if (archetypeKey) return VISUAL_PROFILES[archetypeKey];

  const enemyKey = normalizeVisualKey(item.enemy_force);
  if (enemyKey) return VISUAL_PROFILES[enemyKey];

  return VISUAL_PROFILES.generic;
}

export function buildCanonicalImagePlan(
  item: ContentItem,
  scene: ScenePackage,
): CanonicalImagePlan {
  const profile = resolveVisualProfile(item);

  const referenceKeys = [
    profile.referenceKey,
    STYLE_REFERENCE_KEY,
  ].filter((value): value is string => Boolean(value));

  const referenceInstructions = referenceKeys.length
    ? `
REFERENCE IMAGE RULES
If input image 0 is available, it is the canonical subject reference.
Preserve its recognizable identity, silhouette, clothing language,
materials, facial character and overall design. Do not redesign the subject.
If input image 1 is available, use it only as the canonical Watchman Universe
cinematography, texture, palette and atmosphere reference.
The new scene may change pose, camera angle and environment,
but must remain recognizably inside the same visual universe.
`.trim()
    : '';

  const prompt = `
${UNIVERSE_FOUNDATION}

${referenceInstructions}

CANONICAL SUBJECT
${profile.label}

IDENTITY LOCK
${profile.identity}

SOURCE MEANING
Theme: ${item.theme}
Battlefield: ${item.battlefield || 'unspecified'}
Core idea: ${item.source_text}

NEW SCENE
${scene.scene_concept}

ENVIRONMENT
${scene.environment}

COMPOSITION
${scene.composition}

SYMBOLIC DETAIL
${scene.symbolic_detail}

PALETTE LOCK
${profile.palette}

LIGHTING LOCK
${profile.lighting}

ATMOSPHERE LOCK
${profile.atmosphere}

CAMERA / MATERIAL RULES
Photorealistic live-action cinema frame.
Believable skin, fabric, metal, stone, rain, smoke and environmental texture.
Natural lens behavior, controlled depth of field, subtle film grain.
Subject must look physically present in a real location.
No promotional poster pose. No clean studio backdrop.
4:5 vertical social-feed composition.

NEGATIVE CONSTRAINTS
${profile.negative}
`.trim();

  return { prompt, referenceKeys, profile };
}
