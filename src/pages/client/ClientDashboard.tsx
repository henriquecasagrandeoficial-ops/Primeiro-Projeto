import { useQuery } from "@tanstack/react-query";
import { BellRing, CalendarDays, Flame, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getBanners } from "@/services/mockApi";
import { useAppStore } from "@/store/appStore";

export function ClientDashboard() {
  const products = useAppStore((state) => state.products);
  const notifications = useAppStore((state) => state.notifications);
  const { data: banners, isLoading } = useQuery({
    queryKey: ["banners"],
    queryFn: getBanners,
  });

  const featured = products.filter((product) => product.featuredWeek);
  const productOfDay = products.filter((product) => product.productOfDay);

  return (
    <div>
      <PageHeader
        title="Página Inicial"
        description="Promoções, produtos em destaque, avisos e novidades da semana."
      />

      {isLoading ? (
        <Skeleton className="mb-6 h-64" />
      ) : (
        <section className="mb-6 overflow-hidden rounded-2xl bg-primary text-primary-foreground shadow-xl">
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_360px] lg:items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                <Flame className="h-4 w-4" />
                Promoções da semana
              </div>
              <h2 className="max-w-3xl text-balance text-3xl font-black sm:text-5xl">
                {banners?.[0]?.title}
              </h2>
              <p className="max-w-2xl text-primary-foreground/80">
                {banners?.[0]?.subtitle}
              </p>
              <Button variant="secondary">Ver cardápio completo</Button>
            </div>
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-sm uppercase tracking-wide text-primary-foreground/70">
                Produto do dia
              </p>
              <h3 className="mt-2 text-2xl font-bold">
                {productOfDay[0]?.name ?? "Especial Dona Lu"}
              </h3>
              <p className="mt-2 text-sm text-primary-foreground/75">
                Selecionado fresco para hoje, com preparo artesanal.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Produtos em Destaque</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Produtos da Semana</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {products.map((product) => (
            <div key={product.id} className="min-w-72">
              <ProductCard product={product} compact />
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Produtos do Dia</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {productOfDay.map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellRing className="h-5 w-5 text-primary" />
              Avisos da Doceria
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="rounded-xl border bg-secondary/40 p-4">
                <p className="font-semibold">{notification.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {notification.message}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
