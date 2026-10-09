"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Loader2, AlertCircle, ChevronDown } from "lucide-react"
import { addOrder } from "@/lib/balance"

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
  balance: _balance,
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
          setError("Erro ao carregar serviços.")
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
      const q = searchQuery.toLowerCase().trim()
      const searchingFollowers = ["seguidor", "seguidores", "follower", "followers"].some((term) =>
        q.includes(term)
      )
      filtered = filtered.filter((s) => {
        const serviceText = `${s.name} ${s.category}`.toLowerCase()
        const matchesNameOrCategory = serviceText.includes(q)
        const isInstagramFollowerService =
          serviceText.includes("instagram") &&
          (serviceText.includes("audiência de perfil") ||
            serviceText.includes("atrair seguidores"))
        return matchesNameOrCategory || (searchingFollowers && isInstagramFollowerService)
      })
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
    return Math.round((((rate * qty * 2) / 1000) + Number.EPSILON) * 100) / 100
  }, [selectedService, quantity])

  const handleSubmit = async () => {
    if (!selectedService) {
      setSubmitMessage({ type: "error", text: "Selecione um serviço." })
      return
    }
    if (!link.trim()) {
      setSubmitMessage({ type: "error", text: "Informe o link do perfil ou publicação." })
      return
    }
    const qty = parseInt(quantity)
    const min = parseInt(selectedService.min)
    const max = parseInt(selectedService.max)
    if (isNaN(qty) || qty < min || qty > max) {
      setSubmitMessage({
        type: "error",
        text: `Quantidade deve ser entre ${min.toLocaleString("pt-BR")} e ${max.toLocaleString("pt-BR")}.`,
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
        if (typeof data.balance === "number" && Number.isFinite(data.balance)) {
          onBalanceChange(data.balance)
        }
        throw new Error(data.error || "Erro ao criar pedido.")
      }

      if (typeof data.balance === "number" && Number.isFinite(data.balance)) {
        onBalanceChange(data.balance)
      }

      addOrder({
        id: data.order ? String(data.order) : String(Date.now()),
        serviceId: selectedService.service,
        serviceName: selectedService.name,
        link: link.trim(),
        quantity: qty,
        cost: Number(data.cost ?? estimatedCost),
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
        <p className="text-sm text-muted-foreground">Carregando serviços...</p>
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
        <input
          type="text"
          placeholder="Buscar serviço pelo nome..."
          aria-label="Buscar serviço pelo nome"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-border bg-card px-3 py-2.5 pl-10 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Category */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-foreground">Categoria</label>
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
        <label className="text-sm font-semibold text-foreground">Serviço</label>
        <div className="relative">
          <select
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            className="w-full appearance-none rounded-lg border border-border bg-secondary px-3 py-2.5 pr-10 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Selecione um serviço</option>
            {filteredServices.length === 0 && <option value="" disabled>Nenhum serviço encontrado</option>}
            {filteredServices.map((s) => (
              <option key={s.service} value={String(s.service)}>
                {s.name.toLowerCase().includes("instagram") && (s.name.toLowerCase().includes("audiência de perfil") || s.name.toLowerCase().includes("atrair seguidores")) ? "👥 Seguidores Instagram — " : ""}{s.name} - R$ {(parseFloat(s.rate) * 2).toFixed(2)} por 1000
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Service Description */}
      {selectedService?.description && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-foreground">Descricao</label>
          <div className="rounded-lg border border-border bg-secondary/60 p-4">
            <div
              className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line [&_br]:block"
              dangerouslySetInnerHTML={{ __html: selectedService.description }}
            />
          </div>
        </div>
      )}

      {/* Link */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-foreground">Link do perfil ou publicação</label>
        <input
          type="text"
          placeholder="https://www.instagram.com/seuperfil"
          aria-label="Link do perfil ou publicação"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full rounded-lg border border-border bg-secondary px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Quantity */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-foreground">
          Quantidade
        </label>
        <input
          type="number"
          placeholder={
            selectedService
              ? `Min: ${selectedService.min} - Max: ${selectedService.max}`
              : "Selecione um serviço primeiro"
          }
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min={selectedService ? parseInt(selectedService.min) : undefined}
          max={selectedService ? parseInt(selectedService.max) : undefined}
          className="w-full rounded-lg border border-border bg-secondary px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring font-mono"
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
        <label className="text-sm font-bold text-foreground">
          Valor estimado
        </label>
        <input
          type="text"
          readOnly
          value={
            estimatedCost > 0
              ? `R$ ${estimatedCost.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : "R$ 0,00"
          }
          className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm text-muted-foreground font-mono outline-none cursor-default"
        />
      </div>

      {/* Submit message */}
      {submitMessage && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            submitMessage.type === "success"
              ? "border-primary/40 bg-primary/10 text-accent"
              : "border-destructive/40 bg-destructive/10 text-destructive"
          }`}
        >
          {submitMessage.text}
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={submitting || !selectedService}
        className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Enviando...
          </span>
        ) : (
          "Enviar"
        )}
      </button>
    </div>
  )
}
