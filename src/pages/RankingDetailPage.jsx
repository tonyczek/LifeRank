import { useMemo, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { Link, useParams } from 'react-router-dom'
import { AddItemForm } from '../components/AddItemForm'
import { CategorySelector } from '../components/CategorySelector'
import { ItemList } from '../components/ItemList'
import { Leaderboard } from '../components/Leaderboard'
import { RankingCustomizationControls } from '../components/RankingCustomizationControls'
import { useRankings } from '../hooks/useRankings'
import { useProfile } from '../hooks/useProfile'
import { buildCategoryOptions } from '../utils/categories'
import { buildEncodedShareUrl } from '../utils/shareLink'
import ExportModal from '../components/ExportModal'
import { rankingTypeShortLabel } from '../utils/rankingTypeUi'

function TypeBadge({ type }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#F5F5F7] px-2.5 py-1 text-xs font-medium text-[#1D1D1F] ring-1 ring-black/5">
      {rankingTypeShortLabel(type)}
    </span>
  )
}

function medal(rank) {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return '•'
}

function isImageClipboardWriteSupported() {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') return false
  if (!window.isSecureContext) return false
  if (!navigator.clipboard || typeof navigator.clipboard.write !== 'function') return false
  if (typeof ClipboardItem === 'undefined') return false
  return true
}

const SHARE_ACTION_BUTTON_CLASS =
  'inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-5 text-sm font-medium text-[#1D1D1F] shadow-sm transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-white'

const EXPORT_THEME_IDS = ['default', 'dark', 'blue', 'purple', 'minimal']

const EXPORT_THEME_STYLES = {
  default: {
    container: 'bg-gradient-to-br from-gray-50 to-gray-200',
    text: 'text-gray-900',
    subtext: 'text-gray-600',
    rowMuted: 'text-gray-500',
    rowName: 'text-gray-900',
    rowValue: 'text-gray-800',
    rowBg: 'bg-gray-100/80 ring-1 ring-gray-200/60',
    rowFirst:
      'bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 ring-1 ring-amber-200/90 shadow-sm',
    footerBorder: 'border-gray-100',
  },
  dark: {
    container: 'bg-gray-900',
    text: 'text-white',
    subtext: 'text-gray-400',
    rowMuted: 'text-gray-400',
    rowName: 'text-white',
    rowValue: 'text-gray-200',
    rowBg: 'bg-gray-800/80 ring-1 ring-gray-600/50',
    rowFirst:
      'bg-gradient-to-br from-amber-900/50 via-yellow-900/40 to-amber-900/50 ring-1 ring-amber-500/40 shadow-sm',
    footerBorder: 'border-gray-700',
  },
  blue: {
    container: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    text: 'text-white',
    subtext: 'text-blue-100',
    rowMuted: 'text-blue-200',
    rowName: 'text-white',
    rowValue: 'text-blue-50',
    rowBg: 'bg-white/15 ring-1 ring-white/25',
    rowFirst:
      'bg-gradient-to-br from-amber-200/95 via-yellow-100/95 to-amber-200/95 ring-1 ring-amber-300/80 shadow-sm',
    footerBorder: 'border-white/20',
  },
  purple: {
    container: 'bg-gradient-to-br from-purple-500 to-pink-500',
    text: 'text-white',
    subtext: 'text-purple-100',
    rowMuted: 'text-pink-200',
    rowName: 'text-white',
    rowValue: 'text-pink-50',
    rowBg: 'bg-white/15 ring-1 ring-white/25',
    rowFirst:
      'bg-gradient-to-br from-amber-200/95 via-yellow-100/95 to-amber-200/95 ring-1 ring-amber-300/80 shadow-sm',
    footerBorder: 'border-white/20',
  },
  minimal: {
    container: 'bg-white',
    text: 'text-black',
    subtext: 'text-gray-500',
    rowMuted: 'text-gray-500',
    rowName: 'text-black',
    rowValue: 'text-gray-800',
    rowBg: 'bg-gray-100 ring-1 ring-gray-200',
    rowFirst:
      'bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 ring-1 ring-amber-200/90 shadow-sm',
    footerBorder: 'border-gray-200',
  },
}

export function RankingDetailPage() {
  const { id } = useParams()
  const { rankings, updateRanking, addItem, deleteItem, updateItem, reorderItems } = useRankings()
  const { profile } = useProfile()
  const ranking = rankings.find((entry) => entry.id === id)
  const [isEditingName, setIsEditingName] = useState(false)
  const [draftName, setDraftName] = useState('')
  const [draftEmoji, setDraftEmoji] = useState('🏆')
  const [draftColor, setDraftColor] = useState('default')
  const [draftCategory, setDraftCategory] = useState('Other')
  const [draftCustomCategory, setDraftCustomCategory] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [exportCount, setExportCount] = useState(5)
  const [theme, setTheme] = useState('default')
  const [shareFeedback, setShareFeedback] = useState(null)
  const exportRef = useRef(null)
  const categoryOptions = buildCategoryOptions(rankings)
  const canCopyImageToClipboard = useMemo(() => isImageClipboardWriteSupported(), [])

  const topNForExport = useMemo(() => {
    const withIndex = [...(ranking?.items ?? [])].map((item, index) => ({ item, index }))
    if ((ranking?.type ?? 'rating') === 'drag') {
      return withIndex
        .sort((a, b) => Number(a.item?.order ?? a.index) - Number(b.item?.order ?? b.index))
        .map((entry) => entry.item)
        .slice(0, exportCount)
    }
    return withIndex
      .sort((a, b) => Number(b.item?.value ?? 0) - Number(a.item?.value ?? 0))
      .map((entry) => entry.item)
      .slice(0, exportCount)
  }, [ranking, exportCount])

  if (!ranking) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F]">
        <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
            <h1 className="text-2xl font-semibold tracking-tight">Not found</h1>
            <p className="mt-2 text-sm text-[#6E6E73]">
              We could not find the requested ranking.
            </p>
            <Link
              to="/"
              className="mt-4 inline-flex items-center rounded-xl bg-[#0071E3] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              ← All Rankings
            </Link>
          </div>
        </div>
      </div>
    )
  }

  function startEditingName() {
    setDraftName(ranking.name)
    setDraftEmoji(ranking.emoji || '🏆')
    setDraftColor(ranking.color || 'default')
    const currentCategory = (ranking.category || 'Other').trim() || 'Other'
    if (categoryOptions.includes(currentCategory)) {
      setDraftCategory(currentCategory)
      setDraftCustomCategory('')
    } else {
      setDraftCategory('Custom')
      setDraftCustomCategory(currentCategory)
    }
    setIsEditingName(true)
  }

  function saveRankingName() {
    const trimmed = draftName.trim()
    if (!trimmed) return
    const finalCategory =
      draftCategory === 'Custom' ? draftCustomCategory.trim() || 'Other' : draftCategory
    updateRanking(ranking.id, {
      name: trimmed,
      emoji: draftEmoji,
      color: draftColor,
      category: finalCategory,
    })
    setIsEditingName(false)
  }

  async function handleExportImage() {
    if (!exportRef.current) return
    setIsExporting(true)
    let objectUrl = null
    try {
      const dataUrl = await toPng(exportRef.current, { cacheBust: true, pixelRatio: 2 })
      const response = await fetch(dataUrl)
      if (!response.ok) throw new Error('Image response not ok')
      const blob = await response.blob()
      objectUrl = URL.createObjectURL(blob)
      const safeName = (ranking.name || 'ranking').replace(/[<>:"/\\|?*]+/g, '_').trim() || 'ranking'
      const link = document.createElement('a')
      link.download = `${safeName}.png`
      link.href = objectUrl
      link.click()
      setShareFeedback(null)
      window.setTimeout(() => {
        if (objectUrl) URL.revokeObjectURL(objectUrl)
      }, 250)
    } catch {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
      setShareFeedback({
        variant: 'error',
        message:
          'Download blocked by your browser. Try disabling your browser shields or use Chrome/Edge.',
      })
      window.setTimeout(() => setShareFeedback(null), 6500)
    } finally {
      setIsExporting(false)
    }
  }

  const exportTheme = EXPORT_THEME_STYLES[theme] ?? EXPORT_THEME_STYLES.default

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F]">
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center rounded-lg px-2 py-1 text-sm text-[#6E6E73] transition hover:bg-black/5 hover:text-[#1D1D1F]"
          >
            ← All Rankings
          </Link>
          <div className="mt-3 flex items-center gap-3">
            {isEditingName ? (
              <div className="w-full max-w-2xl space-y-3 rounded-2xl bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
                <input
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-medium outline-none transition focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20"
                />
                <RankingCustomizationControls
                  emoji={draftEmoji}
                  setEmoji={setDraftEmoji}
                  color={draftColor}
                  setColor={setDraftColor}
                />
                <CategorySelector
                  category={draftCategory}
                  setCategory={setDraftCategory}
                  customCategory={draftCustomCategory}
                  setCustomCategory={setDraftCustomCategory}
                  options={categoryOptions}
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={saveRankingName}
                    className="rounded-lg bg-[#0071E3] px-3 py-1.5 text-xs font-medium text-white transition hover:brightness-110"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingName(false)}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#6E6E73] transition hover:bg-black/5 hover:text-[#1D1D1F]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-semibold tracking-tight">
                  <span className="mr-1.5">{ranking.emoji || '🏆'}</span>
                  {ranking.name}
                </h1>
                <button
                  type="button"
                  onClick={startEditingName}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#6E6E73] transition hover:bg-black/5 hover:text-[#1D1D1F]"
                >
                  Edit
                </button>
              </>
            )}
            <TypeBadge type={ranking.type} />
            <button
              type="button"
              onClick={() => setIsExportOpen(true)}
              disabled={isExporting}
              className="rounded-lg bg-[#0071E3] px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F5F7] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isExporting ? 'Preparing…' : 'Share'}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <Leaderboard
            items={ranking.items ?? []}
            metricLabel={ranking.metricLabel}
            rankingType={ranking.type}
          />
          <AddItemForm ranking={ranking} onAddItem={addItem} />
          <ItemList
            ranking={ranking}
            onDeleteItem={deleteItem}
            onUpdateItem={updateItem}
            onReorderItems={reorderItems}
          />
        </div>
      </div>

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => {
          setIsExportOpen(false)
          setShareFeedback(null)
        }}
      >
        <div className="flex max-h-[min(90vh,880px)] flex-col overflow-visible">
          <h2 className="text-center text-lg font-semibold tracking-tight text-[#1D1D1F]">Share your ranking!</h2>
          <p className="mt-1 text-center text-sm text-[#6E6E73]">Ready to share 🚀</p>

          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="flex flex-wrap justify-center gap-2">
              {[3, 5, 10].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setExportCount(n)}
                  className={[
                    'rounded-xl px-3 py-1.5 text-sm font-medium transition-all duration-150 ease-in-out active:scale-[0.97]',
                    exportCount === n
                      ? 'bg-[#0071E3] text-white hover:brightness-110'
                      : 'bg-white text-[#6E6E73] ring-1 ring-black/10 hover:bg-black/5 hover:text-[#1D1D1F]',
                  ].join(' ')}
                >
                  Top {n}
                </button>
              ))}
            </div>
            <div className="flex shrink-0 items-center gap-2" role="group" aria-label="Export color theme">
              {EXPORT_THEME_IDS.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTheme(id)}
                  aria-label={`Theme: ${id}`}
                  title={id}
                  className={[
                    'h-6 w-6 shrink-0 cursor-pointer rounded-full border border-black/20 shadow-sm transition hover:shadow-md',
                    theme === id ? 'ring-2 ring-black/20 scale-110' : 'hover:scale-110',
                    id === 'default' && 'bg-gradient-to-br from-gray-100 to-gray-400',
                    id === 'dark' && 'border-gray-700 bg-gray-900',
                    id === 'blue' && 'border-blue-600 bg-blue-500',
                    id === 'purple' && 'border-purple-600 bg-purple-500',
                    id === 'minimal' && 'border-gray-300 bg-white',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 flex min-h-0 max-h-[70vh] flex-1 justify-center overflow-x-auto overflow-y-auto py-2">
            <div className="flex shrink-0 origin-top scale-[0.67] justify-center overflow-visible">
              {/* Single export root: everything below must stay inside this node for toPng */}
              <div
                ref={exportRef}
                className={[
                  'box-border min-h-min w-[720px] max-w-full shrink-0 overflow-visible rounded-2xl p-10 shadow-xl',
                  exportTheme.container,
                ].join(' ')}
              >
                <header className="text-center">
                  <h3
                    className={[
                      'break-words text-3xl font-semibold leading-tight tracking-tight',
                      exportTheme.text,
                    ].join(' ')}
                  >
                    <span className="mr-2 inline-block align-middle">{ranking.emoji || '🏆'}</span>
                    <span className="align-middle">{ranking.name}</span>
                  </h3>
                </header>

                <div className="mt-4 flex items-center justify-center gap-3">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="avatar"
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                    />
                  ) : null}
                  <span className={['text-base font-medium', exportTheme.subtext].join(' ')}>
                    Created by {profile.name?.trim() ? profile.name.trim() : 'Anonymous'}
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  {Array.from({ length: exportCount }, (_, index) => {
                    const item = topNForExport[index]
                    const rank = index + 1
                    const isFirst = rank === 1 && Boolean(item)
                    const valueText =
                      item && ranking.type !== 'drag'
                        ? `${item.value} ${ranking.metricLabel || ''}`.trim()
                        : item
                          ? ''
                          : '—'
                    return (
                      <div
                        key={index}
                        className={[
                          'grid grid-cols-[2.5rem_2.25rem_minmax(0,1fr)_minmax(0,11rem)] items-center gap-3 rounded-xl px-4 py-3',
                          isFirst ? exportTheme.rowFirst : exportTheme.rowBg,
                        ].join(' ')}
                      >
                        <span
                          className={['text-base font-semibold tabular-nums', exportTheme.rowMuted].join(' ')}
                        >
                          {rank}
                        </span>
                        <span className="text-lg leading-none">{medal(rank)}</span>
                        <span
                          className={['min-w-0 truncate text-base font-medium', exportTheme.rowName].join(' ')}
                        >
                          {item?.name || '—'}
                        </span>
                        <span
                          className={[
                            'min-w-0 break-words text-right text-sm font-semibold tabular-nums',
                            exportTheme.rowValue,
                          ].join(' ')}
                        >
                          {valueText}
                        </span>
                      </div>
                    )
                  })}
                </div>

                <div
                  className={[
                    'mt-8 flex w-full shrink-0 justify-between border-t pt-4 text-xs',
                    exportTheme.footerBorder,
                    exportTheme.subtext,
                  ].join(' ')}
                >
                  <span>Created with LifeRank</span>
                  <span>liferank.app</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-shrink-0 flex-wrap items-center justify-center gap-3 border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={async () => {
                if (!exportRef.current) return
                try {
                  const dataUrl = await toPng(exportRef.current, { cacheBust: true, pixelRatio: 2 })
                  const blob = await (await fetch(dataUrl)).blob()
                  await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
                  setShareFeedback({ variant: 'success', message: 'Copied! Share it 🚀' })
                  window.setTimeout(() => setShareFeedback(null), 2800)
                } catch {
                  setShareFeedback({
                    variant: 'error',
                    message: 'Copy not supported in your browser. Use Download instead 👍',
                  })
                  window.setTimeout(() => setShareFeedback(null), 4000)
                }
              }}
              disabled={isExporting || !canCopyImageToClipboard}
              title={canCopyImageToClipboard ? undefined : 'Not supported in this browser'}
              aria-label="Copy image to clipboard"
              className={SHARE_ACTION_BUTTON_CLASS}
            >
              <span aria-hidden>📋</span>
              Copy
            </button>
            <button
              type="button"
              onClick={handleExportImage}
              disabled={isExporting}
              aria-label="Download ranking image"
              className={SHARE_ACTION_BUTTON_CLASS}
            >
              <span aria-hidden>⬇️</span>
              {isExporting ? 'Preparing…' : 'Download'}
            </button>
            <button
              type="button"
              onClick={async () => {
                const built = buildEncodedShareUrl(ranking, profile)
                if (!built.ok) {
                  setShareFeedback({ variant: 'error', message: built.error })
                  window.setTimeout(() => setShareFeedback(null), 4000)
                  return
                }
                try {
                  await navigator.clipboard.writeText(built.url)
                  setShareFeedback({ variant: 'success', message: 'Link copied' })
                  window.setTimeout(() => setShareFeedback(null), 2800)
                } catch {
                  setShareFeedback({ variant: 'error', message: 'Could not copy link' })
                  window.setTimeout(() => setShareFeedback(null), 4000)
                }
              }}
              className={SHARE_ACTION_BUTTON_CLASS}
            >
              <span aria-hidden>🔗</span>
              Copy link
            </button>
          </div>

          {shareFeedback ? (
            <p
              className={[
                'mt-3 text-center text-sm font-medium',
                shareFeedback.variant === 'success' ? 'text-emerald-700' : 'text-red-700',
              ].join(' ')}
              role="status"
            >
              {shareFeedback.message}
            </p>
          ) : null}
        </div>
      </ExportModal>
    </div>
  )
}
