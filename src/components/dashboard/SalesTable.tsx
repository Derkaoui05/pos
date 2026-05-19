"use client";
import { useState } from "react";
import { format } from "date-fns";
import { Order } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

export default function SalesTable({ orders }: { orders: Order[] }) {
  const [selected, setSelected] = useState<Order | null>(null);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Cashier</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map(order => (
                <TableRow
                  key={order.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelected(order)}
                >
                  <TableCell className="font-mono text-xs font-medium">
                    #{order.orderNumber.slice(-8).toUpperCase()}
                  </TableCell>
                  <TableCell>{order.cashier.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {order.paymentMethod}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === "COMPLETED"  ? "default"     :
                        order.status === "REFUNDED"   ? "secondary"   : "destructive"
                      }
                      className="text-xs"
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {order.total.toFixed(2)} MAD
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-xs">
                    {format(new Date(order.createdAt), "dd/MM HH:mm")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Order #{selected?.orderNumber.slice(-8).toUpperCase()}
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                <span>Date</span>
                <span className="text-foreground font-medium text-right">
                  {format(new Date(selected.createdAt), "dd/MM/yyyy HH:mm")}
                </span>
                <span>Cashier</span>
                <span className="text-foreground font-medium text-right">
                  {selected.cashier.name}
                </span>
                <span>Payment</span>
                <span className="text-foreground font-medium text-right">
                  {selected.paymentMethod}
                </span>
              </div>

              <div className="border rounded-lg divide-y">
                {selected.items.map(item => (
                  <div key={item.id} className="flex justify-between px-3 py-2">
                    <span>{item.product.name}</span>
                    <span className="text-muted-foreground">
                      {item.quantity} × {item.unitPrice.toFixed(2)}
                    </span>
                    <span className="font-medium">{item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 border-t pt-3">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span><span>{selected.subtotal.toFixed(2)} MAD</span>
                </div>
                {selected.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span><span>- {selected.discount.toFixed(2)} MAD</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span><span>{selected.tax.toFixed(2)} MAD</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-1 border-t">
                  <span>Total</span><span>{selected.total.toFixed(2)} MAD</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}