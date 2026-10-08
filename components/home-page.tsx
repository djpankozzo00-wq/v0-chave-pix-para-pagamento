"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Instagram,
  MessageCircle,
  Music2,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Youtube,
  Zap,
} from "lucide-react"
import { Header } from "@/components/header"
import { OrderPanel } from "@/components/order-panel"
import { AddBalanceModal } from "@/components/add-balance-modal"
import { Footer } from "@/components/footer"
import { getBalance, addBalance as addBalanceFn } from "@/lib/balance"

const categories = [
  { name: "Instagram", detail: "Serviços para perfis e publicações", icon: Instagram, tag: "POPULAR" },
  { name: "TikTok", detail: "Opções para vídeos e perfis", icon: Music2, tag: "VÍDEOS" },
  { name: "YouTube", detail: "Serviços para canais e vídeos", icon: Youtube, tag: "CANAIS" },
  { name: "Outras redes", detail: "Explore as opções disponíveis", icon: MessageCircle, tag: "MAIS" },
]

const steps = [
  { number: "01", title: "Escolha um serviço", description: "Pesquise pelo nome ou filtre pela categoria desejada." },
  { number: "02", title: "Informe os detalhes", description: "Adicione o link e a quantidade permitida para o serviço." },
  { number: "03", title: "Revise seu pedido", description: "Confira as informações e o valor antes de continuar." },
]

export function HomePage() {
  const [balance, setBalance] = useState(0)
  const [balanceModalOpen, setBalanceModalOpen] = useState(false)

  useEffect(() => {
    let active = true
    fetch("/api/balance", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Não foi possível carregar o saldo do servidor.")
        return response.json()
      })
      .then((result) => {
        if (active && Number.isFinite(Number(result.balance))) {
          setBalance(Math.round(Number(result.balance) * 100) / 100)
        } else if (active) {
          setBalance(getBalance())
        }
      })
      .catch(() => {
        if (active) setBalance(getBalance())
      })
    return () => { active = false }
  }, [])

  const handleBalanceAdded = (amount: number) => {
    const newBalance = addBalanceFn(amount)
    setBalance(newBalance)
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#080b10] text-white">
      <Header balance={balance} onAddBalance={() => setBalanceModalOpen(true)} />

      <main className="flex-1">
        <section className="relative isolate overflow-hidden border-b border-white/[0.08]">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_76%_5%,rgba(16,185,129,0.17),transparent_42%),radial-gradient(ellipse_at_0%_80%,rgba(59,130,246,0.07),transparent_36%)]" />
          <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:gap-16 lg:px-8 lg:py-24">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-3.5 py-2 text-xs font-semibold tracking-wide text-emerald-300">
                <Sparkles className="h-4 w-4" /> SUA CENTRAL DE SERVIÇOS DIGITAIS
              </div>
              <h1 className="max-w-3xl text-4xl font-black leading-[1.08] tracking-[-0.04em] sm:text-5xl lg:text-[3.65rem]">
                Sua presença digital, <span className="text-emerald-400">em um só lugar.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                Encontre e configure serviços para redes sociais com uma experiência simples, organizada e feita para você.
              </p>
              <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row">
                <a href="#servicos" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-950/30 transition hover:-translate-y-0.5 hover:bg-emerald-300">
                  Explorar serviços <ArrowRight className="h-4 w-4" />
                </a>
                <Link href="/login" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-5 py-3.5 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/[0.06]">
                  Acessar minha conta
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-400">
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Navegação simples</span>
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Serviços por categoria</span>
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Preço visível antes do envio</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <div aria-hidden="true" className="absolute -inset-5 rounded-[2rem] bg-emerald-400/[0.06] blur-2xl" />
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0f151d]/95 shadow-2xl shadow-black/40">
                <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300"><BarChart3 className="h-5 w-5" /></div>
                    <div><p className="text-sm font-bold">Painel Social</p><p className="mt-0.5 text-xs text-slate-500">Central de serviços</p></div>
                  </div>
                  <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Visão geral</span>
                </div>
                <div className="p-5 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Comece por aqui</p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight">O que você quer impulsionar?</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">Escolha uma rede e encontre os serviços disponíveis no catálogo.</p>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {categories.slice(0, 4).map(({ name, icon: Icon, tag }) => (
                      <a key={name} href="#servicos" className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 transition hover:border-emerald-400/30 hover:bg-emerald-400/[0.04]">
                        <div className="flex items-center justify-between">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] text-slate-200 transition group-hover:bg-emerald-400/10 group-hover:text-emerald-300"><Icon className="h-5 w-5" /></div>
                          <ChevronRight className="h-4 w-4 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-emerald-300" />
                        </div>
                        <p className="mt-4 text-sm font-bold">{name}</p>
                        <p className="mt-1 text-[10px] font-semibold tracking-[0.14em] text-slate-500">{tag}</p>
                      </a>
                    ))}
                  </div>
                  <div className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.05] p-4">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                    <div><p className="text-sm font-semibold text-slate-200">Confira antes de enviar</p><p className="mt-1 text-xs leading-5 text-slate-400">Revise o serviço, o link, a quantidade e o valor estimado do pedido.</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Explore por categoria</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">Encontre o que você procura</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">Acesse o catálogo e veja as opções disponíveis para cada rede.</p>
            </div>
            <a href="#fazer-pedido" className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-emerald-300 transition hover:text-emerald-200">Ver catálogo <ArrowRight className="h-4 w-4" /></a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {categories.map(({ name, detail, icon: Icon, tag }) => (
              <a key={name} href="#fazer-pedido" className="group rounded-2xl border border-white/[0.09] bg-[#0e141c] p-5 transition duration-200 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-[#111a22]">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-slate-200 transition group-hover:border-emerald-400/20 group-hover:bg-emerald-400/10 group-hover:text-emerald-300"><Icon className="h-5 w-5" /></div>
                  <span className="rounded-md bg-white/[0.04] px-2 py-1 text-[10px] font-bold tracking-wider text-slate-500">{tag}</span>
                </div>
                <h3 className="mt-5 font-bold">{name}</h3>
                <p className="mt-2 min-h-10 text-sm leading-5 text-slate-400">{detail}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300">Ver opções <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </a>
            ))}
          </div>
        </section>

        <section id="servicos" className="scroll-mt-8 border-y border-white/[0.08] bg-[#0b1017]">
          <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
            <div className="mx-auto mb-8 max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Catálogo de serviços</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">Configure seu pedido</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">Pesquise o serviço, confira os detalhes e veja a estimativa antes de continuar.</p>
            </div>
            <div id="fazer-pedido" className="mx-auto max-w-3xl scroll-mt-6 rounded-2xl border border-white/10 bg-[#101720] p-4 shadow-2xl shadow-black/20 sm:p-7">
              <div className="mb-5 flex items-center gap-3 border-b border-white/[0.08] pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300"><Zap className="h-5 w-5" /></div>
                <div><h3 className="font-bold">Novo pedido</h3><p className="mt-0.5 text-xs text-slate-400">Preencha os campos abaixo</p></div>
              </div>
              <OrderPanel balance={balance} onBalanceChange={setBalance} />
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Como funciona</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">Três passos para começar</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6">
                <p className="font-mono text-sm font-bold tracking-wider text-emerald-300">{step.number}</p>
                <h3 className="mt-4 font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-gradient-to-r from-emerald-400/[0.08] to-transparent p-5 sm:flex-row sm:items-center sm:p-7">
            <div className="flex items-start gap-3"><div className="rounded-xl bg-emerald-400/10 p-2.5 text-emerald-300"><BadgeCheck className="h-5 w-5" /></div><div><h3 className="font-bold">Pronto para explorar?</h3><p className="mt-1 text-sm text-slate-400">Veja o catálogo e encontre o serviço que faz sentido para você.</p></div></div>
            <a href="#fazer-pedido" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300">Explorar catálogo <ArrowRight className="h-4 w-4" /></a>
          </div>
        </section>
      </main>

      <Footer />
      <AddBalanceModal open={balanceModalOpen} onOpenChange={setBalanceModalOpen} onBalanceAdded={handleBalanceAdded} />
    </div>
  )
}
