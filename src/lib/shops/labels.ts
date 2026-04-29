export const LABEL_SUGGESTIONS = [
  'bio',
  'direct trade',
  'single origin',
  'organic',
  'fresh & clean',
  'decaf-friendly',
  'lait végétal',
  'grains à emporter',
  'cuisine maison',
  'pâtisserie',
  'brunch',
  'sans gluten',
  'vegan',
  'salon de thé',
  'matcha',
  'pet-friendly',
  'terrasse',
] as const;

export function normalizeLabel(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}
