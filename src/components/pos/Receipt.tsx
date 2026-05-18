import { Order } from "@/types";
import { format } from "date-fns";

interface Props {
  order: Order;
  ref:   React.Ref<HTMLDivElement>;
}

export default function Receipt({ order, ref }: Props) {
  return (
    <div ref={ref} className="p-6 font-mono text-xs w-[300px] bg-white text-black">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-base font-bold uppercase">POS App</h1>
        <p className="text-muted-foreground">123 Rue Mohammed V, Tanger</p>
        <p className="text-muted-foreground">Tel: +212 600 000 000</p>
      </div>

      <Divider />

      {/* Order info */}
      <div className="space-y-1 mb-3">
        <Row label="Order" value={`#${order.orderNumber.slice(-8).toUpperCase()}`} />
        <Row label="Date"  value={format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")} />
        <Row label="Cashier" value={order.cashier.name} />
      </div>

      <Divider />

      {/* Items */}
      <div className="space-y-1 my-3">
        {order.items.map(item => (
          <div key={item.id} className="flex justify-between gap-2">
            <span className="flex-1 truncate">{item.product.name}</span>
            <span className="whitespace-nowrap">
              {item.quantity} x {item.unitPrice.toFixed(2)}
            </span>
            <span className="w-16 text-right">{item.subtotal.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <Divider />

      {/* Totals */}
      <div className="space-y-1 my-3">
        <Row label="Subtotal" value={`${order.subtotal.toFixed(2)} MAD`} />
        {order.discount > 0 && (
          <Row label="Discount" value={`- ${order.discount.toFixed(2)} MAD`} />
        )}
        <Row label="Tax (20%)" value={`${order.tax.toFixed(2)} MAD`} />
      </div>

      <Divider />

      <div className="flex justify-between font-bold text-sm my-2">
        <span>TOTAL</span>
        <span>{order.total.toFixed(2)} MAD</span>
      </div>

      <Divider />

      {/* Payment */}
      <div className="space-y-1 my-3">
        <Row label="Payment" value={order.paymentMethod} />
        <Row label="Paid"    value={`${order.amountPaid.toFixed(2)} MAD`} />
        {order.change > 0 && (
          <Row label="Change" value={`${order.change.toFixed(2)} MAD`} />
        )}
      </div>

      <Divider />

      {/* Footer */}
      <div className="text-center mt-4 space-y-1 text-muted-foreground">
        <p>Thank you for your purchase!</p>
        <p>شكراً لزيارتكم</p>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="border-t border-dashed border-gray-300 my-2" />;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}