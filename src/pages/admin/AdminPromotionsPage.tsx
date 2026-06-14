import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input, Label, Textarea } from "@/components/ui/form";
import { useProducts } from "@/hooks/useProducts";
import { usePromotionMutations, usePromotions } from "@/hooks/usePromotions";
import { formatDate } from "@/utils/formatters";

export function AdminPromotionsPage() {
  const { data: products = [] } = useProducts();
  const { data: promotions = [] } = usePromotions();
  const { createPromotion } = usePromotionMutations();
  const [open, setOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    validUntil: "",
    bannerUrl: "",
  });

  const savePromotion = async () => {
    if (!form.title || !form.validUntil) {
      toast.error("Informe título e validade.");
      return;
    }

    await createPromotion.mutateAsync({
      id: crypto.randomUUID(),
      title: form.title,
      description: form.description,
      validUntil: form.validUntil,
      bannerUrl: form.bannerUrl || undefined,
      productIds: selectedProducts,
      active: true,
    });
    setOpen(false);
    setSelectedProducts([]);
    setForm({ title: "", description: "", validUntil: "", bannerUrl: "" });
    toast.success("Promoção criada.");
  };

  return (
    <div>
      <PageHeader
        title="Gerenciamento de Promoções"
        description="Crie campanhas, defina validade, banner e produtos participantes."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" />
            Criar promoção
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {promotions.map((promotion) => (
          <Card key={promotion.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>{promotion.title}</CardTitle>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {promotion.description}
                  </p>
                </div>
                <Badge variant={promotion.active ? "success" : "secondary"}>
                  {promotion.active ? "Ativa" : "Inativa"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Válida até {formatDate(promotion.validUntil)}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {promotion.productIds.map((id) => {
                  const product = products.find((item) => item.id === id);
                  return product ? (
                    <Badge key={id} variant="secondary">
                      {product.name}
                    </Badge>
                  ) : null;
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        open={open}
        title="Criar promoção"
        confirmLabel="Salvar"
        onClose={() => setOpen(false)}
        onConfirm={savePromotion}
      >
        <div className="space-y-4">
          <Field label="Título">
            <Input
              value={form.title}
              onChange={(event) => setForm((state) => ({ ...state, title: event.target.value }))}
            />
          </Field>
          <Field label="Descrição">
            <Textarea
              value={form.description}
              onChange={(event) =>
                setForm((state) => ({ ...state, description: event.target.value }))
              }
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Validade">
              <Input
                type="date"
                value={form.validUntil}
                onChange={(event) =>
                  setForm((state) => ({ ...state, validUntil: event.target.value }))
                }
              />
            </Field>
            <Field label="Banner">
              <Input
                value={form.bannerUrl}
                placeholder="/IMG/banner.png"
                onChange={(event) =>
                  setForm((state) => ({ ...state, bannerUrl: event.target.value }))
                }
              />
            </Field>
          </div>
          <div className="space-y-2">
            <Label>Produtos participantes</Label>
            <div className="grid max-h-48 gap-2 overflow-auto rounded-xl border p-3">
              {products.map((product) => (
                <label key={product.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={(event) =>
                      setSelectedProducts((current) =>
                        event.target.checked
                          ? [...current, product.id]
                          : current.filter((id) => id !== product.id),
                      )
                    }
                  />
                  {product.name}
                </label>
              ))}
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
