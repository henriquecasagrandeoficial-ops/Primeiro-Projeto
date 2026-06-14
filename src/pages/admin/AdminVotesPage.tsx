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
import { useAppStore } from "@/store/appStore";
import { formatDate } from "@/utils/formatters";

export function AdminVotesPage() {
  const votes = useAppStore((state) => state.votes);
  const addVote = useAppStore((state) => state.addVote);
  const addVoteOption = useAppStore((state) => state.addVoteOption);
  const closeVote = useAppStore((state) => state.closeVote);
  const publishVoteResult = useAppStore((state) => state.publishVoteResult);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [optionDialog, setOptionDialog] = useState<string | null>(null);
  const [optionName, setOptionName] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: new Date().toISOString().slice(0, 10),
    endDate: "",
  });

  const createVote = () => {
    if (!form.title || !form.endDate) {
      toast.error("Informe título e data de término.");
      return;
    }

    addVote({
      id: crypto.randomUUID(),
      title: form.title,
      description: form.description,
      startDate: form.startDate,
      endDate: form.endDate,
      status: "active",
      options: [],
      resultPublished: false,
    });
    setDialogOpen(false);
    setForm({ title: "", description: "", startDate: form.startDate, endDate: "" });
    toast.success("Votação criada.");
  };

  const saveOption = () => {
    if (!optionDialog || !optionName) return;
    addVoteOption(optionDialog, optionName);
    setOptionDialog(null);
    setOptionName("");
    toast.success("Opção adicionada.");
  };

  return (
    <div>
      <PageHeader
        title="Gerenciamento de Votações"
        description="Crie votações, adicione opções, encerre ciclos e publique vencedores."
        action={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Criar votação
          </Button>
        }
      />

      <div className="grid gap-5">
        {votes.map((vote) => {
          const winner = [...vote.options].sort((a, b) => b.votes - a.votes)[0];
          const total = vote.options.reduce((sum, option) => sum + option.votes, 0);

          return (
            <Card key={vote.id}>
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle>{vote.title}</CardTitle>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {vote.description}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(vote.startDate)} até {formatDate(vote.endDate)}
                    </p>
                  </div>
                  <Badge variant={vote.status === "active" ? "success" : "secondary"}>
                    {vote.status === "active" ? "Ativa" : "Encerrada"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {vote.options.map((option) => {
                  const percentage = total ? Math.round((option.votes / total) * 100) : 0;

                  return (
                    <div key={option.id}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="font-medium">{option.productName}</span>
                        <span className="text-muted-foreground">
                          {option.votes} votos · {percentage}%
                        </span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  );
                })}

                {vote.resultPublished && winner ? (
                  <div className="rounded-xl bg-secondary p-4 text-sm">
                    Resultado publicado: <strong>{winner.productName}</strong>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => setOptionDialog(vote.id)}>
                    Adicionar opção
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={vote.status === "closed"}
                    onClick={() => {
                      closeVote(vote.id);
                      toast.success("Votação encerrada.");
                    }}
                  >
                    Encerrar votação
                  </Button>
                  <Button
                    disabled={!winner || vote.resultPublished}
                    onClick={() => {
                      publishVoteResult(vote.id);
                      toast.success("Resultado publicado.");
                    }}
                  >
                    Publicar resultado
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog
        open={dialogOpen}
        title="Criar votação"
        confirmLabel="Criar"
        onClose={() => setDialogOpen(false)}
        onConfirm={createVote}
      >
        <div className="grid gap-4">
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
            <Field label="Data de início">
              <Input
                type="date"
                value={form.startDate}
                onChange={(event) =>
                  setForm((state) => ({ ...state, startDate: event.target.value }))
                }
              />
            </Field>
            <Field label="Data de término">
              <Input
                type="date"
                value={form.endDate}
                onChange={(event) =>
                  setForm((state) => ({ ...state, endDate: event.target.value }))
                }
              />
            </Field>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={Boolean(optionDialog)}
        title="Adicionar opção"
        confirmLabel="Adicionar"
        onClose={() => setOptionDialog(null)}
        onConfirm={saveOption}
      >
        <Field label="Produto candidato">
          <Input
            value={optionName}
            placeholder="Ex: Torta de Limão"
            onChange={(event) => setOptionName(event.target.value)}
          />
        </Field>
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
