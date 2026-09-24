import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { askListenfyAI } from "@/components/chat/ListenfyChat";
import { LISTENFY_FAQ } from "@/lib/listenfy-knowledge";

export default function FaqSection() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="px-5 py-7 sm:px-8 lg:px-12">
      <h2 id="faq-title" className="text-2xl font-bold sm:text-3xl">Perguntas Frequentes</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Tens dúvidas sobre o Listenfy? Encontra aqui as respostas às perguntas mais frequentes.
      </p>
      <Accordion type="single" collapsible className="mt-5 max-w-3xl">
        {LISTENFY_FAQ.map((item, i) => (
          <AccordionItem key={item.question} value={`faq-${i}`} className="border-border">
            <AccordionTrigger className="text-left font-semibold hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-6 text-muted-foreground">
              <p>{item.answer}</p>
              <button
                type="button"
                onClick={() => askListenfyAI(item.question)}
                aria-label={`Perguntar ao Listenfy AI: ${item.question}`}
                className="mt-3 rounded-full px-0 text-xs font-bold text-primary hover:underline"
              >
                💬 Perguntar ao Listenfy AI
              </button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
