import { NextResponse } from "next/server"
import { prisma } from "@/lib/primsa" // ⇐ usa "@/lib/prisma" si ese es tu archivo real
import { Prisma } from "@prisma/client"
import { slugify, toSeoTitle, toSeoDescription } from "@/lib/slug"

export const runtime = "nodejs"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get("q")?.trim() ?? ""
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"))
    const perPage = Math.min(100, Math.max(1, Number(searchParams.get("perPage") ?? "10")))
    const skip = (page - 1) * perPage
    const sort = (searchParams.get("sort") as "name" | "price" | "stock" | "status" | "updatedAt") || "updatedAt"
    const dir = (searchParams.get("dir") as "asc" | "desc") || "desc"

    const orderBy: Record<string, any> = {
      name: { name: dir },
      price: { price: dir },
      stock: { stock: dir },
      status: { status: dir },
      updatedAt: { updatedAt: dir },
    }

    const where = q
      ? {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { slug: { contains: q, mode: "insensitive" } },
        ],
      }
      : {}

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: orderBy[sort],
        skip,
        take: perPage,
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          stock: true,
          status: true,
          updatedAt: true,
          images: true,
          categories: { select: { name: true } },
        },
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      items,
      total,
      page,
      perPage,
      pages: Math.ceil(total / perPage),
    })
  } catch (err: any) {
    console.error("[GET /admin/api/products] Error:", err)
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    if (!body?.name || body.price == null) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 })
    }

    const name: string = body.name
    const slug: string = (body.slug && String(body.slug).trim()) || slugify(name)
    const price = new Prisma.Decimal(String(body.price))
    const compareAt =
      body.compareAt == null ? null : new Prisma.Decimal(String(body.compareAt))

    const seoTitle = (body.seoTitle && String(body.seoTitle).trim()) || toSeoTitle(name)
    const seoDesc =
      (body.seoDesc && String(body.seoDesc).trim()) || toSeoDescription(body.description)

    const created = await prisma.product.create({
      data: {
        name,
        slug,
        description: body.description ?? null,
        price,
        compareAt,
        status: body.status ?? "draft",
        stock: Number(body.stock ?? 0),
        images: Array.isArray(body.images) ? body.images : [],
        tags: Array.isArray(body.tags) ? body.tags : [],
        seoTitle,
        seoDesc,
        ...(Array.isArray(body.categories) && body.categories.length
          ? { categories: { connect: body.categories.map((id: string) => ({ id })) } }
          : {}),
      },
      select: { id: true },
    })

    return NextResponse.json({ id: created.id }, { status: 201 })
  } catch (err: any) {
    console.error("[POST /admin/api/products] Error:", err)
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 })
  }
}