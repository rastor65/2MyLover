import { NextResponse } from "next/server"
import { prisma } from "@/lib/primsa"
import { z } from "zod"

export const runtime = "nodejs"

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get("q")?.trim() ?? ""
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"))
    const perPage = Math.min(100, Math.max(1, Number(searchParams.get("perPage") ?? "10")))
    const skip = (page - 1) * perPage
    const sort = (searchParams.get("sort") as "name" | "slug" | "count") || "name"
    const dir = (searchParams.get("dir") as "asc" | "desc") || "asc"

    const where = q
      ? {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { slug: { contains: q, mode: "insensitive" } },
        ],
      }
      : {}

    const orderBy =
      sort === "count"
        ? { products: { _count: dir } } // ordena por conteo del relation
        : { [sort]: dir as "asc" | "desc" }

    const [items, total] = await Promise.all([
      prisma.category.findMany({
        where,
        orderBy: { name: "asc" },
        skip,
        take: perPage,
        select: {
          id: true,
          name: true,
          slug: true,
          _count: { select: { products: true } }, // 👈 CAMBIO AQUÍ
        },
      }),
      prisma.category.count({ where }),
    ])

    return NextResponse.json({
      items,
      total,
      page,
      perPage,
      pages: Math.ceil(total / perPage),
    })
  } catch (err: any) {
    console.error("[GET /admin/api/categories] Error:", err)
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    const parsed = categorySchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 })

    const { name, slug } = parsed.data
    const exists = await prisma.category.findUnique({ where: { slug } })
    if (exists) return NextResponse.json({ error: "Slug ya existe" }, { status: 409 })

    const created = await prisma.category.create({
      data: { name, slug },
      select: { id: true },
    })
    return NextResponse.json({ id: created.id }, { status: 201 })
  } catch (err: any) {
    console.error("[POST /admin/api/categories] Error:", err)
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 })
  }
}
