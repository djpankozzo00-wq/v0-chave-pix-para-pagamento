"use client"

import { Plus, Wallet, Menu, X } from "lucide-react"
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
    <header className="sticky top-0 z-50">
      {/* Top bar - teal */}
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <span className="text-lg font-bold tracking-tight font-mono uppercase">
            InstaBarato
          </span>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-primary-foreground"
            aria-label="Menu"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="border-t border-primary-foreground/20 px-4 pb-3">
            <div className="mx-auto max-w-3xl flex flex-col gap-2">
              <button
                onClick={() => {
                  onAddBalance()
                  setMenuOpen(false)
                }}
                className="flex items-center gap-2 rounded-lg bg-primary-foreground/15 px-3 py-2 text-sm font-medium text-primary-foreground"
              >
                <Plus className="h-4 w-4" />
                Adicionar Saldo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Balance bar */}
      <div className="bg-primary/85 text-primary-foreground">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            <span className="text-sm font-medium">Saldo:</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-base font-bold font-mono">
              R$ {balance.toFixed(5).replace(".", ",")}
            </span>
            <button
              onClick={onAddBalance}
              className="flex items-center gap-1 rounded-md bg-primary-foreground/20 px-2.5 py-1 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/30"
            >
              <Plus className="h-3 w-3" />
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
