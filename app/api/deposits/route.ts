import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser, getSupabaseConfig, isPixAdmin } from "@/lib/pix-auth"

export const runtime = "nodejs"

export async function GET() {
  const session = await getAuthenticatedUser()
  if (!session) return NextResponse.json({ error: "Entre na sua conta para continuar." }, { status: 401 })
  if (!isPixAdmin(session.user.email)) return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 })

  const config = getSupabaseConfig()
  if (!config) return NextResponse.json({ error: "Banco de dados não configurado." }, { status: 500 })

  const response = await fetch(
    `${config.url}/rest/v1/pix_deposit_requests?select=id,user_email,amount,status,created_at&status=eq.pending&order=created_at.desc`,
    { headers: { apikey: config.key, Authorization: `Bearer ${session.accessToken}` }, cache: "no-store" },
  )
  const rows = await response.json().catch(() => [])
  if (!response.ok) return NextResponse.json({ error: "Não foi possível carregar as solicitações." }, { status: response.status })
  return NextResponse.json({ requests: rows })
}

export async function POST(request: NextRequest) {
  const session = await getAuthenticatedUser()
  if (!session) return NextResponse.json({ error: "Entre na sua conta para solicitar um depósito." }, { status: 401 })

  const config = getSupabaseConfig()
  if (!config) return NextResponse.json({ error: "Banco de dados não configurado." }, { status: 500 })

  try {
    const body = await request.json()
    const amount = Number(body.amount)
    if (!Number.isFinite(amount) || amount < 1 || amount > 10000) {
      return NextResponse.json({ error: "Informe um valor entre R$ 1,00 e R$ 10.000,00." }, { status: 400 })
    }
    const roundedAmount = Math.round(amount * 100) / 100
    const response = await fetch(`${config.url}/rest/v1/pix_deposit_requests`, {
      method: "POST",
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        user_id: session.user.id,
        user_email: (session.user.email || "").toLowerCase(),
        amount: roundedAmount,
        status: "pending",
      }),
      cache: "no-store",
    })
    const result = await response.json().catch(() => null)
    if (!response.ok) return NextResponse.json({ error: "Não foi possível registrar a solicitação. Tente novamente." }, { status: response.status })
    return NextResponse.json({ ok: true, request: Array.isArray(result) ? result[0] : result })
  } catch {
    return NextResponse.json({ error: "Informe um valor válido e tente novamente." }, { status: 400 })
  }
}
