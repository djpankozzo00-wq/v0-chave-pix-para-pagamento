"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, CheckCircle2, KeyRound, AlertTriangle, Clock3 } from "lucide-react"

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
  void onBalanceAdded
  const [step, setStep] = useState<"pix" | "details">("pix")
  const [copied, setCopied] = useState(false)
  const [amount, setAmount] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const close = () => {
    setStep("pix")
    setCopied(false)
    setAmount("")
    setSending(false)
    setError("")
    setSuccess(false)
    onOpenChange(false)
  }

  const copyKey = async () => {
    try {
      await navigator.clipboard.writeText(PIX_KEY)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }

  async function submitRequest() {
    setError("")
    const normalized = amount.includes(",")
      ? amount.replace(/\./g, "").replace(",", ".")
      : amount.trim()
    const parsedAmount = Number(normalized)
    if (!Number.isFinite(parsedAmount) || parsedAmount < 1 || parsedAmount > 10000) {
      setError("Informe um valor entre R$ 1,00 e R$ 10.000,00.")
      return
    }

    setSending(true)
    try {
      const response = await fetch("/api/deposits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parsedAmount }),
      })
      const result = await response.json()
      if (!response.ok) {
        setError(result.error || "Não foi possível enviar a solicitação.")
        return
      }
      setSuccess(true)
    } catch {
      setError("Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.")
    } finally {
      setSending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) close() }}>
      <DialogContent className="border-border bg-card sm:max-w-md">
        {step === "pix" ? (
          <>
            <DialogHeader>
              <DialogTitle>Adicionar saldo via PIX</DialogTitle>
              <DialogDescription>Faça a transferência e aguarde a conferência manual antes de usar o saldo.</DialogDescription>
            </DialogHeader>
            <div className="mt-4 flex flex-col gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><KeyRound className="h-7 w-7" /></div>
              <div>
                <Label htmlFor="pix-key">Chave PIX cadastrada no projeto</Label>
                <div className="mt-2 flex gap-2">
                  <Input id="pix-key" readOnly value={PIX_KEY} className="min-w-0 bg-secondary font-mono text-xs" />
                  <Button variant="outline" size="icon" onClick={copyKey} aria-label="Copiar chave PIX">{copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</Button>
                </div>
                {copied && <p role="status" className="mt-2 text-xs text-primary">Chave copiada.</p>}
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.07] p-4">
                <div className="flex gap-3"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" /><div><p className="text-sm font-semibold">Aprovação manual</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Confira o nome do destinatário no Nubank antes de transferir. O saldo só será liberado depois que o administrador confirmar o recebimento.</p></div></div>
              </div>
              <Button className="w-full" onClick={() => { setError(""); setSuccess(false); setStep("details") }}>Já fiz o PIX</Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{success ? "Solicitação enviada" : "Solicitar confirmação do PIX"}</DialogTitle>
              <DialogDescription>{success ? "Seu pedido ficou aguardando conferência do administrador." : "Digite exatamente o valor que você transferiu."}</DialogDescription>
            </DialogHeader>
            <div className="mt-4 flex flex-col gap-4">
              {success ? (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] p-4">
                  <div className="flex gap-3"><Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" /><div><p className="text-sm font-semibold">Aguardando conferência</p><p className="mt-1 text-xs leading-5 text-muted-foreground">O saldo não foi adicionado ainda. Assim que o administrador conferir a entrada no Nubank e aprovar, o saldo será atualizado.</p></div></div>
                </div>
              ) : (
                <>
                  <div><Label htmlFor="amount">Valor transferido (R$)</Label><Input id="amount" className="mt-2 bg-secondary" inputMode="decimal" placeholder="Ex.: 50,00" value={amount} onChange={(event) => setAmount(event.target.value)} /></div>
                  <p className="text-xs leading-5 text-muted-foreground">O envio desta solicitação não confirma o pagamento. O administrador vai conferir o valor recebido antes de aprovar.</p>
                  {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
                  <Button onClick={submitRequest} disabled={sending} className="w-full">{sending ? "Enviando..." : "Enviar solicitação"}</Button>
                </>
              )}
              <Button onClick={close} variant={success ? "default" : "outline"} className="w-full">{success ? "Concluir" : "Cancelar"}</Button>
              {!success && <Button onClick={() => { setStep("pix"); setError("") }} variant="ghost" className="w-full">Voltar</Button>}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
