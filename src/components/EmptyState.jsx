export function EmptyState({
  onCreate,
  onIdeas,
  title = 'No rankings yet',
  description = 'Create your first ranking to start tracking and comparing what matters to you.',
  buttonLabel = 'Create ranking',
  emoji = '🏆',
  showExample = true,
}) {
  const hasActions = Boolean(onCreate || onIdeas)

  return (
    <div className="rounded-2xl bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-black/5">
      <div className="mx-auto flex max-w-lg flex-col items-center px-2 py-6 text-center sm:px-4 sm:py-8">
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

        {showExample ? (
          <div className="mt-10 w-full max-w-sm">
            <p className="text-left text-xs font-medium text-[#6E6E73]">Example</p>
            <div className="mt-2 rounded-xl bg-[#F5F5F7] px-4 py-4 text-left text-sm text-[#1D1D1F] ring-1 ring-black/5">
              <ul className="space-y-2.5">
                <li className="leading-snug">🥇 Interstellar</li>
                <li className="leading-snug">🥈 Inception</li>
                <li className="leading-snug">🥉 The Dark Knight</li>
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
