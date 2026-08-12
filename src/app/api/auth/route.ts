import { createClient } from '@/lib/db'
import { NextResponse } from 'next/server'
import { verifyPassword, createSession, getSessionUser, SESSION_COOKIE } from '@/lib/auth'

export async function POST(request: Request) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email dan password wajib diisi' }, { status: 400 })
  }

  const db = createClient()
  const rows = await db`select id, email, password_hash from admin_user where email = ${String(email).toLowerCase().trim()} limit 1`

  if (!rows[0]) {
    return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 })
  }

  const ok = await verifyPassword(String(password), rows[0].password_hash)
  if (!ok) {
    return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 })
  }

  const token = await createSession(rows[0].id)
  const res = NextResponse.json({ success: true, user: { id: rows[0].id, email: rows[0].email } })
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 30 * 24 * 3600,
  })
  return res
}

export async function GET() {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
  return NextResponse.json({ authenticated: true, user })
}
