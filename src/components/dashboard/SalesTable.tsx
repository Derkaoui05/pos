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
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RotateCcw, Loader2 } from "lucide-react";

export default function SalesTable({ orders }: { orders: Order[] }) {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<Order | null>(null);
  const [isConfirmingRefund, setIsConfirmingRefund] = useState(false);

  const handleClose = () => {
    setSelected(null);
    setIsConfirmingRefund(false);
  };

  const refundMutation = useMutation({
    mutationFn: (orderId: string) => {
      return fetch(`/api/orders/${orderId}/refund`, {
        method: "POST",
      }).then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to process refund");
        return json;
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Order refunded successfully");
      handleClose();
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

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
      <Dialog open={!!selected} onOpenChange={handleClose}>
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

              {selected.status === "COMPLETED" && (
                <div className="border-t pt-4 mt-2">
                  {!isConfirmingRefund ? (
                    <Button
                      variant="destructive"
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => setIsConfirmingRefund(true)}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Refund Transaction
                    </Button>
                  ) : (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 space-y-3">
                      <p className="text-xs text-destructive font-medium text-center leading-normal">
                        Are you sure you want to refund this transaction? 
                        This will restore stock levels for all items and mark this order as refunded. This action cannot be undone.
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setIsConfirmingRefund(false)}
                          disabled={refundMutation.isPending}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1 flex items-center justify-center gap-1.5"
                          onClick={() => refundMutation.mutate(selected.id)}
                          disabled={refundMutation.isPending}
                        >
                          {refundMutation.isPending ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              Refunding...
                            </>
                          ) : (
                            "Yes, Refund"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {selected.status === "REFUNDED" && (
                <div className="border-t pt-4 mt-2 text-center text-xs text-muted-foreground font-semibold flex items-center justify-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 py-2.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
                  <Badge variant="secondary" className="px-2 py-0.5 text-[10px]">
                    Refunded
                  </Badge>
                  This transaction has been fully refunded
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}