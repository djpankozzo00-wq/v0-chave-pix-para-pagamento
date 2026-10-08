import { cookies } from "next/headers"

export type AuthenticatedUser = {
  id: string
  email?: string
}

export async function getAuthenticatedUser(): Promise<{ user: AuthenticatedUser; accessToken: string } | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("painel-social-access-token")?.value

  if (!supabaseUrl || !publishableKey || !accessToken) return null

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { apikey: publishableKey, Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    })
    if (!response.ok) return null
    const user = await response.json() as AuthenticatedUser
    if (!user?.id) return null
    return { user, accessToken }
  } catch {
    return null
  }
}

export function isPixAdmin(email?: string): boolean {
  return (email || "").trim().toLowerCase() === "djpankozzo00@gmail.com"
}

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  return url && key ? { url, key } : null
}
