"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, LockKeyhole, Mail, UserRound } from "lucide-react"

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [notice, setNotice] = useState("")
  return <main className="flex min-h-screen items-center justify-center bg-[#080b10] px-4 py-10 text-white">
    <div className="w-full max-w-md">
      <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Voltar ao início</Link>
      <div className="rounded-3xl border border-white/10 bg-[#10161e] p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300"><LockKeyhole className="h-6 w-6" /></div>
        <h1 className="text-2xl font-black">{mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">{mode === "login" ? "Entre para acessar seu painel de serviços." : "Cadastre-se para organizar seus pedidos e saldo."}</p>
        <div className="mt-6 grid grid-cols-2 rounded-xl bg-black/30 p-1 text-sm">
          <button onClick={() => { setMode("login"); setNotice("") }} className={`rounded-lg px-3 py-2 font-semibold ${mode === "login" ? "bg-emerald-400 text-slate-950" : "text-slate-400"}`}>Entrar</button>
          <button onClick={() => { setMode("register"); setNotice("") }} className={`rounded-lg px-3 py-2 font-semibold ${mode === "register" ? "bg-emerald-400 text-slate-950" : "text-slate-400"}`}>Cadastrar</button>
        </div>
        <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); setNotice("Esta é a interface inicial. O login real será ativado quando conectarmos um backend seguro.") }}>
          {mode === "register" && <label className="block text-sm font-medium">Nome completo<div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3"><UserRound className="h-4 w-4 text-slate-500" /><input required autoComplete="name" className="w-full bg-transparent py-3 outline-none" placeholder="Seu nome" /></div></label>}
          <label className="block text-sm font-medium">E-mail<div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3"><Mail className="h-4 w-4 text-slate-500" /><input required type="email" autoComplete="email" className="w-full bg-transparent py-3 outline-none" placeholder="voce@email.com" /></div></label>
          <label className="block text-sm font-medium">Senha<div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3"><LockKeyhole className="h-4 w-4 text-slate-500" /><input required minLength={6} type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} className="w-full bg-transparent py-3 outline-none" placeholder="Mínimo de 6 caracteres" /></div></label>
          <button className="w-full rounded-xl bg-emerald-400 px-4 py-3 font-bold text-slate-950 transition hover:bg-emerald-300">{mode === "login" ? "Entrar na conta" : "Criar conta"}</button>
        </form>
        {notice && <p role="status" className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm leading-5 text-amber-200">{notice}</p>}
        <p className="mt-5 text-xs leading-5 text-slate-500">Versão de interface: nenhum dado é enviado ou armazenado por este formulário.</p>
      </div>
    </div>
  </main>
}
