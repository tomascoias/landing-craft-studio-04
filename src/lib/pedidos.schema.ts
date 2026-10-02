import { z } from "zod";

export const pedidoSchema = z.object({
  requestId: z.string().uuid({ message: "Pedido inválido. Atualiza a página e tenta novamente." }),
  nome: z
    .string()
    .trim()
    .min(1, { message: "Indica o teu nome." })
    .max(100, { message: "O nome deve ter no máximo 100 caracteres." }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Indica o teu email." })
    .max(255, { message: "O email deve ter no máximo 255 caracteres." })
    .email({ message: "Indica um email válido." }),
  pedido: z
    .string()
    .trim()
    .min(1, { message: "Descreve o teu pedido." })
    .max(2000, { message: "O pedido deve ter no máximo 2000 caracteres." }),
});

export type PedidoInput = z.infer<typeof pedidoSchema>;
