"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"

export function CartDrawer() {
  const { state, removeItem, updateQuantity, toggleCart, closeCart } = useCart()

  return (
    <Sheet open={state.isOpen} onOpenChange={toggleCart}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingBag className="h-5 w-5" />
          {state.itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {state.itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Carrito de compras</span>
            <Badge variant="secondary">{state.itemCount} artículos</Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {state.items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <ShoppingBag className="h-16 w-16 text-muted mb-4" />
              <h3 className="font-serif text-xl font-bold mb-2">Tu carrito está vacío</h3>
              <p className="text-muted mb-6">Agrega algunos productos para comenzar</p>
              <Button asChild onClick={closeCart}>
                <Link href="/tienda">Explorar productos</Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-6">
                <div className="space-y-6">
                  {state.items.map((item, index) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
                      <div className="relative w-20 h-20 rounded-md overflow-hidden bg-card">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-sm leading-tight">{item.name}</h4>
                            <div className="flex gap-2 text-xs text-muted mt-1">
                              <span>{item.color}</span>
                              <span>•</span>
                              <span>Talla {item.size}</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted hover:text-destructive"
                            onClick={() => removeItem(index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(index, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="px-3 py-1 text-sm min-w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(index, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <span className="font-serif font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Footer */}
              <div className="border-t pt-6 space-y-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="font-serif">${state.total.toFixed(2)}</span>
                </div>

                <div className="space-y-3">
                  <Button className="w-full" size="lg" asChild onClick={closeCart}>
                    <Link href="/checkout">Proceder al pago</Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" asChild onClick={closeCart}>
                    <Link href="/tienda">Continuar comprando</Link>
                  </Button>
                </div>

                <p className="text-xs text-muted text-center">Envío gratuito en pedidos superiores a $100</p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
