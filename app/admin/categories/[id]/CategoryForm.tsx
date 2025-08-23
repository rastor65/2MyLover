"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const schema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  slug: z
    .string()
    .min(2, "Mínimo 2")
    .regex(/^[a-z0-9-]+$/, "Sólo minúsculas, números y -"),
})
type FormData = z.infer<typeof schema>

function slugify(v: string) {
  return v
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function CategoryForm({
  id,
  initial,
}: {
  id: string
  initial: { name: string; slug: string }
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement | null>(null)

  // Autogenerar por defecto si el slug inicial coincide con el nombre inicial slugificado
  const initialAuto = useMemo(
    () => slugify(initial.name || "") === (initial.slug || ""),
    [initial.name, initial.slug]
  )
  const [autoSlug, setAutoSlug] = useState<boolean>(initialAuto)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: initial.name, slug: initial.slug },
    mode: "onChange",
  })

  const nameValue = watch("name")
  const slugValue = watch("slug")

  // Autogenerar slug mientras autoSlug esté activo
  useEffect(() => {
    if (autoSlug) {
      const s = slugify(nameValue || "")
      setValue("slug", s, { shouldValidate: true, shouldDirty: true })
    }
  }, [nameValue, autoSlug, setValue])

  // Atajo Ctrl/Cmd + Enter para enviar
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "enter") {
        e.preventDefault()
        formRef.current?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const onSubmit = async (values: FormData) => {
    try {
      setError(null)
      const res = await fetch(`/admin/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const j = await res.json().catch(() => null)
      if (!res.ok) {
        if (res.status === 409 && j?.error) throw new Error("Ya existe una categoría con ese slug.")
        throw new Error(j?.error || `Error ${res.status}`)
      }
      router.push("/admin/categories")
      router.refresh()
    } catch (e: any) {
      setError(e?.message || "No se pudo guardar")
    }
  }

  const onDelete = async () => {
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

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="border-b px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold leading-none">
              Actualiza el nombre y el slug. Mantén consistencia para SEO.
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-6">
          <div className="grid md:grid-cols-2 gap-5">
            {/* Nombre */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium">Nombre</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Ej. Suéteres"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-red-600">{errors.name.message}</p>
              )}
              <p className="text-[11px] text-muted-foreground">Mín. 2 caracteres.</p>
            </div>

            {/* Slug con toggle de autogeneración */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium">Slug</label>
                <label className="inline-flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    className="accent-black"
                    checked={autoSlug}
                    onChange={(e) => setAutoSlug(e.target.checked)}
                  />
                  Autogenerar
                </label>
              </div>
              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="ej. sueteres"
                {...register("slug")}
                onChange={(e) => {
                  // si lo tocas manualmente, desactiva autogeneración
                  if (autoSlug) setAutoSlug(false)
                  register("slug").onChange(e)
                }}
              />
              {errors.slug && (
                <p className="text-xs text-red-600">{errors.slug.message}</p>
              )}
              <p className="text-[11px] text-muted-foreground">
                Sólo minúsculas, números y guiones.
              </p>
            </div>
          </div>

          {/* Preview URL */}
          <div className="rounded-lg border p-3 bg-gray-50">
            <div className="text-xs">Vista previa de URL</div>
            <div className="mt-1 text-sm font-medium break-all">
              /tienda/categoria/{slugValue || <span className="opacity-60">slug</span>}
            </div>
          </div>

          {/* Error global */}
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-5 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onDelete}
            className="rounded-md border border-red-300 text-red-600 px-3 py-2 text-sm hover:bg-red-50"
          >
            Eliminar
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isValid || !isDirty}
              className="rounded-md bg-black text-white px-4 py-2 text-sm disabled:opacity-50"
              title="Ctrl/Cmd + Enter"
            >
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
