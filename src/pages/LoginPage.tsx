import { zodResolver } from "@hookform/resolvers/zod";
import { Apple, ArrowRight, CakeSlice, Globe, Lock, Mail, Share2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldError, Input, Label } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthProvider";
import type { UserRole } from "@/types";
import { cn } from "@/utils/cn";

const schema = z.object({
  email: z.string().email("Informe um e-mail válido."),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres."),
  remember: z.boolean().optional(),
});

type LoginForm = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const [role, setRole] = useState<UserRole>("client");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      const user = await login(data);
      if (user.role !== role) {
        await logout();
        toast.error("Este usuário não pertence ao perfil selecionado.");
        return;
      }

      toast.success(`Bem-vindo, ${user.name}!`);
      navigate(role === "admin" ? "/admin" : "/cliente", { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao entrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1fr_480px] lg:items-center">
        <section className="space-y-8">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-accent/40 bg-card px-4 py-2 text-sm font-semibold text-primary shadow-soft">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground">
              <CakeSlice className="h-3.5 w-3.5" />
            </span>
            Doceria Dona Lu
          </div>
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              <span className="h-px w-7 bg-accent" aria-hidden="true" />
              Doces artesanais premium
            </span>
            <h1 className="max-w-3xl text-balance font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
              Cada detalhe pensado para <span className="text-primary">adoçar</span> a sua experiência.
            </h1>
            <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Acesse a área do cliente ou o painel administrativo. Cardápio,
              fidelidade, votações e encomendas em um só lugar.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { title: "Cardápio premium", desc: "Vitrine artesanal completa." },
              { title: "Votações", desc: "Escolha os próximos sabores." },
              { title: "Fidelidade", desc: "Recompensas exclusivas." },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border/70 bg-card p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-elevated"
              >
                <p className="font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle>Entrar no sistema</CardTitle>
            <CardDescription>
              Escolha o perfil e informe seus dados para continuar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid gap-2 sm:grid-cols-3">
              {[
                { icon: <Globe className="h-4 w-4" />, label: "Google" },
                { icon: <Apple className="h-4 w-4" />, label: "Apple" },
                { icon: <Share2 className="h-4 w-4" />, label: "Facebook" },
              ].map((item) => (
                <Button key={item.label} variant="outline" disabled className="min-h-11">
                  {item.icon}
                  {item.label}
                </Button>
              ))}
            </div>

            <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-secondary p-1">
              {[
                { value: "client", label: "Cliente" },
                { value: "admin", label: "Administrador" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-semibold transition",
                    role === item.value
                      ? "bg-card text-primary shadow-sm"
                      : "text-muted-foreground",
                  )}
                  onClick={() => setRole(item.value as UserRole)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-9"
                    placeholder="voce@email.com"
                    autoComplete="email"
                    inputMode="email"
                    aria-invalid={Boolean(errors.email)}
                    {...register("email")}
                  />
                </div>
                <FieldError message={errors.email?.message} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-9"
                    placeholder="Sua senha"
                    autoComplete="current-password"
                    aria-invalid={Boolean(errors.password)}
                    {...register("password")}
                  />
                </div>
                <FieldError message={errors.password?.message} />
              </div>

              <div className="flex items-center justify-between gap-3 text-sm">
                <label className="flex items-center gap-2 text-muted-foreground">
                  <input type="checkbox" className="h-4 w-4" {...register("remember")} />
                  Lembrar usuário
                </label>
                <Link to="/forgot-password" className="font-semibold text-primary">
                  Recuperar senha
                </Link>
              </div>

              <Button className="w-full" size="lg" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
            <div className="mt-5 rounded-xl border bg-secondary/50 p-4 text-center text-sm">
              <p className="text-muted-foreground">Ainda não possui cadastro?</p>
              <Button className="mt-3 w-full" variant="outline" asChild>
                <Link to="/register">Criar Conta</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
