import { useRef, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitPedido } from "@/lib/pedidos.functions";
import { pedidoSchema } from "@/lib/pedidos.schema";

type Fields = { nome: string; email: string; pedido: string };
type Errors = Partial<Record<keyof Fields, string>>;

export default function RecommendationSection() {
  const submit = useServerFn(submitPedido);
  const [values, setValues] = useState<Fields>({ nome: "", email: "", pedido: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const requestId = useRef<string | null>(null);
  const inFlight = useRef(false);

  const update = (key: keyof Fields, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    // Content changed → it's a new request, not a retry.
    requestId.current = null;
    if (status === "success" || status === "error") setStatus("idle");
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (inFlight.current) return;
    requestId.current ??= crypto.randomUUID();
    const parsed = pedidoSchema.safeParse({ ...values, requestId: requestId.current });
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof Fields;
        if (k in values && !next[k]) next[k] = issue.message;
      }
      setErrors(next);
      return;
    }
    inFlight.current = true;
    setStatus("loading");
    try {
      const res = await submit({ data: parsed.data });
      if (res.ok) {
        setStatus("success");
        setMessage("O seu pedido foi recebido com sucesso.");
        setValues({ nome: "", email: "", pedido: "" });
        requestId.current = null;
      } else {
        setStatus("error");
        setMessage(res.error);
      }
    } catch {
      setStatus("error");
      setMessage("Ocorreu um erro de ligação. Verifica a tua internet e tenta novamente.");
    } finally {
      inFlight.current = false;
    }
  };

  const loading = status === "loading";
  const fieldClass =
    "mt-2 rounded-md border-transparent bg-secondary shadow-none focus-visible:ring-2";

  return (
    <section
      id="recomendacao"
      aria-labelledby="recomendacao-title"
      className="px-5 py-7 sm:px-8 lg:px-12"
    >
      <h2 id="recomendacao-title" className="text-2xl font-bold sm:text-3xl">
        Pede uma recomendação
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Conta-nos o que estás à procura e o Listenfy poderá ajudar-te a descobrir música.
      </p>
      <form
        onSubmit={onSubmit}
        noValidate
        className="mt-5 grid max-w-3xl gap-4 rounded-md bg-sidebar p-5 sm:grid-cols-2"
      >
        <div>
          <label htmlFor="rec-nome" className="text-sm font-bold">
            Nome
          </label>
          <Input
            id="rec-nome"
            value={values.nome}
            maxLength={100}
            autoComplete="name"
            disabled={loading}
            onChange={(e) => update("nome", e.target.value)}
            aria-invalid={!!errors.nome}
            className={`h-11 ${fieldClass}`}
          />
          {errors.nome && <p className="mt-1 text-xs text-destructive">{errors.nome}</p>}
        </div>
        <div>
          <label htmlFor="rec-email" className="text-sm font-bold">
            Email
          </label>
          <Input
            id="rec-email"
            type="email"
            value={values.email}
            maxLength={255}
            autoComplete="email"
            disabled={loading}
            onChange={(e) => update("email", e.target.value)}
            aria-invalid={!!errors.email}
            className={`h-11 ${fieldClass}`}
          />
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="rec-pedido" className="text-sm font-bold">
            Pedido
          </label>
          <textarea
            id="rec-pedido"
            value={values.pedido}
            maxLength={2000}
            rows={4}
            disabled={loading}
            placeholder="Ex.: Quero músicas calmas para estudar, de preferência indie."
            onChange={(e) => update("pedido", e.target.value)}
            aria-invalid={!!errors.pedido}
            className={`block w-full resize-y px-3 py-2 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50 ${fieldClass}`}
          />
          {errors.pedido && <p className="mt-1 text-xs text-destructive">{errors.pedido}</p>}
        </div>
        <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Usamos o teu nome, email e pedido apenas para responder à tua recomendação. Não
            partilhamos os teus dados.
          </p>
          <Button
            type="submit"
            disabled={loading}
            className="h-11 shrink-0 rounded-full px-6 font-bold"
          >
            {loading ? "A enviar…" : "Pedir recomendação"}
          </Button>
        </div>
        {status === "success" && (
          <p role="status" className="text-sm font-semibold text-primary sm:col-span-2">
            {message}
          </p>
        )}
        {status === "error" && (
          <p role="alert" className="text-sm font-semibold text-destructive sm:col-span-2">
            {message}
          </p>
        )}
      </form>
    </section>
  );
}
