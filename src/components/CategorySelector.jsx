export function CategorySelector({
  category,
  setCategory,
  customCategory,
  setCustomCategory,
  options,
}) {
  return (
    <div>
      <label className="text-sm font-medium text-[#1D1D1F]">Category</label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
        <option value="Custom">Custom</option>
      </select>
      {category === 'Custom' ? (
        <input
          value={customCategory}
          onChange={(e) => setCustomCategory(e.target.value)}
          placeholder="Type custom category"
          className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20"
        />
      ) : null}
    </div>
  )
}

