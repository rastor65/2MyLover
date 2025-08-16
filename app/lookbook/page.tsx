"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Share2, Instagram, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { CartDrawer } from "@/components/cart-drawer"
import { Footer } from "@/components/footer"

const lookbookItems = [
  {
    id: 1,
    title: "Urban Minimalist",
    description: "La perfecta combinación de suéter negro oversized con accesorios minimalistas",
    image: "/urban-fashion-lookbook-bw-1.png",
    products: [
      { name: "Suéter Oversized Negro", price: 124.99, id: 3 },
      { name: "Gorra Urbana Blanca", price: 34.99, id: 2 },
    ],
    tags: ["Casual", "Urbano", "Minimalista"],
    season: "Otoño/Invierno",
    featured: true,
  },
  {
    id: 2,
    title: "Essential White",
    description: "Elegancia en su forma más pura con nuestra línea blanca esencial",
    image: "/urban-minimalist-lookbook-2.png",
    products: [
      { name: "Camiseta Essential Blanca", price: 49.99, id: 4 },
      { name: "Pack Accesorios Minimalista", price: 79.99, id: 6 },
    ],
    tags: ["Elegante", "Esencial", "Versátil"],
    season: "Primavera/Verano",
    featured: false,
  },
  {
    id: 3,
    title: "Street Sophistication",
    description: "Sofisticación urbana que redefine el estilo callejero contemporáneo",
    image: "/urban-fashion-lookbook-3.png",
    products: [
      { name: "Chaqueta Bomber Negra", price: 159.99, id: 5 },
      { name: "Suéter Minimalista Negro", price: 89.99, id: 1 },
    ],
    tags: ["Sofisticado", "Urbano", "Contemporáneo"],
    season: "Otoño/Invierno",
    featured: true,
  },
  {
    id: 4,
    title: "Monochrome Mastery",
    description: "Dominio absoluto del contraste en blanco y negro",
    image: "/monochrome-street-style.png",
    products: [
      { name: "Suéter Cuello Alto Blanco", price: 94.99, id: 7 },
      { name: "Gorra Snapback Negra", price: 39.99, id: 8 },
    ],
    tags: ["Contraste", "Monocromático", "Audaz"],
    season: "Todo el año",
    featured: false,
  },
  {
    id: 5,
    title: "Effortless Elegance",
    description: "Elegancia sin esfuerzo para el día a día urbano",
    image: "/effortless-urban-elegance.png",
    products: [
      { name: "Suéter Minimalista Negro", price: 89.99, id: 1 },
      { name: "Pack Accesorios Minimalista", price: 79.99, id: 6 },
    ],
    tags: ["Elegante", "Cotidiano", "Cómodo"],
    season: "Todo el año",
    featured: false,
  },
  {
    id: 6,
    title: "Bold Minimalism",
    description: "Minimalismo audaz que hace una declaración silenciosa",
    image: "/bold-minimalist-look.png",
    products: [
      { name: "Chaqueta Bomber Negra", price: 159.99, id: 5 },
      { name: "Gorra Urbana Blanca", price: 34.99, id: 2 },
    ],
    tags: ["Audaz", "Minimalista", "Declarativo"],
    season: "Otoño/Invierno",
    featured: true,
  },
]

export default function LookbookPage() {
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedLook, setSelectedLook] = useState<number | null>(null)

  const filteredLooks = lookbookItems.filter((item) => {
    if (selectedFilter === "all") return true
    if (selectedFilter === "featured") return item.featured
    return item.tags.some((tag) => tag.toLowerCase().includes(selectedFilter.toLowerCase()))
  })

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
            <Link href="/tienda" className="text-sm font-medium hover:text-muted transition-colors">
              Tienda
            </Link>
            <Link href="/lookbook" className="text-sm font-medium text-primary">
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
              <Heart className="h-5 w-5" />
            </Button>
            <CartDrawer />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl font-bold mb-6">Lookbook</h1>
          <p className="text-muted text-xl max-w-3xl mx-auto leading-relaxed">
            Descubre cómo nuestras piezas minimalistas se combinan para crear looks únicos que definen tu identidad
            urbana
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <Button
            variant={selectedFilter === "all" ? "default" : "outline"}
            onClick={() => setSelectedFilter("all")}
            className="rounded-full"
          >
            Todos los looks
          </Button>
          <Button
            variant={selectedFilter === "featured" ? "default" : "outline"}
            onClick={() => setSelectedFilter("featured")}
            className="rounded-full"
          >
            Destacados
          </Button>
          <Button
            variant={selectedFilter === "urbano" ? "default" : "outline"}
            onClick={() => setSelectedFilter("urbano")}
            className="rounded-full"
          >
            Urbano
          </Button>
          <Button
            variant={selectedFilter === "elegante" ? "default" : "outline"}
            onClick={() => setSelectedFilter("elegante")}
            className="rounded-full"
          >
            Elegante
          </Button>
          <Button
            variant={selectedFilter === "minimalista" ? "default" : "outline"}
            onClick={() => setSelectedFilter("minimalista")}
            className="rounded-full"
          >
            Minimalista
          </Button>
        </div>

        {/* Lookbook Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredLooks.map((look, index) => (
            <Card
              key={look.id}
              className={`group cursor-pointer border-0 shadow-none hover:shadow-xl transition-all duration-500 ${
                index % 3 === 1 ? "md:mt-12" : ""
              }`}
              onClick={() => setSelectedLook(look.id)}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-lg">
                  <Image
                    src={look.image || "/placeholder.svg"}
                    alt={look.title}
                    width={400}
                    height={500 + (index % 2) * 100}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                    style={{ height: `${400 + (index % 3) * 50}px` }}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Featured Badge */}
                  {look.featured && (
                    <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">Destacado</Badge>
                  )}

                  {/* Actions */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/90 hover:bg-white">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/90 hover:bg-white">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {look.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-white/20 text-white border-white/30">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="font-serif text-xl font-bold mb-2">{look.title}</h3>
                    <p className="text-sm opacity-90 mb-4">{look.description}</p>
                    <Button size="sm" className="bg-white text-black hover:bg-white/90">
                      Ver productos
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Look Detail */}
        {selectedLook && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Image */}
                  <div className="relative">
                    <Image
                      src={lookbookItems.find((l) => l.id === selectedLook)?.image || "/placeholder.svg"}
                      alt={lookbookItems.find((l) => l.id === selectedLook)?.title || ""}
                      width={600}
                      height={800}
                      className="w-full h-96 lg:h-full object-cover"
                    />
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute top-4 right-4"
                      onClick={() => setSelectedLook(null)}
                    >
                      ×
                    </Button>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {lookbookItems
                          .find((l) => l.id === selectedLook)
                          ?.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                      </div>
                      <h2 className="font-serif text-3xl font-bold mb-4">
                        {lookbookItems.find((l) => l.id === selectedLook)?.title}
                      </h2>
                      <p className="text-muted leading-relaxed mb-6">
                        {lookbookItems.find((l) => l.id === selectedLook)?.description}
                      </p>
                      <div className="text-sm text-muted mb-6">
                        <span className="font-medium">Temporada: </span>
                        {lookbookItems.find((l) => l.id === selectedLook)?.season}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-lg mb-4">Productos en este look:</h3>
                      <div className="space-y-4">
                        {lookbookItems
                          .find((l) => l.id === selectedLook)
                          ?.products.map((product) => (
                            <div key={product.id} className="flex items-center justify-between p-4 bg-card rounded-lg">
                              <div>
                                <h4 className="font-medium">{product.name}</h4>
                                <p className="font-serif font-bold text-lg">${product.price}</p>
                              </div>
                              <Button size="sm" asChild>
                                <Link href={`/tienda/producto/${product.id}`}>Ver producto</Link>
                              </Button>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t">
                      <div className="flex gap-4">
                        <Button className="flex-1">Comprar este look</Button>
                        <Button variant="outline" size="icon">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Instagram Section */}
        <section className="py-16 border-t">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold mb-4">Síguenos en Instagram</h2>
            <p className="text-muted text-lg mb-6">Descubre cómo nuestra comunidad lleva el estilo 2MyLover</p>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Instagram className="h-4 w-4" />
              @2mylover
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              "/instagram-feed-1.png",
              "/instagram-feed-2.png",
              "/instagram-feed-3.png",
              "/instagram-feed-4.png",
              "/instagram-feed-5.png",
              "/instagram-feed-6.png",
            ].map((src, index) => (
              <div key={index} className="relative group cursor-pointer overflow-hidden rounded-lg aspect-square">
                <Image
                  src={src || "/placeholder.svg"}
                  alt={`Instagram ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <Instagram className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
