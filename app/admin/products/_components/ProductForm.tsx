"use client"

import { useRef, useState } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// ───────────────── Zod schema (crear) ─────────────────
const productSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  slug: z.string().min(1, "Slug requerido").regex(/^[a-z0-9-]+$/, "Sólo minúsculas, números y -"),

  price: z.coerce.number().nonnegative(),
  compareAt: z
    .union([z.coerce.number().nonnegative(), z.literal("")])
    .optional()
    .transform((v) => (v === "" || v == null ? undefined : v)),

  status: z.enum(["draft", "published", "archived"]),
  stock: z.coerce.number().int().nonnegative(),

  images: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),

  description: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
})

// Usa el OUTPUT del schema (post‑transform + defaults)
type ProductFormValues = z.output<typeof productSchema>
// ──────────────────────────────────────────────────────

export default function ProductForm() {
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as Resolver<ProductFormValues>,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: 0,
      compareAt: undefined,
      status: "draft",
      stock: 0,
      images: [],
      tags: [],
      categories: [],
      seoTitle: "",
      seoDesc: "",
    },
  })

  async function handleUpload(file: File) {
    try {
      setUploading(true)
      const fd = new FormData()
      fd.append("file", file)
      fd.append("folder", "products")
      const res = await fetch("/admin/api/upload", { method: "POST", body: fd })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(j?.error || `Error ${res.status}`)
      if (j?.url) {
        const next = [...images, j.url]
        setImages(next)
        setValue("images", next, { shouldValidate: true })
      }
    } catch (e: any) {
      alert(e?.message || "No se pudo subir la imagen")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  const onSubmit = async (values: ProductFormValues) => {
    // asegura sincronía por si acaso
    values.images = images

    const res = await fetch("/admin/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
    const j = await res.json().catch(() => null)
    if (!res.ok) {
      alert(j?.error || `Error ${res.status}`)
      return
    }
    window.location.href = "/admin/products"
  }

  // autogenera slug desde nombre
  const handleNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const v = e.currentTarget.value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    if (v) setValue("slug", v, { shouldDirty: true, shouldValidate: true })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Nombre</label>
          <input className="w-full border rounded px-3 py-2" {...register("name")} onBlur={handleNameBlur} />
          {errors.name && <p className="text-red-600 text-xs">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Slug</label>
          <input className="w-full border rounded px-3 py-2" {...register("slug")} />
          {errors.slug && <p className="text-red-600 text-xs">{errors.slug.message}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium">Precio</label>
          <input type="number" step="0.01" className="w-full border rounded px-3 py-2" {...register("price")} />
          {errors.price && <p className="text-red-600 text-xs">{errors.price.message as string}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Precio original</label>
          <input
            type="number"
            step="0.01"
            placeholder="Opcional"
            className="w-full border rounded px-3 py-2"
            {...register("compareAt")}
          />
          {errors.compareAt && <p className="text-red-600 text-xs">{errors.compareAt.message as string}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Stock</label>
          <input type="number" className="w-full border rounded px-3 py-2" {...register("stock")} />
          {errors.stock && <p className="text-red-600 text-xs">{errors.stock.message as string}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Estado</label>
          <select className="w-full border rounded px-3 py-2" {...register("status")}>
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
            <option value="archived">Archivado</option>
          </select>
          {errors.status && <p className="text-red-600 text-xs">{errors.status.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Categorías (IDs)</label>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="IDs separadas por coma (abc,def)"
            {...register("categories", {
              setValueAs: (v: string | string[]) =>
                Array.isArray(v)
                  ? v
                  : String(v || "")
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
            })}
          />
          {errors.categories && <p className="text-red-600 text-xs">{errors.categories.message as string}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Descripción</label>
        <textarea rows={4} className="w-full border rounded px-3 py-2" {...register("description")} />
        {errors.description && <p className="text-red-600 text-xs">{errors.description.message as string}</p>}
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
              if (f) void handleUpload(f)
            }}
          />
          <button
            type="button"
            className="rounded border px-3 py-2 text-sm"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Subiendo..." : "Subir imagen"}
          </button>
          <span className="text-sm text-muted-foreground">Puedes eliminar cualquiera después de subir.</span>
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
                  setValue("images", next, { shouldValidate: true })
                }}
                aria-label="Eliminar imagen"
                title="Eliminar imagen"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {errors.images && <p className="text-red-600 text-xs">{errors.images.message as string}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">SEO Title</label>
          <input className="w-full border rounded px-3 py-2" {...register("seoTitle")} />
          {errors.seoTitle && <p className="text-red-600 text-xs">{errors.seoTitle.message as string}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">SEO Description</label>
          <input className="w-full border rounded px-3 py-2" {...register("seoDesc")} />
          {errors.seoDesc && <p className="text-red-600 text-xs">{errors.seoDesc.message as string}</p>}
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={isSubmitting} className="rounded bg-black text-white px-4 py-2 text-sm disabled:opacity-50">
          {isSubmitting ? "Guardando..." : "Crear"}
        </button>
      </div>
    </form>
  )
}
