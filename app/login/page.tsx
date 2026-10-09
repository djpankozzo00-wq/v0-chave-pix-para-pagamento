"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LockKeyhole, Mail, UserRound } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<"login" | "register" | "recover">("login")
  const [notice, setNotice] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setNotice("")
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, name, email, password }),
      })
      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Não foi possível concluir. Tente novamente.")
        return
      }

      setNotice(result.message || "Operação concluída.")
      if (result.ok && mode === "recover") {
        setNotice(result.message || "Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha.")
        return
      }
      if (result.ok && !result.needsEmailConfirmation && mode === "login") {
        router.push("/")
        router.refresh()
      }
      if (result.ok && !result.needsEmailConfirmation && mode === "register") {
        router.push("/")
        router.refresh()
      }
    } catch {
      setError("Não foi possível conectar ao serviço. Verifique sua internet e tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  function changeMode(nextMode: "login" | "register" | "recover") {
    setMode(nextMode)
    setNotice("")
    setError("")
  }

  return <main className="flex min-h-screen items-center justify-center bg-[#080b10] px-4 py-10 text-white">
    <div className="w-full max-w-md">
      <div className="rounded-3xl border border-white/10 bg-[#10161e] p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300"><LockKeyhole className="h-6 w-6" /></div>
        <h1 className="text-2xl font-black">{mode === "login" ? "Bem-vindo de volta" : mode === "register" ? "Crie sua conta" : "Recuperar senha"}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">{mode === "login" ? "Entre para acessar seu painel de serviços." : mode === "register" ? "Cadastre-se para organizar seus pedidos e saldo." : "Informe seu e-mail para receber o link de recuperação."}</p>
        {mode !== "recover" && <div className="mt-6 grid grid-cols-2 rounded-xl bg-black/30 p-1 text-sm">
          <button type="button" onClick={() => changeMode("login")} className={`rounded-lg px-3 py-2 font-semibold ${mode === "login" ? "bg-emerald-400 text-slate-950" : "text-slate-400"}`}>Entrar</button>
          <button type="button" onClick={() => changeMode("register")} className={`rounded-lg px-3 py-2 font-semibold ${mode === "register" ? "bg-emerald-400 text-slate-950" : "text-slate-400"}`}>Cadastrar</button>
        </div>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {mode === "register" && <label className="block text-sm font-medium">Nome completo<div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3"><UserRound className="h-4 w-4 text-slate-500" /><input required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-transparent py-3 outline-none" placeholder="Seu nome" /></div></label>}
          <label className="block text-sm font-medium">E-mail<div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3"><Mail className="h-4 w-4 text-slate-500" /><input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent py-3 outline-none" placeholder="voce@email.com" /></div></label>
          {mode !== "recover" && <label className="block text-sm font-medium">Senha<div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3"><LockKeyhole className="h-4 w-4 text-slate-500" /><input required minLength={6} type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent py-3 outline-none" placeholder="Mínimo de 6 caracteres" /></div></label>}
          {mode === "login" && <button type="button" onClick={() => changeMode("recover")} className="text-sm font-semibold text-emerald-300 hover:text-emerald-200">Esqueci minha senha</button>}
          <button disabled={loading} className="w-full rounded-xl bg-emerald-400 px-4 py-3 font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Aguarde..." : mode === "login" ? "Entrar na conta" : mode === "register" ? "Criar conta" : "Enviar link de recuperação"}</button>
        </form>
        {notice && <p role="status" className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm leading-5 text-emerald-200">{notice}</p>}
        {error && <p role="alert" className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm leading-5 text-rose-200">{error}</p>}
        {mode === "recover" && <button type="button" onClick={() => changeMode("login")} className="mt-4 w-full text-sm text-slate-400 hover:text-white">Voltar para entrar</button>}
        <p className="mt-5 text-xs leading-5 text-slate-500">Suas credenciais são verificadas pelo serviço seguro de autenticação do Supabase.</p>
      </div>
    </div>
  </main>
}
