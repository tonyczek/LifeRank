import { useEffect, useMemo, useRef, useState } from 'react'
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { EmptyState } from './EmptyState'
import { rankingValueFieldLabel } from '../utils/rankingTypeUi'

function SortableItemRow({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? 'opacity-60' : ''}
    >
      {children({ attributes, listeners, isDragging })}
    </div>
  )
}

export function ItemList({ ranking, onDeleteItem, onUpdateItem, onReorderItems }) {
  const isDrag = ranking.type === 'drag'
  const sortedItems = useMemo(() => {
    const items = ranking.items ?? []
    const withIndex = items.map((item, index) => ({ item, index }))
    if (isDrag) {
      return withIndex
        .sort((a, b) => Number(a.item?.order ?? a.index) - Number(b.item?.order ?? b.index))
        .map((entry) => entry.item)
    }
    return withIndex
      .sort((a, b) => Number(b.item?.value ?? 0) - Number(a.item?.value ?? 0))
      .map((entry) => entry.item)
  }, [ranking.items, isDrag])

  const previousIdsRef = useRef(new Set((ranking.items ?? []).map((item) => item.id)))
  const [enteringIds, setEnteringIds] = useState(new Set())
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState({ name: '', value: '', notes: '' })
  const [editError, setEditError] = useState('')
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  useEffect(() => {
    const currentIds = new Set((ranking.items ?? []).map((item) => item.id))
    const newIds = [...currentIds].filter((id) => !previousIdsRef.current.has(id))
    previousIdsRef.current = currentIds
    if (newIds.length === 0) return

    setEnteringIds((prev) => new Set([...prev, ...newIds]))
    const timer = setTimeout(() => {
      setEnteringIds((prev) => {
        const next = new Set(prev)
        newIds.forEach((id) => next.delete(id))
        return next
      })
    }, 280)
    return () => clearTimeout(timer)
  }, [ranking.items])

  if (sortedItems.length === 0) {
    return (
      <EmptyState title="No items yet" description="Add your first item to start building this ranking." emoji="📝" />
    )
  }

  const isRating = ranking.type === 'rating'
  const valueLabel = rankingValueFieldLabel(ranking)

  function startEdit(item) {
    setEditingId(item.id)
    setDraft({
      name: item.name,
      value: String(item.value),
      notes: item.notes ?? '',
    })
    setEditError('')
  }

  function saveEdit(itemId) {
    const trimmedName = draft.name.trim()
    const numericValue = Number(draft.value)
    if (!trimmedName) {
      setEditError('Name is required.')
      return
    }
    if (!isDrag) {
      if (draft.value === '') {
        setEditError(isRating ? 'Score is required.' : 'Number is required.')
        return
      }
      if (Number.isNaN(numericValue)) {
        setEditError('Must be a number.')
        return
      }
      if (isRating && (numericValue < 1 || numericValue > 10)) {
        setEditError('Score must be between 1 and 10.')
        return
      }
    }

    onUpdateItem(ranking.id, itemId, {
      name: trimmedName,
      value: isDrag ? undefined : numericValue,
      notes: draft.notes,
    })
    setEditingId(null)
    setEditError('')
  }

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const currentIds = sortedItems.map((item) => item.id)
    const oldIndex = currentIds.indexOf(active.id)
    const newIndex = currentIds.indexOf(over.id)
    if (oldIndex === -1 || newIndex === -1) return
    const reorderedIds = arrayMove(currentIds, oldIndex, newIndex)
    onReorderItems?.(ranking.id, reorderedIds)
  }

  return (
    <section className="rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-colors duration-200 dark:bg-gray-800 dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
      <h2 className="text-lg font-semibold tracking-tight text-[#1D1D1F] dark:text-gray-100">All Items</h2>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={isDrag ? handleDragEnd : undefined}>
        <SortableContext items={sortedItems.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          <div className="mt-4 space-y-2">
            {sortedItems.map((item, index) => (
              <SortableItemRow key={item.id} id={item.id}>
                {({ attributes, listeners }) => (
                  <div
                    className={[
                      'rounded-xl bg-[#F5F5F7] px-4 py-3 transition-all duration-300 dark:bg-gray-700/80',
                      enteringIds.has(item.id) ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100',
                    ].join(' ')}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#6E6E73] dark:text-gray-400">#{index + 1}</p>
                        {editingId === item.id ? (
                          <div className="mt-2 space-y-2">
                            <input
                              value={draft.name}
                              onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
                              className="w-full rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-xs text-[#1D1D1F] outline-none transition focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 dark:border-white/10 dark:bg-gray-900 dark:text-gray-100"
                              placeholder="Name"
                            />
                            {!isDrag ? (
                              <input
                                type="number"
                                min={isRating ? 1 : undefined}
                                max={isRating ? 10 : undefined}
                                step="any"
                                value={draft.value}
                                onChange={(e) => setDraft((prev) => ({ ...prev, value: e.target.value }))}
                                className="w-full rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-xs text-[#1D1D1F] outline-none transition focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 dark:border-white/10 dark:bg-gray-900 dark:text-gray-100"
                                placeholder={valueLabel}
                              />
                            ) : null}
                            <input
                              value={draft.notes}
                              onChange={(e) => setDraft((prev) => ({ ...prev, notes: e.target.value }))}
                              className="w-full rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-xs text-[#1D1D1F] outline-none transition focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 dark:border-white/10 dark:bg-gray-900 dark:text-gray-100"
                              placeholder="Notes (optional)"
                            />
                            {editError ? <p className="text-xs text-red-600">{editError}</p> : null}
                          </div>
                        ) : (
                          <>
                            <p className="truncate text-sm font-medium text-[#1D1D1F] dark:text-gray-100">{item.name}</p>
                            {!isDrag ? (
                              <p className="mt-1 text-xs text-[#6E6E73] dark:text-gray-400">{`${item.value} ${valueLabel}`.trim()}</p>
                            ) : null}
                            {item.notes ? (
                              <p className="mt-2 text-xs leading-relaxed text-[#6E6E73] dark:text-gray-400">{item.notes}</p>
                            ) : null}
                          </>
                        )}
                      </div>

                      <div className="flex gap-1">
                        {isDrag && editingId !== item.id ? (
                          <button
                            type="button"
                            {...attributes}
                            {...listeners}
                            className="rounded-lg px-2 py-1 text-sm text-[#6E6E73] cursor-grab active:cursor-grabbing hover:bg-black/5"
                            aria-label="Drag to reorder"
                          >
                            ≡
                          </button>
                        ) : null}
                        {editingId === item.id ? (
                          <>
                            <button
                              type="button"
                              onClick={() => saveEdit(item.id)}
                              className="rounded-lg bg-[#0071E3] px-2 py-1 text-xs font-medium text-white transition hover:brightness-110"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(null)
                                setEditError('')
                              }}
                              className="rounded-lg px-2 py-1 text-xs font-medium text-[#6E6E73] transition hover:bg-black/5 hover:text-[#1D1D1F]"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => startEdit(item)}
                              className="rounded-lg px-2 py-1 text-xs font-medium text-[#6E6E73] transition hover:bg-black/5 hover:text-[#1D1D1F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3]"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteItem(ranking.id, item.id)}
                              className="rounded-lg px-2 py-1 text-xs font-medium text-[#6E6E73] transition hover:bg-black/5 hover:text-[#1D1D1F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3]"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </SortableItemRow>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </section>
  )
}

