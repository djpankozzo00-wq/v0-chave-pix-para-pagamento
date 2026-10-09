import { NextResponse } from "next/server"
import { getAuthenticatedUser, getSupabaseConfig, isPixAdmin } from "@/lib/pix-auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const session = await getAuthenticatedUser()
  if (!session) return NextResponse.json({ error: "Entre na sua conta para continuar." }, { status: 401 })
  if (!isPixAdmin(session.user.email)) {
    return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 })
  }

  const config = getSupabaseConfig()
  if (!config) return NextResponse.json({ error: "Banco de dados não configurado." }, { status: 500 })

  const query = new URLSearchParams({
    select: "id,user_email,service_id,service_name,target_link,quantity,cost,provider_order_id,status,error_message,created_at,updated_at",
    order: "created_at.desc",
    limit: "100",
  })
  const response = await fetch(`${config.url}/rest/v1/social_orders?${query.toString()}`, {
    headers: { apikey: config.key, Authorization: `Bearer ${session.accessToken}` },
    cache: "no-store",
  })
  const result = await response.json().catch(() => null)
  if (!response.ok) {
    return NextResponse.json({ error: "Não foi possível carregar os pedidos." }, { status: response.status })
  }

  const rows = Array.isArray(result) ? result : []
  return NextResponse.json({ orders: rows })
}
