// app/admin/page.tsx
import Link from "next/link"
import { getBaseUrl } from "@/lib/base-url"

type Product = {
  id: string
  name: string
  slug: string
  price: string | number
  stock: number
  status: "draft" | "published" | "archived"
  updatedAt: string
}

type Category = {
  id: string
  name: string
  slug: string
  _count?: { products: number }
}

async function fetchProductsSummary() {
  const base = await getBaseUrl()
  // Pedimos 1 ítem para obtener "total" barato
  const url = new URL("/admin/api/products", base)
  url.searchParams.set("q", "")
  url.searchParams.set("page", "1")
  url.searchParams.set("perPage", "1")

  const res = await fetch(url.toString(), { cache: "no-store" })
  if (!res.ok) throw new Error("No se pudo cargar productos")
  const json = await res.json()
  const total: number = json?.total ?? 0

  // Ahora pedimos últimos 5 productos (ya ordenas por updatedAt desc en tu API)
  const recentUrl = new URL("/admin/api/products", base)
  recentUrl.searchParams.set("q", "")
  recentUrl.searchParams.set("page", "1")
  recentUrl.searchParams.set("perPage", "5")
  const resRecent = await fetch(recentUrl.toString(), { cache: "no-store" })
  const recentJson = resRecent.ok ? await resRecent.json() : { items: [] }

  // Contemos publicados y el stock total rápido sobre el “page” pedido (si quieres precisión global,
  // podrías crear un endpoint agregado en el futuro)
  const publishedOnPage = (recentJson.items as Product[]).filter(p => p.status === "published").length
  const stockOnPage = (recentJson.items as Product[]).reduce((acc, p) => acc + (Number(p.stock || 0)), 0)

  return {
    total,
    recent: (recentJson.items as Product[]) ?? [],
    publishedOnPage,
    stockOnPage,
  }
}

async function fetchCategoriesSummary() {
  const base = await getBaseUrl()
  const url = new URL("/admin/api/categories", base)
  url.searchParams.set("q", "")
  url.searchParams.set("page", "1")
  url.searchParams.set("perPage", "1")

  const res = await fetch(url.toString(), { cache: "no-store" })
  if (!res.ok) throw new Error("No se pudo cargar categorías")
  const json = await res.json()
  const total: number = json?.total ?? 0

  // Últimas 5 categorías (usa tu mismo orden; si tu handler acepta sort/dir mejor aún)
  const recentUrl = new URL("/admin/api/categories", base)
  recentUrl.searchParams.set("q", "")
  recentUrl.searchParams.set("page", "1")
  recentUrl.searchParams.set("perPage", "5")
  const resRecent = await fetch(recentUrl.toString(), { cache: "no-store" })
  const recentJson = resRecent.ok ? await resRecent.json() : { items: [] }

  return {
    total,
    recent: (recentJson.items as Category[]) ?? [],
  }
}

// Fecha ISO corta y estable para SSR (evita hydration mismatch)
function isoShort(d: string | number | Date) {
  try {
    return new Date(d).toISOString().replace("T", " ").slice(0, 16)
  } catch {
    return ""
  }
}

// Iniciales para avatar/monograma
function initials(text: string) {
  const parts = (text || "").trim().split(/\s+/).slice(0, 2)
  return parts.map(p => p.charAt(0).toUpperCase()).join("") || "X"
}

export default async function AdminHome() {
  const [{ total: totalProducts, recent: recentProducts, publishedOnPage, stockOnPage }, { total: totalCategories, recent: recentCategories }] =
    await Promise.all([fetchProductsSummary(), fetchCategoriesSummary()])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Resumen del catálogo y accesos rápidos.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/products/new" className="rounded-lg bg-black text-white px-4 py-2 text-sm shadow hover:opacity-90">
            Nuevo producto
          </Link>
          <Link href="/admin/categories/new" className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
            Nueva categoría
          </Link>
        </div>
      </div>

      {/* KPI strip con alto contraste */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl border px-4 py-3 shadow-sm bg-black text-white">
          <div className="text-[11px] opacity-80">Productos totales</div>
          <div className="mt-1 text-2xl font-semibold">{totalProducts}</div>
          <div className="mt-2 text-[11px] opacity-70">Última actualización desde API</div>
        </div>

        <div className="rounded-xl border px-4 py-3 shadow-sm bg-zinc-900 text-white">
          <div className="text-[11px] opacity-80">Categorías totales</div>
          <div className="mt-1 text-2xl font-semibold">{totalCategories}</div>
          <div className="mt-2 text-[11px] opacity-70">Gestión del árbol de navegación</div>
        </div>

        <div className="rounded-xl border px-4 py-3 shadow-sm bg-indigo-600 text-white">
          <div className="text-[11px] opacity-90">Publicados (página reciente)</div>
          <div className="mt-1 text-2xl font-semibold">{publishedOnPage}</div>
          <div className="mt-2 text-[11px] opacity-80">Entre los 5 últimos</div>
        </div>

        <div className="rounded-xl border px-4 py-3 shadow-sm bg-emerald-600 text-white">
          <div className="text-[11px] opacity-90">Stock total (página reciente)</div>
          <div className="mt-1 text-2xl font-semibold">{stockOnPage}</div>
          <div className="mt-2 text-[11px] opacity-80">Suma de los 5 últimos</div>
        </div>
      </div>

      {/* Grids: productos recientes y categorías recientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productos recientes */}
        <section className="rounded-2xl border bg-white shadow-sm overflow-hidden">
          <header className="border-b px-5 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold leading-none">Productos recientes</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Últimos cambios en el catálogo.
              </p>
            </div>
            <Link href="/admin/products" className="text-xs underline hover:opacity-80">
              Ver todos
            </Link>
          </header>

          {recentProducts.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">No hay productos recientes.</div>
          ) : (
            <ul className="divide-y">
              {recentProducts.map((p) => (
                <li key={p.id} className="px-5 py-3 hover:bg-gray-50/60">
                  <div className="flex items-center gap-3">
                    {/* Avatar / monograma */}
                    <div className="h-9 w-9 rounded-lg border bg-gray-50 flex items-center justify-center shrink-0">
                      <span className="text-[11px] text-gray-600">{initials(p.name)}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div className="truncate">
                          <Link href={`/admin/products/${p.id}`} className="font-medium hover:underline">
                            {p.name}
                          </Link>
                          <div className="text-[11px] text-muted-foreground truncate">/{p.slug}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-semibold">
                            ${Number(p.price ?? 0).toFixed(2)}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {p.status === "published" ? "Publicado" : p.status === "draft" ? "Borrador" : "Archivado"}
                          </div>
                        </div>
                      </div>
                      <div className="mt-1 text-[11px] text-muted-foreground">
                        Stock: <span className="font-medium">{p.stock ?? 0}</span> · Actualizado: {isoShort(p.updatedAt)}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Categorías recientes */}
        <section className="rounded-2xl border bg-white shadow-sm overflow-hidden">
          <header className="border-b px-5 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold leading-none">Categorías recientes</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Nuevas categorías o cambios recientes.
              </p>
            </div>
            <Link href="/admin/categories" className="text-xs underline hover:opacity-80">
              Ver todas
            </Link>
          </header>

          {recentCategories.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">No hay categorías recientes.</div>
          ) : (
            <ul className="divide-y">
              {recentCategories.map((c) => (
                <li key={c.id} className="px-5 py-3 hover:bg-gray-50/60">
                  <div className="flex items-center gap-3">
                    {/* Avatar / monograma */}
                    <div className="h-9 w-9 rounded-lg border bg-gray-50 flex items-center justify-center shrink-0">
                      <span className="text-[11px] text-gray-600">{initials(c.name)}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div className="truncate">
                          <Link href={`/admin/categories/${c.id}`} className="font-medium hover:underline">
                            {c.name}
                          </Link>
                          <div className="text-[11px] text-muted-foreground truncate">/{c.slug}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs ring-1 ring-inset bg-gray-50 text-gray-700 ring-gray-200">
                            {(c._count?.products ?? 0)} productos
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Quick actions */}
      <section className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        <header className="border-b px-5 py-4">
          <h2 className="text-base font-semibold leading-none">Acciones rápidas</h2>
          <p className="text-xs text-muted-foreground mt-1">Tareas comunes del panel.</p>
        </header>
        <div className="p-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/admin/products/new" className="rounded-lg border px-4 py-3 text-sm hover:bg-gray-50">
            ➕ Crear producto
          </Link>
          <Link href="/admin/categories/new" className="rounded-lg border px-4 py-3 text-sm hover:bg-gray-50">
            ➕ Crear categoría
          </Link>
          <Link href="/admin/products?sort=updated&dir=desc" className="rounded-lg border px-4 py-3 text-sm hover:bg-gray-50">
            🧭 Revisar productos
          </Link>
          <Link href="/admin/categories?sort=name&dir=asc" className="rounded-lg border px-4 py-3 text-sm hover:bg-gray-50">
            🧭 Revisar categorías
          </Link>
        </div>
      </section>
    </div>
  )
}
