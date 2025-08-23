"use client"

import { useEffect, useRef, useState } from "react"

type ProductLite = {
  id: string
  name: string
  slug?: string
  price?: number | string
  images?: string[]
  categories?: { name: string }[]
}

function currency(n: unknown) {
  const num = Number(n ?? 0)
  return `$${num.toFixed(2)}`
}

function initials(name: string) {
  const parts = (name || "").trim().split(/\s+/).slice(0, 2)
  return parts.map((p) => p.charAt(0).toUpperCase()).join("") || "P"
}

export default function ProductPreviewTrigger({ product }: { product: ProductLite }) {
  const [open, setOpen] = useState(false)
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const img = product.images?.[0]

  // Cerrar con Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    if (open) document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <>
      {/* Botón/trigger: avatar o monograma */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="h-9 w-9 rounded-lg border bg-gray-50 flex items-center justify-center overflow-hidden hover:scale-[1.02] transition"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Ver preview de ${product.name}`}
      >
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-[11px] text-gray-600">{initials(product.name)}</span>
        )}
      </button>

      {/* Modal / preview card */}
      {open && (
        <div
          className="fixed inset-0 z-50"
          aria-modal="true"
          role="dialog"
          onClick={(e) => {
            // Cerrar al hacer click en el overlay
            if (e.target === e.currentTarget) setOpen(false)
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Card */}
          <div
            ref={dialogRef}
            className="absolute inset-0 grid place-items-center p-4"
          >
            <div className="w-full max-w-md rounded-2xl border bg-white shadow-xl overflow-hidden">
              <div className="grid grid-cols-[120px_1fr] gap-0">
                <div className="relative aspect-square max-h-40 bg-gray-50">
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <span className="text-base font-medium text-gray-600">{initials(product.name)}</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-semibold leading-tight">{product.name}</h3>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50"
                      aria-label="Cerrar"
                    >
                      Cerrar
                    </button>
                  </div>

                  <div className="mt-1 text-sm text-muted-foreground">/{product.slug ?? "-"}</div>

                  <div className="mt-3">
                    <div className="text-xs text-muted-foreground">Precio</div>
                    <div className="text-lg font-semibold">{currency(product.price)}</div>
                  </div>

                  <div className="mt-3">
                    <div className="text-xs text-muted-foreground">Categorías</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {(product.categories?.length ? product.categories : [{ name: "Sin categoría" }]).map((c) => (
                        <span
                          key={c.name}
                          className="inline-flex items-center rounded-full bg-gray-100 text-gray-800 ring-1 ring-inset ring-gray-200 px-2 py-0.5 text-[11px]"
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-2">
                    <a
                      href={`/admin/products/${product.id}`}
                      className="rounded-md border px-3 py-1.5 text-xs hover:bg-gray-50"
                    >
                      Editar
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
