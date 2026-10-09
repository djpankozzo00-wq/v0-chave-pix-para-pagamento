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
    const mode = body.mode === "register" ? "register" : body.mode === "recover" ? "recover" : body.mode === "reset" ? "reset" : "login"
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
    const password = typeof body.password === "string" ? body.password : ""
    const name = typeof body.name === "string" ? body.name.trim() : ""

    if (mode === "recover") {
      if (!email) return NextResponse.json({ error: "Informe seu e-mail para recuperar a senha." }, { status: 400 })
      const redirectTo = `${request.nextUrl.origin}/login?reset=1`
      const recoveryResponse = await fetch(`${supabaseUrl}/auth/v1/recover?redirect_to=${encodeURIComponent(redirectTo)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: publishableKey },
        body: JSON.stringify({ email }),
        cache: "no-store",
      })
      if (!recoveryResponse.ok) {
        const recoveryData = await recoveryResponse.json().catch(() => ({}))
        return NextResponse.json({ error: recoveryData.message || recoveryData.msg || "Não foi possível enviar o e-mail de recuperação." }, { status: recoveryResponse.status })
      }
      return NextResponse.json({ ok: true, message: "Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha. Confira também o spam." })
    }

    if (mode === "reset") {
      const accessToken = typeof body.accessToken === "string" ? body.accessToken : ""
      if (!accessToken || password.length < 6) return NextResponse.json({ error: "O link é inválido ou a senha tem menos de 6 caracteres. Solicite um novo link." }, { status: 400 })
      const updateResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", apikey: publishableKey, Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ password }),
        cache: "no-store",
      })
      const updateData = await updateResponse.json().catch(() => ({}))
      if (!updateResponse.ok) return NextResponse.json({ error: updateData.message || updateData.msg || "Não foi possível alterar a senha. Solicite um novo link." }, { status: updateResponse.status })
      return NextResponse.json({ ok: true, message: "Senha alterada! Agora entre com sua nova senha." })
    }

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
      const rawMessage = [
        authData.msg,
        authData.message,
        authData.error_description,
        authData.error,
      ].find((value) => typeof value === "string") as string | undefined

      const message = mode === "login" && /invalid login credentials/i.test(rawMessage || "")
        ? "E-mail ou senha não conferem. Se você ainda não criou uma conta, toque em Cadastrar e registre-se primeiro."
        : rawMessage || "Não foi possível concluir. Confira os dados e tente novamente."

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
