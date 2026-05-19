import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, barcode, price, stock, imageUrl, categoryId } = body;

  if (!name || !price || !categoryId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: { name, barcode, price: Number(price), stock: Number(stock), imageUrl, categoryId },
    include: { category: true },
  });

  return NextResponse.json(product, { status: 201 });
}