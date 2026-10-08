"use client"

import Link from "next/link"
import { Plus, Wallet, Menu, X, UserRound } from "lucide-react"
import { useState } from "react"

export function Header({
  balance,
  onAddBalance,
}: {
  balance: number
  onAddBalance: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10">
      <div className="bg-[#080b10] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="text-lg font-black tracking-tight sm:text-xl">
            Painel <span className="text-emerald-400">Social</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm font-semibold transition hover:bg-white/5 sm:inline-flex">
              <UserRound className="h-4 w-4" /> Entrar
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-lg border border-white/15 p-2 text-white sm:hidden"
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="border-t border-white/10 px-4 py-3 sm:hidden">
            <div className="mx-auto flex max-w-6xl flex-col gap-2">
              <Link href="/login" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/5">
                <UserRound className="h-4 w-4" /> Entrar ou cadastrar
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
            <span>Saldo demonstrativo</span>
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
