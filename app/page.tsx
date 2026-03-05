"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { OrderPanel } from "@/components/order-panel"
import { AddBalanceModal } from "@/components/add-balance-modal"
import { Footer } from "@/components/footer"
import { getBalance, addBalance as addBalanceFn } from "@/lib/balance"

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
    <div className="min-h-screen flex flex-col">
      <Header
        balance={balance}
        onAddBalance={() => setBalanceModalOpen(true)}
      />

      <main className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8">
          <h1 className="text-xl font-bold text-foreground font-mono mb-6 text-balance">
            Novo Pedido
          </h1>
          <OrderPanel
            balance={balance}
            onBalanceChange={setBalance}
          />
        </div>
      </main>

      <Footer />

      <AddBalanceModal
        open={balanceModalOpen}
        onOpenChange={setBalanceModalOpen}
        onBalanceAdded={handleBalanceAdded}
      />
    </div>
  )
}
