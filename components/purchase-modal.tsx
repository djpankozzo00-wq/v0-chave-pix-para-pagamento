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

type SelectedPackage = {
  platform: string
  type: string
  quantity: string
  price: string
}

type Step = "form" | "payment"

export function PurchaseModal({
  open,
  onOpenChange,
  selectedPackage,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedPackage: SelectedPackage | null
}) {
  const [step, setStep] = useState<Step>("form")
  const [profileUrl, setProfileUrl] = useState("")
  const [email, setEmail] = useState("")
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")

  const resetModal = () => {
    setStep("form")
    setProfileUrl("")
    setEmail("")
    setCopied(false)
    setError("")
  }

  const handleClose = (open: boolean) => {
    if (!open) resetModal()
    onOpenChange(open)
  }

  const handleSubmit = () => {
    if (!profileUrl.trim()) {
      setError("Informe o link do seu perfil ou publicacao.")
      return
    }

    setError("")
    setStep("payment")
  }

  const handleCopyPix = () => {
    navigator.clipboard.writeText(PIX_KEY)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  if (!selectedPackage) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="border-border bg-card sm:max-w-md">
        {step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-foreground font-mono">
                Finalizar Compra
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {selectedPackage.quantity} {selectedPackage.type.toLowerCase()} de{" "}
                {selectedPackage.platform} por R$ {selectedPackage.price}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 flex flex-col gap-4">
              <div className="rounded-lg border border-border bg-secondary p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pedido</span>
                  <span className="text-sm font-medium text-foreground">
                    {selectedPackage.quantity} {selectedPackage.type.toLowerCase()}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Plataforma</span>
                  <span className="text-sm font-medium text-foreground">
                    {selectedPackage.platform}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
                  <span className="text-sm font-medium text-foreground">Total</span>
                  <span className="text-lg font-bold text-primary font-mono">
                    R$ {selectedPackage.price}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="profileUrl" className="text-foreground">
                  Link do perfil / publicacao *
                </Label>
                <Input
                  id="profileUrl"
                  placeholder="https://instagram.com/seuperfil"
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-foreground">
                  E-mail (opcional)
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button onClick={handleSubmit} className="mt-2">
                Pagar com PIX
              </Button>
            </div>
          </>
        )}

        {step === "payment" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-foreground font-mono">
                Pagamento PIX
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Copie a chave PIX abaixo e faca o pagamento pelo seu banco.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 flex flex-col items-center gap-5">
              {/* Order summary */}
              <div className="w-full rounded-lg border border-border bg-secondary p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pedido</span>
                  <span className="text-sm font-medium text-foreground">
                    {selectedPackage.quantity} {selectedPackage.type.toLowerCase()} - {selectedPackage.platform}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Perfil</span>
                  <span className="text-sm font-medium text-foreground truncate max-w-[200px]">
                    {profileUrl}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
                  <span className="text-sm font-medium text-foreground">Valor a pagar</span>
                  <span className="text-lg font-bold text-primary font-mono">
                    R$ {selectedPackage.price}
                  </span>
                </div>
              </div>

              {/* PIX Key icon */}
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <KeyRound className="h-8 w-8 text-primary" />
              </div>

              {/* PIX key to copy */}
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

              {/* Instructions */}
              <div className="w-full rounded-lg border border-border bg-secondary px-4 py-3">
                <p className="text-sm font-medium text-foreground mb-2">Como pagar:</p>
                <ol className="flex flex-col gap-1 text-xs text-muted-foreground list-decimal list-inside">
                  <li>Copie a chave PIX acima</li>
                  <li>Abra o app do seu banco</li>
                  <li>{'Escolha "Pagar com PIX" > "Chave PIX"'}</li>
                  <li>Cole a chave e pague o valor de <span className="font-bold text-primary font-mono">R$ {selectedPackage.price}</span></li>
                  <li>Envie o comprovante para confirmar a entrega</li>
                </ol>
              </div>

              <Button
                variant="outline"
                onClick={() => setStep("form")}
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
