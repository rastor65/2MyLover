"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import CategoryMultiSelect from "@/components/admin/CategoryMultiSelect"
import { slugify, toSeoDescription, toSeoTitle } from "@/lib/slug"

const productSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  slug: z.string().min(1, "Slug requerido").regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y -"),
  price: z.coerce.number().nonnegative("Precio inválido"),
  compareAt: z.coerce.number().positive().optional(),
  status: z.enum(["draft", "published", "archived"]),
  stock: z.coerce.number().int().nonnegative("Stock inválido"),
  images: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
  description: z.string().optional(),
  seoTitle: z.string().max(60).optional(),
  seoDesc: z.string().max(160).optional(),
})
type ProductFormValues = z.infer<typeof productSchema>

export default function ProductCreateForm() {
  const [images, setImages] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, dirtyFields },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
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

  const name = watch("name")
  const description = watch("description")
  const imagesWatch = watch("images")
  const categories = watch("categories")

  // ——— AUTO: slug & SEO mientras el usuario no los haya tocado
  useEffect(() => {
    if (!dirtyFields.slug) setValue("slug", slugify(name || ""), { shouldValidate: true })
    if (!dirtyFields.seoTitle) setValue("seoTitle", toSeoTitle(name || ""), { shouldValidate: true })
  }, [name, dirtyFields.slug, dirtyFields.seoTitle, setValue])

  useEffect(() => {
    if (!dirtyFields.seoDesc) setValue("seoDesc", toSeoDescription(description || ""), { shouldValidate: true })
  }, [description, dirtyFields.seoDesc, setValue])

  async function handleUpload(file: File) {
    const fd = new FormData()
    fd.append("file", file)
    fd.append("folder", "products")
    const res = await fetch("/admin/api/upload", { method: "POST", body: fd })
    const out = await res.json().catch(() => ({}))
    if (!res.ok) return alert("Error al subir: " + (out?.error || res.status))
    const next = [...images, out.url]
    setImages(next)
    setValue("images", next, { shouldValidate: true })
  }

  const onSubmit = async (values: ProductFormValues) => {
    values.images = images
    const res = await fetch("/admin/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
    const j = await res.json().catch(() => null)
    if (!res.ok) return alert("Error: " + (j?.error || res.status))
    window.location.href = "/admin/products"
  }

  const seoTitleCount = (watch("seoTitle") || "").length
  const seoDescCount = (watch("seoDesc") || "").length

  const PrimaryImage = useMemo(() => imagesWatch?.[0], [imagesWatch])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl mx-auto grid gap-6 md:grid-cols-[1fr_360px]">
      {/* MAIN COLUMN */}
      <div className="space-y-6">
        {/* Card: Básico */}
        <section className="rounded-2xl border p-5 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Información básica</h2>
            <span className="text-xs px-2 py-1 rounded-full border">Crear</span>
          </div>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Nombre</label>
              <input className="w-full border rounded-lg px-3 py-2" {...register("name")} />
              {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Slug</label>
              <input className="w-full border rounded-lg px-3 py-2" {...register("slug")} />
              <p className="text-xs text-muted-foreground mt-1">Se autogenera a partir del nombre (puedes editarlo).</p>
              {errors.slug && <p className="text-red-600 text-xs mt-1">{errors.slug.message}</p>}
            </div>
          </div>
        </section>

        {/* Card: Precio/Inventario/Categorías */}
        <section className="rounded-2xl border p-5 bg-white shadow-sm">
          <h2 className="text-lg font-semibold">Inventario y precio</h2>
          <div className="mt-4 grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium">Precio</label>
              <input type="number" step="0.01" className="w-full border rounded-lg px-3 py-2" {...register("price", { valueAsNumber: true })} />
              {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Precio original</label>
              <input type="number" step="0.01" className="w-full border rounded-lg px-3 py-2" {...register("compareAt", { valueAsNumber: true })} />
              {errors.compareAt && <p className="text-red-600 text-xs mt-1">{errors.compareAt?.toString()}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Stock</label>
              <input type="number" className="w-full border rounded-lg px-3 py-2" {...register("stock", { valueAsNumber: true })} />
              {errors.stock && <p className="text-red-600 text-xs mt-1">{errors.stock.message as string}</p>}
            </div>
          </div>

          <div className="mt-4 grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium">Estado</label>
              <select className="w-full border rounded-lg px-3 py-2" {...register("status")}>
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
                <option value="archived">Archivado</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <CategoryMultiSelect
                value={categories}
                onChange={(ids) => setValue("categories", ids, { shouldDirty: true, shouldValidate: true })}
              />
            </div>
          </div>
        </section>

        {/* Card: Descripción / Imágenes */}
        <section className="rounded-2xl border p-5 bg-white shadow-sm">
          <h2 className="text-lg font-semibold">Contenido</h2>
          <div className="mt-4 grid md:grid-cols-[1fr_auto] gap-4">
            <div>
              <label className="block text-sm font-medium">Descripción</label>
              <textarea rows={5} className="w-full border rounded-lg px-3 py-2" {...register("description")} />
              {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description.message as string}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Imágenes</label>
              <button type="button" className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50" onClick={() => fileInputRef.current?.click()}>
                Subir imagen
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) void handleUpload(f)
                  if (fileInputRef.current) fileInputRef.current.value = ""
                }}
              />
            </div>
          </div>

          <div className="flex gap-3 flex-wrap mt-3">
            {images.map((src, idx) => (
              <div key={src} className="relative">
                <img src={src} alt="" className="h-24 w-24 object-cover rounded-lg border" />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-white border rounded-full px-2 shadow"
                  onClick={() => {
                    const next = images.filter((_, i) => i !== idx)
                    setImages(next)
                    setValue("images", next, { shouldValidate: true })
                  }}
                  aria-label="Eliminar imagen"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Card: SEO */}
        <section className="rounded-2xl border p-5 bg-white shadow-sm">
          <h2 className="text-lg font-semibold">SEO</h2>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">SEO Title</label>
              <input className="w-full border rounded-lg px-3 py-2" {...register("seoTitle")} />
              <div className="flex justify-between text-xs mt-1">
                <span className="text-muted-foreground">Se autogenera del nombre (puedes editarlo).</span>
                <span>{seoTitleCount}/60</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">SEO Description</label>
              <input className="w-full border rounded-lg px-3 py-2" {...register("seoDesc")} />
              <div className="flex justify-between text-xs mt-1">
                <span className="text-muted-foreground">Se autogenera de la descripción (puedes editarla).</span>
                <span>{seoDescCount}/160</span>
              </div>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex gap-3 sticky bottom-4">
          <button type="submit" className="rounded-xl bg-black text-white px-5 py-2 text-sm shadow hover:opacity-90">
            Guardar producto
          </button>
        </div>
      </div>

      {/* SIDE COLUMN — Preview */}
      <aside className="space-y-6 md:sticky md:top-4 h-fit">
        <section className="rounded-2xl border p-5 bg-white shadow-sm">
          <h3 className="font-semibold mb-3">Preview</h3>
          <div className="rounded-xl border overflow-hidden">
            <div className="bg-gray-100 aspect-square flex items-center justify-center">
              {PrimaryImage ? (
                <img src={PrimaryImage} alt="" className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="text-xs text-muted-foreground">Sin imagen</span>
              )}
            </div>
            <div className="p-3">
              <div className="text-sm font-medium truncate">{name || "Nombre del producto"}</div>
              <div className="text-xs text-muted-foreground mt-1">/{watch("slug") || "slug"}</div>
              <div className="text-sm mt-2">${Number(watch("price") || 0).toFixed(2)}</div>
            </div>
          </div>
        </section>
      </aside>
    </form>
  )
}
