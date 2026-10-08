"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, BadgeCheck, BarChart3, ChevronRight, Instagram, MessageCircle, Music2, PlayCircle, ShieldCheck, Sparkles, Youtube, Zap } from "lucide-react"
import { Header } from "@/components/header"
import { OrderPanel } from "@/components/order-panel"
import { AddBalanceModal } from "@/components/add-balance-modal"
import { Footer } from "@/components/footer"
import { getBalance, addBalance as addBalanceFn } from "@/lib/balance"

const categories = [
  { name: "Instagram", detail: "Seguidores, curtidas e visualizações", icon: Instagram },
  { name: "TikTok", detail: "Visualizações e engajamento", icon: Music2 },
  { name: "YouTube", detail: "Views, inscritos e curtidas", icon: Youtube },
  { name: "Outras redes", detail: "Serviços para suas redes sociais", icon: MessageCircle },
]

export default function HomePage() {
  const [balance, setBalance] = useState(0)
  const [balanceModalOpen, setBalanceModalOpen] = useState(false)

  useEffect(() => {
    setBalance(getBalance())
  }, [])

  const handleBalanceAdded = (amount: number) => {
    const newBalance = addBalanceFn(amount)
    setBalance(newBalance)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#080b10] text-white">
      <Header balance={balance} onAddBalance={() => setBalanceModalOpen(true)} />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_0%,rgba(34,197,94,0.17),transparent_48%)]" />
          <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                <Sparkles className="h-4 w-4" /> Sua presença digital começa aqui
              </div>
              <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Faça suas redes <span className="text-emerald-400">crescerem</span> com praticidade.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                Encontre serviços para redes sociais em um só lugar. Escolha o serviço, informe seu perfil e acompanhe seus pedidos pelo painel.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#servicos" className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-emerald-300">
                  Ver serviços <ArrowRight className="h-4 w-4" />
                </a>
                <Link href="/login" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/5">
                  Entrar ou cadastrar
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-400">
                <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-400" /> Painel simples</span>
                <span className="inline-flex items-center gap-2"><Zap className="h-4 w-4 text-emerald-400" /> Pedido em poucos passos</span>
                <span className="inline-flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-emerald-400" /> Acompanhamento organizado</span>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#10161e] p-5 shadow-2xl shadow-emerald-950/30 sm:p-7">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm text-slate-400">Visão geral</p>
                  <h2 className="mt-1 text-xl font-bold">Seu painel social</h2>
                </div>
                <div className="rounded-xl bg-emerald-400/10 p-3 text-emerald-300"><BarChart3 className="h-6 w-6" /></div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm text-slate-400">Serviços disponíveis</p>
                  <p className="mt-2 text-3xl font-black">24/7</p>
                  <p className="mt-1 text-xs text-emerald-300">Consulte as opções</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm text-slate-400">Pagamento</p>
                  <p className="mt-2 text-3xl font-black">PIX</p>
                  <p className="mt-1 text-xs text-slate-400">Fluxo demonstrativo</p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Escolha sua rede", sub: "Instagram, TikTok, YouTube e mais", icon: PlayCircle },
                  { label: "Configure seu pedido", sub: "Selecione o serviço e informe o perfil", icon: ChevronRight },
                  { label: "Acompanhe no painel", sub: "Tenha seus pedidos organizados", icon: BarChart3 },
                ].map((item) => {
                  const Icon = item.icon
                  return <div key={item.label} className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-3">
                    <div className="rounded-lg bg-emerald-400/10 p-2 text-emerald-300"><Icon className="h-5 w-5" /></div>
                    <div><p className="text-sm font-semibold">{item.label}</p><p className="mt-0.5 text-xs text-slate-400">{item.sub}</p></div>
                  </div>
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">Categorias</p>
              <h2 className="mt-2 text-2xl font-black sm:text-3xl">Serviços para suas redes</h2>
              <p className="mt-2 text-sm text-slate-400">Escolha uma categoria e veja as opções disponíveis.</p>
            </div>
            <a href="#fazer-pedido" className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-300 hover:text-emerald-200">Fazer um pedido <ArrowRight className="h-4 w-4" /></a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => {
              const Icon = category.icon
              return <a key={category.name} href="#fazer-pedido" className="group rounded-2xl border border-white/10 bg-[#10161e] p-5 transition hover:-translate-y-1 hover:border-emerald-400/40">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300"><Icon className="h-6 w-6" /></div>
                <h3 className="font-bold">{category.name}</h3>
                <p className="mt-2 min-h-10 text-sm leading-5 text-slate-400">{category.detail}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-300">Explorar <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </a>
            })}
          </div>
        </section>

        <section id="servicos" className="mx-auto w-full max-w-6xl scroll-mt-8 px-4 pb-14 sm:px-6">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">Área de pedidos</p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">Monte seu pedido</h2>
            <p className="mt-2 text-sm text-slate-400">Use o formulário abaixo para consultar e configurar seu serviço.</p>
          </div>
          <div id="fazer-pedido" className="scroll-mt-6 rounded-2xl border border-white/10 bg-[#10161e] p-4 shadow-xl sm:p-6">
            <OrderPanel balance={balance} onBalanceChange={setBalance} />
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#0d1219]">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-3">
            <div><ShieldCheck className="h-6 w-6 text-emerald-400" /><h3 className="mt-3 font-bold">Experiência simples</h3><p className="mt-1 text-sm leading-6 text-slate-400">Navegue pelas categorias e encontre o formulário de pedido rapidamente.</p></div>
            <div><Zap className="h-6 w-6 text-emerald-400" /><h3 className="mt-3 font-bold">Tudo organizado</h3><p className="mt-1 text-sm leading-6 text-slate-400">A estrutura foi pensada para reunir pedidos e saldo em um único painel.</p></div>
            <div><BadgeCheck className="h-6 w-6 text-emerald-400" /><h3 className="mt-3 font-bold">Acesso à conta</h3><p className="mt-1 text-sm leading-6 text-slate-400">Acesse a tela de entrada e cadastro demonstrativa para continuar evoluindo o projeto.</p></div>
          </div>
        </section>
      </main>

      <Footer />
      <AddBalanceModal open={balanceModalOpen} onOpenChange={setBalanceModalOpen} onBalanceAdded={handleBalanceAdded} />
    </div>
  )
}
