import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CakeSlice, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
import { loginMock } from "@/services/mockApi";
import { useAppStore } from "@/store/appStore";
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
  const setUser = useAppStore((state) => state.setUser);
  const [role, setRole] = useState<UserRole>("client");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "cliente@doceria.com",
      password: "123456",
      remember: true,
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      const user = await loginMock(data.email, role);
      setUser(user);
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
          <div className="inline-flex items-center gap-3 rounded-full border bg-card px-4 py-2 text-sm font-semibold text-primary">
            <CakeSlice className="h-4 w-4" />
            Doceria Dona Lu
          </div>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-balance text-4xl font-black tracking-tight text-primary sm:text-6xl">
              Gestão moderna para encantar clientes e organizar a doceria.
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Acesse a área do cliente ou o painel administrativo com dados
              simulados, cardápio, votações, feedbacks e gestão de produtos.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {["Cardápio completo", "Votações", "CRUD admin"].map((item) => (
              <div key={item} className="rounded-xl border bg-card p-4 shadow-sm">
                <p className="font-semibold">{item}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Fluxo pronto para integração futura.
                </p>
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
                <a href="#recuperar" className="font-semibold text-primary">
                  Recuperar senha
                </a>
              </div>

              <Button className="w-full" size="lg" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
