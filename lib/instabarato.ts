const API_URL = "https://instabarato.com/api/v2"
const API_KEY = process.env.INSTABARATO_API_KEY!

export async function getServices() {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      key: API_KEY,
      action: "services",
    }),
  })

  if (!response.ok) {
    throw new Error("Erro ao buscar servicos do InstaBarato")
  }

  return response.json()
}

export async function createOrder({
  serviceId,
  link,
  quantity,
}: {
  serviceId: number
  link: string
  quantity: number
}) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      key: API_KEY,
      action: "add",
      service: serviceId,
      link,
      quantity,
    }),
  })

  if (!response.ok) {
    throw new Error("Erro ao criar pedido no InstaBarato")
  }

  return response.json()
}

export async function getOrderStatus(orderId: number) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      key: API_KEY,
      action: "status",
      order: orderId,
    }),
  })

  if (!response.ok) {
    throw new Error("Erro ao consultar status do pedido")
  }

  return response.json()
}

export async function getBalance() {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      key: API_KEY,
      action: "balance",
    }),
  })

  if (!response.ok) {
    throw new Error("Erro ao consultar saldo")
  }

  return response.json()
}
