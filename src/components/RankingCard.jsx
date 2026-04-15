import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { rankingTypeShortLabel } from '../utils/rankingTypeUi'

function TypeBadge({ type }) {
  const label = rankingTypeShortLabel(type)
  return (
    <span className="inline-flex items-center rounded-full bg-[#F5F5F7] px-2.5 py-1 text-xs font-medium text-[#1D1D1F] ring-1 ring-black/5">
      {label}
    </span>
  )
}

const CARD_TINTS = {
  default: 'bg-white',
  blue: 'bg-blue-50',
  green: 'bg-green-50',
  purple: 'bg-purple-50',
  orange: 'bg-orange-50',
  pink: 'bg-pink-50',
}

function medal(rank) {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return '•'
}

export function RankingCard({ ranking, onDelete }) {
  const navigate = useNavigate()

  const top3 = useMemo(() => {
    const items = Array.isArray(ranking?.items) ? ranking.items : []
    const withIndex = items.map((item, index) => ({ item, index }))
    if (ranking?.type === 'drag') {
      return withIndex
        .sort((a, b) => Number(a.item?.order ?? a.index) - Number(b.item?.order ?? b.index))
        .map((entry) => entry.item)
        .slice(0, 3)
    }
    return withIndex
      .sort((a, b) => Number(b.item?.value ?? 0) - Number(a.item?.value ?? 0))
      .map((entry) => entry.item)
      .slice(0, 3)
  }, [ranking])

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/ranking/${ranking.id}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') navigate(`/ranking/${ranking.id}`)
      }}
      className={[
        'group relative cursor-pointer rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(0,0,0,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3]',
        CARD_TINTS[ranking.color] || 'bg-white',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold tracking-tight">
              <span className="mr-1.5">{ranking.emoji || '🏆'}</span>
              {ranking.name}
            </h3>
            <TypeBadge type={ranking.type} />
          </div>
          <p className="mt-1 truncate text-sm text-[#6E6E73]">{ranking.metricLabel || '—'}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {[0, 1, 2].map((idx) => {
          const item = top3[idx]
          return (
            <div
              key={idx}
              className="flex items-center justify-between rounded-xl bg-[#F5F5F7] px-3 py-2"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="w-5 text-xs font-semibold text-[#6E6E73]">{idx + 1}</span>
                <span className="text-sm">{medal(idx + 1)}</span>
                <span className="truncate text-sm">{item?.name || '—'}</span>
              </div>
              <span className="ml-3 text-sm font-medium text-[#1D1D1F]">
                {item ? (ranking.type === 'drag' ? `#${idx + 1}` : Number(item.value ?? 0)) : '—'}
              </span>
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            const ok = window.confirm(`Delete "${ranking.name}"? This cannot be undone.`)
            if (ok) onDelete?.()
          }}
          className="rounded-lg px-2 py-1 text-xs font-medium text-[#6E6E73] transition hover:bg-black/5 hover:text-[#1D1D1F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3]"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

