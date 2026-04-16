import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { SharedRankingDisplay } from '../components/SharedRankingDisplay'
import { useRankings } from '../hooks/useRankings'
import { decodeSharePayload } from '../utils/shareLink'
import { sortRankingItems } from '../utils/rankingDisplay'

function importSharedRanking(createRanking, addItem, ranking) {
  const created = createRanking({
    name: ranking.name,
    type: ranking.type,
    metricLabel: ranking.metricLabel ?? '',
    emoji: ranking.emoji ?? '🏆',
    color: ranking.color ?? 'default',
    category: ranking.category ?? 'Other',
  })
  const itemsInOrder = sortRankingItems({ ...ranking, items: ranking.items ?? [] })
  for (const item of itemsInOrder) {
    addItem(created.id, {
      name: item.name ?? '',
      value: Number(item.value ?? 0),
      notes: item.notes ?? '',
    })
  }
  return created.id
}

export function SharePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { createRanking, addItem } = useRankings()
  const [importing, setImporting] = useState(false)

  const encodedRaw = searchParams.get('data')
  const encoded = encodedRaw != null && encodedRaw.trim() !== '' ? encodedRaw : null

  const decoded = useMemo(() => decodeSharePayload(encoded), [encoded])

  const errorMessage = useMemo(() => {
    if (!decoded.ok && decoded.reason === 'missing') return 'Invalid or missing link'
    if (!decoded.ok) return 'This link is broken'
    return null
  }, [decoded])

  const ranking = decoded.ok ? decoded.ranking : null
  const author = decoded.ok ? decoded.author : { name: '', avatar: '' }

  useEffect(() => {
    if (ranking?.name) {
      document.title = `${ranking.name} · LifeRank`
      return () => {
        document.title = 'LifeRank'
      }
    }
    document.title = 'LifeRank'
  }, [ranking?.name])

  async function handleImport() {
    if (!decoded.ok || !ranking) return
    setImporting(true)
    try {
      const newId = importSharedRanking(createRanking, addItem, ranking)
      navigate(`/ranking/${newId}`)
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F]" data-share-page>
      <div className="mx-auto w-full max-w-[680px] px-4 py-10 sm:px-6">
        <Link
          to="/"
          className="inline-flex items-center rounded-lg px-2 py-1 text-sm text-[#6E6E73] transition hover:bg-black/5 hover:text-[#1D1D1F]"
        >
          ← LifeRank
        </Link>

        {errorMessage ? (
          <div className="mt-12 rounded-2xl bg-white p-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-black/5">
            <p className="text-base font-medium text-[#1D1D1F]">{errorMessage}</p>
            <Link
              to="/"
              className="mt-6 inline-block text-sm font-medium text-[#0071E3] underline-offset-2 transition hover:underline"
            >
              Back to LifeRank
            </Link>
          </div>
        ) : (
          <>
            <p className="mt-6 text-center text-xs font-semibold uppercase tracking-wide text-[#6E6E73]">
              Shared ranking
            </p>

            <div className="mt-3">
              <SharedRankingDisplay ranking={ranking} author={author} />
            </div>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleImport}
                disabled={importing}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-[#0071E3] px-5 text-sm font-medium text-white shadow-sm transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {importing ? 'Importing…' : 'Import this ranking'}
              </button>
            </div>

            <p className="mt-8 text-center text-xs text-[#6E6E73]">Created with LifeRank</p>
          </>
        )}
      </div>
    </div>
  )
}
