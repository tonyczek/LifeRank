/**
 * User-facing strings for ranking `type`.
 * Internal values stay: rating | value | drag.
 */

export function rankingTypeShortLabel(type) {
  if (type === 'rating') return 'Score (1–10)'
  if (type === 'value') return 'Number'
  if (type === 'drag') return 'Manual order'
  return type
}

export function rankingTypeHint(type) {
  if (type === 'rating') return 'Best for opinions (movies, food, etc.)'
  if (type === 'value') return 'Best for measurable things (price, km, height)'
  if (type === 'drag') return 'Drag & drop to order items'
  return ''
}

/** Label for score/number inputs and inline value captions. */
export function rankingValueFieldLabel(ranking) {
  if (!ranking) return ''
  if (ranking.type === 'rating') return 'Score (1–10)'
  if (ranking.type === 'value') return ranking.metricLabel?.trim() || 'Number'
  return ''
}
