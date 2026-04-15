import { useEffect, useMemo, useState } from 'react'
import { useRankings } from '../hooks/useRankings'
import { RankingCard } from '../components/RankingCard'
import { CreateRankingModal } from '../components/CreateRankingModal'
import { EmptyState } from '../components/EmptyState'
import { RankingIdeasModal } from '../components/RankingIdeasModal'
import { ProfileModal } from '../components/ProfileModal'
import logo from '../assets/logo.png'
import profileIcon from '../assets/profile.png'

const VIEW_MODE_STORAGE_KEY = 'liferank_view_mode'

function readStoredViewMode() {
  const raw = localStorage.getItem(VIEW_MODE_STORAGE_KEY)
  if (raw === 'category') return 'grouped'
  return 'all'
}

export function HomePage() {
  const { rankings, createRanking, deleteRanking } = useRankings()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isIdeasOpen, setIsIdeasOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [viewMode, setViewMode] = useState(() => readStoredViewMode())

  useEffect(() => {
    localStorage.setItem(
      VIEW_MODE_STORAGE_KEY,
      viewMode === 'grouped' ? 'category' : 'all',
    )
  }, [viewMode])
  const [collapsedCategories, setCollapsedCategories] = useState({})
  const groupedRankings = useMemo(() => {
    const groups = {}
    rankings.forEach((ranking) => {
      const category = (ranking.category || 'Other').trim() || 'Other'
      if (!groups[category]) groups[category] = []
      groups[category].push(ranking)
    })
    return Object.entries(groups)
  }, [rankings])

  function toggleCategory(category) {
    setCollapsedCategories((prev) => ({ ...prev, [category]: !prev[category] }))
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F]">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <div className="min-w-0">
            <div className="flex items-center">
              <img src={logo} alt="LifeRank logo" className="mr-2 h-8 w-8" />
              <h1 className="text-xl font-semibold tracking-tight">LifeRank</h1>
            </div>
            <p className="mt-1 text-sm text-[#6E6E73]">Your life. Ranked.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-xl bg-white p-1 ring-1 ring-black/10">
                <button
                  type="button"
                  onClick={() => setViewMode('grouped')}
                  className={[
                    'rounded-lg px-3 py-1.5 text-sm font-medium transition',
                    viewMode === 'grouped'
                      ? 'bg-[#0071E3] text-white'
                      : 'text-[#6E6E73] hover:bg-black/5 hover:text-[#1D1D1F]',
                  ].join(' ')}
                >
                  Grouped
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('all')}
                  className={[
                    'rounded-lg px-3 py-1.5 text-sm font-medium transition',
                    viewMode === 'all'
                      ? 'bg-[#0071E3] text-white'
                      : 'text-[#6E6E73] hover:bg-black/5 hover:text-[#1D1D1F]',
                  ].join(' ')}
                >
                  All
                </button>
              </div>
              <button
                type="button"
                onClick={() => setIsIdeasOpen(true)}
                className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-[#1D1D1F] ring-1 ring-black/10 transition hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3]"
              >
                ✨ Ideas for rankings
              </button>
            </div>
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center justify-center rounded-xl bg-[#0071E3] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F5F7]"
            >
              New Ranking
            </button>
            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center justify-center rounded-full p-1 transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3]"
            >
              <img src={profileIcon} alt="Profile" className="h-7 w-7 object-contain" />
            </button>
          </div>
        </div>

        {rankings.length === 0 ? (
          <EmptyState
            onCreate={() => setIsCreateOpen(true)}
            onIdeas={() => setIsIdeasOpen(true)}
            onQuickStart={(payload) => createRanking(payload)}
          />
        ) : viewMode === 'all' ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rankings.map((r) => (
              <RankingCard key={r.id} ranking={r} onDelete={() => deleteRanking(r.id)} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {groupedRankings.map(([category, categoryRankings]) => {
              const isCollapsed = Boolean(collapsedCategories[category])
              return (
                <section key={category} className="rounded-2xl bg-white/70 p-4 ring-1 ring-black/5">
                  <button
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className="flex w-full items-center justify-between rounded-xl px-2 py-1 text-left transition hover:bg-black/5"
                  >
                    <h2 className="text-lg font-semibold tracking-tight text-[#1D1D1F]">{category}</h2>
                    <span className="text-sm text-[#6E6E73]">
                      {isCollapsed ? 'Show' : 'Hide'} ({categoryRankings.length})
                    </span>
                  </button>
                  {!isCollapsed ? (
                    <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {categoryRankings.map((r) => (
                        <RankingCard key={r.id} ranking={r} onDelete={() => deleteRanking(r.id)} />
                      ))}
                    </div>
                  ) : null}
                </section>
              )
            })}
          </div>
        )}
      </div>

      <CreateRankingModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        rankings={rankings}
        onCreate={(payload) => {
          createRanking(payload)
          setIsCreateOpen(false)
        }}
      />
      <ProfileModal open={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <RankingIdeasModal
        open={isIdeasOpen}
        onClose={() => setIsIdeasOpen(false)}
        onCreateFromIdea={(idea) => {
          createRanking({
            name: idea.name,
            type: idea.type,
            category: idea.category,
            metricLabel: idea.type === 'value' ? 'Number' : idea.type === 'drag' ? 'Manual order' : 'Score (1–10)',
          })
          setIsIdeasOpen(false)
        }}
      />
    </div>
  )
}

