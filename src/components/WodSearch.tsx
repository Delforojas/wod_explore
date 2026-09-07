interface WodSearchProps {
  value: string
  onChange: (value: string) => void
}

export function WodSearch({ value, onChange }: WodSearchProps) {
  return (
    <div className="catalog-search">
      <label htmlFor="wod-search" className="field-label normal-case tracking-normal text-board-text">
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
        className="input-control px-4"
      />
    </div>
  )
}
