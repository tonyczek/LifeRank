import { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useRankings } from '../hooks/useRankings'
import { useProfile } from '../hooks/useProfile'
import { sortRankingItems } from '../utils/rankingDisplay'
import { rankingTypeShortLabel } from '../utils/rankingTypeUi'

function TypeBadge({ type }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#F5F5F7] px-2.5 py-1 text-xs font-medium text-[#1D1D1F] ring-1 ring-black/5">
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
 * Read-only public view. Data comes from local storage (same browser).
 * Future: remote fetch, public/private toggle, SEO meta.
 */
export function PublicRankingPage() {
  const { id } = useParams()
  const { rankings } = useRankings()
  const { profile } = useProfile()

  const ranking = useMemo(
    () => rankings.find((r) => r.id === id),
    [rankings, id],
  )

  const sortedItems = useMemo(
    () => (ranking ? sortRankingItems(ranking) : []),
    [ranking],
  )

  const visible = ranking && ranking.isPublic !== false

  useEffect(() => {
    if (!visible || !ranking?.name) {
      document.title = 'LifeRank'
      return
    }
    document.title = `${ranking.name} · LifeRank`
    return () => {
      document.title = 'LifeRank'
    }
  }, [visible, ranking?.name])

  if (!visible) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F]">
        <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center px-4 py-12">
          <p className="text-center text-base font-medium text-[#1D1D1F]">Ranking not found</p>
          <Link
            to="/"
            className="mt-6 text-sm font-medium text-[#0071E3] underline-offset-2 transition hover:underline"
          >
            Back to LifeRank
          </Link>
        </div>
      </div>
    )
  }

  const metricLabel = ranking.metricLabel ?? ''

  return (
    <div
      className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F]"
      data-public-ranking
      data-ranking-id={ranking.id}
    >
      <div className="mx-auto w-full max-w-[680px] px-4 py-10 sm:px-6">
        <Link
          to="/"
          className="inline-flex items-center rounded-lg px-2 py-1 text-sm text-[#6E6E73] transition hover:bg-black/5 hover:text-[#1D1D1F]"
        >
          ← LifeRank
        </Link>

        <article className="mt-6 rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-black/5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h1 className="min-w-0 flex-1 text-2xl font-semibold leading-tight tracking-tight">
              <span className="mr-1.5">{ranking.emoji || '🏆'}</span>
              {ranking.name}
            </h1>
            <TypeBadge type={ranking.type} />
          </div>

          <div className="mt-4 flex items-center gap-3 border-b border-gray-100 pb-4">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt=""
                className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-black/10"
              />
            ) : (
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F5F5F7] text-lg ring-1 ring-black/10"
                aria-hidden
              >
                👤
              </div>
            )}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#6E6E73]">Author</p>
              <p className="text-sm font-semibold text-[#1D1D1F]">
                {profile.name?.trim() ? profile.name.trim() : 'Anonymous'}
              </p>
            </div>
          </div>

          <h2 className="mt-5 text-lg font-semibold tracking-tight">Ranking</h2>
          <div className="mt-3 space-y-2">
            {sortedItems.length === 0 ? (
              <p className="rounded-xl bg-[#F5F5F7] px-3 py-4 text-center text-sm text-[#6E6E73]">No items</p>
            ) : (
              sortedItems.map((item, index) => {
                const rank = index + 1
                const highlight = rank === 1
                return (
                  <div
                    key={item.id ?? `${rank}-${item.name}`}
                    className={[
                      'grid grid-cols-[34px_30px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl px-3 py-2',
                      highlight ? 'bg-amber-50' : 'bg-[#F5F5F7]',
                    ].join(' ')}
                  >
                    <span className="text-sm font-semibold text-[#6E6E73]">{rank}</span>
                    <span className="text-base">{medal(rank)}</span>
                    <span className="truncate text-sm text-[#1D1D1F]">{item.name || '—'}</span>
                    <span className="text-sm font-medium text-[#1D1D1F]">
                      {ranking.type === 'drag' ? `#${rank}` : `${item.value} ${metricLabel}`.trim()}
                    </span>
                  </div>
                )
              })
            )}
          </div>
        </article>

        <p className="mt-8 text-center text-xs text-[#6E6E73]">Created with LifeRank</p>
      </div>
    </div>
  )
}
