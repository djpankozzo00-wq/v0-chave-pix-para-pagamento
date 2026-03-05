import { Zap } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30 py-6">
      <div className="mx-auto max-w-3xl px-4">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold text-foreground font-mono">
              InstaBarato
            </span>
          </div>

          <p className="text-xs text-muted-foreground">
            {'2024 InstaBarato. Todos os direitos reservados.'}
          </p>
        </div>
      </div>
    </footer>
  )
}
