// components/tienda/FilterBar.tsx
"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Grid, List } from "lucide-react"
import { useMemo, useCallback } from "react"

type Category = { name: string; slug: string; _count?: { products?: number } }

function buildQS(sp: URLSearchParams, patch: Record<string, string | number | undefined>) {
  const next = new URLSearchParams(sp.toString())
  Object.entries(patch).forEach(([k, v]) => {
    if (v === undefined || v === "") next.delete(k)
    else next.set(k, String(v))
  })
  // siempre reinicia página cuando cambian filtros/orden/vista
  if ("category" in patch || "sort" in patch || "view" in patch || "q" in patch) {
    next.set("page", "1")
  }
  return next.toString()
}

export default function FilterBar({
  categories,
  q,
  category,
  sortBy,
  view,
  perPage,
}: {
  categories: Category[]
  q: string
  category: string
  sortBy: string
  view: "grid" | "list"
  perPage: number
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const sp = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams])

  const navigate = useCallback(
    (patch: Record<string, string | number | undefined>) => {
      const qs = buildQS(sp, patch)
      router.push(`${pathname}?${qs}`)
    },
    [router, pathname, sp]
  )

  return (
    <div className="mb-8 space-y-4">
      {/* Búsqueda */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        <Input
          placeholder="Buscar productos…"
          defaultValue={q}
          className="pl-10"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const value = (e.currentTarget as HTMLInputElement).value
              navigate({ q: value })
            }
          }}
          onBlur={(e) => navigate({ q: e.currentTarget.value })}
        />
      </div>

      {/* Controles */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Categoría */}
        <Select defaultValue={category || "all"} onValueChange={(val) => navigate({ category: val })}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.slug} value={c.slug}>
                {c.name} {c._count?.products ? `(${c._count.products})` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Orden */}
        <Select defaultValue={sortBy} onValueChange={(val) => navigate({ sort: val })}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Destacados</SelectItem>
            <SelectItem value="newest">Más nuevos</SelectItem>
            <SelectItem value="price-asc">Precio: menor a mayor</SelectItem>
            <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
            <SelectItem value="name">Nombre A-Z</SelectItem>
          </SelectContent>
        </Select>

        {/* Vista */}
        <div className="flex gap-2 ml-auto">
          <Button
            variant={view === "grid" ? "default" : "outline"}
            size="icon"
            aria-label="Ver en grilla"
            onClick={() => navigate({ view: "grid" })}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "list" ? "default" : "outline"}
            size="icon"
            aria-label="Ver en lista"
            onClick={() => navigate({ view: "list" })}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
