// app/api/auth/[...nextauth]/route.ts - NextAuth v4
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

// Si quieres, puedes forzar runtime Node:
export const runtime = "nodejs"
