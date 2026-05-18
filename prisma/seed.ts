import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, log: ["query"] });

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@pos.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@pos.com",
      password: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
    },
  });

  const food = await prisma.category.upsert({
    where: { name: "Food" },
    update: {},
    create: { name: "Food" },
  });

  const drinks = await prisma.category.upsert({
    where: { name: "Drinks" },
    update: {},
    create: { name: "Drinks" },
  });

  await prisma.product.createMany({
    skipDuplicates: true,
    data: [
      { name: "Sandwich", price: 15, stock: 50, categoryId: food.id },
      { name: "Croissant", price: 8, stock: 30, categoryId: food.id },
      { name: "Water 500ml", price: 4, stock: 100, categoryId: drinks.id },
      { name: "Coffee", price: 10, stock: 80, categoryId: drinks.id },
    ],
  });

  console.log("✅ Seed done");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());