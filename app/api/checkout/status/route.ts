import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const transactionId = searchParams.get("transactionId")

  if (!transactionId) {
    return NextResponse.json(
      { error: "ID da transacao nao informado." },
      { status: 400 }
    )
  }

  // Check order status from global store
  const order = global.pendingOrders?.get(transactionId)

  if (!order) {
    return NextResponse.json(
      { error: "Transacao nao encontrada." },
      { status: 404 }
    )
  }

  return NextResponse.json({
    status: order.status,
    transactionId,
  })
}
