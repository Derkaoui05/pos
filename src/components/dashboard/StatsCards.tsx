import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, ShoppingBag, Calendar, Clock } from "lucide-react";

interface StatBlock {
  total: number;
  count: number;
}

interface Props {
  stats: {
    today:   StatBlock;
    week:    StatBlock;
    month:   StatBlock;
    allTime: StatBlock;
  };
}

const CARDS = [
  { key: "today",   label: "Today",      icon: Clock,       color: "text-blue-500"  },
  { key: "week",    label: "This Week",  icon: Calendar,    color: "text-purple-500"},
  { key: "month",   label: "This Month", icon: TrendingUp,  color: "text-green-500" },
  { key: "allTime", label: "All Time",   icon: ShoppingBag, color: "text-orange-500"},
] as const;

export default function StatsCards({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS.map(card => {
        const stat = stats[card.key];
        return (
          <Card key={card.key}>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{card.label}</span>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.total.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">MAD</p>
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.count} order{stat.count !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}