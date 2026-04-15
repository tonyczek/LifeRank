import { useEffect, useMemo, useState } from 'react'
import { RankingCustomizationControls } from './RankingCustomizationControls'
import { CategorySelector } from './CategorySelector'
import { buildCategoryOptions } from '../utils/categories'
import { rankingTypeHint, rankingTypeShortLabel } from '../utils/rankingTypeUi'

export function CreateRankingModal({ open, onClose, onCreate, rankings = [] }) {
  const [animateIn, setAnimateIn] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState('rating')
  const [metricLabel, setMetricLabel] = useState('')
  const [category, setCategory] = useState('Other')
  const [customCategory, setCustomCategory] = useState('')
  const [emoji, setEmoji] = useState('🏆')
  const [color, setColor] = useState('default')
  const [error, setError] = useState('')
  const categoryOptions = useMemo(() => buildCategoryOptions(rankings), [rankings])

  const showMetric = type === 'value'

  const payload = useMemo(() => {
    return {
      name: name.trim(),
      type,
      metricLabel: type === 'value' ? metricLabel.trim() : type === 'drag' ? 'Manual order' : 'Score (1–10)',
      category: category === 'Custom' ? customCategory.trim() || 'Other' : category,
      emoji: emoji.trim() || '🏆',
      color,
    }
  }, [name, type, metricLabel, showMetric, category, customCategory, emoji, color])

  useEffect(() => {
    if (!open) return
    setError('')
    setAnimateIn(false)
    const t = setTimeout(() => setAnimateIn(true), 10)
    return () => clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  function submit(e) {
    e.preventDefault()
    if (!payload.name) {
      setError('Name is required.')
      return
    }
    if (payload.type === 'value' && !payload.metricLabel) {
      setError('Metric label is required for Number rankings.')
      return
    }
    onCreate?.(payload)
    setName('')
    setType('rating')
    setMetricLabel('')
    setCategory('Other')
    setCustomCategory('')
    setEmoji('🏆')
    setColor('default')
    setError('')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.()
      }}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      <div
        className={[
          'relative w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.18)] ring-1 ring-black/5',
          'transition duration-200 ease-out',
          animateIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
        ].join(' ')}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-[#1D1D1F]">Create ranking</h2>
            <p className="mt-1 text-sm text-[#6E6E73]">Choose a type and start adding items.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm font-medium text-[#6E6E73] transition hover:bg-black/5 hover:text-[#1D1D1F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="mt-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-[#1D1D1F]">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Favorite coffees"
              className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-0 transition focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20"
              autoFocus
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#1D1D1F]">Type</label>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => setType('rating')}
                className={[
                  'rounded-xl border px-3 py-2 text-left text-sm transition',
                  type === 'rating'
                    ? 'border-[#0071E3] bg-[#0071E3]/5 text-[#1D1D1F]'
                    : 'border-black/10 bg-white text-[#6E6E73] hover:bg-black/5',
                ].join(' ')}
              >
                <div className="font-medium">{rankingTypeShortLabel('rating')}</div>
                <div className="mt-0.5 text-xs">{rankingTypeHint('rating')}</div>
              </button>

              <button
                type="button"
                onClick={() => setType('value')}
                className={[
                  'rounded-xl border px-3 py-2 text-left text-sm transition',
                  type === 'value'
                    ? 'border-[#0071E3] bg-[#0071E3]/5 text-[#1D1D1F]'
                    : 'border-black/10 bg-white text-[#6E6E73] hover:bg-black/5',
                ].join(' ')}
              >
                <div className="font-medium">{rankingTypeShortLabel('value')}</div>
                <div className="mt-0.5 text-xs">{rankingTypeHint('value')}</div>
              </button>

              <button
                type="button"
                onClick={() => setType('drag')}
                className={[
                  'rounded-xl border px-3 py-2 text-left text-sm transition',
                  type === 'drag'
                    ? 'border-[#0071E3] bg-[#0071E3]/5 text-[#1D1D1F]'
                    : 'border-black/10 bg-white text-[#6E6E73] hover:bg-black/5',
                ].join(' ')}
              >
                <div className="font-medium">{rankingTypeShortLabel('drag')}</div>
                <div className="mt-0.5 text-xs">{rankingTypeHint('drag')}</div>
              </button>
            </div>
          </div>

          <CategorySelector
            category={category}
            setCategory={setCategory}
            customCategory={customCategory}
            setCustomCategory={setCustomCategory}
            options={categoryOptions}
          />

          <RankingCustomizationControls
            emoji={emoji}
            setEmoji={setEmoji}
            color={color}
            setColor={setColor}
          />

          {showMetric ? (
            <div>
              <label className="text-sm font-medium text-[#1D1D1F]">Metric label</label>
              <input
                value={metricLabel}
                onChange={(e) => setMetricLabel(e.target.value)}
                placeholder='e.g. "Height (m)"'
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-0 transition focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20"
              />
            </div>
          ) : null}

          {error ? (
            <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">{error}</div>
          ) : null}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-medium text-[#1D1D1F] transition hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#0071E3] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

