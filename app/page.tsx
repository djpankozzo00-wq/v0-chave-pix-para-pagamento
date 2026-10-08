import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { HomePage } from "@/components/home-page"

export const dynamic = "force-dynamic"

export default async function Page() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("painel-social-access-token")?.value
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!accessToken || !supabaseUrl || !publishableKey) {
    redirect("/login")
  }

  try {
    const authResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: publishableKey,
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    })

    if (!authResponse.ok) {
      redirect("/login")
    }
  } catch {
    redirect("/login")
  }

  return <HomePage />
}
