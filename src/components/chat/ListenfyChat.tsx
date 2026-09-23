import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { CalendarDays, MessageCircle, Music4, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import { SCHEDULE_DEMO_MARKER } from "@/lib/listenfy-knowledge";
import { cn } from "@/lib/utils";

const ASK_EVENT = "listenfy-ai:ask";

/** Opens the assistant and sends `question` — usable from anywhere (e.g. a FAQ item). */
export function askListenfyAI(question: string) {
  window.dispatchEvent(new CustomEvent<string>(ASK_EVENT, { detail: question }));
}

const QUICK_ACTIONS = [
  { label: "❓ How does Listenfy work?", prompt: "How does Listenfy work?" },
  { label: "🎵 Recommend me some music", prompt: "Recommend me some music based on my preferences." },
  { label: "🎧 Create a playlist", prompt: "Create a playlist idea for me." },
  { label: "🔎 Explore an artist", prompt: "Help me explore an artist I might like." },
];

const GREETING =
  "Hey! 👋 I'm Listenfy AI.\n\nI can help you discover music, explore artists and albums, create playlist ideas, or answer questions about Listenfy.\n\nWhat would you like to do?";

type ListenfyChatProps = {
  onScheduleDemo: () => void;
};

export default function ListenfyChat({ onScheduleDemo }: ListenfyChatProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status, error } = useChat({ transport });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const busy = status === "submitted" || status === "streaming";

  const ask = useCallback(
    (text: string) => {
      const value = text.trim();
      if (!value || busy) return;
      setInput("");
      void sendMessage({ text: value });
    },
    [busy, sendMessage],
  );

  useEffect(() => {
    const onAsk = (event: Event) => {
      setOpen(true);
      ask((event as CustomEvent<string>).detail);
    };
    window.addEventListener(ASK_EVENT, onAsk);
    return () => window.removeEventListener(ASK_EVENT, onAsk);
  }, [ask]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    const id = window.setTimeout(() => textareaRef.current?.focus(), 120);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(id);
    };
  }, [open, status]);

  return (
    <>
      {open && (
        <section
          role="dialog"
          aria-label="Listenfy AI"
          className={cn(
            "fixed bottom-[76px] right-4 z-[120] flex w-[calc(100vw-24px)] flex-col overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl",
            "h-[min(550px,calc(100dvh-140px))] sm:bottom-[90px] sm:right-6 sm:w-[380px] sm:max-w-[calc(100vw-32px)]",
          )}
        >
          <header className="flex items-start gap-3 border-b border-border px-4 py-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
              <Music4 className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-bold">Listenfy AI</h2>
              <p className="truncate text-xs text-muted-foreground">Your personal music assistant</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar Listenfy AI"
              className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </header>

          <Conversation className="min-h-0 flex-1">
            <ConversationContent className="gap-3 p-4">
              <Message from="assistant">
                <MessageContent>
                  <MessageResponse>{GREETING}</MessageResponse>
                </MessageContent>
              </Message>

              {messages.length === 0 && (
                <div className="flex flex-wrap gap-2 pl-1">
                  {QUICK_ACTIONS.map((action) => (
                    <button
                      key={action.prompt}
                      type="button"
                      onClick={() => ask(action.prompt)}
                      className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((message) => {
                const text = message.parts
                  .map((part) => (part.type === "text" ? part.text : ""))
                  .join("");
                const wantsDemo = text.includes(SCHEDULE_DEMO_MARKER);
                const clean = text.replaceAll(SCHEDULE_DEMO_MARKER, "").trim();
                if (!clean && !wantsDemo) return null;
                return (
                  <div key={message.id} className="flex flex-col gap-2">
                    <Message from={message.role === "user" ? "user" : "assistant"}>
                      <MessageContent>
                        <MessageResponse>{clean}</MessageResponse>
                      </MessageContent>
                    </Message>
                    {message.role === "assistant" && wantsDemo && (
                      <Button
                        type="button"
                        onClick={onScheduleDemo}
                        className="w-fit rounded-full bg-primary px-4 font-bold text-primary-foreground hover:bg-primary/90"
                      >
                        <CalendarDays /> Schedule a demo
                      </Button>
                    )}
                  </div>
                );
              })}

              {status === "submitted" && (
                <Shimmer className="pl-1 text-xs">Listenfy AI is typing…</Shimmer>
              )}

              {error && (
                <p className="rounded-md bg-secondary px-3 py-2 text-xs text-muted-foreground">
                  Sorry, I couldn&apos;t process that request right now. Please try again.
                </p>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          <div className="border-t border-border p-3">
            <PromptInput
              onSubmit={(message, event) => {
                event.preventDefault();
                ask(message.text ?? input);
              }}
            >
              <PromptInputTextarea
                ref={textareaRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask me about music or Listenfy..."
              />
              <PromptInputFooter className="justify-end">
                <PromptInputSubmit status={status} disabled={!input.trim() || busy} />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Fechar Listenfy AI" : "Abrir Listenfy AI"}
        aria-expanded={open}
        className={cn(
          "fixed bottom-4 right-4 z-[120] grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-xl",
          "transition-transform duration-200 hover:scale-105 active:scale-95 sm:bottom-6 sm:right-6",
        )}
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>
    </>
  );
}
