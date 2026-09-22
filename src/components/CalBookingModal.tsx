import { getCalApi } from "@calcom/embed-react";
import { X } from "lucide-react";
import { Suspense, lazy, useEffect } from "react";

const Cal = lazy(() =>
  import("@calcom/embed-react").then((mod) => ({ default: mod.default })),
);

type CalBookingModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function CalBookingModal({ open, onClose }: CalBookingModalProps) {
  useEffect(() => {
    if (!open) return;

    (async () => {
      const cal = await getCalApi({ embedJsUrl: "https://app.cal.com/embed/embed.js" });
      cal("ui", {
        theme: "dark",
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Agendar reunião"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative flex h-[85dvh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-border bg-popover shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-bold">Agendar reunião</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar agendamento"
            className="grid size-9 place-items-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1">
          <Suspense
            fallback={
              <div className="grid h-full place-items-center text-sm text-muted-foreground">
                A carregar o calendário…
              </div>
            }
          >
            <Cal
              calLink="tomas-coias-u5rdfj/listenfy"
              style={{ width: "100%", height: "100%", overflow: "scroll" }}
              config={{ layout: "month_view", theme: "dark" }}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
