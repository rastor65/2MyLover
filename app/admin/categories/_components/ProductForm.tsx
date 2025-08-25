"use client"

import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"

const categorySchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  slug: z.string().min(2, "Mínimo 2").regex(/^[a-z0-9-]+$/, "Sólo minúsculas, números y -"),
})
type CategoryFormValues = z.infer<typeof categorySchema>

export default function CategoryForm({
  id,
  initial,
}: {
  id?: string
  initial?: { name: string; slug: string }
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: initial ?? { name: "", slug: "" },
  })

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      setError(null)
      const url = id ? `/admin/api/categories/${id}` : "/admin/api/categories"
      const method = id ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const j = await res.json().catch(() => null)
      if (!res.ok) throw new Error(j?.error || `Error ${res.status}`)
      router.push("/admin/categories")
      router.refresh()
    } catch (e: any) {
      setError(e?.message || "No se pudo guardar")
    }
  }

  const onDelete = async () => {
    if (!id) return
    if (!confirm("¿Eliminar categoría? (no debe tener productos asociados)")) return
    try {
      const res = await fetch(`/admin/api/categories/${id}`, { method: "DELETE" })
      const j = await res.json().catch(() => null)
      if (!res.ok) throw new Error(j?.error || `Error ${res.status}`)
      router.push("/admin/categories")
      router.refresh()
    } catch (e: any) {
      setError(e?.message || "No se pudo eliminar")
    }
  }

  const handleNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const v = e.target.value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    if (v) setValue("slug", v, { shouldDirty: true })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
      <div>
        <label className="block text-sm">Nombre</label>
        <input className="w-full border rounded px-3 py-2" {...register("name")} onBlur={handleNameBlur} />
        {errors.name && <p className="text-red-600 text-xs">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm">Slug</label>
        <input className="w-full border rounded px-3 py-2" {...register("slug")} />
        {errors.slug && <p className="text-red-600 text-xs">{errors.slug.message}</p>}
      </div>

      {error && <p className="text-red-700 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button disabled={isSubmitting} className="rounded bg-black text-white px-4 py-2 disabled:opacity-50">
          {isSubmitting ? "Guardando..." : "Guardar"}
        </button>
        {id && (
          <button type="button" onClick={onDelete} className="rounded border px-4 py-2">
            Eliminar
          </button>
        )}
      </div>
    </form>
  )
}
