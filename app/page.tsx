// app/page.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Search, Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { CartDrawer } from "@/components/cart-drawer"
import { Footer } from "@/components/footer"
import { prisma } from "@/lib/primsa"

export const runtime = "nodejs"
export const revalidate = 60

function formatMoney(v: unknown) {
  try {
    // Decimal | number | string -> string
    const n = Number(v as any)
    return Number.isFinite(n) ? `$${n.toFixed(2)}` : `$${String(v)}`
  } catch {
    return `$${String(v)}`
  }
}

export default async function HomePage() {
  // ❌ Sin anotación manual: deja que Prisma infiera el tipo exacto
  const featured = await prisma.product.findMany({
    where: { status: "published" },
    orderBy: { updatedAt: "desc" },
    take: 6,
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,       // Decimal
      images: true,      // JsonValue
      categories: { select: { name: true, slug: true } },
    },
  })

  // ✅ Derivamos el tipo del array devuelto por Prisma
  type Featured = (typeof featured)[number]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/" className="font-serif text-2xl font-bold tracking-tight">
              2MyLover
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium hover:text-muted transition-colors">Inicio</Link>
            <Link href="/tienda" className="text-sm font-medium hover:text-muted transition-colors">Tienda</Link>
            <Link href="/lookbook" className="text-sm font-medium hover:text-muted transition-colors">Lookbook</Link>
            <Link href="/nosotros" className="text-sm font-medium hover:text-muted transition-colors">Nosotros</Link>
            <Link href="/contacto" className="text-sm font-medium hover:text-muted transition-colors">Contacto</Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon"><Search className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon"><Heart className="h-5 w-5" /></Button>
            <CartDrawer />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40 z-10" />
        <Image src="/monochrome-urban-model.png" alt="2MyLover Hero" fill className="object-cover" priority />
        <div className="relative z-20 text-center text-white max-w-4xl px-4">
          <h2 className="font-serif text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Vístete con estilo,<br/>vístete con identidad
          </h2>
          <p className="text-xl md:text-2xl mb-8 font-light">Moda urbana minimalista en blanco y negro</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-black hover:bg-secondary text-lg px-8 py-6" asChild>
              <Link href="/tienda">Comprar ahora</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black text-lg px-8 py-6 bg-transparent" asChild>
              <Link href="/tienda">Explorar catálogo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="font-serif text-4xl font-bold mb-4">Productos Destacados</h3>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Descubre nuestra selección de piezas exclusivas que definen el estilo urbano contemporáneo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.length === 0 ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={`skeleton-${i}`} className="border-0 shadow-none hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="h-80 w-full bg-muted animate-pulse rounded-md" />
                    <div className="p-6 text-center space-y-2">
                      <div className="h-4 w-2/3 bg-muted rounded mx-auto animate-pulse" />
                      <div className="h-4 w-1/3 bg-muted rounded mx-auto animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              featured.map((p: Featured) => {
                // Normaliza images (JsonValue) a string | placeholder
                const primaryImg =
                  Array.isArray(p.images) && typeof p.images[0] === "string"
                    ? p.images[0]
                    : "/placeholder.svg"
                const cat = p.categories?.[0]

                return (
                  <Card key={p.id} className="group cursor-pointer border-0 shadow-none hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-0">
                      <Link href={`/tienda/${p.slug}`} className="block">
                        <div className="relative overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={primaryImg}
                            alt={p.name}
                            className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="inline-flex items-center rounded-md bg-white/90 px-3 py-1 text-sm font-medium text-black shadow">
                              Vista rápida
                            </span>
                          </div>
                        </div>
                        <div className="p-6 text-center">
                          {cat && (
                            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                              {cat.name}
                            </div>
                          )}
                          <h4 className="font-medium text-lg mb-2">{p.name}</h4>
                          <p className="font-serif text-xl font-bold">{formatMoney(p.price)}</p>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link href="/tienda">Ver todo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-serif text-4xl font-bold mb-6">Únete a nuestra comunidad</h3>
          <p className="text-muted text-lg mb-8 max-w-2xl mx-auto">
            Sé el primero en conocer nuestras nuevas colecciones y ofertas exclusivas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu email"
              className="flex-1 px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button className="px-8">Quiero unirme</Button>
          </div>
        </div>
      </section>

      {/* Lookbook */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="font-serif text-4xl font-bold mb-4">Inspiración</h3>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Descubre cómo combinar nuestras piezas para crear looks únicos
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "/urban-fashion-lookbook-bw-1.png",
              "/urban-minimalist-lookbook-2.png",
              "/urban-fashion-lookbook-3.png",
              "/placeholder.svg?height=300&width=300",
            ].map((src, index) => (
              <div key={index} className="relative group cursor-pointer overflow-hidden rounded-lg">
                <Image
                  src={src || "/placeholder.svg"}
                  alt={`Lookbook ${index + 1}`}
                  width={300}
                  height={300 + (index % 2) * 50}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <Button variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" asChild>
                    <Link href="/lookbook">Ver look</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link href="/lookbook">Ver todo el lookbook</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
