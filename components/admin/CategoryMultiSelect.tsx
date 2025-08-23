"use client"

import { useEffect, useMemo, useState } from "react"

type Cat = { id: string; name: string; slug: string }

export default function CategoryMultiSelect({
  value,
  onChange,
  label = "Categorías",
  placeholder = "Filtrar categorías…",
  className = "",
}: {
  value: string[]
  onChange: (ids: string[]) => void
  label?: string
  placeholder?: string
  className?: string
}) {
  const [q, setQ] = useState("")
  const [all, setAll] = useState<Cat[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/admin/api/categories?q=${encodeURIComponent(q)}&perPage=50`, { cache: "no-store" })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || `Error ${res.status}`)
        if (active) setAll(data.items ?? [])
      } catch (e: any) {
        if (active) setError(e?.message || "No se pudo cargar categorías")
      } finally {
        if (active) setLoading(false)
      }
    }
    void load()
    return () => { active = false }
  }, [q])

  const selectedSet = useMemo(() => new Set(value), [value])

  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        className="w-full border rounded px-3 py-2 mb-2"
        placeholder={placeholder}
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="border rounded p-2 max-h-56 overflow-auto space-y-1 bg-white">
        {loading && <div className="text-sm text-muted-foreground">Cargando…</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}
        {!loading && !error && all.length === 0 && (
          <div className="text-sm text-muted-foreground">Sin resultados</div>
        )}
        {all.map((c) => {
          const checked = selectedSet.has(c.id)
          return (
            <label key={c.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => {
                  if (e.target.checked) onChange([...value, c.id])
                  else onChange(value.filter((id) => id !== c.id))
                }}
              />
              <span className="font-medium">{c.name}</span>
              <span className="text-muted-foreground">({c.slug})</span>
            </label>
          )
        })}
      </div>
      {value.length > 0 && (
        <div className="text-xs text-muted-foreground mt-1">
          Seleccionadas: {value.length}
        </div>
      )}
    </div>
  )
}
