"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, CircleDollarSign, ClipboardList, ShieldCheck, RefreshCw, CheckCircle2, Clock3 } from "lucide-react"

type DepositRequest = {
  id: string
  user_email: string
  amount: number | string
  status: string
  created_at: string
}

export default function AdminPage() {
  const [requests, setRequests] = useState<DepositRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [approving, setApproving] = useState("")

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

  useEffect(() => { void loadRequests() }, [loadRequests])

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
