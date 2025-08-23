import { NextResponse } from "next/server"
import { prisma } from "@/lib/primsa" // cambia a "@/lib/prisma" si aplica
import { Prisma } from "@prisma/client"
import { slugify, toSeoTitle, toSeoDescription } from "@/lib/slug"

export const runtime = "nodejs"
type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: { categories: { select: { id: true, name: true, slug: true } } },
    })
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(product)
  } catch (err: any) {
    console.error("[GET /admin/api/products/[id]] Error:", err)
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: Ctx) {
  try {
    const { id } = await params
    const body = await req.json().catch(() => null)
    if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 })

    const data: any = {
      name: body.name,
      slug: (body.slug && String(body.slug).trim()) || (body.name ? slugify(body.name) : undefined),
      description: body.description ?? null,
      status: body.status,
      stock: typeof body.stock !== "undefined" ? Number(body.stock) : undefined,
      images: Array.isArray(body.images) ? body.images : undefined,
      tags: Array.isArray(body.tags) ? body.tags : undefined,
      seoTitle:
        (typeof body.seoTitle !== "undefined" && body.seoTitle !== null
          ? String(body.seoTitle).trim()
          : body.name
          ? toSeoTitle(body.name)
          : undefined),
      seoDesc:
        (typeof body.seoDesc !== "undefined" && body.seoDesc !== null
          ? String(body.seoDesc).trim()
          : typeof body.description !== "undefined"
          ? toSeoDescription(body.description)
          : undefined),
    }

    if (typeof body.price !== "undefined") {
      data.price = new Prisma.Decimal(String(body.price))
    }
    if (typeof body.compareAt !== "undefined") {
      data.compareAt =
        body.compareAt == null ? null : new Prisma.Decimal(String(body.compareAt))
    }

    if (Array.isArray(body.categories)) {
      data.categories = { set: body.categories.map((catId: string) => ({ id: catId })) }
    }

    const updated = await prisma.product.update({ where: { id }, data })
    return NextResponse.json(updated)
  } catch (err: any) {
    console.error("[PUT /admin/api/products/[id]] Error:", err)
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 })
  }
}
