// app/tienda/page.tsx
import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/primsa"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Heart, Search, Grid, List } from "lucide-react"
import { CartDrawer } from "@/components/cart-drawer"
import { Footer } from "@/components/footer"
import FilterBar from "@/components/tienda/FilterBar"

export const runtime = "nodejs"
export const revalidate = 60

type SPromise = Promise<Record<string, string | string[] | undefined>>

function money(v: any) {
  try {
    const n = Number(v)
    if (Number.isFinite(n)) return `$${n.toFixed(2)}`
    return `$${String(v)}`
  } catch {
    return `$${String(v)}`
  }
}

function toStringParam(p?: string | string[]) {
  if (Array.isArray(p)) return p[0] ?? ""
  return p ?? ""
}

function activeClass(cond: boolean, a: string, b: string) {
  return cond ? a : b
}

function firstImageAsString(images: unknown): string | undefined {
  // Soporta: string | string[] | Json raro
  if (typeof images === "string") return images
  if (Array.isArray(images)) {
    const s = images.find((x) => typeof x === "string")
    return s as string | undefined
  }
  // También puede venir como {0:"...", ...}
  if (images && typeof images === "object") {
    const maybeArray = Object.values(images as Record<string, unknown>)
    const s = maybeArray.find((x) => typeof x === "string")
    return s as string | undefined
  }
  return undefined
}

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: SPromise
}) {
  const sp = await searchParams

  const q = toStringParam(sp.q).trim()
  const category = toStringParam(sp.category) || "all"
  const sortBy =
    toStringParam(sp.sort) || "featured" // featured | newest | price-asc | price-desc | name
  const view = (toStringParam(sp.view) as "grid" | "list") || "grid"
  const page = Math.max(1, Number(toStringParam(sp.page) || "1"))
  const perPage = Math.min(48, Math.max(1, Number(toStringParam(sp.perPage) || "12")))
  const skip = (page - 1) * perPage

  // Filtros
  const where: any = {
    status: "published",
    ...(q
      ? {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { slug: { contains: q, mode: "insensitive" } },
          { tags: { has: q.toLowerCase() } },
        ],
      }
      : {}),
    ...(category !== "all"
      ? { categories: { some: { slug: category } } }
      : {}),
  }

  // Orden
  let orderBy: any = { updatedAt: "desc" } // featured
  if (sortBy === "newest") orderBy = { createdAt: "desc" }
  if (sortBy === "price-asc") orderBy = { price: "asc" }
  if (sortBy === "price-desc") orderBy = { price: "desc" }
  if (sortBy === "name") orderBy = { name: "asc" }

  // Datos
  const [items, total, allCategories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: perPage,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        compareAt: true,
        images: true,
        categories: { select: { name: true, slug: true } },
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true, _count: { select: { products: true } } },
    }),
  ])

  const pages = Math.max(1, Math.ceil(total / perPage))

  // Helper para construir URLs de filtros conservando el resto
  function buildQS(next: Partial<Record<string, string | number>>) {
    const u = new URLSearchParams()
    if (q) u.set("q", q)
    if (category) u.set("category", category)
    if (sortBy) u.set("sort", sortBy)
    if (view) u.set("view", view)
    if (perPage) u.set("perPage", String(perPage))
    if (page) u.set("page", String(page))

    Object.entries(next).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") u.delete(k)
      else u.set(k, String(v))
    })
    return "?" + u.toString()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight">
            2MyLover
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium hover:text-muted transition-colors">
              Inicio
            </Link>
            <Link href="/tienda" className="text-sm font-medium text-primary">
              Tienda
            </Link>
            <Link href="/lookbook" className="text-sm font-medium hover:text-muted transition-colors">
              Lookbook
            </Link>
            <Link href="/nosotros" className="text-sm font-medium hover:text-muted transition-colors">
              Nosotros
            </Link>
            <Link href="/contacto" className="text-sm font-medium hover:text-muted transition-colors">
              Contacto
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/tienda" aria-label="Buscar">
                <Search className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <CartDrawer />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Título */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold mb-4">Tienda</h1>
          <p className="text-muted text-lg">
            Descubre nuestra colección completa de moda urbana minimalista
          </p>
        </div>

        {/* Filtros / búsqueda */}
        <div className="mb-8 space-y-4">
          {/* Búsqueda */}
          <FilterBar
            categories={allCategories}
            q={q}
            category={category}
            sortBy={sortBy}
            view={view}
            perPage={perPage}
          />

          {/* Controles */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Categoría */}
            <form action="/tienda">
              <input type="hidden" name="q" value={q} />
              <input type="hidden" name="sort" value={sortBy} />
              <input type="hidden" name="view" value={view} />
              <input type="hidden" name="perPage" value={perPage} />
              <Select
                defaultValue={category}
                onValueChange={(val) => {
                  // submit GET
                  const f = document.currentScript?.parentElement as HTMLFormElement | null
                  if (f) {
                    const el = f.querySelector('input[name="category"]') as HTMLInputElement
                    if (el) el.value = val
                    f.submit()
                  }
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {allCategories.map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>
                      {c.name} {c._count.products ? `(${c._count.products})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input name="category" defaultValue={category} hidden />
            </form>

            {/* Orden */}
            <form action="/tienda">
              <input type="hidden" name="q" value={q} />
              <input type="hidden" name="category" value={category} />
              <input type="hidden" name="view" value={view} />
              <input type="hidden" name="perPage" value={perPage} />
              <Select
                defaultValue={sortBy}
                onValueChange={(val) => {
                  const f = document.currentScript?.parentElement as HTMLFormElement | null
                  if (f) {
                    const el = f.querySelector('input[name="sort"]') as HTMLInputElement
                    if (el) el.value = val
                    f.submit()
                  }
                }}
              >
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
              <input name="sort" defaultValue={sortBy} hidden />
            </form>

            {/* Vista */}
            <div className="flex gap-2 ml-auto">
              <Link href={buildQS({ view: "grid", page: 1 })}>
                <Button
                  variant={activeClass(view === "grid", "default", "outline") as any}
                  size="icon"
                  aria-label="Ver en grilla"
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={buildQS({ view: "list", page: 1 })}>
                <Button
                  variant={activeClass(view === "list", "default", "outline") as any}
                  size="icon"
                  aria-label="Ver en lista"
                >
                  <List className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Conteo */}
        <div className="mb-6">
          <p className="text-muted">
            Mostrando {items.length} de {total} productos
          </p>
        </div>

        {/* Grid / List */}
        <div
          className={`grid gap-6 ${view === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1"
            }`}
        >
          {items.map((p) => {
            const img = firstImageAsString(p.images) ?? "/placeholder.svg"
            const cat = p.categories?.[0]
            const original = p.compareAt ? Number(p.compareAt) : undefined

            return (
              <Card
                key={p.id}
                className={`group cursor-pointer border-0 shadow-none hover:shadow-lg transition-all duration-300 ${view === "list" ? "flex" : ""
                  }`}
              >
                <CardContent className={`p-0 ${view === "list" ? "flex w-full" : ""}`}>
                  <div
                    className={`relative overflow-hidden ${view === "list" ? "w-48 flex-shrink-0" : ""
                      }`}
                  >
                    <img
                      src={img}
                      alt={p.name}
                      className={`object-cover group-hover:scale-105 transition-transform duration-300 ${view === "list" ? "w-48 h-48" : "w-full h-80"
                        }`}
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {/* Puedes marcar “Nuevo” por lógica (ej. <30 días) si quieres */}
                      {/* <Badge className="bg-primary text-primary-foreground">Nuevo</Badge> */}
                    </div>
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button size="icon" variant="secondary" className="h-8 w-8" aria-label="Favorito">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    <Link
                      href={`/tienda/${p.slug}`}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <Button size="sm">Ver producto</Button>
                    </Link>
                  </div>

                  <div
                    className={`p-6 ${view === "list" ? "flex-1 flex flex-col justify-center" : "text-center"
                      }`}
                  >
                    {cat && (
                      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                        {cat.name}
                      </div>
                    )}
                    <h4 className="font-medium text-lg mb-2">{p.name}</h4>
                    <div className="flex items-center gap-2 mb-4 justify-center">
                      <span className="font-serif text-xl font-bold">{money(p.price)}</span>
                      {original && (
                        <span className="text-muted line-through text-sm">{money(original)}</span>
                      )}
                    </div>
                    <Button className={view === "list" ? "w-40" : "w-full"} asChild>
                      <Link href={`/tienda/${p.slug}`}>Agregar al carrito</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Estado vacío */}
        {items.length === 0 && (
          <div className="text-center py-16">
            <h3 className="font-serif text-2xl font-bold mb-4">No se encontraron productos</h3>
            <p className="text-muted mb-6">Intenta ajustar tus filtros o búsqueda</p>
            <Link href="/tienda">
              <Button>Limpiar filtros</Button>
            </Link>
          </div>
        )}

        {/* Paginación */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <Link href={buildQS({ page: Math.max(1, page - 1) })}>
              <Button variant="outline" disabled={page <= 1}>
                Anterior
              </Button>
            </Link>
            <span className="text-sm text-muted-foreground">
              Página {page} de {pages}
            </span>
            <Link href={buildQS({ page: Math.min(pages, page + 1) })}>
              <Button variant="outline" disabled={page >= pages}>
                Siguiente
              </Button>
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
