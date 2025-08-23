import { NextResponse } from "next/server"
import { prisma } from "@/lib/primsa"
import { z } from "zod"

export const runtime = "nodejs"
type Ctx = { params: Promise<{ id: string }> }

const categorySchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
})

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params
  const cat = await prisma.category.findUnique({ where: { id } })
  if (!cat) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(cat)
}

export async function PUT(req: Request, { params }: Ctx) {
  const { id } = await params
  const body = await req.json().catch(() => null)
  const parsed = categorySchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 })

  // Si envían slug nuevo, checar colisión
  if (parsed.data.slug) {
    const dup = await prisma.category.findUnique({ where: { slug: parsed.data.slug } })
    if (dup && dup.id !== id) return NextResponse.json({ error: "Slug ya existe" }, { status: 409 })
  }

  const updated = await prisma.category.update({
    where: { id },
    data: parsed.data,
  })
  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params

  // Evitar borrar si tiene productos (o cambia por soft delete si prefieres)
  const withProducts = await prisma.product.count({ where: { categories: { some: { id } } } })
  if (withProducts > 0) {
    return NextResponse.json({ error: "No se puede eliminar: hay productos ligados" }, { status: 409 })
  }

  await prisma.category.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
