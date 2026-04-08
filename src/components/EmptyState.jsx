export function EmptyState({
  onCreate,
  title = 'No rankings yet',
  description = 'Create your first ranking to start tracking and comparing what matters to you.',
  buttonLabel = 'New Ranking',
}) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 text-sm text-[#6E6E73]">{description}</p>
      {onCreate ? (
        <div className="mt-6">
          <button
            type="button"
            onClick={onCreate}
            className="inline-flex items-center justify-center rounded-xl bg-[#0071E3] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            {buttonLabel}
          </button>
        </div>
      ) : null}
    </div>
  )
}

