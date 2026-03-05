export type Order = {
  id: string
  serviceId: number
  serviceName: string
  link: string
  quantity: number
  cost: number
  date: string
  status: string
}

const BALANCE_KEY = "instabarato_balance"
const ORDERS_KEY = "instabarato_orders"

export function getBalance(): number {
  if (typeof window === "undefined") return 0
  const stored = localStorage.getItem(BALANCE_KEY)
  return stored ? parseFloat(stored) : 0
}

export function setBalance(amount: number): number {
  const rounded = Math.round(amount * 100) / 100
  localStorage.setItem(BALANCE_KEY, String(rounded))
  return rounded
}

export function addBalance(amount: number): number {
  const current = getBalance()
  return setBalance(current + amount)
}

export function deductBalance(amount: number): number {
  const current = getBalance()
  if (amount > current) {
    throw new Error("Saldo insuficiente")
  }
  return setBalance(current - amount)
}

export function getOrders(): Order[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(ORDERS_KEY)
  return stored ? JSON.parse(stored) : []
}

export function addOrder(order: Order): void {
  const orders = getOrders()
  orders.unshift(order)
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}
