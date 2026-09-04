interface WodSearchProps {
  value: string
  onChange: (value: string) => void
}

export function WodSearch({ value, onChange }: WodSearchProps) {
  return (
    <div className="max-w-xl">
      <label htmlFor="wod-search" className="text-sm font-semibold text-slate-200">
        Buscar WOD por nombre
      </label>
      <input
        id="wod-search"
        name="wod-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Ej.: Fran…"
        autoComplete="off"
        className="mt-2 min-h-11 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-base text-slate-100 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
      />
    </div>
  )
}
