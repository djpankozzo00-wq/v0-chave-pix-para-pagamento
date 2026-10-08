import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser, getSupabaseConfig, isPixAdmin } from "@/lib/pix-auth"

export const runtime = "nodejs"

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthenticatedUser()
  if (!session) return NextResponse.json({ error: "Entre na sua conta para continuar." }, { status: 401 })
  if (!isPixAdmin(session.user.email)) return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 })

  const { id } = await context.params
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json({ error: "Solicitação inválida." }, { status: 400 })
  }

  const config = getSupabaseConfig()
  if (!config) return NextResponse.json({ error: "Banco de dados não configurado." }, { status: 500 })

  const response = await fetch(`${config.url}/rest/v1/rpc/approve_pix_deposit`, {
    method: "POST",
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ p_deposit_id: id }),
    cache: "no-store",
  })
  const result = await response.json().catch(() => null)
  if (!response.ok) {
    const message = JSON.stringify(result || "")
    const status = /já processada|not found|não encontrada/i.test(message) ? 409 : response.status
    return NextResponse.json({ error: status === 409 ? "Esta solicitação já foi processada ou não existe." : "Não foi possível aprovar o depósito." }, { status })
  }
  return NextResponse.json({ ok: true, result })
}
