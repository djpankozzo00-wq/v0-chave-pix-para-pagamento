import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "E seguro comprar seguidores?",
    answer:
      "Sim! Utilizamos metodos seguros e discretos. Nunca pedimos sua senha e sua conta nao corre nenhum risco. Trabalhamos com tecnicas que seguem as diretrizes das plataformas.",
  },
  {
    question: "Quanto tempo demora a entrega?",
    answer:
      "A maioria dos pedidos comeca a ser entregue em ate 30 minutos apos a confirmacao do pagamento. Pedidos maiores podem levar ate 24 horas para entrega completa.",
  },
  {
    question: "Quais formas de pagamento voces aceitam?",
    answer:
      "Aceitamos PIX, que e a forma mais rapida e pratica. O pagamento e confirmado instantaneamente, permitindo que seu pedido comece a ser processado imediatamente.",
  },
  {
    question: "Os seguidores sao reais?",
    answer:
      "Trabalhamos com perfis de alta qualidade que possuem fotos e publicacoes. A qualidade varia conforme o servico escolhido, e oferecemos opcoes premium com perfis brasileiros.",
  },
  {
    question: "Voces oferecem garantia de reposicao?",
    answer:
      "Sim! Todos os nossos servicos possuem garantia de reposicao. Caso haja alguma queda, repomos automaticamente sem custo adicional dentro do periodo de garantia.",
  },
  {
    question: "Preciso informar minha senha?",
    answer:
      "Nao! Nunca pedimos senha de nenhuma conta. Precisamos apenas do link do seu perfil ou da publicacao que deseja impulsionar.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground font-mono md:text-4xl">
            Perguntas Frequentes
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Tire suas duvidas sobre nossos servicos.
          </p>
        </div>

        <Accordion type="single" collapsible className="mt-12">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-foreground">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
