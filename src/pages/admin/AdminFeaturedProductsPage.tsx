import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/form";
import { useAppStore } from "@/store/appStore";
import type { Product } from "@/types";

export function AdminFeaturedProductsPage({ mode }: { mode: "day" | "week" }) {
  const products = useAppStore((state) => state.products);
  const updateProduct = useAppStore((state) => state.updateProduct);
  const title = mode === "day" ? "Produtos do Dia" : "Produtos da Semana";
  const description =
    mode === "day"
      ? "Selecione produtos do dia e programe a data de destaque."
      : "Selecione produtos da semana e programe o período de destaque.";

  const update = (product: Product) => {
    updateProduct(product);
    toast.success("Programação atualizada.");
  };

  return (
    <div>
      <PageHeader title={title} description={description} />

      <div className="grid gap-4 lg:grid-cols-2">
        {products.map((product) => {
          const active = mode === "day" ? product.productOfDay : product.featuredWeek;

          return (
            <Card key={product.id}>
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.category} · {product.shortDescription}
                    </p>
                  </div>
                  {active ? <Badge variant="success">Selecionado</Badge> : null}
                </div>

                {mode === "day" ? (
                  <div className="space-y-2">
                    <Label>Data programada</Label>
                    <Input
                      type="date"
                      value={product.scheduledDay ?? ""}
                      onChange={(event) =>
                        update({ ...product, scheduledDay: event.target.value })
                      }
                    />
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Início</Label>
                      <Input
                        type="date"
                        value={product.scheduledWeek?.start ?? ""}
                        onChange={(event) =>
                          update({
                            ...product,
                            scheduledWeek: {
                              start: event.target.value,
                              end: product.scheduledWeek?.end ?? "",
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Fim</Label>
                      <Input
                        type="date"
                        value={product.scheduledWeek?.end ?? ""}
                        onChange={(event) =>
                          update({
                            ...product,
                            scheduledWeek: {
                              start: product.scheduledWeek?.start ?? "",
                              end: event.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                )}

                <Button
                  variant={active ? "outline" : "default"}
                  className="w-full"
                  onClick={() =>
                    update(
                      mode === "day"
                        ? { ...product, productOfDay: !product.productOfDay }
                        : { ...product, featuredWeek: !product.featuredWeek },
                    )
                  }
                >
                  {active ? "Remover seleção" : "Selecionar"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
