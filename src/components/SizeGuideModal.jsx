import { useEffect } from 'react'
import { X } from 'lucide-react'

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]'

const CLOTHING = {
  note: 'All measurements are in inches. If you are between sizes, choose the larger one for a relaxed fit.',
  head: ['Size', 'Chest', 'Waist', 'Hips'],
  rows: [
    ['XS', '32 – 34', '25 – 27', '35 – 37'],
    ['S', '34 – 36', '27 – 29', '37 – 39'],
    ['M', '36 – 38', '29 – 31', '39 – 41'],
    ['L', '38 – 40', '31 – 33', '41 – 43'],
    ['XL', '40 – 42', '33 – 35', '43 – 45'],
  ],
  tips: [
    'Chest: measure around the fullest part, keeping the tape level.',
    'Waist: measure around your natural waistline.',
    'Hips: measure around the widest part of your hips.',
  ],
}

const FOOTWEAR = {
  note: 'Approximate conversions. Measure your foot from heel to longest toe and match it to the length.',
  head: ['US', 'EU', 'UK', 'Foot length'],
  rows: [
    ['6', '36.5', '4', '23 cm'],
    ['7', '37.5', '5', '24 cm'],
    ['8', '38.5', '6', '25 cm'],
    ['9', '39.5', '7', '25.5 cm'],
    ['10', '40.5', '8', '26.5 cm'],
  ],
  tips: ['Measure in the evening, when feet are at their largest.', 'Stand on a sheet of paper and mark your heel and longest toe.'],
}

export default function SizeGuideModal({ open, onClose, kind }) {
  const data = kind === 'footwear' ? FOOTWEAR : CLOTHING

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6 ${
        open ? 'visible' : 'invisible delay-500'
      }`}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close size guide"
        onClick={onClose}
        className={`absolute inset-0 cursor-default bg-[#3b2a20]/45 backdrop-blur-[3px] transition-opacity duration-500 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Size guide"
        className={`relative max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 shadow-[0_30px_80px_-30px_rgba(59,42,32,0.6)] transition-[opacity,translate,scale] duration-500 ${EASE} sm:rounded-3xl sm:p-8 ${
          open ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-10 scale-[0.97] opacity-0'
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl text-[#3b2a20] sm:text-3xl">Size guide</h2>
            <p className="mt-2 text-sm leading-6 text-[#5c4638]">{data.note}</p>
          </div>
          <button
            type="button"
            aria-label="Close size guide"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full text-[#5c4638] transition-colors hover:bg-[#f3ece4]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-[#efe8df]">
          <table className="w-full min-w-[320px] text-left text-sm">
            <thead className="bg-[#f6f0e8] text-[#3b2a20]">
              <tr>
                {data.head.map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[#5c4638]">
              {data.rows.map((row) => (
                <tr key={row[0]} className="border-t border-[#efe8df] transition-colors hover:bg-[#faf6f1]">
                  {row.map((cell, i) => (
                    <td key={i} className={`px-4 py-3 ${i === 0 ? 'font-semibold text-[#3b2a20]' : ''}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="mt-6 space-y-2 text-sm leading-6 text-[#5c4638]">
          {data.tips.map((t) => (
            <li key={t} className="flex gap-3">
              <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[#c9a27a]" />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}