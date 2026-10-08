"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, CheckCircle2, KeyRound, AlertTriangle } from "lucide-react"

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
  // Never credit a balance based only on a user-entered amount. A trusted payment
  // provider and server-side payment confirmation are required.
  void onBalanceAdded
  const [step, setStep] = useState<"pix" | "details">("pix")
  const [copied, setCopied] = useState(false)
  const [amount, setAmount] = useState("")

  const close = () => {
    setStep("pix")
    setCopied(false)
    setAmount("")
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

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) close() }}>
      <DialogContent className="border-border bg-card sm:max-w-md">
        {step === "pix" ? (
          <>
            <DialogHeader>
              <DialogTitle>Adicionar saldo via PIX</DialogTitle>
              <DialogDescription>Confira o destinatário no aplicativo do seu banco antes de transferir.</DialogDescription>
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
                <div className="flex gap-3"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" /><div><p className="text-sm font-semibold">Crédito automático indisponível</p><p className="mt-1 text-xs leading-5 text-muted-foreground">A confirmação segura de pagamentos ainda não está integrada. Não faça uma transferência contando com a liberação automática do saldo.</p></div></div>
              </div>
              <Button className="w-full" onClick={() => setStep("details")}>Ver detalhes</Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Pagamento ainda não integrado</DialogTitle>
              <DialogDescription>Informar um valor não confirma que o dinheiro foi recebido.</DialogDescription>
            </DialogHeader>
            <div className="mt-4 flex flex-col gap-4">
              <div><Label htmlFor="amount">Valor da transferência (R$), apenas para referência</Label><Input id="amount" className="mt-2 bg-secondary" inputMode="decimal" placeholder="Ex.: 50,00" value={amount} onChange={(event) => setAmount(event.target.value)} /></div>
              <p className="text-sm leading-6 text-muted-foreground">Para ativar depósitos reais, configure um provedor PIX e valide o pagamento no servidor antes de creditar qualquer saldo.</p>
              <Button onClick={close} className="w-full">Entendi</Button>
              <Button onClick={() => setStep("pix")} variant="outline" className="w-full">Voltar</Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
