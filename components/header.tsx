"use client"

import { Zap, Plus, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header({
  balance,
  onAddBalance,
}: {
  balance: number
  onAddBalance: () => void
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <a href="#" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground font-mono">
            InstaBarato
          </span>
        </a>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-1.5">
            <Wallet className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold text-primary font-mono">
              R$ {balance.toFixed(2).replace(".", ",")}
            </span>
          </div>
          <Button
            size="sm"
            onClick={onAddBalance}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Adicionar Saldo</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
