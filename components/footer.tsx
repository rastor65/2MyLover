import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-16">
        {/* Newsletter Section */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl font-bold mb-4">Mantente al día</h2>
          <p className="text-muted text-lg mb-8 max-w-2xl mx-auto">
            Suscríbete a nuestro newsletter y sé el primero en conocer nuestras nuevas colecciones y ofertas exclusivas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input placeholder="Tu correo electrónico" className="flex-1" />
            <Button className="gap-2">
              <Mail className="h-4 w-4" />
              Suscribirse
            </Button>
          </div>
        </div>

        <Separator className="mb-16" />

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="font-serif text-2xl font-bold tracking-tight block mb-4">
              2MyLover
            </Link>
            <p className="text-muted leading-relaxed mb-6">
              Moda urbana minimalista que define tu identidad. Piezas exclusivas para quienes valoran la calidad y el
              diseño consciente.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="hover:bg-primary hover:text-primary-foreground">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-primary hover:text-primary-foreground">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-primary hover:text-primary-foreground">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Navegación</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-muted hover:text-foreground transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/tienda" className="text-muted hover:text-foreground transition-colors">
                  Tienda
                </Link>
              </li>
              <li>
                <Link href="/lookbook" className="text-muted hover:text-foreground transition-colors">
                  Lookbook
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="text-muted hover:text-foreground transition-colors">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-muted hover:text-foreground transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-lg mb-4">Atención al Cliente</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/ayuda" className="text-muted hover:text-foreground transition-colors">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link href="/envios" className="text-muted hover:text-foreground transition-colors">
                  Envíos y Devoluciones
                </Link>
              </li>
              <li>
                <Link href="/tallas" className="text-muted hover:text-foreground transition-colors">
                  Guía de Tallas
                </Link>
              </li>
              <li>
                <Link href="/cuidados" className="text-muted hover:text-foreground transition-colors">
                  Cuidado de Prendas
                </Link>
              </li>
              <li>
                <Link href="/garantia" className="text-muted hover:text-foreground transition-colors">
                  Garantía
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contacto</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted flex-shrink-0 mt-0.5" />
                <div className="text-muted text-sm">
                  <p>Av. Reforma 123</p>
                  <p>Ciudad de México, CDMX</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted flex-shrink-0" />
                <p className="text-muted text-sm">+52 55 1234 5678</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted flex-shrink-0" />
                <p className="text-muted text-sm">hola@2mylover.com</p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted text-sm">© 2024 2MyLover. Todos los derechos reservados.</p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacidad" className="text-muted hover:text-foreground transition-colors">
              Política de Privacidad
            </Link>
            <Link href="/terminos" className="text-muted hover:text-foreground transition-colors">
              Términos y Condiciones
            </Link>
            <Link href="/cookies" className="text-muted hover:text-foreground transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
