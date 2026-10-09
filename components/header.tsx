"use client"

import Link from "next/link"
import { Plus, Wallet, Menu, X, ShieldCheck } from "lucide-react"
import { useEffect, useState } from "react"

export function Header({
  balance,
  onAddBalance,
}: {
  balance: number
  onAddBalance: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [hasOpenOrders, setHasOpenOrders] = useState(false)

  useEffect(() => {
    let active = true
    const checkOpenOrders = async () => {
      try {
        const response = await fetch("/api/admin/orders", { cache: "no-store" })
        if (!response.ok) {
          if (active) setHasOpenOrders(false)
          return
        }
        const result = await response.json()
        const pending = (result.orders || []).some(
          (order: { status?: string }) => order.status === "pending_manual" || order.status === "processing_manual",
        )
        if (active) setHasOpenOrders(pending)
      } catch {
        if (active) setHasOpenOrders(false)
      }
    }

    void checkOpenOrders()
    const timer = window.setInterval(() => void checkOpenOrders(), 8000)
    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-white/10">
      <div className="bg-[#080b10] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="text-lg font-black tracking-tight sm:text-xl">
            Painel <span className="text-emerald-400">Social</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="hidden items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10 sm:inline-flex"
            >
              <span className="relative inline-flex">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                {hasOpenOrders && <span aria-label="Há pedidos em aberto" title="Há pedidos em aberto" className="absolute -right-2 -top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-[#080b10]" />}
              </span>
              Área administrativa
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative rounded-lg border border-white/15 p-2 text-white sm:hidden"
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              {hasOpenOrders && <span aria-label="Há pedidos em aberto" title="Há pedidos em aberto" className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500 ring-2 ring-[#080b10]" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="border-t border-white/10 px-4 py-3 sm:hidden">
            <div className="mx-auto flex max-w-6xl flex-col gap-2">
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm font-semibold text-white"
              >
                <span className="relative inline-flex">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  {hasOpenOrders && <span aria-label="Há pedidos em aberto" title="Há pedidos em aberto" className="absolute -right-2 -top-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-[#080b10]" />}
                </span>
                Área administrativa
                {hasOpenOrders && <span className="ml-auto text-xs font-bold text-red-400">Pedidos em aberto</span>}
              </Link>
              <button
                onClick={() => {
                  onAddBalance()
                  setMenuOpen(false)
                }}
                className="flex items-center gap-2 rounded-lg bg-emerald-400 px-3 py-2 text-sm font-bold text-slate-950"
              >
                <Plus className="h-4 w-4" /> Adicionar saldo
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="bg-[#10161e] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Wallet className="h-4 w-4 text-emerald-400" />
            <span>Saldo</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold sm:text-base">
              R$ {balance.toFixed(2).replace(".", ",")}
            </span>
            <button
              onClick={onAddBalance}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-400 px-3 py-1.5 text-xs font-bold text-slate-950 transition hover:bg-emerald-300"
            >
              <Plus className="h-3.5 w-3.5" /> Adicionar
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
