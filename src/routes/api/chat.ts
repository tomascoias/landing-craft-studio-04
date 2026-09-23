import { createOpenAI } from "@ai-sdk/openai";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { buildListenfySystemPrompt } from "@/lib/listenfy-knowledge";

type ChatRequestBody = { messages?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) {
          return new Response("AI is not configured", { status: 500 });
        }

        const initialRunId = request.headers.get("X-Lovable-AIG-Run-ID");
        let runId = initialRunId;
        const runIdFetch: typeof fetch = async (input, init) => {
          const headers = new Headers(init?.headers);
          if (runId) headers.set("X-Lovable-AIG-Run-ID", runId);
          const response = await fetch(input, { ...init, headers });
          runId = response.headers.get("X-Lovable-AIG-Run-ID") ?? runId;
          return response;
        };

        const lovable = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey: key,
          headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
          fetch: runIdFetch,
        });

        try {
          const result = streamText({
            model: lovable.responses("openai/gpt-6-astra"),
            system: buildListenfySystemPrompt(),
            messages: await convertToModelMessages(messages as UIMessage[]),
            providerOptions: {
              openai: {
                forceReasoning: true,
                reasoningEffort: "low",
                reasoningSummary: "auto",
                store: false,
                include: ["reasoning.encrypted_content"],
              },
            },
            abortSignal: request.signal,
          });

          return result.toUIMessageStreamResponse({
            originalMessages: messages as UIMessage[],
          });
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") {
            return new Response(null, { status: 499 });
          }
          console.error("[listenfy-ai] chat failed", error);
          return new Response("AI request failed", { status: 500 });
        }
      },
    },
  },
});
