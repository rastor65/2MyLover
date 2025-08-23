// src/lib/auth.ts (NextAuth v4)
import type { NextAuthOptions, User as NAUser, DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./primsa"
import { compare } from "bcryptjs"
import { z } from "zod"

declare module "next-auth" {
  interface User {
    role?: "viewer" | "editor" | "admin" | "superadmin"
  }
  interface Session {
    user: DefaultSession["user"] & {
      role?: "viewer" | "editor" | "admin" | "superadmin"
      id?: string
    }
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "credentials",
      credentials: { email: {}, password: {} },
      authorize: async (raw): Promise<NAUser | null> => {
        const parsed = credentialsSchema.safeParse(raw)
        if (!parsed.success) return null
        const { email, password } = parsed.data

        const dbUser = await prisma.user.findUnique({ where: { email } })
        if (!dbUser?.passwordHash) return null

        const ok = await compare(password, dbUser.passwordHash)
        if (!ok) return null

        return {
          id: dbUser.id,
          name: dbUser.name ?? "",
          email: dbUser.email ?? undefined,
          image: undefined,
          role: (dbUser.role ?? "viewer") as "viewer" | "editor" | "admin" | "superadmin",
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "viewer"
        token.id = (user as any).id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as "viewer" | "editor" | "admin" | "superadmin"
        session.user.id = (token.sub as string) || (token.id as string | undefined)
      }
      return session
    },
  },
  secret: process.env.AUTH_SECRET,
}
