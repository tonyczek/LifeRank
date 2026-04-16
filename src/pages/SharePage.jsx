import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SharedRankingDisplay } from '../components/SharedRankingDisplay'
import { decodeSharePayload } from '../utils/shareLink'

/**
 * Read-only viewer for /share?data=… (no app navigation, no imports, no rankings state).
 */
export function SharePage() {
  const [searchParams] = useSearchParams()

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

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F]" data-share-page>
      <div className="mx-auto w-full max-w-[680px] px-4 py-10 sm:px-6">
        {errorMessage ? (
          <div className="mt-4 rounded-2xl bg-white p-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-black/5">
            <p className="text-base font-medium text-[#1D1D1F]">{errorMessage}</p>
          </div>
        ) : (
          <>
            <p className="text-center text-xs font-semibold uppercase tracking-wide text-[#6E6E73]">
              Shared ranking
            </p>

            <div className="mt-3">
              <SharedRankingDisplay ranking={ranking} author={author} />
            </div>

            <p className="mt-8 text-center text-xs text-[#6E6E73]">Created with LifeRank</p>
          </>
        )}
      </div>
    </div>
  )
}
