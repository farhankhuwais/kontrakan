import { createClient } from '@/lib/db'
import { cookies } from 'next/headers'
import { randomBytes, scrypt as _scrypt, timingSafeEqual } from 'crypto'
import { promisify } from 'util'

const scrypt = promisify(_scrypt)
export const SESSION_COOKIE = 'kontrakan_session'
const SESSION_DAYS = 30

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const hash = (await scrypt(password, salt, 64)) as Buffer
  return `scrypt:${salt}:${hash.toString('hex')}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, salt, hashHex] = stored.split(':')
  if (scheme !== 'scrypt' || !salt || !hashHex) return false
  const hash = (await scrypt(password, salt, 64)) as Buffer
  const expected = Buffer.from(hashHex, 'hex')
  return hash.length === expected.length && timingSafeEqual(hash, expected)
}

export async function createSession(userId: string): Promise<string> {
  const db = createClient()
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 3600 * 1000)
  await db`insert into sessions (user_id, token, expires_at) values (${userId}, ${token}, ${expiresAt})`
  return token
}

export async function getSessionUser(): Promise<{ id: string; email: string } | null> {
  const db = createClient()
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null
  const rows = await db`
    select u.id, u.email
    from sessions s
    join admin_user u on u.id = s.user_id
    where s.token = ${token} and s.expires_at > now()
    limit 1
  `
  return rows[0] ? { id: rows[0].id, email: rows[0].email } : null
}

export async function destroySession(token: string): Promise<void> {
  const db = createClient()
  await db`delete from sessions where token = ${token}`
}
