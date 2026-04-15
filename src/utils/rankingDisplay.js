/** Sorted display order for ranking items (matches ItemList / Leaderboard). */
export function sortRankingItems(ranking) {
  const items = ranking?.items ?? []
  const withIndex = items.map((item, index) => ({ item, index }))
  const isDrag = ranking?.type === 'drag'
  if (isDrag) {
    return withIndex
      .sort((a, b) => Number(a.item?.order ?? a.index) - Number(b.item?.order ?? b.index))
      .map((entry) => entry.item)
  }
  return withIndex
    .sort((a, b) => Number(b.item?.value ?? 0) - Number(a.item?.value ?? 0))
    .map((entry) => entry.item)
}
