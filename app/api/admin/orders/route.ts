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
    select: "id,user_email,service_id,service_name,target_link,quantity,cost,provider_order_id,status,error_message,delivery_message,created_at,updated_at",
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


export async function PATCH(request: Request) {
  const session = await getAuthenticatedUser()
  if (!session) return NextResponse.json({ error: "Entre na sua conta para continuar." }, { status: 401 })
  if (!isPixAdmin(session.user.email)) {
    return NextResponse.json({ error: "Acesso restrito ao administrador." }, { status: 403 })
  }

  const config = getSupabaseConfig()
  if (!config) return NextResponse.json({ error: "Banco de dados não configurado." }, { status: 500 })

  try {
    const body = await request.json()
    const orderId = typeof body?.orderId === "string" ? body.orderId : ""
    const status = typeof body?.status === "string" ? body.status : ""
    const deliveryMessage = typeof body?.deliveryMessage === "string" ? body.deliveryMessage.slice(0, 1000) : ""

    if (!orderId || !["pending_manual", "processing_manual", "completed"].includes(status)) {
      return NextResponse.json({ error: "Pedido ou status inválido." }, { status: 400 })
    }

    const response = await fetch(`${config.url}/rest/v1/rpc/admin_update_social_order`, {
      method: "POST",
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_order_id: orderId,
        p_status: status,
        p_delivery_message: deliveryMessage || null,
      }),
      cache: "no-store",
    })
    const result = await response.json().catch(() => null)
    if (!response.ok || result !== true) {
      return NextResponse.json({ error: "Não foi possível atualizar o pedido." }, { status: response.ok ? 404 : response.status })
    }

    return NextResponse.json({ ok: true, message: status === "completed" ? "Pedido marcado como entregue ao cliente." : "Status do pedido atualizado." })
  } catch {
    return NextResponse.json({ error: "Não foi possível atualizar o pedido." }, { status: 500 })
  }
}
