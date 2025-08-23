import { headers } from "next/headers"
import { prisma } from "./prisma"

export async function auditLog(params: {
  userId?: string | null
  entity: string
  entityId: string
  action: "create" | "update" | "delete"
  diff?: any
}) {
  const h = await headers()
  const ip = h.get("x-forwarded-for") || h.get("x-real-ip") || ""
  const ua = h.get("user-agent") || ""
  await prisma.auditLog.create({
    data: { ...params, ip, userAgent: ua }
  })
}
