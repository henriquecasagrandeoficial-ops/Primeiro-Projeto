import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldError, Input, Label, Select, Textarea } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthProvider";
import { useFeedbackMutations, useFeedbacks } from "@/hooks/useFeedbacks";
import type { FeedbackCategory } from "@/types";
import { formatDate } from "@/utils/formatters";

const schema = z.object({
  title: z.string().min(3, "Informe um título."),
  category: z.enum(["suggestion", "complaint", "compliment"]),
  message: z.string().min(10, "Descreva melhor sua mensagem."),
});

type FeedbackForm = z.infer<typeof schema>;

const categoryLabel: Record<FeedbackCategory, string> = {
  suggestion: "Sugestão",
  complaint: "Reclamação",
  compliment: "Elogio",
};

export function ClientFeedbackPage() {
  const { user } = useAuth();
  const { data: feedbacks = [] } = useFeedbacks();
  const { createFeedback } = useFeedbackMutations();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FeedbackForm>({
    resolver: zodResolver(schema),
    defaultValues: { category: "suggestion" },
  });

  const userFeedbacks = feedbacks.filter((feedback) => feedback.userId === user?.id);

  const onSubmit = async (data: FeedbackForm) => {
    if (!user) return;

    await createFeedback.mutateAsync({
      id: crypto.randomUUID(),
      userId: user.id,
      status: "new",
      createdAt: new Date().toISOString().slice(0, 10),
      ...data,
    });
    reset({ title: "", message: "", category: "suggestion" });
    toast.success("Feedback enviado para a doceria.");
  };

  return (
    <div>
      <PageHeader
        title="Feedbacks"
        description="Envie sugestões, reclamações ou elogios e acompanhe seu histórico."
      />

      <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Novo feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input id="title" placeholder="Ex: Nova sugestão" {...register("title")} />
                <FieldError message={errors.title?.message} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select id="category" {...register("category")}>
                  <option value="suggestion">Sugestão</option>
                  <option value="complaint">Reclamação</option>
                  <option value="compliment">Elogio</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea
                  id="message"
                  placeholder="Conte para a Dona Lu como podemos melhorar."
                  {...register("message")}
                />
                <FieldError message={errors.message?.message} />
              </div>
              <Button className="w-full">
                <Send className="h-4 w-4" />
                Enviar feedback
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Histórico enviado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {userFeedbacks.map((feedback) => (
              <div key={feedback.id} className="rounded-xl border p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">{feedback.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(feedback.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">
                      {categoryLabel[feedback.category]}
                    </Badge>
                    <Badge>{feedback.status}</Badge>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{feedback.message}</p>
                {feedback.response ? (
                  <p className="mt-3 rounded-lg bg-secondary p-3 text-sm">
                    Resposta: {feedback.response}
                  </p>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
