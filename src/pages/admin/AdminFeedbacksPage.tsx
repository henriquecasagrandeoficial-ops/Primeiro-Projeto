import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/form";
import { useAppStore } from "@/store/appStore";
import type { FeedbackCategory, FeedbackStatus } from "@/types";
import { formatDate } from "@/utils/formatters";

const categoryLabel: Record<FeedbackCategory, string> = {
  suggestion: "Sugestão",
  complaint: "Reclamação",
  compliment: "Elogio",
};

const statusLabel: Record<FeedbackStatus, string> = {
  new: "Novo",
  reviewing: "Em análise",
  resolved: "Resolvido",
};

export function AdminFeedbacksPage() {
  const feedbacks = useAppStore((state) => state.feedbacks);
  const updateFeedbackStatus = useAppStore((state) => state.updateFeedbackStatus);
  const [category, setCategory] = useState<FeedbackCategory | "all">("all");
  const [responseById, setResponseById] = useState<Record<string, string>>({});

  const filteredFeedbacks = feedbacks.filter(
    (feedback) => category === "all" || feedback.category === category,
  );

  return (
    <div>
      <PageHeader
        title="Gerenciamento de Feedbacks"
        description="Visualize, filtre, altere status e responda mensagens dos clientes."
      />

      <Card className="mb-5">
        <CardContent className="grid gap-4 p-4 sm:grid-cols-[260px_1fr] sm:items-end">
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as FeedbackCategory | "all")
              }
            >
              <option value="all">Todas</option>
              <option value="suggestion">Sugestões</option>
              <option value="complaint">Reclamações</option>
              <option value="compliment">Elogios</option>
            </Select>
          </div>
          <Input disabled value={`${filteredFeedbacks.length} feedbacks encontrados`} />
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredFeedbacks.map((feedback) => (
          <Card key={feedback.id}>
            <CardContent className="space-y-4 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold">{feedback.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(feedback.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{categoryLabel[feedback.category]}</Badge>
                  <Badge>{statusLabel[feedback.status]}</Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{feedback.message}</p>
              <Textarea
                placeholder="Responder feedback..."
                value={responseById[feedback.id] ?? feedback.response ?? ""}
                onChange={(event) =>
                  setResponseById((current) => ({
                    ...current,
                    [feedback.id]: event.target.value,
                  }))
                }
              />
              <div className="flex flex-wrap gap-2">
                {(["new", "reviewing", "resolved"] as FeedbackStatus[]).map((status) => (
                  <Button
                    key={status}
                    variant={feedback.status === status ? "default" : "outline"}
                    onClick={() => {
                      updateFeedbackStatus(
                        feedback.id,
                        status,
                        responseById[feedback.id] ?? feedback.response,
                      );
                      toast.success("Feedback atualizado.");
                    }}
                  >
                    {statusLabel[status]}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
