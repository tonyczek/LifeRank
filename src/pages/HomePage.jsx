import { useEffect, useMemo, useRef, useState } from 'react'
import { useRankings } from '../hooks/useRankings'
import { useProfile } from '../hooks/useProfile'
import { RankingCard } from '../components/RankingCard'
import { CreateRankingModal } from '../components/CreateRankingModal'
import { EmptyState } from '../components/EmptyState'
import { RankingIdeasModal } from '../components/RankingIdeasModal'
import { ProfileModal } from '../components/ProfileModal'
import logo from '../assets/logo.png'
import profileIcon from '../assets/profile.png'
import {
  normalizeImportedProfile,
  normalizeImportedRankings,
  parseAndValidateBackup,
} from '../utils/backup'

const VIEW_MODE_STORAGE_KEY = 'liferank_view_mode'

function readStoredViewMode() {
  const raw = localStorage.getItem(VIEW_MODE_STORAGE_KEY)
  if (raw === 'category') return 'grouped'
  return 'all'
}

export function HomePage() {
  const { rankings, createRanking, deleteRanking, addItem, replaceRankings } = useRankings()
  const { profile, replaceProfile } = useProfile()
  const importInputRef = useRef(null)
  const settingsMenuRef = useRef(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
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

  useEffect(() => {
    if (!isSettingsOpen) return
    function onDocMouseDown(e) {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(e.target)) {
        setIsSettingsOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [isSettingsOpen])
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

  function handleExportBackup() {
    const payload = { rankings, profile }
    const text = JSON.stringify(payload, null, 2)
    const blob = new Blob([text], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'liferank-backup.json'
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 500)
    window.alert('Backup downloaded')
  }

  function handleImportFileChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : ''
      const parsed = parseAndValidateBackup(text)
      if (!parsed.ok) {
        window.alert('Invalid file format')
        return
      }
      const ok = window.confirm(
        'This will replace your current rankings and profile. Continue?',
      )
      if (!ok) return

      replaceRankings(normalizeImportedRankings(parsed.data.rankings))
      replaceProfile(normalizeImportedProfile(parsed.data.profile))
      window.alert('Data imported successfully')
    }
    reader.onerror = () => window.alert('Invalid file format')
    reader.readAsText(file)
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
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg border border-transparent bg-blue-600 px-4 text-sm font-medium leading-none text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F5F7]"
              >
                New Ranking
              </button>
              <div className="relative" ref={settingsMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen((open) => !open)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-lg leading-none text-[#1D1D1F] transition hover:bg-black/5 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3]"
                  aria-expanded={isSettingsOpen}
                  aria-haspopup="menu"
                  aria-label="Settings"
                >
                  ⚙️
                </button>
                {isSettingsOpen ? (
                  <div
                    className="absolute right-0 top-full z-40 mt-1 min-w-[180px] rounded-xl bg-white py-2 shadow-lg ring-1 ring-black/10"
                    role="menu"
                  >
                    <div className="flex flex-col">
                      <button
                        type="button"
                        role="menuitem"
                        className="px-4 py-2 text-left text-sm transition hover:bg-black/5"
                        onClick={() => {
                          setIsSettingsOpen(false)
                          handleExportBackup()
                        }}
                      >
                        Export data
                      </button>
                      <div className="my-1 border-t border-gray-100" aria-hidden />
                      <button
                        type="button"
                        role="menuitem"
                        className="px-4 py-2 text-left text-sm transition hover:bg-black/5"
                        onClick={() => {
                          setIsSettingsOpen(false)
                          importInputRef.current?.click()
                        }}
                      >
                        Import data
                      </button>
                    </div>
                    {/* Future menu items: dark mode, reset data, about */}
                  </div>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setIsProfileOpen(true)}
                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white leading-none text-[#1D1D1F] transition hover:bg-black/5 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3]"
                aria-label="Profile"
              >
                <img src={profileIcon} alt="" className="h-7 w-7 object-contain" />
              </button>
              <input
                ref={importInputRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                aria-hidden
                onChange={handleImportFileChange}
              />
            </div>
          </div>
        </div>

        {rankings.length === 0 ? (
          <EmptyState
            onCreate={() => setIsCreateOpen(true)}
            onIdeas={() => setIsIdeasOpen(true)}
            onQuickStart={(payload) => {
              const { starterItems = [], ...rankingPayload } = payload
              const ranking = createRanking(rankingPayload)
              for (const row of starterItems) {
                addItem(ranking.id, {
                  name: row.name,
                  value: row.value ?? 0,
                  notes: row.notes ?? '',
                })
              }
            }}
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

