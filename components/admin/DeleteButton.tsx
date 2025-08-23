"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function DeleteButton({
  href,
  confirmText = "¿Eliminar? Esta acción es irreversible.",
  className = "rounded border px-3 py-1 text-sm hover:bg-red-50",
  onDone,
}: {
  href: string
  confirmText?: string
  className?: string
  onDone?: () => void
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm(confirmText)) return
    try {
      setLoading(true)
      const res = await fetch(href, { method: "DELETE" })
      const j = await res.json().catch(() => null)
      if (!res.ok) throw new Error(j?.error || `Error ${res.status}`)
      onDone?.()
      router.refresh()
    } catch (e: any) {
      alert(e?.message || "No se pudo eliminar")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleDelete} disabled={loading} className={className}>
      {loading ? "Eliminando..." : "Eliminar"}
    </button>
  )
}
