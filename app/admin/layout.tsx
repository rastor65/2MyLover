// app/admin/layout.tsx
import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import AdminShell from "@/components/admin/AdminShell"

export const runtime = "nodejs"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions)
  // V4:
  // const session = await getServerSession(authOptions)

  const role = (session?.user as any)?.role as
    | "viewer"
    | "editor"
    | "admin"
    | "superadmin"
    | undefined

  if (!session || !["admin", "superadmin"].includes(role ?? "")) {
    redirect("/login")
  }

  return (
    <AdminShell userEmail={session.user?.email ?? ""} role={role ?? "viewer"}>
      {children}
    </AdminShell>
  )
}
