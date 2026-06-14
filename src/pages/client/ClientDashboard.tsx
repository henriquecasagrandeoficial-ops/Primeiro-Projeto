import { motion } from "framer-motion";
import {
  BellRing,
  CalendarDays,
  Camera,
  Gift,
  Quote,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { SocialLinks } from "@/components/SocialLinks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthProvider";
import { useCoupons } from "@/hooks/useCoupons";
import { useFeedbacks } from "@/hooks/useFeedbacks";
import { useNotifications } from "@/hooks/useNotifications";
import { useProducts } from "@/hooks/useProducts";
import { emptySettings, useSettings } from "@/hooks/useSettings";
import { getInitials } from "@/utils/formatters";

function SectionTitle({
  icon,
  title,
  subtitle,
  action,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-secondary text-primary ring-1 ring-inset ring-accent/40">
          {icon}
        </span>
        <div>
          <h2 className="font-serif text-xl font-semibold tracking-tight">{title}</h2>
          {subtitle ? (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
      </div>
      {action}
    </div>
  );
}

export function ClientDashboard() {
  const { user } = useAuth();
  const { data: products = [] } = useProducts();
  const { data: notifications = [] } = useNotifications(user?.id);
  const { data: coupons = [] } = useCoupons();
  const { data: feedbacks = [] } = useFeedbacks();
  const { data: settings = emptySettings } = useSettings();

  const featured = products.filter((product) => product.featuredWeek);
  const productOfDay = products.filter((product) => product.productOfDay);
  const currentBanner = settings.heroBanner;
  const compliments = feedbacks
    .filter((item) => item.category === "compliment")
    .slice(0, 3);

  const firstName = user?.name?.split(" ")[0] ?? "cliente";

  return (
    <div className="space-y-10">
      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground shadow-elevated"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            backgroundImage:
              "radial-gradient(40rem 22rem at 100% 0%, rgba(199,154,75,0.4), transparent 60%), radial-gradient(34rem 20rem at 0% 100%, rgba(232,185,173,0.3), transparent 55%)",
          }}
        />
        <div className="relative grid gap-6 p-6 sm:p-9 lg:grid-cols-[1fr_340px] lg:items-center">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Olá, {firstName}
            </span>
            <h1 className="max-w-3xl text-balance font-serif text-3xl font-semibold leading-[1.1] sm:text-5xl">
              {currentBanner.title}
            </h1>
            <p className="max-w-xl text-pretty text-primary-foreground/80 leading-relaxed">
              {currentBanner.subtitle}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" size="lg" asChild>
                <Link to={currentBanner.ctaHref || "/cliente/cardapio"}>
                  {currentBanner.ctaLabel || "Ver cardápio"}
                </Link>
              </Button>
              <Button
                size="lg"
                asChild
                className="border border-white/30 bg-white/10 text-primary-foreground hover:bg-white/20"
              >
                <Link to="/cliente/votacao">Votar nos sabores</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground/70">
              <Star className="h-3.5 w-3.5 fill-current text-accent" />
              Produto do dia
            </p>
            <h3 className="mt-3 font-serif text-2xl font-semibold">
              {productOfDay[0]?.name ?? "Especial Dona Lu"}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-primary-foreground/75">
              {productOfDay[0]?.shortDescription ??
                "Selecionado fresco para hoje, com preparo 100% artesanal."}
            </p>
            <Button variant="secondary" className="mt-4 w-full" asChild>
              <Link to="/cliente/cardapio">Conferir agora</Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* DESTAQUES */}
      <section>
        <SectionTitle
          icon={<Star className="h-5 w-5" />}
          title="Produtos em Destaque"
          subtitle="Seleção especial da casa para você"
          action={
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
              <Link to="/cliente/cardapio">Ver tudo</Link>
            </Button>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* CARDS DE VALOR */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="relative overflow-hidden bg-primary text-primary-foreground">
          <span className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/25" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary-foreground">
              <Trophy className="h-5 w-5 text-accent" />
              Fidelidade Dona Lu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-serif text-3xl font-semibold">Programa ativo</p>
            <p className="mt-2 text-sm text-primary-foreground/80">
              Acumule recompensas a cada encomenda e desbloqueie benefícios exclusivos.
            </p>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-accent" style={{ width: "35%" }} />
            </div>
            <Button className="mt-4 w-full" variant="secondary" asChild>
              <Link to="/cliente/fidelidade">Ver benefícios</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-gold" />
              Cupons disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-serif text-3xl font-semibold text-primary">{coupons.length}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Use em encomendas futuras e campanhas especiais da doceria.
            </p>
            <Button className="mt-4 w-full" variant="outline" asChild>
              <Link to="/cliente/cupons">Ver cupons</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-gold" />
              Acompanhe a doceria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Promoções, bastidores e novidades nas redes sociais.
            </p>
            <SocialLinks />
          </CardContent>
        </Card>
      </section>

      {/* PRODUTOS DA SEMANA - CARROSSEL */}
      <section>
        <SectionTitle
          icon={<CalendarDays className="h-5 w-5" />}
          title="Produtos da Semana"
          subtitle="Deslize para conhecer as novidades"
        />
        <div className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-3">
          {products.map((product) => (
            <div key={product.id} className="w-64 shrink-0 snap-start sm:w-72">
              <ProductCard product={product} compact />
            </div>
          ))}
        </div>
      </section>

      {/* AVALIAÇÕES */}
      {compliments.length ? (
        <section>
          <SectionTitle
            icon={<Quote className="h-5 w-5" />}
            title="O que dizem nossos clientes"
            subtitle="Avaliações e depoimentos reais"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {compliments.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <Card className="h-full">
                  <CardContent className="flex h-full flex-col gap-4 p-5">
                    <div className="flex gap-0.5 text-accent">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star key={starIndex} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="flex-1 text-pretty text-sm leading-relaxed text-foreground/90">
                      “{item.message}”
                    </p>
                    <div className="flex items-center gap-3 border-t border-border/70 pt-4">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                        {getInitials(item.title || "Cliente")}
                      </span>
                      <p className="text-sm font-semibold">{item.title || "Cliente Dona Lu"}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      ) : null}

      {/* PRODUTOS DO DIA + AVISOS */}
      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-gold" />
              Produtos do Dia
            </CardTitle>
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
              <BellRing className="h-5 w-5 text-gold" />
              Avisos da Doceria
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="rounded-xl border border-border/70 bg-secondary/40 p-4 transition hover:bg-secondary/70"
              >
                <p className="font-semibold">{notification.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
