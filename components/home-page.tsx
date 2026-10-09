"use client"

import { useEffect, useState } from "react"
import { ShoppingBag, Search } from "lucide-react"
import { Header } from "@/components/header"
import { OrderPanel } from "@/components/order-panel"
import { AddBalanceModal } from "@/components/add-balance-modal"
import { Footer } from "@/components/footer"
import { getBalance, addBalance as addBalanceFn, setBalance as setStoredBalance } from "@/lib/balance"

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
          const serverBalance = Math.round(Number(result.balance) * 100) / 100
          setStoredBalance(serverBalance)
          setBalance(serverBalance)
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
      </main>

      <Footer />
      <AddBalanceModal open={balanceModalOpen} onOpenChange={setBalanceModalOpen} onBalanceAdded={handleBalanceAdded} />
    </div>
  )
}
