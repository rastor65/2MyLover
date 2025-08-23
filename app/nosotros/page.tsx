import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, Award, Truck, Shield, Recycle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { CartDrawer } from "@/components/cart-drawer"
import { Footer } from "@/components/footer"

export default function AboutPage() {
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
            <Link href="/lookbook" className="text-sm font-medium hover:text-muted transition-colors">
              Lookbook
            </Link>
            <Link href="/nosotros" className="text-sm font-medium text-primary">
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

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background to-card" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary text-primary-foreground">Nuestra Historia</Badge>
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-8 tracking-tight">
              Vístete con identidad,
              <br />
              <span className="text-muted">vístete con propósito</span>
            </h1>
            <p className="text-xl text-muted leading-relaxed max-w-3xl mx-auto">
              2MyLover nació de la convicción de que la moda debe ser más que tendencias pasajeras. Creamos piezas
              atemporales que reflejan la esencia del estilo urbano contemporáneo.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-4xl font-bold mb-8">El concepto 2MyLover</h2>
              <div className="space-y-6 text-lg leading-relaxed">
                <p>
                  En un mundo saturado de opciones, 2MyLover emerge como una declaración de simplicidad y autenticidad.
                  Nuestro nombre refleja la dualidad del amor propio y el amor por el diseño consciente.
                </p>
                <p>
                  Cada pieza es cuidadosamente diseñada para trascender las estaciones y las tendencias, creando un
                  guardarropa cápsula que define tu identidad sin comprometer tu estilo.
                </p>
                <p>
                  El minimalismo no es ausencia, es presencia consciente. Es elegir calidad sobre cantidad, esencia
                  sobre exceso, identidad sobre imitación.
                </p>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/brand-story-image.png"
                alt="2MyLover Brand Story"
                width={600}
                height={700}
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold mb-6">Nuestra Filosofía</h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              Tres pilares fundamentales guían cada decisión que tomamos en 2MyLover
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4">Exclusividad</h3>
                <p className="text-muted leading-relaxed">
                  Producimos en cantidades limitadas para garantizar que cada pieza mantenga su carácter único y
                  especial.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4">Minimalismo</h3>
                <p className="text-muted leading-relaxed">
                  Creemos en la belleza de la simplicidad. Cada línea, cada corte, cada detalle tiene un propósito
                  definido.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4">Identidad</h3>
                <p className="text-muted leading-relaxed">
                  Nuestras piezas no definen quién eres, sino que amplifican tu esencia auténtica y tu estilo personal.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <Image
                src="/sustainable-fashion.png"
                alt="Sustainable Fashion"
                width={600}
                height={500}
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div>
              <h2 className="font-serif text-4xl font-bold mb-8">Compromiso y Valores</h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Recycle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Sostenibilidad</h3>
                    <p className="text-muted">
                      Utilizamos materiales orgánicos y procesos de producción responsables que respetan el medio
                      ambiente.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Calidad Premium</h3>
                    <p className="text-muted">
                      Cada prenda pasa por rigurosos controles de calidad para garantizar durabilidad y confort
                      excepcionales.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Experiencia Completa</h3>
                    <p className="text-muted">
                      Desde el diseño hasta la entrega, cuidamos cada detalle para ofrecerte una experiencia memorable.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold mb-6">Nuestro Equipo</h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              Un grupo apasionado de creativos, diseñadores y visionarios unidos por el amor al diseño consciente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sofia Martínez",
                role: "Directora Creativa",
                image: "/team-member-1.png",
                description: "Visionaria del diseño minimalista con 10 años de experiencia en moda urbana.",
              },
              {
                name: "Carlos Rivera",
                role: "Director de Producción",
                image: "/team-member-2.png",
                description: "Experto en procesos sostenibles y calidad premium en la industria textil.",
              },
              {
                name: "Ana López",
                role: "Directora de Marca",
                image: "/team-member-3.png",
                description: "Especialista en construcción de marca y experiencia del cliente en el sector fashion.",
              },
            ].map((member, index) => (
              <Card
                key={index}
                className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardContent className="p-6">
                  <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden">
                    <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                  </div>
                  <h3 className="font-serif text-xl font-bold mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-4">{member.role}</p>
                  <p className="text-muted text-sm leading-relaxed">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-4xl font-bold mb-6">Únete a la Revolución Minimalista</h2>
            <p className="text-xl text-muted mb-8 leading-relaxed">
              Descubre cómo nuestras piezas pueden transformar tu guardarropa y definir tu identidad urbana
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/tienda">Explorar Colección</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/lookbook">Ver Lookbook</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
