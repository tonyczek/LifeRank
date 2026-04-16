import { useMemo } from 'react'
import { sortRankingItems } from '../utils/rankingDisplay'
import { rankingItemRowValueText, rankingTypeShortLabel } from '../utils/rankingTypeUi'

function TypeBadge({ type }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#F5F5F7] px-2.5 py-1 text-xs font-medium text-[#1D1D1F] ring-1 ring-black/5 transition-colors duration-200 dark:bg-gray-700 dark:text-gray-100 dark:ring-white/10">
      {rankingTypeShortLabel(type)}
    </span>
  )
}

function medal(rank) {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return '•'
}

/**
 * Read-only ranking card (shared by public /id page and /share?data= page).
 */
export function SharedRankingDisplay({ ranking, author }) {
  const sortedItems = useMemo(() => sortRankingItems(ranking), [ranking])
  const metricLabel = ranking.metricLabel ?? ''
  const name = author?.name?.trim() ? author.name.trim() : 'Anonymous'
  const avatar = author?.avatar

  return (
    <article className="rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-black/5 transition-colors duration-200 dark:bg-gray-800 dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] dark:ring-white/10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="min-w-0 flex-1 text-2xl font-semibold leading-tight tracking-tight text-[#1D1D1F] dark:text-gray-100">
          <span className="mr-1.5">{ranking.emoji || '🏆'}</span>
          {ranking.name}
        </h1>
        <TypeBadge type={ranking.type} />
      </div>

      <div className="mt-4 flex items-center gap-3 border-b border-gray-100 pb-4 dark:border-gray-700">
        {avatar ? (
          <img
            src={avatar}
            alt=""
            className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-black/10 dark:ring-white/10"
          />
        ) : (
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F5F5F7] text-lg ring-1 ring-black/10 dark:bg-gray-700 dark:ring-white/10"
            aria-hidden
          >
            👤
          </div>
        )}
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#6E6E73] dark:text-gray-400">Author</p>
          <p className="text-sm font-semibold text-[#1D1D1F] dark:text-gray-100">{name}</p>
        </div>
      </div>

      <h2 className="mt-5 text-lg font-semibold tracking-tight text-[#1D1D1F] dark:text-gray-100">Ranking</h2>
      <div className="mt-3 space-y-2">
        {sortedItems.length === 0 ? (
          <p className="rounded-xl bg-[#F5F5F7] px-3 py-4 text-center text-sm text-[#6E6E73] dark:bg-gray-700/80 dark:text-gray-400">
            No items
          </p>
        ) : (
          sortedItems.map((item, index) => {
            const rank = index + 1
            const highlight = rank === 1
            return (
              <div
                key={item.id ?? `${rank}-${item.name}`}
                className={[
                  'grid grid-cols-[34px_30px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl px-3 py-2',
                  highlight ? 'bg-amber-50 dark:bg-amber-950/30' : 'bg-[#F5F5F7] dark:bg-gray-700/80',
                ].join(' ')}
              >
                <span className="text-sm font-semibold text-[#6E6E73] dark:text-gray-400">{rank}</span>
                <span className="text-base">{medal(rank)}</span>
                <span className="truncate text-sm text-[#1D1D1F] dark:text-gray-100">{item.name || '—'}</span>
                <span className="text-right text-sm font-semibold tabular-nums text-[#1D1D1F] dark:text-gray-100">
                  {ranking.type === 'drag'
                    ? `#${rank}`
                    : rankingItemRowValueText({
                        type: ranking.type,
                        value: item.value,
                        metricLabel,
                      })}
                </span>
              </div>
            )
          })
        )}
      </div>
    </article>
  )
}
