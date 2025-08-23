import Link from "next/link"
import { getBaseUrl } from "@/lib/base-url"
import DeleteButton from "@/components/admin/DeleteButton"
import ProductPreviewTrigger from "@/components/admin/ProductPreview"

type SortKey = "name" | "price" | "stock" | "status" | "updatedAt"
type Dir = "asc" | "desc"
type SearchParamsPromise = Promise<{
  q?: string
  page?: string
  perPage?: string
  status?: "draft" | "published" | "archived" | ""
  sort?: SortKey
  dir?: Dir
}>

function formatIsoShort(d: string | number | Date) {
  try { return new Date(d).toISOString().replace("T", " ").slice(0, 16) } catch { return "" }
}
function currency(n: unknown) { const num = Number(n ?? 0); return `$${num.toFixed(2)}` }
function initials(name: string) {
  const parts = (name || "").trim().split(/\s+/).slice(0, 2)
  return parts.map(p => p.charAt(0).toUpperCase()).join("") || "P"
}

async function fetchProducts(search: string, page: number, perPage = 10, status?: string, sort?: SortKey, dir?: Dir) {
  const base = await getBaseUrl()
  const url = new URL("/admin/api/products", base)
  url.searchParams.set("q", search)
  url.searchParams.set("page", String(page))
  url.searchParams.set("perPage", String(perPage))
  if (status) url.searchParams.set("status", status)
  if (sort) url.searchParams.set("sort", sort)
  if (dir) url.searchParams.set("dir", dir)
  const res = await fetch(url.toString(), { cache: "no-store" })
  if (!res.ok) throw new Error(`Error al cargar productos (${res.status})`)
  return res.json()
}

function qs(params: Record<string, string | number | undefined>) {
  const sp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") sp.set(k, String(v))
  }
  return `?${sp.toString()}`
}

function Pill({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${className}`}>
      {children}
    </span>
  )
}
function StatusBadge({ status }: { status?: string }) {
  const s = status ?? "draft"
  const map: Record<string, string> = {
    draft: "bg-gray-50 text-gray-700 ring-gray-200",
    published: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    archived: "bg-amber-50 text-amber-700 ring-amber-200",
  }
  return <Pill className={map[s] ?? map.draft}>{s}</Pill>
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
  const href = qs({ ...baseParams, sort: keyName, dir: nextDir })
  const ariaSort = active ? (currentDir === "asc" ? "ascending" : "descending") : "none"
  const arrow = active ? (currentDir === "asc" ? "↑" : "↓") : "↕"
  return (
    <Link
      href={href}
      aria-sort={ariaSort as any}
      className={`inline-flex items-center gap-1 hover:underline ${active ? "text-black" : "text-gray-700"}`}
    >
      {label} <span className="text-xs">{arrow}</span>
    </Link>
  )
}

export default async function ProductsPage({ searchParams }: { searchParams: SearchParamsPromise }) {
  const sp = await searchParams
  const q = sp?.q ?? ""
  const page = Math.max(1, Number(sp?.page ?? "1"))
  const perPage = Math.min(50, Math.max(5, Number(sp?.perPage ?? "10")))
  const status = (sp?.status ?? "") as "" | "draft" | "published" | "archived"
  const sort = (sp?.sort as SortKey) || "updatedAt"
  const dir = (sp?.dir as Dir) || "desc"

  const data = await fetchProducts(q, page, perPage, status || undefined, sort, dir)
  const items: any[] = Array.isArray(data?.items) ? data.items : []
  const total: number = Number(data?.total ?? 0)
  const pages: number = Math.max(1, Number(data?.pages ?? 1))

  const publishedCount = items.filter(i => i.status === "published").length
  const lowStockCount = items.filter(i => (i.stock ?? 0) <= 3).length

  const baseParams = { q, perPage, status, sort, dir }

  return (
    <div className="space-y-7">
      {/* Top bar */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Productos</h1>
          <p className="text-sm">
            Catálogo y existencias. {total} {total === 1 ? "ítem" : "ítems"} en total.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center rounded-lg bg-black text-white px-4 py-2 text-sm shadow hover:opacity-90"
        >
          Nuevo producto
        </Link>
      </div>

      {/* KPI strip – colores modern/minimal */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border px-4 py-3 shadow-sm bg-black text-white">
          <div className="text-[11px] opacity-80">Total</div>
          <div className="mt-1 text-2xl font-semibold">{total}</div>
        </div>
        <div className="rounded-xl border px-4 py-3 shadow-sm bg-emerald-600 text-white">
          <div className="text-[11px] opacity-90">Publicados (en página)</div>
          <div className="mt-1 text-2xl font-semibold">{publishedCount}</div>
        </div>
        <div className="rounded-xl border px-4 py-3 shadow-sm bg-rose-600 text-white">
          <div className="text-[11px] opacity-90">Stock bajo (≤3)</div>
          <div className="mt-1 text-2xl font-semibold">{lowStockCount}</div>
        </div>
      </div>

      {/* Filtros */}
      <form className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <input
            className="w-full border rounded-lg px-3 py-2 pr-24"
            name="q"
            placeholder="Buscar por nombre o slug…"
            defaultValue={q}
          />
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button type="submit" className="rounded-md border px-3 py-1.5 text-xs hover:bg-gray-50">Buscar</button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="status" className="text-sm text-muted-foreground">Estado</label>
          <select id="status" name="status" defaultValue={status} className="border rounded-lg px-2 py-2 text-sm">
            <option value="">Todos</option>
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
            <option value="archived">Archivado</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="perPage" className="text-sm text-muted-foreground">Por página</label>
          <select id="perPage" name="perPage" defaultValue={String(perPage)} className="border rounded-lg px-2 py-2 text-sm">
            {[10, 20, 30, 50].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          {/* Mantener sort/dir actuales en el submit */}
          <input type="hidden" name="sort" value={sort} />
          <input type="hidden" name="dir" value={dir} />
        </div>
      </form>

      {/* Lista */}
      {items.length === 0 ? (
        <div className="rounded-xl border p-12 text-center bg-white shadow-sm">
          <div className="text-sm text-muted-foreground">No se encontraron productos.</div>
          <div className="mt-4">
            <Link href="/admin/products/new" className="inline-flex items-center rounded-lg bg-black text-white px-4 py-2 text-sm shadow hover:opacity-90">
              Crear el primero
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-xl border overflow-hidden bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/70 sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-gray-50/60">
                <tr className="text-left">
                  <th className="p-3 font-medium">
                    <SortHeader label="Producto" keyName="name" currentSort={sort} currentDir={dir} baseParams={{ ...baseParams, page: 1 }} />
                  </th>
                  <th className="p-3 font-medium text-center">
                    <SortHeader label="Precio" keyName="price" currentSort={sort} currentDir={dir} baseParams={{ ...baseParams, page: 1 }} />
                  </th>
                  <th className="p-3 font-medium text-center">
                    <SortHeader label="Stock" keyName="stock" currentSort={sort} currentDir={dir} baseParams={{ ...baseParams, page: 1 }} />
                  </th>
                  <th className="p-3 font-medium text-center">
                    <SortHeader label="Estado" keyName="status" currentSort={sort} currentDir={dir} baseParams={{ ...baseParams, page: 1 }} />
                  </th>
                  <th className="p-3 font-medium text-center">
                    <SortHeader label="Actualizado" keyName="updatedAt" currentSort={sort} currentDir={dir} baseParams={{ ...baseParams, page: 1 }} />
                  </th>
                  <th className="p-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {items.map((p) => {
                  const thumb = (p as any)?.images?.[0] as string | undefined
                  return (
                    <tr key={p.id} className="hover:bg-gray-50/60">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <ProductPreviewTrigger
                            product={{
                              id: p.id,
                              name: p.name,
                              slug: p.slug,
                              price: p.price,
                              images: (p as any)?.images,
                              categories: (p as any)?.categories ?? [],
                            }}
                          />
                          {/* Título + slug */}
                          <div>
                            <div className="font-medium leading-tight">{p.name}</div>
                            <div className="text-[11px] text-muted-foreground leading-tight">/{p.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-center">{currency(p.price)}</td>
                      <td className="p-3 text-center">
                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs ring-1 ring-inset
                          ${(p.stock ?? 0) <= 3 ? "bg-rose-50 text-rose-700 ring-rose-200" : "bg-gray-50 text-gray-700 ring-gray-200"}`}>
                          {p.stock ?? 0}
                        </span>
                      </td>
                      <td className="p-3 text-center"><StatusBadge status={p.status} /></td>
                      <td className="p-3 text-center">{p.updatedAt ? formatIsoShort(p.updatedAt) : "-"}</td>
                      <td className="p-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link className="rounded-md border px-3 py-1.5 text-xs hover:bg-gray-50" href={`/admin/products/${p.id}`}>
                            Editar
                          </Link>
                          <DeleteButton
                            href={`/admin/api/products/${p.id}`}
                            confirmText="¿Eliminar producto? Esta acción es irreversible."
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden grid gap-3">
            {items.map((p) => {
              const thumb = (p as any)?.images?.[0] as string | undefined
              return (
                <div key={p.id} className="rounded-xl border p-4 bg-white shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg border bg-gray-50 flex items-center justify-center overflow-hidden">
                        {thumb ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={thumb} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-[11px] text-gray-600">{initials(p.name)}</span>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium leading-tight">{p.name}</div>
                        <div className="text-[11px] text-muted-foreground leading-tight">/{p.slug}</div>
                      </div>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>

                  <div className="mt-3 grid grid-cols-3 text-xs gap-2">
                    <div><div className="text-muted-foreground">Precio</div><div className="font-medium">{currency(p.price)}</div></div>
                    <div><div className="text-muted-foreground">Stock</div><div className="font-medium">{p.stock ?? 0}</div></div>
                    <div><div className="text-muted-foreground">Actualizado</div><div className="font-medium">{p.updatedAt ? formatIsoShort(p.updatedAt) : "-"}</div></div>
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-2">
                    <Link className="rounded-md border px-3 py-1.5 text-xs" href={`/admin/products/${p.id}`}>Editar</Link>
                    <DeleteButton href={`/admin/api/products/${p.id}`} confirmText="¿Eliminar producto? Esta acción es irreversible." />
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Paginación */}
      {pages > 1 && (
        <nav className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Página {page} de {pages}</p>
          <div className="flex items-center gap-2">
            <Link aria-disabled={page === 1} className={`rounded-md border px-3 py-1.5 text-xs hover:bg-gray-50 ${page === 1 ? "pointer-events-none opacity-50" : ""}`} href={qs({ q, perPage, status, sort, dir, page: 1 })}>« Primera</Link>
            <Link aria-disabled={page === 1} className={`rounded-md border px-3 py-1.5 text-xs hover:bg-gray-50 ${page === 1 ? "pointer-events-none opacity-50" : ""}`} href={qs({ q, perPage, status, sort, dir, page: Math.max(1, page - 1) })}>‹ Anterior</Link>
            <Link aria-disabled={page >= pages} className={`rounded-md border px-3 py-1.5 text-xs hover:bg-gray-50 ${page >= pages ? "pointer-events-none opacity-50" : ""}`} href={qs({ q, perPage, status, sort, dir, page: Math.min(pages, page + 1) })}>Siguiente ›</Link>
            <Link aria-disabled={page >= pages} className={`rounded-md border px-3 py-1.5 text-xs hover:bg-gray-50 ${page >= pages ? "pointer-events-none opacity-50" : ""}`} href={qs({ q, perPage, status, sort, dir, page: pages })}>Última »</Link>
          </div>
        </nav>
      )}
    </div>
  )
}
