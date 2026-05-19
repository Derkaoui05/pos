import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfDay, startOfWeek, startOfMonth } from "date-fns";

export async function GET() {
  const now = new Date();

  const [todayOrders, weekOrders, monthOrders, totalOrders, topProducts, recentOrders, orderHistory] =
    await Promise.all([
      // Today sales
      prisma.order.aggregate({
        where: { createdAt: { gte: startOfDay(now) }, status: "COMPLETED" },
        _sum:   { total: true },
        _count: true,
      }),

      // This week
      prisma.order.aggregate({
        where: { createdAt: { gte: startOfWeek(now) }, status: "COMPLETED" },
        _sum:   { total: true },
        _count: true,
      }),

      // This month
      prisma.order.aggregate({
        where: { createdAt: { gte: startOfMonth(now) }, status: "COMPLETED" },
        _sum:   { total: true },
        _count: true,
      }),

      // All time
      prisma.order.aggregate({
        where:  { status: "COMPLETED" },
        _sum:   { total: true },
        _count: true,
      }),

      // Top 5 products
      prisma.orderItem.groupBy({
        by:       ["productId"],
        _sum:     { quantity: true, subtotal: true },
        orderBy:  { _sum: { quantity: "desc" } },
        take:     5,
      }),

      // Recent 10 orders
      prisma.order.findMany({
        take:    10,
        orderBy: { createdAt: "desc" },
        include: {
          items:   { include: { product: true } },
          cashier: { select: { name: true } },
        },
      }),

      // All order history totals from the last 12 months for visual analytics
      prisma.order.findMany({
        where: {
          status: "COMPLETED",
          createdAt: { gte: startOfMonth(new Date(now.getFullYear(), now.getMonth() - 11, 1)) },
        },
        select: {
          createdAt: true,
          total: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),
    ]);

  // Resolve product names for top products
  const topProductIds = topProducts.map(p => p.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: topProductIds } },
    select: { id: true, name: true },
  });

  const topProductsWithNames = topProducts.map(p => ({
    ...p,
    name: products.find(pr => pr.id === p.productId)?.name ?? "Unknown",
  }));

  return NextResponse.json({
    stats: {
      today:  { total: todayOrders._sum.total ?? 0,  count: todayOrders._count },
      week:   { total: weekOrders._sum.total  ?? 0,  count: weekOrders._count },
      month:  { total: monthOrders._sum.total ?? 0,  count: monthOrders._count },
      allTime:{ total: totalOrders._sum.total ?? 0,  count: totalOrders._count },
    },
    topProducts: topProductsWithNames,
    recentOrders,
    orderHistory,
  });
}