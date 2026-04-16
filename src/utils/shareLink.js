import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'
import { sortRankingItems } from './rankingDisplay'

/** Conservative limit for share URLs (query length varies by browser). */
export const SHARE_URL_MAX_LENGTH = 8000

/** Omit huge data-URL avatars so links stay shareable. */
function slimAuthorForShare(author) {
  const name = typeof author?.name === 'string' ? author.name : ''
  let avatar = typeof author?.avatar === 'string' ? author.avatar : ''
  if (avatar.startsWith('data:') || avatar.length > 400) {
    avatar = ''
  }
  return { name, avatar }
}

/**
 * Minimal ranking for URL payload: display + import fields only (no ids, notes, timestamps).
 */
function minimalRankingForShare(ranking) {
  if (!ranking || typeof ranking !== 'object') return null
  if (!['rating', 'value', 'drag'].includes(ranking.type)) return null

  const sorted = sortRankingItems(ranking)
  const type = ranking.type
  const items = sorted.map((it, index) => {
    const name = String(it?.name ?? '').trim()
    const value = Number(it?.value ?? 0)
    if (type === 'drag') {
      return { name, value, order: index }
    }
    return { name, value }
  })

  return {
    name: String(ranking.name ?? '').trim(),
    type,
    metricLabel: String(ranking.metricLabel ?? '').trim(),
    emoji: String(ranking.emoji ?? '🏆').trim() || '🏆',
    category: String(ranking.category ?? 'Other').trim() || 'Other',
    items,
  }
}

/**
 * Build /share?data=… URL (client-side only, no backend).
 * Payload: { ranking, author } — ranking is stripped + lz-compressed.
 */
export function buildEncodedShareUrl(ranking, author) {
  const rankingPart = minimalRankingForShare(ranking)
  if (!rankingPart) {
    return { ok: false, error: 'Could not encode ranking' }
  }
  const payload = {
    ranking: rankingPart,
    author: slimAuthorForShare(author),
  }
  const json = JSON.stringify(payload)
  let encoded
  try {
    encoded = compressToEncodedURIComponent(json)
  } catch {
    return { ok: false, error: 'Could not encode ranking' }
  }
  if (!encoded) {
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
  for (const it of ranking.items) {
    if (!it || typeof it !== 'object') return false
    if (typeof it.name !== 'string') return false
  }
  return true
}

/** Normalize decoded ranking (minimal or legacy full) for UI + import. */
function normalizeDecodedRanking(ranking) {
  const items = (ranking.items ?? []).map((it, idx) => ({
    id: it.id != null && String(it.id).trim() !== '' ? String(it.id) : `share-${idx}`,
    name: String(it?.name ?? '').trim(),
    value: Number(it?.value ?? 0),
    notes: typeof it?.notes === 'string' ? it.notes : '',
    order:
      ranking.type === 'drag'
        ? Number.isFinite(Number(it?.order))
          ? Number(it.order)
          : idx
        : it.order,
  }))
  return {
    name: ranking.name,
    type: ranking.type,
    metricLabel: ranking.metricLabel ?? '',
    emoji: ranking.emoji ?? '🏆',
    color: ranking.color ?? 'default',
    category: ranking.category ?? 'Other',
    isPublic: ranking.isPublic !== false,
    items,
  }
}

function parseJsonPayload(jsonString) {
  const data = JSON.parse(jsonString)
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
  return { ok: true, ranking: normalizeDecodedRanking(ranking), author }
}

/**
 * @param {string|null|undefined} encoded
 * @returns {{ ok: true, ranking: object, author: { name: string, avatar: string } } | { ok: false, reason: 'missing' | 'broken' | 'invalid' }}
 */
export function decodeSharePayload(encoded) {
  if (encoded == null || String(encoded).trim() === '') {
    return { ok: false, reason: 'missing' }
  }
  const raw = String(encoded)

  let jsonString = null
  try {
    const decompressed = decompressFromEncodedURIComponent(raw)
    if (decompressed != null && decompressed !== '') {
      jsonString = decompressed
    }
  } catch {
    jsonString = null
  }

  if (jsonString == null || jsonString === '') {
    try {
      jsonString = decodeURIComponent(atob(raw))
    } catch {
      return { ok: false, reason: 'broken' }
    }
  }

  try {
    return parseJsonPayload(jsonString)
  } catch {
    return { ok: false, reason: 'broken' }
  }
}
