import Link from "next/link"
import NewCategoryForm from "./CategoryNewForm"

export default function NewCategoryPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Nueva categoría</h1>
        <Link href="/admin/categories" className="underline">Volver</Link>
      </div>
      <NewCategoryForm />
    </div>
  )
}
