import { NextResponse } from "next/server"
import { createOrder } from "@/lib/instabarato"

// Webhook called by SyncPay when payment status changes
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const externalId = body.external_id || body.externalId
    const status = body.status

    if (!externalId) {
      return NextResponse.json({ error: "Missing external_id" }, { status: 400 })
    }

    const order = global.pendingOrders?.get(externalId)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Payment confirmed
    if (status === "paid" || status === "completed" || status === "approved") {
      order.status = "paid"
      global.pendingOrders.set(externalId, order)

      // Auto-create order on InstaBarato
      try {
        // Parse quantity (remove dots for thousands)
        const qty = parseInt(order.quantity.replace(/\./g, ""), 10)

        const instaOrder = await createOrder({
          serviceId: 1, // Default service ID - will be mapped properly in production
          link: order.profileUrl,
          quantity: qty,
        })

        order.instaOrderId = instaOrder.order
        order.status = "completed"
        global.pendingOrders.set(externalId, order)
      } catch (err) {
        console.error("Erro ao criar pedido InstaBarato:", err)
        // Payment confirmed but order creation failed - needs manual handling
        order.status = "paid"
        global.pendingOrders.set(externalId, order)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Erro ao processar webhook" },
      { status: 500 }
    )
  }
}
