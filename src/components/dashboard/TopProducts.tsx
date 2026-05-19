import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TopProduct {
  productId: string;
  name:      string;
  _sum: {
    quantity: number;
    subtotal: number;
  };
}

export default function TopProducts({ products }: { products: TopProduct[] }) {
  const max = products[0]?._sum.quantity ?? 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top Products</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {products.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No data yet
          </p>
        )}
        {products.map((p, i) => (
          <div key={p.productId} className="space-y-1">
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground w-4">#{i + 1}</span>
                <span className="font-medium truncate max-w-[140px]">{p.name}</span>
              </div>
              <span className="text-muted-foreground text-xs">
                {p._sum.quantity} sold
              </span>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${(p._sum.quantity / max) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-right">
              {p._sum.subtotal.toFixed(2)} MAD
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}