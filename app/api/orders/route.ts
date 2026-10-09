import { NextResponse } from "next/server"
import { getAuthenticatedUser, getSupabaseConfig } from "@/lib/pix-auth"

export const runtime = "nodejs"

export async function GET() {
  const session = await getAuthenticatedUser()
  if (!session) {
    return NextResponse.json({ error: "Entre na sua conta para acompanhar seus pedidos." }, { status: 401 })
  }

  const config = getSupabaseConfig()
  if (!config) {
    return NextResponse.json({ error: "Banco de dados não configurado." }, { status: 500 })
  }

  try {
    const response = await fetch(
      `${config.url}/rest/v1/social_orders?select=id,service_id,service_name,target_link,quantity,cost,provider_order_id,status,error_message,delivery_message,created_at,updated_at&order=created_at.desc&limit=100`,
      {
        headers: {
          apikey: config.key,
          Authorization: `Bearer ${session.accessToken}`,
        },
        cache: "no-store",
      },
    )
    const result = await response.json().catch(() => null)
    if (!response.ok) {
      return NextResponse.json({ error: "Não foi possível carregar seus pedidos." }, { status: response.status })
    }
    const orders = Array.isArray(result) ? result : []
    return NextResponse.json({ orders }, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    })
  } catch {
    return NextResponse.json({ error: "Erro ao consultar seus pedidos." }, { status: 500 })
  }
}
