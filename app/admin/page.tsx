"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, CircleDollarSign, ClipboardList, ShieldCheck, RefreshCw, CheckCircle2, Clock3, Copy, PackageCheck, PlayCircle } from "lucide-react"


type SocialOrder = {
  id: string; user_email: string; service_id: number; service_name: string;
  target_link: string; quantity: number; cost: number | string;
  provider_order_id: number | null; status: string; delivery_message?: string | null; created_at: string;
}

type DepositRequest = {
  id: string
  user_email: string
  amount: number | string
  status: string
  created_at: string
}

export default function AdminPage() {
  const [requests, setRequests] = useState<DepositRequest[]>([])
  const [orders, setOrders] = useState<SocialOrder[]>([])
  const [ordersError, setOrdersError] = useState("")
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [approving, setApproving] = useState("")
  const [updatingOrder, setUpdatingOrder] = useState("")
  const [deliveryMessages, setDeliveryMessages] = useState<Record<string, string>>({})

  const loadRequests = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/deposits", { cache: "no-store" })
      const result = await response.json()
      if (!response.ok) {
        setError(result.error || "Não foi possível carregar as solicitações.")
        setRequests([])
      } else {
        setRequests(result.requests || [])
      }
    } catch {
      setError("Não foi possível conectar ao servidor.")
    } finally {
      setLoading(false)
    }
  }, [])

  const loadOrders = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/orders", { cache: "no-store" })
      const result = await response.json()
      if (!response.ok) { setOrdersError(result.error || "Não foi possível carregar compras."); return }
      setOrders(result.orders || [])
      setOrdersError("")
    } catch { setOrdersError("Não foi possível atualizar compras.") }
    finally { setOrdersLoading(false) }
  }, [])

  useEffect(() => {
    void loadRequests(); void loadOrders()
    const timer = window.setInterval(() => { void loadRequests(); void loadOrders() }, 8000)
    return () => window.clearInterval(timer)
  }, [loadRequests, loadOrders])

  async function updateOrder(orderId: string, status: "pending_manual" | "processing_manual" | "completed") {
    setUpdatingOrder(orderId)
    setOrdersError("")
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          status,
          deliveryMessage: deliveryMessages[orderId] || "",
        }),
      })
      const result = await response.json()
      if (!response.ok) {
        setOrdersError(result.error || "Não foi possível atualizar o pedido.")
        return
      }
      await loadOrders()
    } catch {
      setOrdersError("Não foi possível atualizar o pedido.")
    } finally {
      setUpdatingOrder("")
    }
  }

  async function approve(id: string) {
    setApproving(id)
    setError("")
    setNotice("")
    try {
      const response = await fetch(`/api/admin/deposits/${id}`, { method: "POST" })
      const result = await response.json()
      if (!response.ok) {
        setError(result.error || "Não foi possível aprovar o depósito.")
        return
      }
      setNotice("Depósito aprovado e saldo creditado no banco de dados.")
      await loadRequests()
    } catch {
      setError("Não foi possível conectar ao servidor.")
    } finally {
      setApproving("")
    }
  }

  return <main className="min-h-screen bg-[#080b10] px-4 py-8 text-white sm:px-6">
    <div className="mx-auto max-w-6xl">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Voltar ao site</Link>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div><p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">Área administrativa</p><h1 className="mt-2 text-3xl font-black">Aprovação de PIX</h1><p className="mt-2 text-slate-400">Confira o recebimento no Nubank antes de aprovar qualquer solicitação.</p></div>
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-200"><ShieldCheck className="h-4 w-4" /> Acesso restrito ao administrador</span>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-[#10161e] p-5"><div className="flex items-center gap-2 text-slate-400"><ClipboardList className="h-5 w-5" /><p className="text-sm">Solicitações pendentes</p></div><p className="mt-3 text-3xl font-black">{requests.length}</p></section>
        <section className="rounded-2xl border border-white/10 bg-[#10161e] p-5"><div className="flex items-center gap-2 text-slate-400"><CircleDollarSign className="h-5 w-5" /><p className="text-sm">Total aguardando conferência</p></div><p className="mt-3 text-3xl font-black">{requests.reduce((sum, item) => sum + Number(item.amount || 0), 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p></section>
      </div>

      <section className="mt-6 rounded-2xl border border-emerald-400/20 bg-[#10161e] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-bold">Compras dos usuários</h2><p className="mt-1 text-sm text-slate-400">Pedidos recebidos aqui para você executar manualmente no fornecedor. Nenhum pedido é enviado automaticamente.</p></div><button onClick={() => void loadOrders()} className="rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/5"><RefreshCw className="mr-2 inline h-4 w-4" />Atualizar compras</button></div>
        {ordersError && <p className="mt-3 text-sm text-rose-300">{ordersError}</p>}
        {ordersLoading ? <p className="py-8 text-center text-slate-400">Carregando compras...</p> : orders.length === 0 ? <p className="py-8 text-center text-slate-400">Nenhuma compra registrada ainda.</p> : <div className="mt-4 space-y-3">{orders.map((order) => <article key={order.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
          <div className="flex flex-wrap justify-between gap-2"><div><h3 className="font-bold">{order.service_name}</h3><p className="mt-1 text-xs text-slate-500">Cliente: {order.user_email || "Não informado"}</p></div><strong>{Number(order.cost).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong></div>
          <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2"><p>Quantidade: <b>{order.quantity}</b></p><p>ID serviço fornecedor: <b>{order.service_id}</b></p><p>ID pedido fornecedor: <b>{order.provider_order_id ?? "Ainda não enviado"}</b></p><p>Status: <b>{order.status === "pending_manual" ? "Aguardando execução manual" : order.status === "processing_manual" ? "Em andamento (manual)" : order.status === "completed" ? "Entregue ao cliente" : order.status}</b></p></div>
          <p className="mt-3 break-all text-sm"><span className="text-slate-400">Link:</span> <a className="text-sky-300 underline" href={order.target_link} target="_blank" rel="noreferrer">{order.target_link}</a></p>
          <p className="mt-2 text-xs text-slate-500">Comprado em {new Date(order.created_at).toLocaleString("pt-BR")}</p>
          <button onClick={() => void navigator.clipboard.writeText("Serviço: " + order.service_name + "\nID do serviço: " + order.service_id + "\nLink: " + order.target_link + "\nQuantidade: " + order.quantity + "\nCliente: " + order.user_email + "\nPedido do painel: " + order.id)} className="mt-3 rounded-lg bg-emerald-400 px-3 py-2 text-sm font-bold text-slate-950"><Copy className="mr-2 inline h-4 w-4" />Copiar dados para fornecedor</button>
          <div className="mt-4 space-y-2 rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <label className="block text-xs font-semibold text-slate-300">Mensagem para o cliente (opcional)</label>
            <textarea value={deliveryMessages[order.id] ?? order.delivery_message ?? ""} onChange={(e) => setDeliveryMessages((prev) => ({ ...prev, [order.id]: e.target.value }))} placeholder="Ex.: Pedido concluído. Obrigado pela compra!" rows={2} className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-slate-500" />
            <div className="flex flex-wrap gap-2">
              <button disabled={updatingOrder === order.id} onClick={() => void updateOrder(order.id, "processing_manual")} className="rounded-lg border border-sky-400/30 px-3 py-2 text-sm font-semibold text-sky-200 disabled:opacity-50"><PlayCircle className="mr-1 inline h-4 w-4" />{updatingOrder === order.id ? "Salvando..." : "Marcar em andamento"}</button>
              <button disabled={updatingOrder === order.id} onClick={() => void updateOrder(order.id, "completed")} className="rounded-lg bg-emerald-400 px-3 py-2 text-sm font-bold text-slate-950 disabled:opacity-50"><PackageCheck className="mr-1 inline h-4 w-4" />Marcar como entregue</button>
            </div>
            {order.delivery_message && <p className="text-xs text-slate-400">Mensagem registrada: {order.delivery_message}</p>}
          </div>
        </article>)}</div>}
      </section>

      <section className="mt-6 rounded-2xl border border-white/10 bg-[#10161e] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-bold">Solicitações de depósito</h2><p className="mt-1 text-sm text-slate-400">Aprove somente depois de confirmar o valor e o recebimento no aplicativo do banco.</p></div><button onClick={() => void loadRequests()} disabled={loading} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/5 disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Atualizar</button></div>
        {notice && <p role="status" className="mt-4 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-200"><CheckCircle2 className="mr-2 inline h-4 w-4" />{notice}</p>}
        {error && <p role="alert" className="mt-4 rounded-lg border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p>}
        {loading ? <p className="py-10 text-center text-sm text-slate-400">Carregando solicitações...</p> : requests.length === 0 && !error ? <div className="py-10 text-center"><Clock3 className="mx-auto h-8 w-8 text-slate-500" /><p className="mt-3 font-semibold">Nenhuma solicitação pendente</p><p className="mt-1 text-sm text-slate-400">Quando alguém solicitar um depósito, ele aparecerá aqui.</p></div> : <div className="mt-5 space-y-3">{requests.map((item) => <div key={item.id} className="flex flex-col gap-4 rounded-xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold">{Number(item.amount).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p><p className="mt-1 text-sm text-slate-300">{item.user_email}</p><p className="mt-1 text-xs text-slate-500">Solicitado em {new Date(item.created_at).toLocaleString("pt-BR")}</p></div><button onClick={() => void approve(item.id)} disabled={!!approving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50">{approving === item.id ? "Aprovando..." : "Confirmar recebimento e creditar"}</button></div>)}</div>}
      </section>
      <p className="mt-5 text-xs leading-5 text-slate-500">Importante: nunca aprove apenas com base no comprovante enviado pelo usuário. Confirme a entrada diretamente no extrato do Nubank. A aprovação é única e não pode creditar a mesma solicitação duas vezes.</p>
    </div>
  </main>
}
