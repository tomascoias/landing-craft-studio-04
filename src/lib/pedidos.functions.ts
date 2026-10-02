import { createServerFn } from "@tanstack/react-start";
import { pedidoSchema } from "./pedidos.schema";
import { createPedido } from "./firestore.server";

export const submitPedido = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => pedidoSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      await createPedido(data.requestId, { nome: data.nome, email: data.email, pedido: data.pedido });
      return { ok: true as const, id: data.requestId };
    } catch (error) {
      console.error("[pedidos] save failed", error);
      return { ok: false as const, error: "Não foi possível guardar o teu pedido. Tenta novamente dentro de instantes." };
    }
  });
