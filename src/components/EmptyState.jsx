const QUICK_START_TEMPLATES = [
  {
    label: '🎬 Top movies',
    name: 'Top movies',
    emoji: '🎬',
    type: 'rating',
    category: 'Entertainment',
    metricLabel: 'Score (1–10)',
    starterItems: [
      { name: 'The Dark Knight', value: 8 },
      { name: 'Inception', value: 9 },
      { name: 'Interstellar', value: 10 },
    ],
  },
  {
    label: '🏔️ Highest peaks climbed',
    name: 'Highest peaks climbed',
    emoji: '🏔️',
    type: 'value',
    category: 'Travel',
    metricLabel: 'Elevation (m)',
    starterItems: [
      { name: 'Zugspitze', value: 2962 },
      { name: 'Matterhorn', value: 4478 },
      { name: 'Mont Blanc', value: 4808 },
    ],
  },
  {
    label: '🌍 Best countries visited',
    name: 'Best countries visited',
    emoji: '🌍',
    type: 'drag',
    category: 'Travel',
    metricLabel: 'Manual order',
    starterItems: [{ name: 'France' }, { name: 'Italy' }, { name: 'Japan' }],
  },
  {
    label: '🍜 Favorite dishes',
    name: 'Favorite dishes',
    emoji: '🍜',
    type: 'rating',
    category: 'Food',
    metricLabel: 'Score (1–10)',
    starterItems: [
      { name: 'Burger', value: 8 },
      { name: 'Sushi', value: 9 },
      { name: 'Pizza', value: 10 },
    ],
  },
]

export function EmptyState({
  onCreate,
  onIdeas,
  onQuickStart,
  title = 'No rankings yet',
  description = 'Create your first ranking to start tracking and comparing what matters to you.',
  buttonLabel = 'Create ranking',
  emoji = '🏆',
}) {
  const hasActions = Boolean(onCreate || onIdeas)

  return (
    <div className="rounded-2xl bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-black/5">
      <div className="mx-auto flex max-w-lg flex-col items-center px-2 py-6 text-center sm:max-w-2xl sm:px-4 sm:py-8">
        <div className="text-5xl leading-none sm:text-6xl" aria-hidden>
          {emoji}
        </div>

        <h2 className="mt-6 text-xl font-semibold tracking-tight text-[#1D1D1F] sm:text-2xl sm:leading-snug">
          {title}
        </h2>

        <p className="mt-4 max-w-md text-sm leading-relaxed text-[#6E6E73] sm:text-base">{description}</p>

        {hasActions ? (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {onCreate ? (
              <button
                type="button"
                onClick={onCreate}
                className="inline-flex min-h-[2.75rem] min-w-[10rem] items-center justify-center rounded-xl bg-[#0071E3] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                {buttonLabel}
              </button>
            ) : null}
            {onIdeas ? (
              <button
                type="button"
                onClick={onIdeas}
                className="inline-flex min-h-[2.75rem] min-w-[10rem] items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-[#1D1D1F] ring-1 ring-black/10 transition hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3]"
              >
                ✨ Get ideas
              </button>
            ) : null}
          </div>
        ) : null}

        {onQuickStart ? (
          <div className="mt-10 w-full max-w-2xl">
            <h3 className="text-left text-sm font-semibold tracking-tight text-[#1D1D1F]">Try one of these</h3>
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden">
              {QUICK_START_TEMPLATES.map((template) => (
                <button
                  key={template.name}
                  type="button"
                  onClick={() => {
                    const payload = { ...template }
                    delete payload.label
                    onQuickStart(payload)
                  }}
                  className="min-h-[3.25rem] min-w-[11.5rem] shrink-0 rounded-xl bg-[#F5F5F7] px-3 py-3 text-left text-sm font-medium leading-snug text-[#1D1D1F] ring-1 ring-black/5 transition hover:bg-[#EBEBED] hover:ring-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] sm:min-w-0"
                >
                  {template.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
