/** Conservative limit for share URLs (query length varies by browser). */
export const SHARE_URL_MAX_LENGTH = 2000

function serializableRanking(ranking) {
  if (!ranking || typeof ranking !== 'object') return null
  return {
    id: ranking.id,
    name: ranking.name,
    type: ranking.type,
    metricLabel: ranking.metricLabel,
    emoji: ranking.emoji,
    color: ranking.color,
    category: ranking.category,
    isPublic: ranking.isPublic,
    createdAt: ranking.createdAt,
    items: Array.isArray(ranking.items)
      ? ranking.items.map((it) => ({
          id: it.id,
          name: it.name,
          value: it.value,
          notes: it.notes,
          order: it.order,
          createdAt: it.createdAt,
        }))
      : [],
  }
}

/**
 * Build /share?data=… URL (client-side only, no backend).
 * Payload: { ranking, author } so recipients see author without local profile.
 */
export function buildEncodedShareUrl(ranking, author) {
  const rankingPart = serializableRanking(ranking)
  if (!rankingPart) {
    return { ok: false, error: 'Could not encode ranking' }
  }
  const payload = {
    ranking: rankingPart,
    author: {
      name: typeof author?.name === 'string' ? author.name : '',
      avatar: typeof author?.avatar === 'string' ? author.avatar : '',
    },
  }
  const json = JSON.stringify(payload)
  let encoded
  try {
    encoded = btoa(encodeURIComponent(json))
  } catch {
    return { ok: false, error: 'Could not encode ranking' }
  }
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = `${origin}/share?data=${encoded}`
  if (url.length > SHARE_URL_MAX_LENGTH) {
    return { ok: false, error: 'Too many items to share via link' }
  }
  return { ok: true, url }
}

function isValidRankingSnapshot(ranking) {
  if (!ranking || typeof ranking !== 'object') return false
  if (typeof ranking.name !== 'string' || !ranking.name.trim()) return false
  if (!['rating', 'value', 'drag'].includes(ranking.type)) return false
  if (!Array.isArray(ranking.items)) return false
  return true
}

/**
 * @param {string|null|undefined} encoded
 * @returns {{ ok: true, ranking: object, author: { name: string, avatar: string } } | { ok: false, reason: 'missing' | 'broken' | 'invalid' }}
 */
export function decodeSharePayload(encoded) {
  if (encoded == null || String(encoded).trim() === '') {
    return { ok: false, reason: 'missing' }
  }
  try {
    const json = decodeURIComponent(atob(String(encoded)))
    const data = JSON.parse(json)
    const ranking = data?.ranking != null ? data.ranking : data
    const author =
      data?.author && typeof data.author === 'object'
        ? {
            name: typeof data.author.name === 'string' ? data.author.name : '',
            avatar: typeof data.author.avatar === 'string' ? data.author.avatar : '',
          }
        : { name: '', avatar: '' }
    if (!isValidRankingSnapshot(ranking)) {
      return { ok: false, reason: 'invalid' }
    }
    return { ok: true, ranking, author }
  } catch {
    return { ok: false, reason: 'broken' }
  }
}
