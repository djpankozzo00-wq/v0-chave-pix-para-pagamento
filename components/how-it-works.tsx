import { MousePointerClick, Link, CreditCard, Rocket } from "lucide-react"

const steps = [
  {
    icon: MousePointerClick,
    title: "Escolha o servico",
    description:
      "Selecione a plataforma, o tipo de servico e a quantidade desejada.",
  },
  {
    icon: Link,
    title: "Informe seu perfil",
    description:
      "Cole o link do seu perfil ou publicacao. Nao pedimos sua senha.",
  },
  {
    icon: CreditCard,
    title: "Realize o pagamento",
    description:
      "Pague via PIX de forma rapida e segura. Confirmacao instantanea.",
  },
  {
    icon: Rocket,
    title: "Receba seus resultados",
    description:
      "A entrega comeca automaticamente apos a confirmacao do pagamento.",
  },
]

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="border-t border-border bg-secondary/50 py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground font-mono md:text-4xl">
            Como Funciona
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Em apenas 4 passos simples, voce impulsiona suas redes sociais.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="relative text-center">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute top-8 left-[calc(50%+28px)] hidden h-px w-[calc(100%-56px)] bg-border md:block" />
              )}
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="mt-1 text-xs font-medium text-primary font-mono">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-3 text-base font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
