import { GoogleGenAI } from "@google/genai";
import { createFileRoute } from "@tanstack/react-router";
import { createUIMessageStream, createUIMessageStreamResponse } from "ai";
import { buildListenfySystemPrompt, LISTENFY_FAQ } from "@/lib/listenfy-knowledge";

type ChatMessagePart = { type?: string; text?: string } | string;

type IncomingMessage = {
  role?: string;
  parts?: ChatMessagePart[];
  content?: string;
};

type ChatRequestBody = {
  messages?: IncomingMessage[];
};

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

function convertMessagesToGemini(messages: IncomingMessage[]) {
  const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

  for (const msg of messages) {
    if (!msg || !msg.role) continue;
    if (msg.role !== "user" && msg.role !== "assistant") continue;

    let text = "";
    if (typeof msg.content === "string") {
      text = msg.content;
    } else if (Array.isArray(msg.parts)) {
      text = msg.parts
        .map((part) => {
          if (typeof part === "string") return part;
          if (part && typeof part.text === "string") return part.text;
          return "";
        })
        .join("");
    }

    const trimmed = text.trim();
    if (!trimmed) continue;

    const role: "user" | "model" = msg.role === "assistant" ? "model" : "user";

    const last = contents[contents.length - 1];
    if (last && last.role === role && last.parts[0]) {
      last.parts[0].text += `\n\n${trimmed}`;
    } else {
      contents.push({
        role,
        parts: [{ text: trimmed }],
      });
    }
  }

  // Gemini requires the first message to be from 'user'
  while (contents.length > 0 && contents[0] && contents[0].role === "model") {
    contents.shift();
  }

  return contents;
}

function findFaqAnswer(userQuestion: string): string | null {
  const norm = userQuestion
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .trim();

  if (!norm) return null;

  for (const entry of LISTENFY_FAQ) {
    const entryNorm = entry.question
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, " ")
      .trim();

    if (norm === entryNorm || norm.includes(entryNorm) || entryNorm.includes(norm)) {
      return entry.answer;
    }
  }

  if (norm.includes("como funciona") && norm.includes("listenfy")) {
    const found = LISTENFY_FAQ.find((f) => f.question.toLowerCase().includes("como funciona"));
    return found ? found.answer : null;
  }
  if ((norm.includes("o que e") || norm.includes("quem e")) && norm.includes("listenfy")) {
    const found = LISTENFY_FAQ.find((f) => f.question.toLowerCase().includes("o que e o listenfy"));
    return found ? found.answer : null;
  }
  if (norm.includes("marcar") && (norm.includes("demonstracao") || norm.includes("reuniao"))) {
    return "Podes marcar uma demonstração diretamente através do calendário disponível no site. Escolhe uma data e hora disponíveis e confirma a reunião. 📅\n\n[[SCHEDULE_DEMO]]";
  }

  return null;
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: ChatRequestBody;
        try {
          body = (await request.json()) as ChatRequestBody;
        } catch {
          return new Response("Invalid JSON body", { status: 400 });
        }

        const { messages } = body;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const contents = convertMessagesToGemini(messages);
        if (contents.length === 0) {
          return new Response("No valid messages provided", { status: 400 });
        }

        const lastUserText = contents[contents.length - 1]?.parts[0]?.text ?? "";

        const ai = getGeminiClient();
        if (!ai) {
          console.error("[listenfy-ai] GEMINI_API_KEY is not configured on the server");
          const directFaq = findFaqAnswer(lastUserText);
          const fallbackText =
            directFaq ||
            "O serviço de inteligência artificial não está configurado no servidor. Por favor, verifica as variáveis de ambiente.";

          const stream = createUIMessageStream({
            execute: ({ writer }) => {
              const textPartId = `text-${Date.now()}`;
              writer.write({ type: "text-start", id: textPartId });
              writer.write({
                type: "text-delta",
                id: textPartId,
                delta: fallbackText,
              });
              writer.write({ type: "text-end", id: textPartId });
            },
          });
          return createUIMessageStreamResponse({ stream });
        }

        // Use gemini-3.1-flash-lite as the default conversational model for low-latency & high reliability
        const preferredModel = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
        const fallbackModel = "gemini-3.1-flash-lite";

        const abortSignal = request.signal && !request.signal.aborted ? request.signal : undefined;

        try {
          let responseStream;

          try {
            responseStream = await ai.models.generateContentStream({
              model: preferredModel,
              contents,
              config: {
                systemInstruction: buildListenfySystemPrompt(),
                abortSignal,
              },
            });
          } catch (firstError) {
            if (firstError instanceof Error && firstError.name === "AbortError") {
              return new Response(null, { status: 499 });
            }

            console.warn(
              `[listenfy-ai] Primary model '${preferredModel}' failed:`,
              firstError instanceof Error ? firstError.message : String(firstError),
            );

            if (preferredModel !== fallbackModel) {
              console.log(`[listenfy-ai] Falling back to model '${fallbackModel}'...`);
              responseStream = await ai.models.generateContentStream({
                model: fallbackModel,
                contents,
                config: {
                  systemInstruction: buildListenfySystemPrompt(),
                  abortSignal,
                },
              });
            } else {
              throw firstError;
            }
          }

          const stream = createUIMessageStream({
            execute: async ({ writer }) => {
              const textPartId = `text-${Date.now()}`;
              writer.write({ type: "text-start", id: textPartId });

              for await (const chunk of responseStream) {
                const text = chunk.text;
                if (text) {
                  writer.write({ type: "text-delta", id: textPartId, delta: text });
                }
              }

              writer.write({ type: "text-end", id: textPartId });
            },
            onError: (err) => {
              console.error(
                "[listenfy-ai] Gemini stream error:",
                err instanceof Error ? err.message : err,
              );
              return "Desculpa, ocorreu um erro ao gerar a resposta. Tenta novamente.";
            },
          });

          return createUIMessageStreamResponse({ stream });
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") {
            return new Response(null, { status: 499 });
          }

          console.error(
            "[listenfy-ai] Gemini API request failed:",
            error instanceof Error ? error.message : String(error),
          );

          const directFaq = findFaqAnswer(lastUserText);
          const fallbackText =
            directFaq ||
            "Desculpa, estou com uma instabilidade temporária no serviço de IA. Por favor, tenta novamente dentro de instantes.";

          const stream = createUIMessageStream({
            execute: ({ writer }) => {
              const textPartId = `text-${Date.now()}`;
              writer.write({ type: "text-start", id: textPartId });
              writer.write({
                type: "text-delta",
                id: textPartId,
                delta: fallbackText,
              });
              writer.write({ type: "text-end", id: textPartId });
            },
          });
          return createUIMessageStreamResponse({ stream });
        }
      },
    },
  },
});
