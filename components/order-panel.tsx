"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Loader2, Send, AlertCircle, ChevronDown } from "lucide-react"
import { deductBalance, addOrder } from "@/lib/balance"

type Service = {
  service: number
  name: string
  type: string
  rate: string
  min: string
  max: string
  category: string
  description?: string
}

export function OrderPanel({
  balance,
  onBalanceChange,
}: {
  balance: number
  onBalanceChange: (newBalance: number) => void
}) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedServiceId, setSelectedServiceId] = useState("")
  const [link, setLink] = useState("")
  const [quantity, setQuantity] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch("/api/services")
        const data = await res.json()
        if (Array.isArray(data)) {
          setServices(data)
        } else {
          setError("Erro ao carregar servicos.")
        }
      } catch {
        setError("Erro ao conectar com o servidor.")
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  const categories = useMemo(() => {
    const cats = new Set<string>()
    services.forEach((s) => {
      if (s.category) cats.add(s.category)
    })
    return Array.from(cats).sort()
  }, [services])

  const filteredServices = useMemo(() => {
    let filtered = services
    if (selectedCategory) {
      filtered = filtered.filter((s) => s.category === selectedCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
      )
    }
    return filtered
  }, [services, selectedCategory, searchQuery])

  const selectedService = useMemo(() => {
    if (!selectedServiceId) return null
    return services.find((s) => String(s.service) === selectedServiceId) || null
  }, [services, selectedServiceId])

  const estimatedCost = useMemo(() => {
    if (!selectedService || !quantity) return 0
    const rate = parseFloat(selectedService.rate)
    const qty = parseInt(quantity)
    if (isNaN(rate) || isNaN(qty)) return 0
    return (rate * qty) / 1000
  }, [selectedService, quantity])

  const handleSubmit = async () => {
    if (!selectedService) {
      setSubmitMessage({ type: "error", text: "Selecione um servico." })
      return
    }
    if (!link.trim()) {
      setSubmitMessage({ type: "error", text: "Informe o link." })
      return
    }
    const qty = parseInt(quantity)
    const min = parseInt(selectedService.min)
    const max = parseInt(selectedService.max)
    if (isNaN(qty) || qty < min || qty > max) {
      setSubmitMessage({
        type: "error",
        text: `Quantidade deve ser entre ${min} e ${max}.`,
      })
      return
    }
    if (estimatedCost > balance) {
      setSubmitMessage({
        type: "error",
        text: "Saldo insuficiente. Adicione mais saldo.",
      })
      return
    }

    setSubmitting(true)
    setSubmitMessage(null)

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.service,
          link: link.trim(),
          quantity: qty,
        }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error || "Erro ao criar pedido.")
      }

      const newBalance = deductBalance(estimatedCost)
      onBalanceChange(newBalance)

      addOrder({
        id: data.order ? String(data.order) : String(Date.now()),
        serviceId: selectedService.service,
        serviceName: selectedService.name,
        link: link.trim(),
        quantity: qty,
        cost: estimatedCost,
        date: new Date().toISOString(),
        status: "pending",
      })

      setSubmitMessage({
        type: "success",
        text: `Pedido #${data.order || "---"} criado com sucesso!`,
      })
      setLink("")
      setQuantity("")
      setSelectedServiceId("")
    } catch (err) {
      setSubmitMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Erro inesperado.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Carregando servicos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-destructive">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Procurar servico..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-secondary border-border text-foreground placeholder:text-muted-foreground pl-10"
        />
      </div>

      {/* Category */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-foreground text-sm font-semibold">Categoria</Label>
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value)
              setSelectedServiceId("")
            }}
            className="w-full appearance-none rounded-lg border border-border bg-secondary px-3 py-2.5 pr-10 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Todas as categorias</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Service */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-foreground text-sm font-semibold">Servico</Label>
        <div className="relative">
          <select
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            className="w-full appearance-none rounded-lg border border-border bg-secondary px-3 py-2.5 pr-10 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Selecione um servico</option>
            {filteredServices.map((s) => (
              <option key={s.service} value={String(s.service)}>
                {s.name} - R$ {parseFloat(s.rate).toFixed(2)} por 1000
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Service Description */}
      {selectedService?.description && (
        <div className="rounded-lg border border-border bg-secondary/50 p-4">
          <p className="text-sm font-semibold text-foreground mb-2">Descricao</p>
          <div
            className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: selectedService.description }}
          />
        </div>
      )}

      {/* Link */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-foreground text-sm font-semibold">Link</Label>
        <Input
          placeholder="https://www.instagram.com/seuperfil"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Quantity */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-foreground text-sm font-semibold">
          Quantidade
        </Label>
        <Input
          type="number"
          placeholder={
            selectedService
              ? `Min: ${selectedService.min} - Max: ${selectedService.max}`
              : "Selecione um servico primeiro"
          }
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min={selectedService ? parseInt(selectedService.min) : undefined}
          max={selectedService ? parseInt(selectedService.max) : undefined}
          className="bg-secondary border-border text-foreground placeholder:text-muted-foreground font-mono"
          disabled={!selectedService}
        />
        {selectedService && (
          <p className="text-xs text-muted-foreground">
            Min.: {parseInt(selectedService.min).toLocaleString("pt-BR")} - Max.:{" "}
            {parseInt(selectedService.max).toLocaleString("pt-BR")}
          </p>
        )}
      </div>

      {/* Cost Estimate */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-foreground text-sm font-semibold">
          Estimativa de Valor
        </Label>
        <Input
          readOnly
          value={
            estimatedCost > 0
              ? `R$ ${estimatedCost.toFixed(5)}`
              : "R$ 0,00"
          }
          className="bg-secondary border-border text-muted-foreground font-mono"
        />
      </div>

      {/* Submit message */}
      {submitMessage && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            submitMessage.type === "success"
              ? "border-primary/30 bg-primary/10 text-primary"
              : "border-destructive/30 bg-destructive/10 text-destructive"
          }`}
        >
          {submitMessage.text}
        </div>
      )}

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={submitting || !selectedService}
        className="w-full gap-2"
        size="lg"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Enviar
          </>
        )}
      </Button>
    </div>
  )
}
