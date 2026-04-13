import type { NutritionData } from '@/lib/types'

interface Props {
  nutrition: NutritionData | null
}

function amt(n: number | undefined, unit: string): string {
  return n !== undefined ? `${n}${unit}` : '—'
}

function pct(n: number | undefined): string {
  return n !== undefined ? `${n}%` : '—%'
}

type NutrientRow = {
  label: string
  amount: string
  dv?: string
  bold?: boolean
  indent?: boolean
}

export default function NutritionLabel({ nutrition: n }: Props) {
  const rows: NutrientRow[] = [
    { label: 'Total Fat',          amount: amt(n?.totalFat.g, 'g'),       dv: pct(n?.totalFat.dv),       bold: true },
    { label: 'Saturated Fat',      amount: amt(n?.saturatedFat.g, 'g'),   dv: pct(n?.saturatedFat.dv),   indent: true },
    { label: 'Trans Fat',          amount: amt(n?.transFat.g, 'g'),                                       indent: true },
    { label: 'Cholesterol',        amount: amt(n?.cholesterol.mg, 'mg'),  dv: pct(n?.cholesterol.dv),    bold: true },
    { label: 'Sodium',             amount: amt(n?.sodium.mg, 'mg'),       dv: pct(n?.sodium.dv),         bold: true },
    { label: 'Total Carbohydrate', amount: amt(n?.totalCarbs.g, 'g'),     dv: pct(n?.totalCarbs.dv),     bold: true },
    { label: 'Dietary Fiber',      amount: amt(n?.dietaryFiber.g, 'g'),   dv: pct(n?.dietaryFiber.dv),   indent: true },
    { label: 'Total Sugars',       amount: amt(n?.totalSugars.g, 'g'),                                    indent: true },
    { label: 'Protein',            amount: amt(n?.protein.g, 'g'),                                        bold: true },
  ]

  const microRows: NutrientRow[] = [
    { label: 'Vitamin D',  amount: amt(n?.vitaminD.mcg, 'mcg'), dv: pct(n?.vitaminD.dv) },
    { label: 'Calcium',    amount: amt(n?.calcium.mg, 'mg'),    dv: pct(n?.calcium.dv) },
    { label: 'Iron',       amount: amt(n?.iron.mg, 'mg'),       dv: pct(n?.iron.dv) },
    { label: 'Potassium',  amount: amt(n?.potassium.mg, 'mg'),  dv: pct(n?.potassium.dv) },
  ]

  return (
    <div className="space-y-2">
      {/* Estimate badge */}
      <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium px-3 py-1 rounded-full">
        <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
        Estimated from image
      </div>

      {/* FDA-style label */}
      <div className="border-[3px] border-black p-2 w-64 bg-white text-black font-sans">
        {/* Header */}
        <p className="text-[32px] font-black leading-none tracking-tight">Nutrition</p>
        <p className="text-[32px] font-black leading-none tracking-tight">Facts</p>

        {/* Serving */}
        <div className="border-t-[6px] border-black mt-1 pt-1">
          <p className="text-xs font-bold">{n ? n.servingSize : '— serving'}</p>
          {n && <p className="text-xs text-zinc-500">{n.foodName}</p>}
        </div>

        {/* Calories */}
        <div className="border-t-[6px] border-black mt-1 flex justify-between items-baseline pt-0.5">
          <span className="text-sm font-bold">Calories</span>
          <span className="text-[40px] font-black leading-none">{n ? n.calories : '—'}</span>
        </div>

        {/* % Daily Value header */}
        <div className="border-t-[6px] border-black mt-1 text-right pt-0.5">
          <span className="text-[10px] font-bold">% Daily Value*</span>
        </div>

        {/* Nutrient rows */}
        {rows.map(({ label, amount, dv: dvVal, bold, indent }) => (
          <div
            key={label}
            className={`flex justify-between items-baseline border-t border-black py-[2px] text-[11px] ${indent ? 'pl-4' : ''}`}
          >
            <span>
              <span className={bold ? 'font-bold' : ''}>{label}</span>
              {' '}
              <span className={bold ? '' : 'font-bold'}>{amount}</span>
            </span>
            {dvVal && <span className="font-bold shrink-0 ml-1">{dvVal}</span>}
          </div>
        ))}

        {/* Micronutrients */}
        <div className="border-t-[10px] border-black mt-1">
          {microRows.map(({ label, amount, dv: dvVal }) => (
            <div key={label} className="flex justify-between items-baseline border-t border-black py-[2px] text-[11px]">
              <span>{label} {amount}</span>
              <span className="font-bold">{dvVal}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t-4 border-black mt-1 pt-1">
          <p className="text-[9px] leading-tight text-zinc-600">
            * Percent Daily Values are based on a 2,000 calorie diet. All values are estimates.
          </p>
        </div>
      </div>
    </div>
  )
}
