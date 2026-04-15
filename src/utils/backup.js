/**
 * Parse and validate LifeRank full backup JSON ({ rankings, profile }).
 * @returns {{ ok: true, data: object } | { ok: false }}
 */
export function parseAndValidateBackup(text) {
  let data
  try {
    data = JSON.parse(text)
  } catch {
    return { ok: false }
  }
  if (!data || typeof data !== 'object') return { ok: false }
  if (!Array.isArray(data.rankings)) return { ok: false }
  if (!data.profile || typeof data.profile !== 'object') return { ok: false }

  for (const r of data.rankings) {
    if (!r || typeof r !== 'object') return { ok: false }
    if (r.id == null || String(r.id).trim() === '') return { ok: false }
    if (typeof r.name !== 'string') return { ok: false }
    if (!['rating', 'value', 'drag'].includes(r.type)) return { ok: false }
    if (!Array.isArray(r.items)) return { ok: false }
  }

  return { ok: true, data }
}

export function normalizeImportedRankings(rankings) {
  return (rankings ?? []).map((r) => ({
    ...r,
    id: String(r.id),
    category: String(r?.category ?? 'Other').trim() || 'Other',
    items: Array.isArray(r.items) ? r.items : [],
  }))
}

export function normalizeImportedProfile(profile) {
  return {
    name: typeof profile?.name === 'string' ? profile.name : '',
    avatar: typeof profile?.avatar === 'string' ? profile.avatar : '',
  }
}
