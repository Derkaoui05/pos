import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body    = await req.json();
  const { name, barcode, price, stock, imageUrl, categoryId } = body;

  const product = await prisma.product.update({
    where:   { id },
    data:    { name, barcode, price: Number(price), stock: Number(stock), imageUrl, categoryId },
    include: { category: true },
  });

  return NextResponse.json(product);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Soft delete
  await prisma.product.update({
    where: { id },
    data:  { isActive: false },
  });

  return NextResponse.json({ success: true });
}