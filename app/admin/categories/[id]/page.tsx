import Link from "next/link"
import { getBaseUrl } from "@/lib/base-url"
import CategoryForm from "./CategoryForm"

type ParamsPromise = Promise<{ id: string }>

async function fetchCategory(id: string) {
  const base = await getBaseUrl()
  const url = new URL(`/admin/api/categories/${id}`, base)
  const res = await fetch(url.toString(), { cache: "no-store" })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Error al cargar categoría (${res.status})`)
  return res.json()
}

export default async function EditCategoryPage({ params }: { params: ParamsPromise }) {
  const { id } = await params
  const cat = await fetchCategory(id)
  if (!cat) return <div className="p-4">Categoría no encontrada</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Editar categoría</h1>
        <Link className="underline" href="/admin/categories">Volver</Link>
      </div>

      <CategoryForm id={id} initial={{ name: cat.name, slug: cat.slug }} />
    </div>
  )
}
