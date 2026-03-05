"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, CheckCircle2, KeyRound } from "lucide-react"

const PIX_KEY = "a18a6815-1ab0-4e94-b20f-55d5fbb3ac9e"

export function AddBalanceModal({
  open,
  onOpenChange,
  onBalanceAdded,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBalanceAdded: (amount: number) => void
}) {
  const [step, setStep] = useState<"pix" | "confirm">("pix")
  const [copied, setCopied] = useState(false)
  const [amount, setAmount] = useState("")
  const [error, setError] = useState("")

  const resetModal = () => {
    setStep("pix")
    setCopied(false)
    setAmount("")
    setError("")
  }

  const handleClose = (open: boolean) => {
    if (!open) resetModal()
    onOpenChange(open)
  }

  const handleCopyPix = () => {
    navigator.clipboard.writeText(PIX_KEY)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  const handleConfirm = () => {
    const value = parseFloat(amount.replace(",", "."))
    if (isNaN(value) || value <= 0) {
      setError("Informe um valor valido.")
      return
    }
    onBalanceAdded(value)
    handleClose(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="border-border bg-card sm:max-w-md">
        {step === "pix" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-foreground font-mono">
                Adicionar Saldo via PIX
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Copie a chave PIX abaixo, faca a transferencia pelo seu banco e depois confirme o valor.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 flex flex-col items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <KeyRound className="h-8 w-8 text-primary" />
              </div>

              <div className="w-full">
                <Label className="text-muted-foreground text-xs">
                  Chave PIX (Copia e Cola)
                </Label>
                <div className="mt-1 flex gap-2">
                  <Input
                    readOnly
                    value={PIX_KEY}
                    className="bg-secondary border-border text-foreground text-xs font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyPix}
                    className="shrink-0"
                  >
                    {copied ? (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {copied && (
                  <p className="mt-1 text-xs text-primary">Chave copiada!</p>
                )}
              </div>

              <div className="w-full rounded-lg border border-border bg-secondary px-4 py-3">
                <p className="text-sm font-medium text-foreground mb-2">Como adicionar saldo:</p>
                <ol className="flex flex-col gap-1 text-xs text-muted-foreground list-decimal list-inside">
                  <li>Copie a chave PIX acima</li>
                  <li>Abra o app do seu banco</li>
                  <li>{'Faca um PIX para a chave copiada'}</li>
                  <li>{'Volte aqui e clique em "Ja paguei"'}</li>
                </ol>
              </div>

              <Button onClick={() => setStep("confirm")} className="w-full">
                Ja paguei
              </Button>
            </div>
          </>
        )}

        {step === "confirm" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-foreground font-mono">
                Confirmar Valor
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Informe o valor que voce transferiu via PIX para adicionar ao seu saldo.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="amount" className="text-foreground">
                  Valor transferido (R$)
                </Label>
                <Input
                  id="amount"
                  type="text"
                  inputMode="decimal"
                  placeholder="Ex: 50,00"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value)
                    setError("")
                  }}
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground font-mono text-lg"
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>

              <Button onClick={handleConfirm} className="w-full">
                Confirmar e adicionar saldo
              </Button>
              <Button
                variant="outline"
                onClick={() => setStep("pix")}
                className="w-full"
              >
                Voltar
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
