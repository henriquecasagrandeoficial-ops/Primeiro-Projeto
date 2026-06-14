import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/types";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/formatters";

const statusLabel = {
  available: "Disponível",
  sold_out: "Esgotado",
  inactive: "Inativo",
};

export function ProductCard({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  return (
    <Card className="overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-40 bg-gradient-to-br from-secondary via-white to-accent">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        ) : null}
        <div className="absolute left-3 top-3">
          <Badge
            variant={product.status === "available" ? "success" : "warning"}
          >
            {statusLabel[product.status]}
          </Badge>
        </div>
      </div>
      <CardContent className={cn("space-y-3 p-4", compact && "p-3")}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {product.category}
          </p>
          <h3 className="mt-1 font-semibold">{product.name}</h3>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {product.shortDescription}
        </p>
        <div className="flex items-center justify-between">
          <strong className="text-primary">{formatCurrency(product.price)}</strong>
          {product.productOfDay ? <Badge variant="secondary">Do dia</Badge> : null}
        </div>
      </CardContent>
    </Card>
  );
}
