"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

// ───────────────── Zod schema (tipado exacto con el formulario) ─────────────────
const schema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  slug: z.string().min(1, "Slug requerido").regex(/^[a-z0-9-]+$/, "Sólo minúsculas, números y -"),

  // números coaccionados → RHF siempre entrega string desde <input type="number">
  price: z.coerce.number().nonnegative(),
  compareAt: z
    .union([z.coerce.number().nonnegative(), z.literal("")])
    .optional()
    .transform((v) => (v === "" || v == null ? undefined : v)),

  stock: z.coerce.number().int().nonnegative(),
  status: z.enum(["draft", "published", "archived"]),

  // imagen opcional: permitimos URL http(s) o ruta relativa que empiece por "/"
  image: z
    .string()
    .max(2048)
    .optional()
    .transform((v) => (v === "" ? undefined : v))
    .refine(
      (v) => v === undefined || /^https?:\/\//i.test(v) || v.startsWith("/"),
      { message: "URL inválida. Usa http(s):// o una ruta que empiece con /" }
    ),

  // ids de categorías
  categories: z.array(z.string()).default([]),

  description: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
})

type FormData = z.infer<typeof schema>

// Tipado sugerido del `initial` que recibes desde el server
type Initial = {
  name: string
  slug: string
  price: string | number
  compareAt?: string | number | null
  stock: number
  status: "draft" | "published" | "archived"
  description?: string | null
  // si guardas una sola imagen en `images[0]`, puedes mapearla a `image`
  image?: string | null
  // o si traes arreglo de imágenes, úsalo para popular `image` con la primera
  images?: string[] | null
  // ids de categorías asociadas
  categoryIds?: string[]
  // SEO
  seoTitle?: string | null
  seoDesc?: string | null
}

export default function ProductForm({
  id,
  initial,
}: {
  id: string
  initial: Initial
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
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
      compareAt:
        initial.compareAt != null && initial.compareAt !== ""
          ? Number(initial.compareAt)
          : undefined,
      stock: Number(initial.stock ?? 0),
      status: initial.status ?? "draft",
      description: initial.description ?? "",
      // toma la primera imagen disponible como `image`
      image:
        (initial.image ?? undefined) ??
        (Array.isArray(initial.images) && initial.images.length > 0
          ? initial.images[0]
          : undefined),
      categories: initial.categoryIds ?? [],
      seoTitle: initial.seoTitle ?? "",
      seoDesc: initial.seoDesc ?? "",
    },
  })

  const imageUrl = watch("image")

  const onSubmit = async (values: FormData) => {
    try {
      setSaving(true)
      setError(null)

      // normaliza payload a tu API
      const payload = {
        name: values.name,
        slug: values.slug,
        price: values.price,
        compareAt: values.compareAt, // puede ser undefined
        stock: values.stock,
        status: values.status,
        description: values.description || null,
        images: values.image ? [values.image] : [], // 1 imagen por ahora
        categories: values.categories,              // ids de categorías
        seoTitle: values.seoTitle || null,
        seoDesc: values.seoDesc || null,
      }

      const res = await fetch(`/admin/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const j = await res.json().catch(() => null)
      if (!res.ok) throw new Error(j?.error || `Error ${res.status}`)

      router.push("/admin/products")
      router.refresh()
    } catch (e: any) {
      setError(e?.message || "No se pudo guardar")
    } finally {
      setSaving(false)
    }
  }

  const handleUpload = async (file: File) => {
    if (!file) return
    try {
      setUploading(true)
      setError(null)
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/admin/api/upload", { method: "POST", body: fd })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || `Error ${res.status}`)
      if (j.url) setValue("image", j.url, { shouldDirty: true })
    } catch (e: any) {
      setError(e?.message || "No se pudo subir la imagen")
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {/* Básico */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">Nombre</label>
          <input className="w-full border rounded px-3 py-2" {...register("name")} />
          {errors.name && <p className="text-red-600 text-xs">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Slug</label>
          <input className="w-full border rounded px-3 py-2" {...register("slug")} />
          {errors.slug && <p className="text-red-600 text-xs">{errors.slug.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
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
          {errors.compareAt && (
            <p className="text-red-600 text-xs">{errors.compareAt.message as string}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Stock</label>
          <input type="number" className="w-full border rounded px-3 py-2" {...register("stock")} />
          {errors.stock && <p className="text-red-600 text-xs">{errors.stock.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Estado</label>
        <select className="w-full border rounded px-3 py-2" {...register("status")}>
          <option value="draft">Borrador</option>
          <option value="published">Publicado</option>
          <option value="archived">Archivado</option>
        </select>
        {errors.status && <p className="text-red-600 text-xs">{errors.status.message}</p>}
      </div>

      {/* Categorías (ids) */}
      <div>
        <label className="block text-sm font-medium">Categorías</label>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="IDs separadas por coma (ej: abc,def)"
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
        {errors.categories && (
          <p className="text-red-600 text-xs">{errors.categories.message as string}</p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium">Descripción</label>
        <textarea rows={5} className="w-full border rounded px-3 py-2" {...register("description")} />
        {errors.description && <p className="text-red-600 text-xs">{errors.description.message}</p>}
      </div>

      {/* Imagen */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Imagen</label>
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="https://…/imagen.jpg o /uploads/imagen.jpg"
            {...register("image")}
          />
          <label className="inline-flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) void handleUpload(file)
              }}
              disabled={uploading}
            />
          </label>
        </div>
        {imageUrl ? (
          <div className="border rounded p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="preview" className="max-h-40 object-contain mx-auto" />
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Ingresa una URL o sube una imagen.</p>
        )}
        {(errors.image as any) && <p className="text-red-600 text-xs">{(errors.image as any).message}</p>}
      </div>

      {/* SEO */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">SEO Title</label>
          <input className="w-full border rounded px-3 py-2" {...register("seoTitle")} />
          {errors.seoTitle && <p className="text-red-600 text-xs">{errors.seoTitle.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">SEO Description</label>
          <input className="w-full border rounded px-3 py-2" {...register("seoDesc")} />
          {errors.seoDesc && <p className="text-red-600 text-xs">{errors.seoDesc.message}</p>}
        </div>
      </div>

      {error && <p className="text-red-700 text-sm">{error}</p>}

      <div className="pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded bg-black text-white px-4 py-2 disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </form>
  )
}
