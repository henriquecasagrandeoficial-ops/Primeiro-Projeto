import { Trophy } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/store/appStore";
import { formatDate } from "@/utils/formatters";

export function ClientVotingPage() {
  const votes = useAppStore((state) => state.votes);
  const voteProduct = useAppStore((state) => state.vote);

  const handleVote = (voteId: string, optionId: string) => {
    voteProduct(voteId, optionId);
    toast.success("Voto registrado com sucesso!");
  };

  return (
    <div>
      <PageHeader
        title="Votação de Produtos"
        description="Vote no produto que você quer ver no cardápio. Cada cliente pode votar apenas uma vez por votação."
      />

      <div className="grid gap-5">
        {votes.map((vote) => {
          const total = vote.options.reduce((sum, option) => sum + option.votes, 0);
          const sortedOptions = [...vote.options].sort((a, b) => b.votes - a.votes);

          return (
            <Card key={vote.id}>
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle>{vote.title}</CardTitle>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {vote.description}
                    </p>
                  </div>
                  <Badge variant={vote.status === "active" ? "success" : "secondary"}>
                    Encerra em {formatDate(vote.endDate)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {sortedOptions.map((option, index) => {
                  const percentage = total ? Math.round((option.votes / total) * 100) : 0;
                  const selected = vote.userVotedOptionId === option.id;

                  return (
                    <div key={option.id} className="rounded-xl border p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="grid h-10 w-10 place-items-center rounded-full bg-secondary font-bold text-primary">
                            {index === 0 ? <Trophy className="h-5 w-5" /> : index + 1}
                          </div>
                          <div>
                            <p className="font-semibold">{option.productName}</p>
                            <p className="text-sm text-muted-foreground">
                              {option.votes} votos · {percentage}%
                            </p>
                          </div>
                        </div>
                        <Button
                          variant={selected ? "secondary" : "default"}
                          disabled={Boolean(vote.userVotedOptionId)}
                          onClick={() => handleVote(vote.id, option.id)}
                        >
                          {selected ? "Seu voto" : "Votar"}
                        </Button>
                      </div>
                      <div className="mt-4 h-3 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
