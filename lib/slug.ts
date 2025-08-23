// lib/slug.ts
export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80)
}

export function toSeoTitle(name: string) {
  return (name || "").trim().slice(0, 60)
}

export function toSeoDescription(desc?: string | null) {
  if (!desc) return ""
  const plain = desc.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
  return plain.slice(0, 160)
}
