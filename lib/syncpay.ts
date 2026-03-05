const SYNCPAY_BASE_URL = "https://api.syncpay.com.br"

let cachedToken: { token: string; expiresAt: number } | null = null

export async function getSyncPayToken(): Promise<string> {
  // Return cached token if still valid
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60000) {
    return cachedToken.token
  }

  const response = await fetch(`${SYNCPAY_BASE_URL}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.SYNCPAY_CLIENT_ID,
      client_secret: process.env.SYNCPAY_CLIENT_SECRET,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Erro na autenticacao SyncPay: ${errorText}`)
  }

  const data = await response.json()

  cachedToken = {
    token: data.token,
    expiresAt: Date.now() + 3600000, // Cache for 1 hour
  }

  return data.token
}

export async function createPixPayment({
  amount,
  externalId,
}: {
  amount: number
  externalId: string
}) {
  const token = await getSyncPayToken()

  const response = await fetch(`${SYNCPAY_BASE_URL}/transaction/cashin/pix`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      amount,
      external_id: externalId,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Erro ao criar pagamento PIX: ${errorText}`)
  }

  return response.json()
}
