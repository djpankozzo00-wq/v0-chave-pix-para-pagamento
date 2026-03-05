"use client"

import { useState } from "react"
import { Instagram, Youtube, Twitter, Music, Facebook, Users, Heart, Eye, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type Platform = {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  services: {
    type: string
    icon: React.ComponentType<{ className?: string }>
    packages: { quantity: string; price: string; popular?: boolean }[]
  }[]
}

const platforms: Platform[] = [
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "text-pink-400",
    services: [
      {
        type: "Seguidores",
        icon: Users,
        packages: [
          { quantity: "100", price: "2,99" },
          { quantity: "500", price: "9,99" },
          { quantity: "1.000", price: "17,99", popular: true },
          { quantity: "5.000", price: "69,99" },
        ],
      },
      {
        type: "Curtidas",
        icon: Heart,
        packages: [
          { quantity: "100", price: "1,99" },
          { quantity: "500", price: "6,99" },
          { quantity: "1.000", price: "11,99", popular: true },
          { quantity: "5.000", price: "49,99" },
        ],
      },
      {
        type: "Views",
        icon: Eye,
        packages: [
          { quantity: "500", price: "1,99" },
          { quantity: "1.000", price: "3,49" },
          { quantity: "5.000", price: "9,99", popular: true },
          { quantity: "10.000", price: "17,99" },
        ],
      },
    ],
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: Music,
    color: "text-cyan-400",
    services: [
      {
        type: "Seguidores",
        icon: Users,
        packages: [
          { quantity: "100", price: "3,99" },
          { quantity: "500", price: "12,99" },
          { quantity: "1.000", price: "22,99", popular: true },
          { quantity: "5.000", price: "89,99" },
        ],
      },
      {
        type: "Curtidas",
        icon: Heart,
        packages: [
          { quantity: "100", price: "2,49" },
          { quantity: "500", price: "7,99" },
          { quantity: "1.000", price: "13,99", popular: true },
          { quantity: "5.000", price: "54,99" },
        ],
      },
      {
        type: "Views",
        icon: Eye,
        packages: [
          { quantity: "1.000", price: "1,99" },
          { quantity: "5.000", price: "5,99" },
          { quantity: "10.000", price: "9,99", popular: true },
          { quantity: "50.000", price: "39,99" },
        ],
      },
    ],
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: Youtube,
    color: "text-red-400",
    services: [
      {
        type: "Inscritos",
        icon: Users,
        packages: [
          { quantity: "100", price: "9,99" },
          { quantity: "500", price: "39,99" },
          { quantity: "1.000", price: "69,99", popular: true },
          { quantity: "5.000", price: "299,99" },
        ],
      },
      {
        type: "Views",
        icon: Eye,
        packages: [
          { quantity: "1.000", price: "4,99" },
          { quantity: "5.000", price: "14,99" },
          { quantity: "10.000", price: "24,99", popular: true },
          { quantity: "50.000", price: "99,99" },
        ],
      },
    ],
  },
  {
    id: "twitter",
    name: "X / Twitter",
    icon: Twitter,
    color: "text-sky-400",
    services: [
      {
        type: "Seguidores",
        icon: Users,
        packages: [
          { quantity: "100", price: "3,99" },
          { quantity: "500", price: "14,99" },
          { quantity: "1.000", price: "24,99", popular: true },
          { quantity: "5.000", price: "99,99" },
        ],
      },
      {
        type: "Curtidas",
        icon: Heart,
        packages: [
          { quantity: "100", price: "2,99" },
          { quantity: "500", price: "9,99" },
          { quantity: "1.000", price: "17,99", popular: true },
          { quantity: "5.000", price: "69,99" },
        ],
      },
    ],
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    color: "text-blue-400",
    services: [
      {
        type: "Seguidores",
        icon: Users,
        packages: [
          { quantity: "100", price: "4,99" },
          { quantity: "500", price: "17,99" },
          { quantity: "1.000", price: "29,99", popular: true },
          { quantity: "5.000", price: "119,99" },
        ],
      },
      {
        type: "Curtidas",
        icon: Heart,
        packages: [
          { quantity: "100", price: "2,99" },
          { quantity: "500", price: "9,99" },
          { quantity: "1.000", price: "16,99", popular: true },
          { quantity: "5.000", price: "64,99" },
        ],
      },
    ],
  },
]

export function Services({ onSelectPackage }: { onSelectPackage: (pkg: { platform: string; type: string; quantity: string; price: string }) => void }) {
  const [activePlatform, setActivePlatform] = useState("instagram")
  const current = platforms.find((p) => p.id === activePlatform)!

  return (
    <section id="servicos" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground font-mono md:text-4xl">
            Nossos Servicos
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Escolha a plataforma e o pacote ideal para voce. Entrega automatica
            e garantia de reposicao.
          </p>
        </div>

        {/* Platform tabs */}
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => setActivePlatform(platform.id)}
              className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all ${
                activePlatform === platform.id
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-secondary text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              <platform.icon className={`h-4 w-4 ${platform.color}`} />
              {platform.name}
            </button>
          ))}
        </div>

        {/* Service types */}
        {current.services.map((service) => (
          <div key={service.type} className="mt-10">
            <div className="mb-6 flex items-center gap-2">
              <service.icon className={`h-5 w-5 ${current.color}`} />
              <h3 className="text-lg font-semibold text-foreground">
                {service.type} {current.name}
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {service.packages.map((pkg) => (
                <div
                  key={pkg.quantity}
                  className={`relative flex flex-col rounded-xl border p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 ${
                    pkg.popular
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card"
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-3 left-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                      Popular
                    </span>
                  )}
                  <div className="text-2xl font-bold text-foreground font-mono">
                    {pkg.quantity}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {service.type.toLowerCase()}
                  </div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-sm text-muted-foreground">R$</span>
                    <span className="text-3xl font-bold text-primary font-mono">
                      {pkg.price}
                    </span>
                  </div>
                  <Button
                    className="mt-6 gap-2"
                    variant={pkg.popular ? "default" : "outline"}
                    onClick={() =>
                      onSelectPackage({
                        platform: current.name,
                        type: service.type,
                        quantity: pkg.quantity,
                        price: pkg.price,
                      })
                    }
                  >
                    Comprar
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
