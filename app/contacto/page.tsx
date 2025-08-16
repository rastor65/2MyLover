"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Heart, MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react"
import Link from "next/link"
import { CartDrawer } from "@/components/cart-drawer"
import { Footer } from "@/components/footer"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: "", email: "", subject: "", message: "" })
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
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
            <Link href="/tienda" className="text-sm font-medium hover:text-muted transition-colors">
              Tienda
            </Link>
            <Link href="/lookbook" className="text-sm font-medium hover:text-muted transition-colors">
              Lookbook
            </Link>
            <Link href="/nosotros" className="text-sm font-medium hover:text-muted transition-colors">
              Nosotros
            </Link>
            <Link href="/contacto" className="text-sm font-medium text-primary">
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
          <Badge className="mb-6 bg-primary text-primary-foreground">Hablemos</Badge>
          <h1 className="font-serif text-5xl font-bold mb-6">Contacto</h1>
          <p className="text-muted text-xl max-w-3xl mx-auto leading-relaxed">
            ¿Tienes alguna pregunta sobre nuestros productos o necesitas ayuda con tu pedido? Estamos aquí para ayudarte
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Envíanos un mensaje</CardTitle>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-bold mb-2">¡Mensaje enviado!</h3>
                  <p className="text-muted">Te responderemos en las próximas 24 horas.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nombre completo</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="subject">Asunto</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Mensaje</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="mt-1"
                    />
                  </div>
                  <Button type="submit" className="w-full gap-2">
                    <Send className="h-4 w-4" />
                    Enviar mensaje
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Ubicación</h3>
                    <p className="text-muted">
                      Av. Reforma 123, Colonia Centro
                      <br />
                      Ciudad de México, CDMX 06000
                      <br />
                      México
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Teléfono</h3>
                    <p className="text-muted">
                      +52 55 1234 5678
                      <br />
                      Lunes a Viernes: 9:00 - 18:00
                      <br />
                      Sábados: 10:00 - 16:00
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Correo electrónico</h3>
                    <p className="text-muted">
                      hola@2mylover.com
                      <br />
                      ventas@2mylover.com
                      <br />
                      soporte@2mylover.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Horarios de atención</h3>
                    <div className="text-muted space-y-1">
                      <p>Lunes - Viernes: 9:00 - 18:00</p>
                      <p>Sábados: 10:00 - 16:00</p>
                      <p>Domingos: Cerrado</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="py-16 border-t">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold mb-4">Preguntas Frecuentes</h2>
            <p className="text-muted text-lg">Encuentra respuestas rápidas a las consultas más comunes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "¿Cuál es el tiempo de entrega?",
                answer:
                  "Los pedidos se procesan en 1-2 días hábiles y la entrega toma de 3-5 días hábiles adicionales.",
              },
              {
                question: "¿Puedo cambiar o devolver un producto?",
                answer: "Sí, aceptamos cambios y devoluciones dentro de los 30 días posteriores a la compra.",
              },
              {
                question: "¿Ofrecen envío gratuito?",
                answer: "Sí, ofrecemos envío gratuito en pedidos superiores a $1,500 MXN.",
              },
              {
                question: "¿Cómo puedo conocer mi talla?",
                answer: "Consulta nuestra guía de tallas en cada producto o contáctanos para asesoría personalizada.",
              },
              {
                question: "¿Los productos son de edición limitada?",
                answer: "Sí, producimos en cantidades limitadas para mantener la exclusividad de cada pieza.",
              },
              {
                question: "¿Tienen tienda física?",
                answer:
                  "Actualmente somos una marca digital, pero puedes visitarnos en nuestro showroom con cita previa.",
              },
            ].map((faq, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-3">{faq.question}</h3>
                  <p className="text-muted leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
