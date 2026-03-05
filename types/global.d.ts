/* eslint-disable no-var */
declare global {
  var pendingOrders: Map<
    string,
    {
      externalId: string
      platform: string
      type: string
      quantity: string
      price: number
      profileUrl: string
      email: string
      status: string
      createdAt: string
      instaOrderId?: number
    }
  >
}

export {}
