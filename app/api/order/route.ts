import { NextResponse } from "next/server"
import { getServices } from "@/lib/instabarato"
import { getAuthenticatedUser, getSupabaseConfig } from "@/lib/pix-auth"

export const runtime = "nodejs"

async function callUserRpc(
  config: { url: string; key: string },
  accessToken: string,
  name: string,
  body: Record<string, unknown>,
) {
  const response = await fetch(`${config.url}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  })
  const result = await response.json().catch(() => null)
  if (!response.ok) {
    const message = JSON.stringify(result || "")
    if (/Insufficient balance/i.test(message)) {
      throw new Error("Saldo insuficiente. Adicione saldo para continuar.")
    }
    throw new Error("Não foi possível registrar a cobrança do pedido.")
  }
  return result
}

function money(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export async function POST(request: Request) {
  const session = await getAuthenticatedUser()
  if (!session) {
    return NextResponse.json({ error: "Entre na sua conta para enviar um pedido." }, { status: 401 })
  }

  const config = getSupabaseConfig()
  if (!config) {
    return NextResponse.json({ error: "Banco de dados não configurado." }, { status: 500 })
  }

  let reservedOrderId: string | null = null

  try {
    const body = await request.json()
    const serviceId = Number(body?.serviceId)
    const quantity = Number(body?.quantity)
    const link = typeof body?.link === "string" ? body.link.trim() : ""

    if (!Number.isSafeInteger(serviceId) || serviceId <= 0 ||
        !Number.isSafeInteger(quantity) || quantity <= 0 || !link) {
      return NextResponse.json({ error: "Informe um serviço, link e quantidade válidos." }, { status: 400 })
    }

    let target: URL
    try {
      target = new URL(link)
    } catch {
      return NextResponse.json({ error: "Informe um link válido começando com https://." }, { status: 400 })
    }
    if (target.protocol !== "https:" && target.protocol !== "http:") {
      return NextResponse.json({ error: "O link precisa usar http ou https." }, { status: 400 })
    }

    const services = await getServices()
    if (!Array.isArray(services)) {
      throw new Error("O fornecedor não retornou a lista de serviços.")
    }
    const service = services.find((item: any) => Number(item?.service) === serviceId)
    if (!service) {
      return NextResponse.json({ error: "Serviço não encontrado ou indisponível." }, { status: 400 })
    }

    const rate = Number(service.rate)
    const min = Number(service.min)
    const max = Number(service.max)
    if (!Number.isFinite(rate) || rate <= 0 || !Number.isSafeInteger(min) ||
        !Number.isSafeInteger(max) || quantity < min || quantity > max) {
      return NextResponse.json({
        error: `A quantidade deve estar entre ${Number.isFinite(min) ? min : "—"} e ${Number.isFinite(max) ? max : "—"}.`,
      }, { status: 400 })
    }

    // Mantém o preço de venda atual do painel: duas vezes a tarifa do fornecedor.
    const cost = money((rate * quantity * 2) / 1000)
    if (!Number.isFinite(cost) || cost <= 0) {
      return NextResponse.json({ error: "Não foi possível calcular o valor do pedido." }, { status: 400 })
    }

    const reserveResult = await callUserRpc(config, session.accessToken, "reserve_social_order", {
      p_service_id: serviceId,
      p_service_name: String(service.name || `Serviço ${serviceId}`).slice(0, 250),
      p_target_link: link,
      p_quantity: quantity,
      p_cost: cost,
      p_user_email: session.user.email || "",
    })
    const reserved = (Array.isArray(reserveResult) ? reserveResult[0] : reserveResult) as {
      order_id?: string
      remaining_balance?: number
    } | null

    reservedOrderId = reserved?.order_id || null
    if (!reservedOrderId) {
      throw new Error("Não foi possível reservar o pedido e cobrar o saldo.")
    }

    // O pedido fica registrado no painel para execução manual pelo administrador.
    // Nenhuma ordem é enviada automaticamente ao fornecedor.
    return NextResponse.json({
      ok: true,
      order: reservedOrderId,
      orderId: reservedOrderId,
      cost,
      balance: Number(reserved.remaining_balance),
      status: "pending_manual",
      message: "Pedido recebido! Aguarde enquanto o administrador prepara seu pedido.",
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao criar pedido. Tente novamente." },
      { status: 500 },
    )
  }
}
