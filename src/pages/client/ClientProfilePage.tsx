import { Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/form";
import { useAppStore } from "@/store/appStore";
import { getInitials } from "@/utils/formatters";

export function ClientProfilePage() {
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [theme, setTheme] = useState(user?.preferences.theme ?? "light");
  const [notifications, setNotifications] = useState(
    user?.preferences.notifications ?? true,
  );

  const save = () => {
    if (!user) return;
    setUser({
      ...user,
      name,
      email,
      preferences: {
        theme,
        notifications,
      },
    });
    toast.success("Perfil atualizado.");
  };

  return (
    <div>
      <PageHeader
        title="Perfil e Configurações"
        description="Atualize seus dados, preferências e configurações de conta."
        action={
          <Button onClick={save}>
            <Save className="h-4 w-4" />
            Salvar
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-secondary text-3xl font-black text-primary">
              {getInitials(name || "Cliente")}
            </div>
            <h2 className="mt-4 text-xl font-bold">{name}</h2>
            <p className="text-sm text-muted-foreground">{email}</p>
            <Button variant="outline" className="mt-5 w-full">
              Alterar foto
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Dados pessoais</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" placeholder="Nova senha" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferências</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="theme">Tema</Label>
                <Select
                  id="theme"
                  value={theme}
                  onChange={(event) => setTheme(event.target.value as "light" | "dark")}
                >
                  <option value="light">Claro</option>
                  <option value="dark">Escuro</option>
                </Select>
              </div>
              <label className="flex items-center gap-3 rounded-xl border p-4">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(event) => setNotifications(event.target.checked)}
                />
                <span>
                  <strong className="block">Notificações</strong>
                  <span className="text-sm text-muted-foreground">
                    Receber novidades e avisos da doceria.
                  </span>
                </span>
              </label>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
