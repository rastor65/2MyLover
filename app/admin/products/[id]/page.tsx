import Link from "next/link"
import { getBaseUrl } from "@/lib/base-url"
import ProductForm from "./ProductForm"

type ParamsPromise = Promise<{ id: string }>

async function fetchProduct(id: string) {
  const base = await getBaseUrl()
  const url = new URL(`/admin/api/products/${id}`, base)
  const res = await fetch(url.toString(), { cache: "no-store" })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Error al cargar producto (${res.status})`)
  return res.json()
}

export default async function EditProductPage({ params }: { params: ParamsPromise }) {
  const { id } = await params
  const product = await fetchProduct(id)
  if (!product) return <div className="p-4">Producto no encontrado</div>

  const initial = {
    name: product.name ?? "",
    slug: product.slug ?? "",
    price: typeof product.price === "string" ? parseFloat(product.price) : Number(product.price ?? 0),
    compareAt:
      product.compareAt == null
        ? undefined
        : typeof product.compareAt === "string"
          ? parseFloat(product.compareAt)
          : Number(product.compareAt),
    stock: Number(product.stock ?? 0),
    status: (product.status ?? "draft") as "draft" | "published" | "archived",
    description: product.description ?? "",
    image: Array.isArray(product.images) && product.images.length ? product.images[0] : "",
    seoTitle: product.seoTitle ?? "",
    seoDesc: product.seoDesc ?? "",
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Editar producto</h1>
        <Link href="/admin/products" className="underline">Volver</Link>
      </div>

      <ProductForm id={id} initial={initial} />
    </div>
  )
}
