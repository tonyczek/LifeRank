import { useMemo, useState } from 'react'
import { rankingValueFieldLabel } from '../utils/rankingTypeUi'

export function AddItemForm({ ranking, onAddItem }) {
  const [name, setName] = useState('')
  const [value, setValue] = useState('')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState({})

  const isRating = ranking.type === 'rating'
  const isDrag = ranking.type === 'drag'
  const valueLabel = useMemo(() => rankingValueFieldLabel(ranking), [ranking])

  function validate() {
    const nextErrors = {}
    const trimmedName = name.trim()
    const numeric = Number(value)

    if (!trimmedName) nextErrors.name = 'Name is required.'
    if (!isDrag) {
      if (value === '') {
        nextErrors.value = isRating ? 'Score is required.' : 'Number is required.'
      } else if (Number.isNaN(numeric)) {
        nextErrors.value = 'Must be a number.'
      } else if (isRating && (numeric < 1 || numeric > 10)) {
        nextErrors.value = 'Score must be between 1 and 10.'
      }
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    onAddItem(ranking.id, {
      name: name.trim(),
      value: isDrag ? 0 : Number(value),
      notes: notes.trim(),
    })

    setName('')
    setValue('')
    setNotes('')
    setErrors({})
  }

  return (
    <section className="rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
      <h2 className="text-lg font-semibold tracking-tight">Add Item</h2>
      <form className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-medium text-[#1D1D1F]">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20"
            placeholder="Item name"
          />
          {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name}</p> : null}
        </div>

        {!isDrag ? (
          <div>
            <label className="text-sm font-medium text-[#1D1D1F]">{valueLabel}</label>
            <input
              type="number"
              min={isRating ? 1 : undefined}
              max={isRating ? 10 : undefined}
              step="any"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20"
              placeholder={isRating ? '1 to 10' : ranking.metricLabel || 'Enter number'}
            />
            {errors.value ? <p className="mt-1 text-xs text-red-600">{errors.value}</p> : null}
          </div>
        ) : null}

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-[#1D1D1F]">Notes (optional)</label>
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20"
            placeholder="Any context or comments"
          />
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl bg-[#0071E3] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Add Item
          </button>
        </div>
      </form>
    </section>
  )
}

