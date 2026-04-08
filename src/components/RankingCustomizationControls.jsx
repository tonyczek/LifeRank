import { COLOR_OPTIONS, EMOJI_GROUPS } from '../data/rankingCustomization'

export function RankingCustomizationControls({ emoji, setEmoji, color, setColor }) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-[#1D1D1F]">Emoji</p>
        <div className="mt-2 max-h-60 space-y-2 overflow-y-auto pr-1">
          {EMOJI_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="mb-1 text-[11px] font-medium text-[#6E6E73]">{group.label}</p>
              <div className="grid grid-cols-6 gap-1">
                {group.emojis.map((symbol) => (
                  <button
                    key={`${group.label}-${symbol}`}
                    type="button"
                    onClick={() => setEmoji(symbol)}
                    className={[
                      'flex h-9 w-9 items-center justify-center rounded-md border text-base transition',
                      emoji === symbol
                        ? 'border-[#0071E3] bg-[#0071E3]/10'
                        : 'border-black/10 bg-white hover:bg-black/5',
                    ].join(' ')}
                    aria-label={`Select ${symbol}`}
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-[#1D1D1F]">Color</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {COLOR_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setColor(option.key)}
              className={[
                'relative flex h-8 min-w-[82px] items-center justify-center rounded-full px-3 text-xs font-medium ring-1 transition',
                option.bg,
                color === option.key
                  ? `${option.ring} ring-4 scale-110 text-[#1D1D1F]`
                  : 'ring-black/10 text-[#6E6E73]',
              ].join(' ')}
            >
              {color === option.key ? (
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] font-bold">✓</span>
              ) : null}
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

