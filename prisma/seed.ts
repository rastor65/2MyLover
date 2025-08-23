// prisma/seed.ts
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  const email = process.env.SEED_SUPERADMIN_EMAIL || "admin@2mylover.com"
  const pass  = process.env.SEED_SUPERADMIN_PASSWORD || "Admin123*"

  const passwordHash = await bcrypt.hash(pass, 10)

  const user = await prisma.user.upsert({
    where: { email },
    update: { role: "superadmin", passwordHash },
    create: {
      email,
      name: "Super Admin",
      role: "superadmin",
      passwordHash,
    },
  })

  console.log("Superadmin listo:", user.email)
}

main().finally(() => prisma.$disconnect())
