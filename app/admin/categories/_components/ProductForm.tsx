"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// --- SCHEMA AUTOCONTENIDO (para descartar imports incorrectos) ---
const categorieschema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  slug: z.string().min(1, "Slug requerido"),

  // coercion: evita 'unknown' porque los <input type="number"> dan string
  price: z.coerce.number().nonnegative(),
  compareAt: z.coerce.number().positive().optional(),

  status: z.enum(["draft", "published", "archived"]),
  stock: z.coerce.number().int().nonnegative(),

  // arrays requeridos con default([]): evita opcionales en el resolver
  images: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),

  description: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
})
type categorieFormValues = z.infer<typeof categorieschema>
// -----------------------------------------------------------------

export default function categorieForm({
  initial,
  categorieId,
}: {
  initial?: Partial<categorieFormValues>
  categorieId?: string
}) {
  const [images, setImages] = useState<string[]>(initial?.images ?? [])
  const inputRef = useRef<HTMLInputElement | null>(null)

  const form = useForm<categorieFormValues>({
    resolver: zodResolver(categorieschema), 
    defaultValues: {
      name: initial?.name ?? "",
      slug: initial?.slug ?? "",
      description: initial?.description ?? "",
      price:
        typeof initial?.price === "number"
          ? initial.price
          : Number(initial?.price ?? 0),
      compareAt:
        initial?.compareAt !== undefined && initial?.compareAt !== null
          ? Number(initial.compareAt)
          : undefined,
      status: initial?.status ?? "draft",
      stock:
        typeof initial?.stock === "number"
          ? initial.stock
          : Number(initial?.stock ?? 0),

      // IMPORTANTES: arrays siempre presentes
      images,
      tags: initial?.tags ?? [],
      categories: initial?.categories ?? [],

      seoTitle: initial?.seoTitle ?? "",
      seoDesc: initial?.seoDesc ?? "",
    },
  })

  async function handleUpload(file: File) {
    const fd = new FormData()
    fd.append("file", file)
    fd.append("folder", "categories")

    const res = await fetch("/admin/api/upload", { method: "POST", body: fd })
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "Error desconocido" }))
      alert("Error al subir: " + error)
      return
    }
    const { url } = (await res.json()) as { url: string }
    const next = [...images, url]
    setImages(next)
    form.setValue("images", next, { shouldValidate: true })
  }

  const onSubmit = async (values: categorieFormValues) => {
    values.images = images // sincroniza por si acaso

    const url = categorieId ? `/admin/api/categories/${categorieId}` : "/admin/api/categories"
    const method = categorieId ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "Error desconocido" }))
      alert("Error: " + JSON.stringify(error))
      return
    }

    window.location.href = "/admin/categories"
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-3xl">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Nombre</label>
          <input className="w-full border rounded px-3 py-2" {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="text-red-600 text-sm">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Slug</label>
          <input className="w-full border rounded px-3 py-2" {...form.register("slug")} />
          {form.formState.errors.slug && (
            <p className="text-red-600 text-sm">{form.formState.errors.slug.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Precio</label>
          <input
            type="number"
            step="0.01"
            className="w-full border rounded px-3 py-2"
            {...form.register("price", { valueAsNumber: true })}
          />
          {form.formState.errors.price && (
            <p className="text-red-600 text-sm">{form.formState.errors.price.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Precio original</label>
          <input
            type="number"
            step="0.01"
            className="w-full border rounded px-3 py-2"
            {...form.register("compareAt", { valueAsNumber: true })}
          />
          {form.formState.errors.compareAt && (
            <p className="text-red-600 text-sm">
              {form.formState.errors.compareAt.message as string}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Stock</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            {...form.register("stock", { valueAsNumber: true })}
          />
          {form.formState.errors.stock && (
            <p className="text-red-600 text-sm">{form.formState.errors.stock.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Estado</label>
          <select className="w-full border rounded px-3 py-2" {...form.register("status")}>
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
            <option value="archived">Archivado</option>
          </select>
          {form.formState.errors.status && (
            <p className="text-red-600 text-sm">{form.formState.errors.status.message as string}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Descripción</label>
        <textarea
          className="w-full border rounded px-3 py-2"
          rows={4}
          {...form.register("description")}
        />
        {form.formState.errors.description && (
          <p className="text-red-600 text-sm">
            {form.formState.errors.description.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) handleUpload(f)
              if (inputRef.current) inputRef.current.value = ""
            }}
          />
          <button
            type="button"
            className="rounded border px-3 py-2 text-sm"
            onClick={() => inputRef.current?.click()}
          >
            Subir imagen
          </button>
          <span className="text-sm text-muted-foreground">
            Haz click para subir. Luego puedes eliminar cualquiera.
          </span>
        </div>

        <div className="flex gap-3 flex-wrap">
          {images.map((src, idx) => (
            <div key={src} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-24 w-24 object-cover rounded border" />
              <button
                type="button"
                className="absolute -top-2 -right-2 bg-white border rounded-full px-2"
                onClick={() => {
                  const next = images.filter((_, i) => i !== idx)
                  setImages(next)
                  form.setValue("images", next, { shouldValidate: true })
                }}
                aria-label="Eliminar imagen"
                title="Eliminar imagen"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {form.formState.errors.images && (
          <p className="text-red-600 text-sm">{form.formState.errors.images.message as string}</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">SEO Title</label>
          <input className="w-full border rounded px-3 py-2" {...form.register("seoTitle")} />
          {form.formState.errors.seoTitle && (
            <p className="text-red-600 text-sm">{form.formState.errors.seoTitle.message as string}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">SEO Description</label>
          <input className="w-full border rounded px-3 py-2" {...form.register("seoDesc")} />
          {form.formState.errors.seoDesc && (
            <p className="text-red-600 text-sm">{form.formState.errors.seoDesc.message as string}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" className="rounded bg-black text-white px-4 py-2 text-sm">
          Guardar
        </button>

        {categorieId && (
          <button
            type="button"
            className="rounded border px-4 py-2 text-sm"
            onClick={async () => {
              if (!confirm("¿Eliminar este categorieo?")) return
              const res = await fetch(`/admin/api/categories/${categorieId}`, { method: "DELETE" })
              if (res.ok) window.location.href = "/admin/categories"
              else alert("No se pudo eliminar")
            }}
          >
            Eliminar
          </button>
        )}
      </div>
    </form>
  )
}
