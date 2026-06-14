import { Trophy } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/ui/skeleton";

export function ClientLoyaltyPage() {
  return (
    <div>
      <PageHeader
        title="Programa de Fidelidade"
        description="Seu programa de fidelidade será carregado diretamente do Firebase."
      />

      <EmptyState
        title="Fidelidade em implantação"
        description="Nenhum benefício foi cadastrado no Firebase para sua conta ainda."
        action={<Trophy className="mx-auto h-8 w-8 text-primary" />}
      />
    </div>
  );
}
