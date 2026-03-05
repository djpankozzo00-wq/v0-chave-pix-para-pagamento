import { NextResponse } from "next/server"
import { createOrder } from "@/lib/instabarato"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { serviceId, link, quantity } = body

    if (!serviceId || !link || !quantity) {
      return NextResponse.json(
        { error: "Campos obrigatorios: serviceId, link, quantity" },
        { status: 400 }
      )
    }

    const result = await createOrder({
      serviceId: Number(serviceId),
      link: String(link),
      quantity: Number(quantity),
    })

    return NextResponse.json(result)
  } catch {
    return NextResponse.json(
      { error: "Erro ao criar pedido. Tente novamente." },
      { status: 500 }
    )
  }
}
