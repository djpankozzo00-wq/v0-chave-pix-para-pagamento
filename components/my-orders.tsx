"use client"

import { useCallback, useEffect, useState } from "react"
import { ClipboardList, RefreshCw, Clock3, ExternalLink } from "lucide-react"

type SocialOrder = {
  id: string
  service_id: number
  service_name: string
  target_link: string
  quantity: number
  cost: number | string
  provider_order_id: number | null
  status: string
  error_message?: string | null
  delivery_message?: string | null
  created_at: string
  updated_at?: string
}

function statusLabel(status: string) {
  const normalized = (status || "").toLowerCase()
  if (["pending_manual", "pending", "submitted", "awaiting"].includes(normalized)) return "Pedido recebido — aguardando atendimento"
  if (["processing_manual", "processing", "in_progress", "in progress"].includes(normalized)) return "Em andamento"
  if (["completed", "complete", "success"].includes(normalized)) return "Pedido entregue / concluído"
  if (["partial", "partially_completed"].includes(normalized)) return "Concluído parcialmente"
  if (["failed", "canceled", "cancelled", "refunded"].includes(normalized)) return "Falhou / cancelado"
  return status || "Aguardando atualização"
}

function statusStyle(status: string) {
  const normalized = (status || "").toLowerCase()
  if (["completed", "complete", "success"].includes(normalized)) return "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
  if (["failed", "canceled", "cancelled", "refunded"].includes(normalized)) return "border-rose-400/20 bg-rose-400/10 text-rose-200"
  return "border-amber-400/20 bg-amber-400/10 text-amber-100"
}

export function MyOrders() {
  const [orders, setOrders] = useState<SocialOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadOrders = useCallback(async () => {
    try {
      const response = await fetch("/api/orders", { cache: "no-store" })
      const result = await response.json()
      if (!response.ok) {
        setError(result.error || "Não foi possível carregar seus pedidos.")
        return
      }
      setOrders(Array.isArray(result.orders) ? result.orders : [])
      setError("")
    } catch {
      setError("Não foi possível atualizar seus pedidos.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadOrders()
    const timer = window.setInterval(() => void loadOrders(), 8000)
    return () => window.clearInterval(timer)
  }, [loadOrders])

  return (
    <section id="meus-pedidos" className="mt-6 scroll-mt-6 rounded-2xl border border-white/10 bg-[#0e141c] p-4 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-3">
          <ClipboardList className="h-5 w-5 text-emerald-300" />
          <div>
            <h2 className="font-semibold">Meus pedidos</h2>
            <p className="mt-1 text-xs text-slate-400">Atualização automática a cada 8 segundos.</p>
          </div>
        </div>
        <button onClick={() => void loadOrders()} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/5">
          <RefreshCw className="h-4 w-4" /> Atualizar
        </button>
      </div>

      {error && <p role="alert" className="mt-4 rounded-lg border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p>}
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-400"><RefreshCw className="h-4 w-4 animate-spin" /> Carregando seus pedidos...</div>
      ) : orders.length === 0 ? (
        <div className="py-10 text-center">
          <Clock3 className="mx-auto h-8 w-8 text-slate-500" />
          <p className="mt-3 font-semibold">Você ainda não tem pedidos</p>
          <p className="mt-1 text-sm text-slate-400">Quando enviar um pedido, ele aparecerá aqui para você acompanhar.</p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {orders.map((order) => (
            <article key={order.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-bold">{order.service_name}</h3>
                  <p className="mt-1 text-xs text-slate-500">Pedido #{order.provider_order_id ?? order.id.slice(0, 8)}</p>
                </div>
                <strong className="text-sm">{Number(order.cost).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong>
              </div>
              <p className={`mt-3 inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyle(order.status)}`}>{statusLabel(order.status)}</p>
              <div className="mt-3 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                <p>Quantidade: <b>{Number(order.quantity).toLocaleString("pt-BR")}</b></p>
                <p>ID do serviço: <b>{order.service_id}</b></p>
                <p>Data: <b>{new Date(order.created_at).toLocaleString("pt-BR")}</b></p>
              </div>
              <a className="mt-3 inline-flex max-w-full items-center gap-2 break-all text-sm text-sky-300 underline" href={order.target_link} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4 shrink-0" /> Ver link enviado
              </a>
              {order.delivery_message && <p className="mt-3 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-100"><b>Mensagem do administrador:</b> {order.delivery_message}</p>}
              {order.delivery_message && <p className="mt-3 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-100"><b>Mensagem do administrador:</b> {order.delivery_message}</p>}
              {order.error_message && <p className="mt-3 text-sm text-rose-200">{order.error_message}</p>}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
