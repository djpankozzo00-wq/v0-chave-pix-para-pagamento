import { NextResponse } from "next/server"
import { createPixPayment } from "@/lib/syncpay"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { platform, type, quantity, price, profileUrl, email } = body

    if (!profileUrl || !platform || !type || !quantity || !price) {
      return NextResponse.json(
        { error: "Dados incompletos. Preencha todos os campos obrigatorios." },
        { status: 400 }
      )
    }

    // Generate a unique external ID for this transaction
    const externalId = `IB-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`

    // Create PIX payment via SyncPay
    const paymentData = await createPixPayment({
      amount: price,
      externalId,
    })

    // Store order info in memory for webhook processing
    // In production, use a database
    const orderInfo = {
      externalId,
      platform,
      type,
      quantity,
      price,
      profileUrl,
      email,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    // Store in global for webhook access (simplified - use DB in production)
    if (!global.pendingOrders) {
      global.pendingOrders = new Map()
    }
    global.pendingOrders.set(externalId, orderInfo)

    return NextResponse.json({
      qrCode: paymentData.qr_code || paymentData.qrCode || "",
      pixCopyPaste: paymentData.pix_copy_paste || paymentData.pixCopyPaste || paymentData.emv || "",
      transactionId: externalId,
    })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao processar pagamento.",
      },
      { status: 500 }
    )
  }
}
