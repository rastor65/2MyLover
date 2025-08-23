"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import CategoryMultiSelect from "@/components/admin/CategoryMultiSelect"
import { slugify, toSeoDescription, toSeoTitle } from "@/lib/slug"

const imageUrlSchema = z
  .string()
  .max(2048)
  .optional()
  .transform((v) => (v === "" ? undefined : v))
  .refine((v) => v === undefined || /^https?:\/\//i.test(v) || v.startsWith("/"), {
    message: "URL inválida. Usa http(s):// o una ruta que empiece con /",
  })

const schema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Sólo minúsculas, números y -"),
  price: z.coerce.number().min(0, "Precio inválido"),
  compareAt: z.union([z.coerce.number().min(0), z.literal("")]).optional().transform((v) => (v === "" || v == null ? undefined : v)),
  stock: z.coerce.number().int().min(0, "Stock inválido"),
  status: z.enum(["draft", "published", "archived"]),
  description: z.string().max(5000).optional(),
  image: imageUrlSchema,
  seoTitle: z.string().max(60).optional(),
  seoDesc: z.string().max(160).optional(),
  categories: z.array(z.string()).default([]),
})
type FormData = z.infer<typeof schema>

export default function ProductEditForm({
  id,
  initial,
}: {
  id: string
  initial: {
    name: string
    slug: string
    price: string | number
    compareAt?: string | number | null
    stock: number
    status: "draft" | "published" | "archived"
    description?: string | null
    image?: string | null
    seoTitle?: string | null
    seoDesc?: string | null
    categories?: { id: string; name: string }[]
  }
}) {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, dirtyFields },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial.name ?? "",
      slug: initial.slug ?? "",
      price: Number(initial.price ?? 0),
      compareAt: initial.compareAt != null && initial.compareAt !== "" ? Number(initial.compareAt) : undefined,
      stock: initial.stock ?? 0,
      status: initial.status ?? "draft",
      description: initial.description ?? "",
      image: initial.image ?? "",
      seoTitle: initial.seoTitle ?? "",
      seoDesc: initial.seoDesc ?? "",
      categories: (initial.categories ?? []).map((c) => c.id),
    },
  })

  const name = watch("name")
  const description = watch("description")
  const imageUrl = watch("image")
  const categories = watch("categories")
  const seoTitleCount = (watch("seoTitle") || "").length
  const seoDescCount = (watch("seoDesc") || "").length

  // AUTO mientras los campos no hayan sido tocados por el usuario
  useEffect(() => {
    if (!dirtyFields.slug) setValue("slug", slugify(name || ""), { shouldValidate: true })
    if (!dirtyFields.seoTitle) setValue("seoTitle", toSeoTitle(name || ""), { shouldValidate: true })
  }, [name, dirtyFields.slug, dirtyFields.seoTitle, setValue])

  useEffect(() => {
    if (!dirtyFields.seoDesc) setValue("seoDesc", toSeoDescription(description || ""), { shouldValidate: true })
  }, [description, dirtyFields.seoDesc, setValue])

  const onSubmit = async (values: FormData) => {
    const payload: any = {
      name: values.name,
      slug: values.slug,
      price: values.price,
      compareAt: values.compareAt,
      stock: values.stock,
      status: values.status,
      description: values.description || null,
      images: values.image ? [values.image] : [],
      seoTitle: values.seoTitle || null,
      seoDesc: values.seoDesc || null,
      categories: values.categories,
    }

    const res = await fetch(`/admin/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const j = await res.json().catch(() => null)
    if (!res.ok) return alert(j?.error || `Error ${res.status}`)

    router.push("/admin/products")
    router.refresh()
  }

  const handleUpload = async (file: File) => {
    if (!file) return
    try {
      setUploading(true)
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/admin/api/upload", { method: "POST", body: fd })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || `Error ${res.status}`)
      if (j.url) setValue("image", j.url, { shouldDirty: true })
    } catch (e: any) {
      alert(e?.message || "No se pudo subir la imagen")
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl mx-auto grid gap-6 md:grid-cols-[1fr_360px]">
      {/* MAIN */}
      <div className="space-y-6">
        <section className="rounded-2xl border p-5 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Información básica</h2>
            <span className="text-xs px-2 py-1 rounded-full border">Editar</span>
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
              <p className="text-xs text-muted-foreground mt-1">Se autogenera del nombre (si no lo editas).</p>
              {errors.slug && <p className="text-red-600 text-xs mt-1">{errors.slug.message}</p>}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border p-5 bg-white shadow-sm">
          <h2 className="text-lg font-semibold">Inventario y clasificación</h2>
          <div className="mt-4 grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium">Precio</label>
              <input type="number" step="0.01" className="w-full border rounded-lg px-3 py-2" {...register("price")} />
              {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Precio original</label>
              <input type="number" step="0.01" className="w-full border rounded-lg px-3 py-2" {...register("compareAt")} />
              {errors.compareAt && <p className="text-red-600 text-xs mt-1">{errors.compareAt?.toString()}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Stock</label>
              <input type="number" className="w-full border rounded-lg px-3 py-2" {...register("stock")} />
              {errors.stock && <p className="text-red-600 text-xs mt-1">{errors.stock.message}</p>}
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

        <section className="rounded-2xl border p-5 bg-white shadow-sm">
          <h2 className="text-lg font-semibold">Contenido</h2>
          <div className="mt-4 grid md:grid-cols-[1fr_auto] gap-4">
            <div>
              <label className="block text-sm font-medium">Descripción</label>
              <textarea rows={5} className="w-full border rounded-lg px-3 py-2" {...register("description")} />
              {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Imagen</label>
              <input type="file" accept="image/*" onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) void handleUpload(f)
              }} disabled={uploading} />
              <input className="w-full border rounded-lg px-3 py-2" placeholder="https://… o /uploads/…" {...register("image")} />
            </div>
          </div>

          {imageUrl && (
            <div className="border rounded-xl p-2 mt-3 bg-white">
              <img src={imageUrl} alt="preview" className="max-h-44 object-contain mx-auto" />
            </div>
          )}
        </section>

        <section className="rounded-2xl border p-5 bg-white shadow-sm">
          <h2 className="text-lg font-semibold">SEO</h2>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">SEO Title</label>
              <input className="w-full border rounded-lg px-3 py-2" {...register("seoTitle")} />
              <div className="flex justify-between text-xs mt-1">
                <span className="text-muted-foreground">Se autogenera del nombre (si no lo editas).</span>
                <span>{seoTitleCount}/60</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">SEO Description</label>
              <input className="w-full border rounded-lg px-3 py-2" {...register("seoDesc")} />
              <div className="flex justify-between text-xs mt-1">
                <span className="text-muted-foreground">Se autogenera de la descripción (si no la editas).</span>
                <span>{seoDescCount}/160</span>
              </div>
            </div>
          </div>
        </section>

        <div className="flex gap-3">
          <button type="submit" className="rounded-xl bg-black text-white px-5 py-2 text-sm shadow hover:opacity-90">
            Guardar cambios
          </button>
        </div>
      </div>

      {/* SIDE */}
      <aside className="space-y-6 md:sticky md:top-4 h-fit">
        <section className="rounded-2xl border p-5 bg-white shadow-sm">
          <h3 className="font-semibold mb-3">Vista rápida</h3>
          <div className="rounded-xl border overflow-hidden">
            <div className="bg-gray-100 aspect-square flex items-center justify-center">
              {imageUrl ? (
                <img src={imageUrl} alt="" className="max-h-full max-w-full object-contain" />
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
