import { useMemo } from 'react'
import { rankingItemRowValueText } from '../utils/rankingTypeUi'

function medal(rank) {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return '•'
}

export function Leaderboard({ items = [], metricLabel = '', rankingType = 'rating' }) {
  const top5 = useMemo(() => {
    const withIndex = [...items].map((item, index) => ({ item, index }))
    if (rankingType === 'drag') {
      return withIndex
        .sort((a, b) => Number(a.item?.order ?? a.index) - Number(b.item?.order ?? b.index))
        .map((entry) => entry.item)
        .slice(0, 5)
    }
    return withIndex
      .sort((a, b) => Number(b.item?.value ?? 0) - Number(a.item?.value ?? 0))
      .map((entry) => entry.item)
      .slice(0, 5)
  }, [items, rankingType])

  return (
    <section className="rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-colors duration-200 dark:bg-gray-800 dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
      <h2 className="text-lg font-semibold tracking-tight text-[#1D1D1F] dark:text-gray-100">Leaderboard</h2>
      <div className="mt-4 space-y-2">
        {[0, 1, 2, 3, 4].map((index) => {
          const item = top5[index]
          const rank = index + 1
          const highlight = rank === 1
          return (
            <div
              key={index}
              className={[
                'grid grid-cols-[34px_30px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl px-3 py-2',
                highlight
                  ? 'bg-amber-50 dark:bg-amber-950/30'
                  : 'bg-[#F5F5F7] dark:bg-gray-700/80',
              ].join(' ')}
            >
              <span className="text-sm font-semibold text-[#6E6E73] dark:text-gray-400">{rank}</span>
              <span className="text-base">{medal(rank)}</span>
              <span className="truncate text-sm text-[#1D1D1F] dark:text-gray-100">{item?.name || '—'}</span>
              <span className="text-right text-sm font-semibold tabular-nums text-[#1D1D1F] dark:text-gray-100">
                {item
                  ? rankingType === 'drag'
                    ? `#${rank}`
                    : rankingItemRowValueText({
                        type: rankingType,
                        value: item.value,
                        metricLabel,
                      })
                  : '—'}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

