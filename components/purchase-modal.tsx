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
import { Loader2, Copy, CheckCircle2, AlertCircle, QrCode } from "lucide-react"

type SelectedPackage = {
  platform: string
  type: string
  quantity: string
  price: string
}

type Step = "form" | "loading" | "payment" | "success" | "error"

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
  const [pixData, setPixData] = useState<{
    qrCode: string
    pixCopyPaste: string
    transactionId: string
  } | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")
  const [checkingPayment, setCheckingPayment] = useState(false)

  const resetModal = () => {
    setStep("form")
    setProfileUrl("")
    setEmail("")
    setPixData(null)
    setCopied(false)
    setError("")
    setCheckingPayment(false)
  }

  const handleClose = (open: boolean) => {
    if (!open) resetModal()
    onOpenChange(open)
  }

  const handleSubmit = async () => {
    if (!profileUrl.trim()) {
      setError("Informe o link do seu perfil ou publicacao.")
      return
    }

    setError("")
    setStep("loading")

    try {
      const priceNumber = parseFloat(
        selectedPackage!.price.replace(".", "").replace(",", ".")
      )

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: selectedPackage!.platform,
          type: selectedPackage!.type,
          quantity: selectedPackage!.quantity,
          price: priceNumber,
          profileUrl: profileUrl.trim(),
          email: email.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar pagamento.")
      }

      setPixData({
        qrCode: data.qrCode,
        pixCopyPaste: data.pixCopyPaste,
        transactionId: data.transactionId,
      })
      setStep("payment")

      // Start polling for payment status
      pollPaymentStatus(data.transactionId)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.")
      setStep("error")
    }
  }

  const pollPaymentStatus = (transactionId: string) => {
    setCheckingPayment(true)
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/checkout/status?transactionId=${transactionId}`
        )
        const data = await res.json()

        if (data.status === "paid" || data.status === "completed") {
          clearInterval(interval)
          setCheckingPayment(false)
          setStep("success")
        }
      } catch {
        // Continue polling
      }
    }, 5000)

    // Stop after 10 minutes
    setTimeout(() => {
      clearInterval(interval)
      setCheckingPayment(false)
    }, 600000)
  }

  const handleCopyPix = () => {
    if (pixData?.pixCopyPaste) {
      navigator.clipboard.writeText(pixData.pixCopyPaste)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
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

        {step === "loading" && (
          <div className="flex flex-col items-center gap-4 py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Gerando pagamento PIX...
            </p>
          </div>
        )}

        {step === "payment" && pixData && (
          <>
            <DialogHeader>
              <DialogTitle className="text-foreground font-mono">
                Pagamento PIX
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Escaneie o QR Code ou copie o codigo PIX para pagar.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 flex flex-col items-center gap-6">
              {/* QR Code area */}
              <div className="flex h-48 w-48 items-center justify-center rounded-xl border border-border bg-foreground p-2">
                {pixData.qrCode ? (
                  <img
                    src={pixData.qrCode}
                    alt="QR Code PIX"
                    className="h-full w-full"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <QrCode className="h-20 w-20 text-background" />
                )}
              </div>

              {/* PIX copy paste */}
              <div className="w-full">
                <Label className="text-muted-foreground text-xs">
                  Codigo PIX Copia e Cola
                </Label>
                <div className="mt-1 flex gap-2">
                  <Input
                    readOnly
                    value={pixData.pixCopyPaste}
                    className="bg-secondary border-border text-foreground text-xs"
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
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-3 w-full">
                {checkingPayment && (
                  <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />
                )}
                <p className="text-sm text-muted-foreground">
                  Aguardando confirmacao do pagamento...
                </p>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Total: <span className="font-bold text-primary font-mono">R$ {selectedPackage.price}</span>
                </p>
              </div>
            </div>
          </>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground font-mono">
              Pagamento Confirmado!
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Seu pedido de {selectedPackage.quantity}{" "}
              {selectedPackage.type.toLowerCase()} de {selectedPackage.platform} foi
              recebido e esta sendo processado. A entrega comeca em instantes!
            </p>
            <Button onClick={() => handleClose(false)} className="mt-4">
              Fechar
            </Button>
          </div>
        )}

        {step === "error" && (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-xl font-bold text-foreground font-mono">
              Erro no Pagamento
            </h3>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button
              onClick={() => {
                setError("")
                setStep("form")
              }}
              className="mt-4"
            >
              Tentar Novamente
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
