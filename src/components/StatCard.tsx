import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

export function StatCard({
  title,
  value,
  icon,
  helper,
}: {
  title: string;
  value: string | number;
  icon: ReactNode;
  helper?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-elevated">
        <span className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/10 transition-transform duration-500 group-hover:scale-150" />
        <CardContent className="relative flex items-center justify-between gap-4 p-5">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {title}
            </p>
            <p className="mt-2 truncate font-serif text-3xl font-semibold tracking-tight">{value}</p>
            {helper ? <p className="mt-1.5 text-xs text-muted-foreground">{helper}</p> : null}
          </div>
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-secondary text-primary ring-1 ring-inset ring-accent/40">
            {icon}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
