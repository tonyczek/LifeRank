import { useEffect } from 'react'
import { rankingTypeShortLabel } from '../utils/rankingTypeUi'

/** UI-only fields (emoji, preview); createRanking still uses name, type, category. */
const RANKING_IDEAS = {
  Sports: [
    {
      name: 'Best football matches seen',
      type: 'drag',
      category: 'Sports',
      emoji: '⚽',
      preview: ['Czech Republic 2–1 Netherlands', 'Champions League final 2024', 'Derby day classic'],
    },
    {
      name: 'Favorite players',
      type: 'drag',
      category: 'Sports',
      emoji: '🏃',
      preview: ['Haaland', 'Mbappé', 'Salah'],
    },
    {
      name: 'Biggest stadiums visited',
      type: 'value',
      category: 'Sports',
      emoji: '🏟️',
      preview: ['Wembley — 90k seats', 'Camp Nou — 99k', 'Maracanã — 78k'],
    },
    {
      name: 'Favourite sports',
      type: 'drag',
      category: 'Sports',
      emoji: '🎾',
      preview: ['Football', 'Tennis', 'Basketball'],
    },
    {
      name: 'Longest runs',
      type: 'value',
      category: 'Sports',
      emoji: '👟',
      preview: ['Half marathon — 21 km', 'Morning 5k', 'Trail 15 km'],
    },
  ],
  Entertainment: [
    {
      name: 'Favourite movies',
      type: 'rating',
      category: 'Entertainment',
      emoji: '🎬',
      preview: ['Interstellar — 10', 'Inception — 9', 'The Dark Knight — 9'],
    },
    {
      name: 'Favorite TV shows',
      type: 'rating',
      category: 'Entertainment',
      emoji: '📺',
      preview: ['The Wire — 10', 'Breaking Bad — 10', 'Succession — 8'],
    },
    {
      name: 'Top female actors',
      type: 'drag',
      category: 'Entertainment',
      emoji: '⭐',
      preview: ['Cate Blanchett', 'Viola Davis', 'Tilda Swinton'],
    },
    {
      name: 'Best video games',
      type: 'drag',
      category: 'Entertainment',
      emoji: '🎮',
      preview: ['Elden Ring', 'Hades', 'Portal 2'],
    },
    {
      name: 'Favorite songs',
      type: 'drag',
      category: 'Entertainment',
      emoji: '🎵',
      preview: ['Bohemian Rhapsody', 'Blinding Lights', 'As It Was'],
    },
  ],
  Travel: [
    {
      name: 'Favourite countries visited',
      type: 'drag',
      category: 'Travel',
      emoji: '🌍',
      preview: ['Japan', 'Italy', 'Portugal'],
    },
    {
      name: 'Highest mountains climbed',
      type: 'value',
      category: 'Travel',
      emoji: '🏔️',
      preview: ['Mont Blanc — 4808 m', 'Matterhorn — 4478 m', 'Triglav — 2864 m'],
    },
    {
      name: 'Favorite cities',
      type: 'drag',
      category: 'Travel',
      emoji: '🌆',
      preview: ['Prague', 'Lisbon', 'Kyoto'],
    },
    {
      name: 'Longest spells outside home',
      type: 'value',
      category: 'Travel',
      emoji: '✈️',
      preview: ['3-week Euro trip — 22 days', 'Workation — 14 days', 'Weekend city break — 3 days'],
    },
    {
      name: 'Dream destinations',
      type: 'drag',
      category: 'Travel',
      emoji: '🧭',
      preview: ['Patagonia', 'Iceland ring road', 'Safari in Tanzania'],
    },
  ],
  Food: [
    {
      name: 'Favorite foods',
      type: 'rating',
      category: 'Food',
      emoji: '🍜',
      preview: ['Ramen — 10', 'Sushi — 9', 'Tacos — 9'],
    },
    {
      name: 'Best restaurants in Prague',
      type: 'rating',
      category: 'Food',
      emoji: '🍽️',
      preview: ['Field — 10', 'Sansho — 9', 'Eska — 8'],
    },
    {
      name: 'Top drinks',
      type: 'rating',
      category: 'Food',
      emoji: '🥤',
      preview: ['Espresso', 'IPA craft', 'Matcha latte'],
    },
    {
      name: 'Favorite desserts',
      type: 'drag',
      category: 'Food',
      emoji: '🍰',
      preview: ['Tiramisu', 'Crème brûlée', 'Apple strudel'],
    },
    {
      name: 'Favorite coke types',
      type: 'rating',
      category: 'Food',
      emoji: '🥤',
      preview: ['Classic — 8', 'Zero — 7', 'Cherry — 6'],
    },
  ],
  Other: [
    {
      name: 'Life goals',
      type: 'drag',
      category: 'Other',
      emoji: '🎯',
      preview: ['Learn a language', 'Run a marathon', 'Publish something'],
    },
    {
      name: 'Favorite hobbies',
      type: 'drag',
      category: 'Other',
      emoji: '🎨',
      preview: ['Photography', 'Cooking', 'Climbing'],
    },
    {
      name: 'Daily habits',
      type: 'rating',
      category: 'Other',
      emoji: '☀️',
      preview: ['Morning walk — 8', 'Reading — 9', 'Stretching — 7'],
    },
    {
      name: 'Best memories',
      type: 'drag',
      category: 'Other',
      emoji: '💭',
      preview: ['Graduation day', 'First concert', 'Road trip 2022'],
    },
    {
      name: 'Bucket list',
      type: 'drag',
      category: 'Other',
      emoji: '📝',
      preview: ['See aurora', 'Skydive once', 'Learn piano basics'],
    },
  ],
}

const POPULAR_IDEAS = [
  RANKING_IDEAS.Entertainment[0],
  RANKING_IDEAS.Food[0],
  RANKING_IDEAS.Travel[4],
]

const POPULAR_NAMES = new Set(POPULAR_IDEAS.map((i) => i.name))

function TypeBadge({ type }) {
  const config =
    type === 'rating'
      ? { classes: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-200' }
      : type === 'value'
        ? { classes: 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-200' }
        : { classes: 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-200' }

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${config.classes}`}>
      {rankingTypeShortLabel(type)}
    </span>
  )
}

function ideaPayload(idea) {
  return { name: idea.name, type: idea.type, category: idea.category }
}

function IdeaCard({ idea, onPick }) {
  const emoji = idea.emoji ?? '✨'
  const lines = Array.isArray(idea.preview) ? idea.preview.slice(0, 3) : ['—', '—', '—']
  while (lines.length < 3) lines.push('—')

  return (
    <button
      type="button"
      onClick={() => onPick?.(ideaPayload(idea))}
      className="flex h-full min-h-[11rem] cursor-pointer flex-col rounded-xl border border-black/10 bg-white p-4 text-left shadow-sm transition-all duration-150 hover:scale-[1.02] hover:bg-gray-50 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] dark:border-white/10 dark:bg-gray-900/60 dark:hover:bg-gray-800"
    >
      <span className="text-2xl leading-none" aria-hidden>
        {emoji}
      </span>
      <h4 className="mt-2 line-clamp-2 text-sm font-medium text-[#1D1D1F] dark:text-gray-100">{idea.name}</h4>
      <div className="mt-3 min-h-0 flex-1 space-y-1 font-mono text-[11px] leading-snug text-[#6E6E73] dark:text-gray-400">
        {lines.map((line, i) => (
          <p key={i} className="truncate">
            <span className="tabular-nums text-[#9CA3AF] dark:text-gray-500">{i + 1}.</span> {line}
          </p>
        ))}
      </div>
      <div className="mt-3 flex shrink-0 justify-end pt-1">
        <TypeBadge type={idea.type} />
      </div>
    </button>
  )
}

export function RankingIdeasModal({ open, onClose, onCreateFromIdea }) {
  useEffect(() => {
    if (!open) return
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4 py-8 backdrop-blur-sm transition-colors duration-200 dark:bg-black/50"
      onClick={() => onClose?.()}
      role="presentation"
    >
      <div
        className="relative max-h-[85vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.18)] ring-1 ring-black/5 transition-colors duration-200 dark:bg-gray-800 dark:ring-white/10"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-[#1D1D1F] dark:text-gray-100">
              ✨ Get inspired
            </h2>
            <p className="mt-1 text-sm text-[#6E6E73] dark:text-gray-400">Pick a template and start instantly</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm font-medium text-[#6E6E73] transition hover:bg-black/5 hover:text-[#1D1D1F] dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-gray-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <section className="mt-6">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#6E6E73] dark:text-gray-400">
            Popular
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {POPULAR_IDEAS.map((idea) => (
              <IdeaCard key={`popular-${idea.name}`} idea={idea} onPick={onCreateFromIdea} />
            ))}
          </div>
        </section>

        {Object.entries(RANKING_IDEAS).map(([category, ideas]) => (
          <section key={category} className="mt-6">
            <h3 className="mb-2 text-sm font-semibold text-[#1D1D1F] dark:text-gray-100">{category}</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {ideas
                .filter((idea) => !POPULAR_NAMES.has(idea.name))
                .map((idea) => (
                  <IdeaCard key={idea.name} idea={idea} onPick={onCreateFromIdea} />
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
