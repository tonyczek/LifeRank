const STORAGE_KEY = 'liferank_data'

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { rankings: [] }
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return { rankings: [] }
    if (!Array.isArray(parsed.rankings)) return { rankings: [] }
    return { rankings: parsed.rankings }
  } catch {
    return { rankings: [] }
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
