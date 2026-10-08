"use client"

import Link from "next/link"
import { ArrowLeft, CircleDollarSign, ClipboardList, ShieldCheck, Users } from "lucide-react"

const stats = [
  { label: "Usuários cadastrados", value: "—", icon: Users, note: "Conecte o banco de dados para exibir" },
  { label: "Pedidos recebidos", value: "—", icon: ClipboardList, note: "Dados reais ainda não conectados" },
  { label: "Pagamentos PIX", value: "—", icon: CircleDollarSign, note: "Integração de pagamentos pendente" },
]

export default function AdminPage() {
  return <main className="min-h-screen bg-[#080b10] px-4 py-8 text-white sm:px-6">
    <div className="mx-auto max-w-6xl">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Voltar ao site</Link>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div><p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">Área administrativa</p><h1 className="mt-2 text-3xl font-black">Visão geral</h1><p className="mt-2 text-slate-400">Estrutura inicial para administrar sua plataforma.</p></div>
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-xs font-semibold text-amber-200"><ShieldCheck className="h-4 w-4" /> Demonstração sem autenticação</span>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {stats.map(({label,value,icon:Icon,note}) => <section key={label} className="rounded-2xl border border-white/10 bg-[#10161e] p-5"><div className="flex items-center justify-between"><p className="text-sm text-slate-400">{label}</p><Icon className="h-5 w-5 text-emerald-300" /></div><p className="mt-4 text-3xl font-black">{value}</p><p className="mt-2 text-xs text-slate-500">{note}</p></section>)}
      </div>
      <section className="mt-6 rounded-2xl border border-white/10 bg-[#10161e] p-5 sm:p-6"><h2 className="text-lg font-bold">Próximas integrações</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-white/10 p-4"><h3 className="font-semibold">Gestão de serviços e pedidos</h3><p className="mt-1 text-sm leading-6 text-slate-400">Criar, editar e acompanhar serviços e pedidos conectados ao banco de dados.</p></div><div className="rounded-xl border border-white/10 p-4"><h3 className="font-semibold">Usuários e permissões</h3><p className="mt-1 text-sm leading-6 text-slate-400">Implementar autenticação, papéis de acesso e proteção das rotas administrativas.</p></div><div className="rounded-xl border border-white/10 p-4"><h3 className="font-semibold">Pagamentos PIX</h3><p className="mt-1 text-sm leading-6 text-slate-400">Integrar um provedor de pagamentos e confirmar transações pelo servidor.</p></div><div className="rounded-xl border border-white/10 p-4"><h3 className="font-semibold">Relatórios</h3><p className="mt-1 text-sm leading-6 text-slate-400">Exibir métricas reais de pedidos, usuários e movimentações financeiras.</p></div></div></section>
    </div>
  </main>
}
