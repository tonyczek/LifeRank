import { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SharedRankingDisplay } from '../components/SharedRankingDisplay'
import { useRankings } from '../hooks/useRankings'
import { useProfile } from '../hooks/useProfile'

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
      <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] transition-colors duration-200 dark:bg-gray-950 dark:text-gray-100">
        <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center px-4 py-12">
          <p className="text-center text-base font-medium text-[#1D1D1F] dark:text-gray-100">Ranking not found</p>
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

  const author = { name: profile.name ?? '', avatar: profile.avatar ?? '' }

  return (
    <div
      className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] transition-colors duration-200 dark:bg-gray-950 dark:text-gray-100"
      data-public-ranking
      data-ranking-id={ranking.id}
    >
      <div className="mx-auto w-full max-w-[680px] px-4 py-10 sm:px-6">
        <Link
          to="/"
          className="inline-flex items-center rounded-lg px-2 py-1 text-sm text-[#6E6E73] transition hover:bg-black/5 hover:text-[#1D1D1F] dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-gray-100"
        >
          ← LifeRank
        </Link>

        <div className="mt-6">
          <SharedRankingDisplay ranking={ranking} author={author} />
        </div>

        <p className="mt-8 text-center text-xs text-[#6E6E73] dark:text-gray-500">Created with LifeRank</p>
      </div>
    </div>
  )
}
