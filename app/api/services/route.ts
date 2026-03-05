import { NextResponse } from "next/server"
import { getServices } from "@/lib/instabarato"

export async function GET() {
  try {
    const services = await getServices()
    return NextResponse.json(services)
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar servicos. Tente novamente." },
      { status: 500 }
    )
  }
}
