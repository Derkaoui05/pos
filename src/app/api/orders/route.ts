import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } }, cashier: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, subtotal, discount, tax, total, paymentMethod, amountPaid, change, cashierId } = body;

    // 1. Validate database stock levels before creating the order
    const productIds = items.map((i: any) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, stock: true },
    });

    for (const item of items) {
      const dbProd = dbProducts.find((p) => p.id === item.productId);
      if (!dbProd) {
        return NextResponse.json({ error: "Product not found." }, { status: 400 });
      }
      if (dbProd.stock < item.quantity) {
        return NextResponse.json({
          error: `We only have ${dbProd.stock} left in stock for "${dbProd.name}".`
        }, { status: 400 });
      }
    }

    // 2. Create the order after stock levels are fully validated
    const order = await prisma.order.create({
      data: {
        subtotal,
        discount,
        tax,
        total,
        paymentMethod,
        amountPaid,
        change,
        cashierId: cashierId || null,
        items: {
          create: items.map((i: any) => ({
            productId: i.productId,
            quantity:  i.quantity,
            unitPrice: i.unitPrice,
            subtotal:  i.quantity * i.unitPrice,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        cashier: true,
      },
    });

    // Update stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 550 });
  }
}
