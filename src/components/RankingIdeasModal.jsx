const RANKING_IDEAS = {
  Sports: [
    { name: 'Best football matches seen', type: 'drag', category: 'Sports' },
    { name: 'Favorite players', type: 'drag', category: 'Sports' },
    { name: 'Biggest stadiums visited', type: 'value', category: 'Sports' },
    { name: 'Favourite sports', type: 'drag', category: 'Sports' },
    { name: 'Longest runs', type: 'value', category: 'Sports' },
  ],
  Entertainment: [
    { name: 'Favourite movies', type: 'rating', category: 'Entertainment' },
    { name: 'Favorite TV shows', type: 'rating', category: 'Entertainment' },
    { name: 'Top female actors', type: 'drag', category: 'Entertainment' },
    { name: 'Best video games', type: 'drag', category: 'Entertainment' },
    { name: 'Favorite songs', type: 'drag', category: 'Entertainment' },
  ],
  Travel: [
    { name: 'Favourite countries visited', type: 'drag', category: 'Travel' },
    { name: 'Highest mountains climbed', type: 'value', category: 'Travel' },
    { name: 'Favorite cities', type: 'drag', category: 'Travel' },
    { name: 'Longest spells outside home', type: 'value', category: 'Travel' },
    { name: 'Dream destinations', type: 'drag', category: 'Travel' },
  ],
  Food: [
    { name: 'Favorite foods', type: 'rating', category: 'Food' },
    { name: 'Best restaurants in Prague', type: 'rating', category: 'Food' },
    { name: 'Top drinks', type: 'rating', category: 'Food' },
    { name: 'Favorite desserts', type: 'drag', category: 'Food' },
    { name: 'Favorite coke types', type: 'rating', category: 'Food' },
  ],
  Other: [
    { name: 'Life goals', type: 'drag', category: 'Other' },
    { name: 'Favorite hobbies', type: 'drag', category: 'Other' },
    { name: 'Daily habits', type: 'rating', category: 'Other' },
    { name: 'Best memories', type: 'drag', category: 'Other' },
    { name: 'Bucket list', type: 'drag', category: 'Other' },
  ],
}

function TypeBadge({ type }) {
  const config =
    type === 'rating'
      ? { label: 'Rating', classes: 'bg-blue-100 text-blue-700' }
      : type === 'value'
        ? { label: 'Value', classes: 'bg-purple-100 text-purple-700' }
        : { label: 'Drag', classes: 'bg-green-100 text-green-700' }

  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${config.classes}`}>{config.label}</span>
}

export function RankingIdeasModal({ open, onClose, onCreateFromIdea }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.()
      }}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      <div className="relative w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.18)] ring-1 ring-black/5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-[#1D1D1F]">Ideas for rankings</h2>
            <p className="mt-1 text-sm text-[#6E6E73]">Click an idea to create a ranking instantly.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm font-medium text-[#6E6E73] transition hover:bg-black/5 hover:text-[#1D1D1F]"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {Object.entries(RANKING_IDEAS).map(([category, ideas]) => (
            <section key={category} className="rounded-xl border border-black/10 p-3">
              <h3 className="text-sm font-semibold text-[#1D1D1F]">{category}</h3>
              <div className="mt-2 space-y-1.5">
                {ideas.map((idea) => (
                  <button
                    key={idea.name}
                    type="button"
                    onClick={() => onCreateFromIdea?.(idea)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition hover:bg-[#F5F5F7]"
                  >
                    <span className="text-sm text-[#1D1D1F]">{idea.name}</span>
                    <TypeBadge type={idea.type} />
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}

