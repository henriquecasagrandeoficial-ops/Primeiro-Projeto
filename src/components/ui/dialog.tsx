import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

type DialogProps = {
  open: boolean;
  title: string;
  description?: string;
  children?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onClose: () => void;
  onConfirm?: () => void;
};

export function Dialog({
  open,
  title,
  description,
  children,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  destructive = false,
  onClose,
  onConfirm,
}: DialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div
        className={cn(
          "w-full max-w-lg rounded-xl border bg-card p-5 shadow-xl",
          "animate-in fade-in zoom-in-95",
        )}
      >
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">{title}</h2>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {children ? <div className="mt-5">{children}</div> : null}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            {cancelLabel}
          </Button>
          {onConfirm ? (
            <Button
              type="button"
              variant={destructive ? "destructive" : "default"}
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
