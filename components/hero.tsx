import { ArrowRight, Shield, Clock, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

const stats = [
  { value: "50K+", label: "Pedidos entregues" },
  { value: "99.8%", label: "Taxa de entrega" },
  { value: "24/7", label: "Suporte ativo" },
  { value: "R$1", label: "A partir de" },
]

const badges = [
  { icon: Shield, label: "100% Seguro" },
  { icon: Clock, label: "Entrega Rapida" },
  { icon: TrendingUp, label: "Crescimento Real" },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badges */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
            {badges.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2"
              >
                <badge.icon className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-secondary-foreground">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground font-mono md:text-6xl lg:text-7xl">
            Impulsione suas{" "}
            <span className="text-primary">redes sociais</span>{" "}
            hoje mesmo
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Compre seguidores, curtidas e views para Instagram, TikTok, YouTube
            e mais. Entrega automatica, precos acessiveis e suporte 24/7.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="gap-2 text-base" asChild>
              <a href="#servicos">
                Ver Servicos
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="text-base" asChild>
              <a href="#como-funciona">Como Funciona</a>
            </Button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-px rounded-2xl border border-border bg-border md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 bg-card px-6 py-6 first:rounded-tl-2xl last:rounded-br-2xl md:first:rounded-bl-2xl md:last:rounded-tr-2xl [&:nth-child(2)]:rounded-tr-2xl md:[&:nth-child(2)]:rounded-tr-none [&:nth-child(3)]:rounded-bl-2xl md:[&:nth-child(3)]:rounded-bl-none"
            >
              <span className="text-2xl font-bold text-primary font-mono md:text-3xl">
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
