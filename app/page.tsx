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
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        balance={balance}
        onAddBalance={() => setBalanceModalOpen(true)}
      />

      <main className="flex-1 px-4 py-6">
        <div className="mx-auto w-full max-w-2xl rounded-xl bg-card p-5 shadow-sm sm:p-6">
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
