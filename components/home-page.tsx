"use client"

import { useEffect, useState } from "react"
import { ShoppingBag, Search, Headset } from "lucide-react"
import { Header } from "@/components/header"
import { OrderPanel } from "@/components/order-panel"
import { MyOrders } from "@/components/my-orders"
import { AddBalanceModal } from "@/components/add-balance-modal"
import { Footer } from "@/components/footer"
import { setBalance as setStoredBalance } from "@/lib/balance"

export function HomePage() {
  const [balance, setBalance] = useState(0)
  const [balanceModalOpen, setBalanceModalOpen] = useState(false)

  useEffect(() => {
    let active = true

    const refreshBalance = async () => {
      try {
        const response = await fetch("/api/balance", { cache: "no-store" })
        if (!response.ok) return
        const result = await response.json()
        if (active && Number.isFinite(Number(result.balance))) {
          const serverBalance = Math.round(Number(result.balance) * 100) / 100
          setStoredBalance(serverBalance)
          setBalance(serverBalance)
        }
      } catch {
        // Mantém o último saldo conhecido se a rede falhar temporariamente.
      }
    }

    void refreshBalance()
    const timer = window.setInterval(() => void refreshBalance(), 5000)

    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [])

  const handleBalanceAdded = (_amount: number) => {
    fetch("/api/balance", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((result) => {
        if (Number.isFinite(Number(result.balance))) {
          const serverBalance = Math.round(Number(result.balance) * 100) / 100
          setStoredBalance(serverBalance)
          setBalance(serverBalance)
        }
      })
      .catch(() => setBalance(0))
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#080b10] text-white">
      <Header balance={balance} onAddBalance={() => setBalanceModalOpen(true)} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <section className="mb-7 rounded-2xl border border-white/10 bg-[#0e141c] p-5 sm:p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">Painel Social</p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Novo pedido</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Escolha um serviço, informe o link e a quantidade. Confira o valor antes de enviar.
              </p>
            </div>
          </div>
        </section>

        <section id="servicos" className="scroll-mt-6 rounded-2xl border border-white/10 bg-[#0e141c] p-4 sm:p-7">
          <div className="mb-5 flex items-center gap-3 border-b border-white/[0.08] pb-4">
            <Search className="h-5 w-5 text-emerald-300" />
            <div>
              <h2 className="font-semibold">Escolher serviço</h2>
              <p className="mt-1 text-xs text-slate-400">Pesquise pelo nome ou selecione uma categoria.</p>
            </div>
          </div>
          <div id="fazer-pedido" className="scroll-mt-6">
            <OrderPanel balance={balance} onBalanceChange={setBalance} />
          </div>
        </section>

        <MyOrders />
      </main>

      <Footer />

      <a
        href="https://services.zangi.com/dl/conversation/4220782184"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com o suporte pelo Zangi"
        className="fixed bottom-5 right-4 z-50 flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-full border border-emerald-300/30 bg-[#10251f] p-2 pr-4 text-white shadow-[0_8px_30px_rgba(0,0,0,0.45)] transition hover:bg-[#16372d] sm:bottom-6 sm:right-6"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-[#07110d]">
          <Headset className="h-6 w-6" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold">Suporte</span>
          <span className="block max-w-[190px] text-xs leading-4 text-emerald-100/80">Baixe o aplicativo Zangi para falar com o suporte.</span>
        </span>
      </a>

      <AddBalanceModal open={balanceModalOpen} onOpenChange={setBalanceModalOpen} onBalanceAdded={handleBalanceAdded} />
    </div>
  )
}
