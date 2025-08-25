"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

// ───────────────── Zod schema ─────────────────
// Tipos coaccionados y transformados para que el output sea estable
const schema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  slug: z.string().min(1, "Slug requerido").regex(/^[a-z0-9-]+$/, "Sólo minúsculas, números y -"),
  price: z.coerce.number().nonnegative(),
  compareAt: z
    .union([z.coerce.number().nonnegative(), z.literal("")])
    .optional()
    .transform((v) => (v === "" || v == null ? undefined : v)),
  stock: z.coerce.number().int().nonnegative(),
  status: z.enum(["draft", "published", "archived"]),
  image: z
    .string()
    .max(2048)
    .optional()
    .transform((v) => (v === "" ? undefined : v))
    .refine(
      (v) => v === undefined || /^https?:\/\//i.test(v) || v.startsWith("/"),
      { message: "URL inválida. Usa http(s):// o una ruta que empiece con /" }
    ),
  categories: z.array(z.string()).default([]), // ← SIEMPRE string[]
  description: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
})

// Usa el OUTPUT del schema (post-transform, con defaults aplicados)
type FormData = z.output<typeof schema>

type Initial = {
  name: string
  slug: string
  price: string | number
  compareAt?: string | number | null
  stock: number
  status: "draft" | "published" | "archived"
  description?: string | null
  image?: string | null
  images?: string[] | null
  categoryIds?: string[]
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
    formState: { errors },
  } = useForm<FormData>({
    // Alinea el resolver con el tipo de salida del schema
    resolver: zodResolver(schema) as Resolver<FormData>,
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
      image:
        (initial.image ?? undefined) ??
        (Array.isArray(initial.images) && initial.images.length > 0
          ? initial.images[0]
          : undefined),
      categories: initial.categoryIds ?? [], // ← coincide con schema (string[])
      seoTitle: initial.seoTitle ?? "",
      seoDesc: initial.seoDesc ?? "",
    },
  })

  const imageUrl = watch("image")

  const onSubmit = async (values: FormData) => {
    try {
      setSaving(true)
      setError(null)

      const payload = {
        name: values.name,
        slug: values.slug,
        price: values.price,
        compareAt: values.compareAt, // number | undefined
        stock: values.stock,
        status: values.status,
        description: values.description || null,
        images: values.image ? [values.image] : [],
        categories: values.categories, // string[]
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
