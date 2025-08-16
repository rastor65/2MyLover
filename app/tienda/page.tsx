"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Heart, Search, Grid, List } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { CartDrawer } from "@/components/cart-drawer"
import { Footer } from "@/components/footer" // Fixed import to use named export

// Mock product data
const products = [
  {
    id: 1,
    name: "Suéter Minimalista Negro",
    price: 89.99,
    originalPrice: 109.99,
    category: "sueteres",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Negro"],
    image: "/minimalist-black-sweater.png",
    isNew: true,
    onSale: true,
  },
  {
    id: 2,
    name: "Gorra Urbana Blanca",
    price: 34.99,
    category: "gorras",
    sizes: ["Única"],
    colors: ["Blanco"],
    image: "/minimalist-white-cap.png",
    isNew: false,
    onSale: false,
  },
  {
    id: 3,
    name: "Hoodie Oversized Negro",
    price: 124.99,
    category: "sueteres",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Negro"],
    image: "/oversized-black-hoodie-urban.png",
    isNew: true,
    onSale: false,
  },
  {
    id: 4,
    name: "Camiseta Essential Blanca",
    price: 49.99,
    category: "camisetas",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blanco"],
    image: "/white-essential-t-shirt.png",
    isNew: false,
    onSale: false,
  },
  {
    id: 5,
    name: "Chaqueta Bomber Negra",
    price: 159.99,
    category: "chaquetas",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Negro"],
    image: "/black-bomber-minimalist.png",
    isNew: false,
    onSale: false,
  },
  {
    id: 6,
    name: "Pack Accesorios Minimalista",
    price: 79.99,
    category: "accesorios",
    sizes: ["Única"],
    colors: ["Negro", "Blanco"],
    image: "/minimalist-bw-accessories.png",
    isNew: true,
    onSale: false,
  },
  {
    id: 7,
    name: "Suéter Cuello Alto Blanco",
    price: 94.99,
    category: "sueteres",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blanco"],
    image: "/minimalist-white-turtleneck.png",
    isNew: false,
    onSale: false,
  },
  {
    id: 8,
    name: "Gorra Snapback Negra",
    price: 39.99,
    category: "gorras",
    sizes: ["Única"],
    colors: ["Negro"],
    image: "/placeholder-2jez3.png",
    isNew: false,
    onSale: false,
  },
]

export default function TiendaPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSize, setSelectedSize] = useState("all")
  const [selectedColor, setSelectedColor] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Filter products based on search and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesSize = selectedSize === "all" || product.sizes.includes(selectedSize)
    const matchesColor =
      selectedColor === "all" || product.colors.some((color) => color.toLowerCase() === selectedColor.toLowerCase())

    return matchesSearch && matchesCategory && matchesSize && matchesColor
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "name":
        return a.name.localeCompare(b.name)
      case "newest":
        return b.isNew ? 1 : -1
      default:
        return 0
    }
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

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold mb-4">Tienda</h1>
          <p className="text-muted text-lg">Descubre nuestra colección completa de moda urbana minimalista</p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4 items-center">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="sueteres">Suéteres</SelectItem>
                <SelectItem value="gorras">Gorras</SelectItem>
                <SelectItem value="camisetas">Camisetas</SelectItem>
                <SelectItem value="chaquetas">Chaquetas</SelectItem>
                <SelectItem value="accesorios">Accesorios</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Talla" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="S">S</SelectItem>
                <SelectItem value="M">M</SelectItem>
                <SelectItem value="L">L</SelectItem>
                <SelectItem value="XL">XL</SelectItem>
                <SelectItem value="XXL">XXL</SelectItem>
                <SelectItem value="Única">Única</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedColor} onValueChange={setSelectedColor}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="negro">Negro</SelectItem>
                <SelectItem value="blanco">Blanco</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Destacados</SelectItem>
                <SelectItem value="newest">Más nuevos</SelectItem>
                <SelectItem value="price-low">Precio: menor a mayor</SelectItem>
                <SelectItem value="price-high">Precio: mayor a menor</SelectItem>
                <SelectItem value="name">Nombre A-Z</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2 ml-auto">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted">
            Mostrando {sortedProducts.length} de {products.length} productos
          </p>
        </div>

        {/* Product Grid */}
        <div
          className={`grid gap-6 ${
            viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
          }`}
        >
          {sortedProducts.map((product) => (
            <Card
              key={product.id}
              className={`group cursor-pointer border-0 shadow-none hover:shadow-lg transition-all duration-300 ${
                viewMode === "list" ? "flex" : ""
              }`}
            >
              <CardContent className={`p-0 ${viewMode === "list" ? "flex w-full" : ""}`}>
                <div className={`relative overflow-hidden ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={300}
                    height={400}
                    className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                      viewMode === "list" ? "w-48 h-48" : "w-full h-80"
                    }`}
                  />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.isNew && <Badge className="bg-primary text-primary-foreground">Nuevo</Badge>}
                    {product.onSale && <Badge className="bg-destructive text-destructive-foreground">Oferta</Badge>}
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button size="icon" variant="secondary" className="h-8 w-8">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Quick View Button */}
                  <Button
                    size="sm"
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    asChild
                  >
                    <Link href={`/tienda/producto/${product.id}`}>Vista rápida</Link>
                  </Button>
                </div>

                <div className={`p-6 ${viewMode === "list" ? "flex-1 flex flex-col justify-center" : "text-center"}`}>
                  <h4 className="font-medium text-lg mb-2">{product.name}</h4>
                  <div className="flex items-center gap-2 mb-2 justify-center">
                    <span className="font-serif text-xl font-bold">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-muted line-through text-sm">${product.originalPrice}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 justify-center mb-4">
                    {product.colors.map((color) => (
                      <Badge key={color} variant="outline" className="text-xs">
                        {color}
                      </Badge>
                    ))}
                  </div>
                  <Button className="w-full" asChild>
                    <Link href={`/tienda/producto/${product.id}`}>Agregar al carrito</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-16">
            <h3 className="font-serif text-2xl font-bold mb-4">No se encontraron productos</h3>
            <p className="text-muted mb-6">Intenta ajustar tus filtros de búsqueda</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
                setSelectedSize("all")
                setSelectedColor("all")
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
