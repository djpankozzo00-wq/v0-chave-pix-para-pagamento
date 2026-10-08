import { NextResponse } from "next/server"
import { getAuthenticatedUser, getSupabaseConfig } from "@/lib/pix-auth"

export const runtime = "nodejs"

export async function GET() {
  const session = await getAuthenticatedUser()
  if (!session) return NextResponse.json({ error: "Entre na sua conta para continuar." }, { status: 401 })

  const config = getSupabaseConfig()
  if (!config) return NextResponse.json({ error: "Banco de dados não configurado." }, { status: 500 })

  const response = await fetch(
    `${config.url}/rest/v1/user_balances?select=balance&user_id=eq.${encodeURIComponent(session.user.id)}&limit=1`,
    { headers: { apikey: config.key, Authorization: `Bearer ${session.accessToken}` }, cache: "no-store" },
  )
  const rows = await response.json().catch(() => null)
  if (!response.ok) return NextResponse.json({ error: "Não foi possível consultar o saldo." }, { status: response.status })
  const balance = Array.isArray(rows) && rows.length ? Number(rows[0].balance) : 0
  return NextResponse.json({ balance: Number.isFinite(balance) ? balance : 0 })
}
