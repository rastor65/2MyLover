// app/admin/api/upload/route.ts
import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get("file") as File | null
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

    // Carpeta donde se guardarán los archivos
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    await mkdir(uploadDir, { recursive: true })

    const buffer = Buffer.from(await file.arrayBuffer())
    const filePath = path.join(uploadDir, file.name)

    await writeFile(filePath, buffer)

    // URL pública (porque está en /public)
    const url = `/uploads/${file.name}`

    return NextResponse.json({ url })
  } catch (err) {
    console.error("Upload error", err)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
