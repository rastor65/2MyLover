import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Search, Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { CartDrawer } from "@/components/cart-drawer"
import { Footer } from "@/components/footer"

export default function HomePage() {
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
            <Link href="/" className="text-sm font-medium hover:text-muted transition-colors">
              Inicio
            </Link>
            <Link href="/tienda" className="text-sm font-medium hover:text-muted transition-colors">
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
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <CartDrawer />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40 z-10" />
        <Image src="/monochrome-urban-model.png" alt="2MyLover Hero" fill className="object-cover" priority />
        <div className="relative z-20 text-center text-white max-w-4xl px-4">
          <h2 className="font-serif text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Vístete con estilo,
            <br />
            vístete con identidad
          </h2>
          <p className="text-xl md:text-2xl mb-8 font-light">Moda urbana minimalista en blanco y negro</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-black hover:bg-secondary text-lg px-8 py-6" asChild>
              <Link href="/tienda">Comprar ahora</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black text-lg px-8 py-6 bg-transparent"
              asChild
            >
              <Link href="/tienda">Explorar catálogo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="font-serif text-4xl font-bold mb-4">Productos Destacados</h3>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Descubre nuestra selección de piezas exclusivas que definen el estilo urbano contemporáneo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Suéter Minimalista Negro",
                price: "$89.99",
                image: "/minimalist-black-sweater.png",
              },
              {
                name: "Gorra Urbana Blanca",
                price: "$34.99",
                image: "/minimalist-white-cap.png",
              },
              {
                name: "Hoodie Oversized",
                price: "$124.99",
                image: "/oversized-black-hoodie-urban.png",
              },
              {
                name: "Camiseta Essential",
                price: "$49.99",
                image: "/white-essential-t-shirt.png",
              },
              {
                name: "Chaqueta Bomber",
                price: "$159.99",
                image: "/black-bomber-minimalist.png",
              },
              {
                name: "Accesorios Pack",
                price: "$79.99",
                image: "/minimalist-bw-accessories.png",
              },
            ].map((product, index) => (
              <Card
                key={index}
                className="group cursor-pointer border-0 shadow-none hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={400}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    <Button
                      size="sm"
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      Vista rápida
                    </Button>
                  </div>
                  <div className="p-6 text-center">
                    <h4 className="font-medium text-lg mb-2">{product.name}</h4>
                    <p className="font-serif text-xl font-bold">{product.price}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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

      {/* Lookbook Teaser */}
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
                  <Button
                    variant="secondary"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    asChild
                  >
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
