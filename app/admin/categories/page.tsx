// app/admin/categories/page.tsx
import Link from "next/link"
import { getBaseUrl } from "@/lib/base-url"
import DeleteButton from "@/components/admin/DeleteButton"

type SortKey = "name" | "slug" | "count"
type Dir = "asc" | "desc"
type SPromise = Promise<{ q?: string; page?: string; perPage?: string; sort?: SortKey; dir?: Dir }>

function initials(name: string) {
  const parts = (name || "").trim().split(/\s+/).slice(0, 2)
  return parts.map(p => p.charAt(0).toUpperCase()).join("") || "C"
}

async function fetchCategories(q: string, page: number, perPage = 10, sort?: SortKey, dir?: Dir) {
  const base = await getBaseUrl()
  const url = new URL("/admin/api/categories", base)
  url.searchParams.set("q", q)
  url.searchParams.set("page", String(page))
  url.searchParams.set("perPage", String(perPage))
  if (sort) url.searchParams.set("sort", sort)
  if (dir) url.searchParams.set("dir", dir)

  const res = await fetch(url.toString(), { cache: "no-store" })
  if (!res.ok) throw new Error(`Error al cargar categorías (${res.status})`)
  return res.json()
}

function qs(params: Record<string, string | number | undefined>) {
  const sp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") sp.set(k, String(v))
  }
  return `?${sp.toString()}`
}

function SortHeader({
  label, keyName, currentSort, currentDir, baseParams
}: {
  label: string
  keyName: SortKey
  currentSort?: string
  currentDir?: Dir
  baseParams: Record<string, string | number | undefined>
}) {
  const active = currentSort === keyName
  const nextDir: Dir = active ? (currentDir === "asc" ? "desc" : "asc") : "asc"
  const href = qs({ ...baseParams, page: 1, sort: keyName, dir: nextDir })
  const arrow = active ? (currentDir === "asc" ? "↑" : "↓") : "↕"
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1 hover:underline ${active ? "text-black" : "text-gray-700"}`}
    >
      {label} <span className="text-xs">{arrow}</span>
    </Link>
  )
}

export default async function CategoriesPage({ searchParams }: { searchParams: SPromise }) {
  const sp = await searchParams
  const q = sp?.q ?? ""
  const page = Math.max(1, Number(sp?.page ?? "1"))
  const perPage = Math.min(50, Math.max(5, Number(sp?.perPage ?? "10")))
  const sort = (sp?.sort as SortKey) || "name"
  const dir = (sp?.dir as Dir) || "asc"

  const data = await fetchCategories(q, page, perPage, sort, dir)
  const items: any[] = Array.isArray(data?.items) ? data.items : []
  const total: number = Number(data?.total ?? 0)
  const pages: number = Math.max(1, Number(data?.pages ?? 1))

  // KPIs calculados sobre la página actual (rápidos, server-safe)
  const withProducts = items.filter(c => (c._count?.products ?? 0) > 0).length
  const emptyCats = items.filter(c => (c._count?.products ?? 0) === 0).length

  const baseParams = { q, perPage, sort, dir }

  return (
    <div className="space-y-7">
      {/* Top bar */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Categorías</h1>
          <p className="text-sm">
            Organización del catálogo. {total} {total === 1 ? "categoría" : "categorías"} en total.
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center rounded-lg bg-black text-white px-4 py-2 text-sm shadow hover:opacity-90"
        >
          Nueva categoría
        </Link>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border px-4 py-3 shadow-sm bg-black text-white">
          <div className="text-[11px] opacity-80">Total</div>
          <div className="mt-1 text-2xl font-semibold">{total}</div>
        </div>
        <div className="rounded-xl border px-4 py-3 shadow-sm bg-indigo-600 text-white">
          <div className="text-[11px] opacity-90">Con productos</div>
          <div className="mt-1 text-2xl font-semibold">{withProducts}</div>
        </div>
        <div className="rounded-xl border px-4 py-3 shadow-sm bg-rose-600 text-white">
          <div className="text-[11px] opacity-90">Vacías</div>
          <div className="mt-1 text-2xl font-semibold">{emptyCats}</div>
        </div>
      </div>

      {/* Búsqueda */}
      <form className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="relative">
          <input
            className="w-full border rounded-lg px-3 py-2 pr-24"
            name="q"
            placeholder="Buscar por nombre o slug…"
            defaultValue={q}
          />
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button type="submit" className="rounded-md border px-3 py-1.5 text-xs hover:bg-gray-50">
              Buscar
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="perPage" className="text-sm text-muted-foreground">Por página</label>
          <select id="perPage" name="perPage" defaultValue={String(perPage)} className="border rounded-lg px-2 py-2 text-sm">
            {[10, 20, 30, 50].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          {/* Mantener sort/dir al buscar */}
          <input type="hidden" name="sort" value={sort} />
          <input type="hidden" name="dir" value={dir} />
        </div>
      </form>

      {/* Lista */}
      {items.length === 0 ? (
        <div className="rounded-xl border p-12 text-center bg-white shadow-sm">
          <div className="text-sm text-muted-foreground">No se encontraron categorías.</div>
          <div className="mt-4">
            <Link href="/admin/categories/new" className="inline-flex items-center rounded-lg bg-black text-white px-4 py-2 text-sm shadow hover:opacity-90">
              Crear la primera
            </Link>
          </div>
        </div>
      ) : (
        // 👇 Un solo root para esta rama para evitar el error de JSX
        <div className="space-y-4">
          {/* Desktop table */}
          <div className="hidden md:block rounded-xl border overflow-hidden bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/70 sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-gray-50/60">
                <tr className="text-left">
                  <th className="p-3 font-medium">
                    <SortHeader label="Nombre" keyName="name" currentSort={sort} currentDir={dir} baseParams={baseParams} />
                  </th>
                  <th className="p-3 font-medium">
                    <SortHeader label="Slug" keyName="slug" currentSort={sort} currentDir={dir} baseParams={baseParams} />
                  </th>
                  <th className="p-3 font-medium text-center">
                    <SortHeader label="# Productos" keyName="count" currentSort={sort} currentDir={dir} baseParams={baseParams} />
                  </th>
                  <th className="p-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {items.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/60">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg border bg-gray-50 flex items-center justify-center">
                          <span className="text-[11px] text-gray-600">{initials(c.name)}</span>
                        </div>
                        <div className="font-medium leading-tight">{c.name}</div>
                      </div>
                    </td>
                    <td className="p-3">/{c.slug}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs ring-1 ring-inset ${
                          (c._count?.products ?? 0) === 0
                            ? "bg-gray-50 text-gray-700 ring-gray-200"
                            : "bg-emerald-50 text-emerald-700 ring-emerald-200"
                        }`}
                      >
                        {c._count?.products ?? 0}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link className="rounded-md border px-3 py-1.5 text-xs hover:bg-gray-50" href={`/admin/categories/${c.id}`}>
                          Editar
                        </Link>
                        <DeleteButton
                          href={`/admin/api/categories/${c.id}`}
                          confirmText="¿Eliminar categoría? Debe no tener productos asociados."
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden grid gap-3">
            {items.map((c) => (
              <div key={c.id} className="rounded-xl border p-4 bg-white shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg border bg-gray-50 flex items-center justify-center">
                      <span className="text-[11px] text-gray-600">{initials(c.name)}</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium leading-tight">{c.name}</div>
                      <div className="text-[11px] text-muted-foreground leading-tight">/{c.slug}</div>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs ring-1 ring-inset ${
                      (c._count?.products ?? 0) === 0
                        ? "bg-gray-50 text-gray-700 ring-gray-200"
                        : "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    }`}
                  >
                    {c._count?.products ?? 0}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-end gap-2">
                  <Link className="rounded-md border px-3 py-1.5 text-xs" href={`/admin/categories/${c.id}`}>Editar</Link>
                  <DeleteButton
                    href={`/admin/api/categories/${c.id}`}
                    confirmText="¿Eliminar categoría? Debe no tener productos asociados."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Paginación */}
      {pages > 1 && (
        <nav className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Página {page} de {pages}</p>
          <div className="flex items-center gap-2">
            <Link aria-disabled={page === 1} className={`rounded-md border px-3 py-1.5 text-xs hover:bg-gray-50 ${page === 1 ? "pointer-events-none opacity-50" : ""}`} href={qs({ q, perPage, sort, dir, page: 1 })}>« Primera</Link>
            <Link aria-disabled={page === 1} className={`rounded-md border px-3 py-1.5 text-xs hover:bg-gray-50 ${page === 1 ? "pointer-events-none opacity-50" : ""}`} href={qs({ q, perPage, sort, dir, page: Math.max(1, page - 1) })}>‹ Anterior</Link>
            <Link aria-disabled={page >= pages} className={`rounded-md border px-3 py-1.5 text-xs hover:bg-gray-50 ${page >= pages ? "pointer-events-none opacity-50" : ""}`} href={qs({ q, perPage, sort, dir, page: Math.min(pages, page + 1) })}>Siguiente ›</Link>
            <Link aria-disabled={page >= pages} className={`rounded-md border px-3 py-1.5 text-xs hover:bg-gray-50 ${page >= pages ? "pointer-events-none opacity-50" : ""}`} href={qs({ q, perPage, sort, dir, page: pages })}>Última »</Link>
          </div>
        </nav>
      )}
    </div>
  )
}
