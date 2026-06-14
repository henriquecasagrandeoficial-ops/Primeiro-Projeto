import { motion } from "framer-motion";
import { CakeSlice, Heart, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { emptySettings, useSettings } from "@/hooks/useSettings";
import { useAppStore } from "@/store/appStore";
import type { Product } from "@/types";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/formatters";

const statusLabel = {
  available: "Disponível",
  sold_out: "Esgotado",
  inactive: "Inativo",
};

const badgeLabel = {
  promotion: "Promoção",
  best_seller: "Mais vendido",
  new: "Novo",
  weekly: "Da semana",
};

const badgeVariant: Record<keyof typeof badgeLabel, "danger" | "gold" | "rose" | "secondary"> = {
  promotion: "danger",
  best_seller: "gold",
  new: "rose",
  weekly: "secondary",
};

export function ProductCard({
  product,
  compact = false,
  onDetails,
}: {
  product: Product;
  compact?: boolean;
  onDetails?: (product: Product) => void;
}) {
  const { data: settings = emptySettings } = useSettings();
  const favoriteProductIds = useAppStore((state) => state.favoriteProductIds);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);
  const trackSocialClick = useAppStore((state) => state.trackSocialClick);
  const isFavorite = favoriteProductIds.includes(product.id);
  const badges = product.badges ?? [];

  const shareText = `Conheça ${product.name} na Doceria Dona Lu`;

  const shareProduct = async () => {
    trackSocialClick("share");

    if (navigator.share) {
      await navigator.share({
        title: product.name,
        text: shareText,
        url: window.location.href,
      });
      return;
    }

    await navigator.clipboard?.writeText(`${shareText} - ${window.location.href}`);
    toast.success("Link do produto copiado.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Card
        className="group flex h-full flex-col overflow-hidden border-border/60 transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/50 hover:shadow-elevated active:scale-[0.99]"
        role={onDetails ? "button" : undefined}
        tabIndex={onDetails ? 0 : undefined}
        onClick={() => onDetails?.(product)}
        onKeyDown={(event) => {
          if (onDetails && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            onDetails(product);
          }
        }}
      >
        <div className="hover-sheen relative aspect-[4/3] overflow-hidden bg-secondary">
          {product.imageUrl ? (
            <img
              loading="lazy"
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.07]"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-gradient-to-br from-secondary via-muted to-rose/40 text-primary/50">
              <CakeSlice className="h-12 w-12" />
            </div>
          )}

          {/* Véu sutil para legibilidade dos badges */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-black/5" />

          <div className="absolute left-3 top-3 flex max-w-[70%] flex-wrap gap-1.5">
            <Badge variant={product.status === "available" ? "success" : "warning"}>
              {statusLabel[product.status]}
            </Badge>
            {badges.slice(0, compact ? 1 : 2).map((badge) => (
              <Badge key={badge} variant={badgeVariant[badge] ?? "secondary"}>
                {badgeLabel[badge]}
              </Badge>
            ))}
          </div>

          <div className="absolute right-3 top-3 flex flex-col gap-2">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              className="h-10 w-10 rounded-full bg-card/90 backdrop-blur shadow-soft hover:bg-card"
              onClick={(event) => {
                event.stopPropagation();
                toggleFavorite(product.id);
                toast.success(isFavorite ? "Removido dos favoritos." : "Salvo nos favoritos.");
              }}
            >
              <Heart className={cn("h-5 w-5 transition", isFavorite && "scale-110 fill-destructive text-destructive")} />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              aria-label="Compartilhar produto"
              className="h-10 w-10 rounded-full bg-card/90 backdrop-blur shadow-soft hover:bg-card"
              onClick={(event) => {
                event.stopPropagation();
                void shareProduct().catch(() => undefined);
              }}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <CardContent className={cn("flex flex-1 flex-col gap-3 p-4", compact && "gap-2.5 p-3.5")}>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold">
              {product.category}
            </p>
            <h3 className="mt-1 font-serif text-lg font-semibold leading-snug text-balance">
              {product.name}
            </h3>
          </div>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {product.shortDescription}
          </p>

          {product.promotionLabel ? (
            <p className="rounded-lg bg-rose-soft px-3 py-2 text-xs font-semibold">
              {product.promotionLabel}
            </p>
          ) : null}

          <div className="mt-auto flex items-end justify-between gap-2 pt-1">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                A partir de
              </p>
              <strong className="font-serif text-xl text-primary">
                {formatCurrency(product.price)}
              </strong>
            </div>
            {product.productOfDay ? <Badge variant="gold">Do dia</Badge> : null}
          </div>

          <Button
            type="button"
            className="min-h-11 w-full"
            onClick={(event) => {
              event.stopPropagation();
              trackSocialClick("whatsapp");
              window.open(
                `${settings.whatsappUrl}&text=${encodeURIComponent(`Olá! Quero saber mais sobre ${product.name}.`)}`,
                "_blank",
                "noreferrer",
              );
            }}
          >
            <MessageCircle className="h-4 w-4" />
            Fazer encomenda
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
