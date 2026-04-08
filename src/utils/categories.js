export const DEFAULT_CATEGORIES = ['Sports', 'Entertainment', 'Travel', 'Food', 'Other']

export function buildCategoryOptions(rankings = []) {
  const used = new Set(
    (rankings ?? [])
      .map((ranking) => String(ranking?.category ?? '').trim())
      .filter(Boolean),
  )
  return [...new Set([...DEFAULT_CATEGORIES, ...used])]
}

