import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

export async function POST(request: NextRequest) {
  if (!supabaseUrl || !publishableKey) {
    return NextResponse.json({ error: "A conexão com o serviço de autenticação ainda não está configurada." }, { status: 500 })
  }

  try {
    const body = await request.json()
    const mode = body.mode === "register" ? "register" : "login"
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
    const password = typeof body.password === "string" ? body.password : ""
    const name = typeof body.name === "string" ? body.name.trim() : ""

    if (!email || !password || password.length < 6 || (mode === "register" && !name)) {
      return NextResponse.json({ error: "Preencha os campos corretamente. A senha precisa ter pelo menos 6 caracteres." }, { status: 400 })
    }

    const endpoint = mode === "register"
      ? `${supabaseUrl}/auth/v1/signup`
      : `${supabaseUrl}/auth/v1/token?grant_type=password`

    const authResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: publishableKey,
      },
      body: JSON.stringify(mode === "register"
        ? { email, password, data: { full_name: name } }
        : { email, password }),
      cache: "no-store",
    })

    const authData = await authResponse.json()

    if (!authResponse.ok) {
      const message = typeof authData.msg === "string"
        ? authData.msg
        : typeof authData.message === "string"
          ? authData.message
          : typeof authData.error_description === "string"
            ? authData.error_description
            : "Não foi possível entrar. Confira o e-mail e a senha e tente novamente."
      return NextResponse.json({ error: message }, { status: authResponse.status })
    }

    if (mode === "register" && !authData.access_token) {
      return NextResponse.json({
        ok: true,
        needsEmailConfirmation: true,
        message: "Cadastro criado! Confira seu e-mail para confirmar a conta antes de entrar.",
      })
    }

    const response = NextResponse.json({
      ok: true,
      message: mode === "register" ? "Conta criada e login realizado!" : "Login realizado com sucesso!",
    })

    if (authData.access_token) {
      response.cookies.set("painel-social-access-token", authData.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: Math.max(60, Number(authData.expires_in) || 3600),
      })
    }

    if (authData.refresh_token) {
      response.cookies.set("painel-social-refresh-token", authData.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      })
    }

    return response
  } catch {
    return NextResponse.json({ error: "Ocorreu um erro ao processar sua solicitação. Tente novamente." }, { status: 500 })
  }
}
