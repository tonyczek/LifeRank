import { useEffect, useMemo, useState } from 'react'
import { loadData, saveData } from '../utils/storage'

function nowIso() {
  return new Date().toISOString()
}

function newId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`
}

function ensureRankingIdsAndVisibility(ranking) {
  const id =
    ranking?.id != null && String(ranking.id).trim() !== '' ? String(ranking.id) : newId()
  const isPublic = ranking?.isPublic === false ? false : true
  return {
    ...ranking,
    id,
    isPublic,
    category: String(ranking?.category ?? 'Other').trim() || 'Other',
  }
}

export function useRankings() {
  const initial = useMemo(() => loadData(), [])
  const [rankings, setRankings] = useState(() =>
    (initial.rankings ?? []).map((ranking) => ensureRankingIdsAndVisibility(ranking)),
  )

  useEffect(() => {
    saveData({ rankings })
  }, [rankings])

  function createRanking({ name, type, metricLabel, emoji, color, category }) {
    const ranking = {
      id: newId(),
      name: String(name ?? '').trim(),
      type,
      metricLabel: String(metricLabel ?? '').trim(),
      emoji: String(emoji ?? '🏆').trim() || '🏆',
      color: String(color ?? 'default').trim() || 'default',
      category: String(category ?? 'Other').trim() || 'Other',
      isPublic: true,
      createdAt: nowIso(),
      items: [],
    }

    setRankings((prev) => [ranking, ...prev])
    return ranking
  }

  function deleteRanking(id) {
    setRankings((prev) => prev.filter((r) => r.id !== id))
  }

  function updateRanking(rankingId, updates) {
    setRankings((prev) =>
      prev.map((ranking) => {
        if (ranking.id !== rankingId) return ranking
        return {
          ...ranking,
          ...updates,
          name:
            updates?.name !== undefined
              ? String(updates.name ?? '').trim() || ranking.name
              : ranking.name,
          metricLabel:
            updates?.metricLabel !== undefined
              ? String(updates.metricLabel ?? '').trim()
              : ranking.metricLabel,
          emoji:
            updates?.emoji !== undefined
              ? String(updates.emoji ?? '').trim() || ranking.emoji || '🏆'
              : ranking.emoji || '🏆',
          color:
            updates?.color !== undefined
              ? String(updates.color ?? '').trim() || ranking.color || 'default'
              : ranking.color || 'default',
          category:
            updates?.category !== undefined
              ? String(updates.category ?? '').trim() || ranking.category || 'Other'
              : ranking.category || 'Other',
        }
      }),
    )
  }

  function addItem(rankingId, { name, value, notes }) {
    let createdItem = null
    setRankings((prev) =>
      prev.map((r) => {
        if (r.id !== rankingId) return r
        const currentItems = r.items ?? []
        const item = {
          id: newId(),
          name: String(name ?? '').trim(),
          value: Number(value ?? 0),
          notes: String(notes ?? ''),
          order: r.type === 'drag' ? currentItems.length : undefined,
          createdAt: nowIso(),
        }
        createdItem = item
        return { ...r, items: r.type === 'drag' ? [...currentItems, item] : [item, ...currentItems] }
      }),
    )
    const item = createdItem ?? {
      id: newId(),
      name: String(name ?? '').trim(),
      value: Number(value ?? 0),
      notes: String(notes ?? ''),
      createdAt: nowIso(),
    }
    return item
  }

  function deleteItem(rankingId, itemId) {
    setRankings((prev) =>
      prev.map((r) =>
        r.id === rankingId ? { ...r, items: (r.items ?? []).filter((it) => it.id !== itemId) } : r,
      ),
    )
  }

  function updateItem(rankingId, itemId, updates) {
    setRankings((prev) =>
      prev.map((ranking) => {
        if (ranking.id !== rankingId) return ranking
        return {
          ...ranking,
          items: (ranking.items ?? []).map((item) => {
            if (item.id !== itemId) return item
            return {
              ...item,
              ...updates,
              name:
                updates?.name !== undefined
                  ? String(updates.name ?? '').trim() || item.name
                  : item.name,
              value:
                updates?.value !== undefined
                  ? Number.isNaN(Number(updates.value))
                    ? item.value
                    : Number(updates.value)
                  : item.value,
              notes: updates?.notes !== undefined ? String(updates.notes ?? '') : item.notes,
              order:
                updates?.order !== undefined
                  ? Number.isNaN(Number(updates.order))
                    ? item.order
                    : Number(updates.order)
                  : item.order,
            }
          }),
        }
      }),
    )
  }

  function reorderItems(rankingId, orderedItemIds) {
    setRankings((prev) =>
      prev.map((ranking) => {
        if (ranking.id !== rankingId) return ranking
        const currentItems = ranking.items ?? []
        const byId = new Map(currentItems.map((item) => [item.id, item]))
        const reordered = orderedItemIds
          .map((id) => byId.get(id))
          .filter(Boolean)
          .map((item, index) => ({ ...item, order: index }))
        return { ...ranking, items: reordered }
      }),
    )
  }

  function replaceRankings(nextRankings) {
    const list = Array.isArray(nextRankings) ? nextRankings : []
    setRankings(
      list.map((ranking) => {
        const base = ensureRankingIdsAndVisibility(ranking)
        return {
          ...base,
          items: Array.isArray(ranking?.items) ? ranking.items : [],
        }
      }),
    )
  }

  return {
    rankings,
    createRanking,
    deleteRanking,
    updateRanking,
    addItem,
    deleteItem,
    updateItem,
    reorderItems,
    replaceRankings,
  }
}

