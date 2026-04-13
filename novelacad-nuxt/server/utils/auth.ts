import bcrypt from 'bcryptjs'
import type { H3Event } from 'h3'
import crypto from 'node:crypto'

const SALT_ROUNDS = 12
const RESET_TOKEN_EXPIRY = 60 * 60 * 24 // 24 hours in seconds

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateResetToken(): { token: string; hash: string } {
  const token = crypto.randomBytes(32).toString('hex')
  const hash = crypto.createHash('sha256').update(token).digest('hex')
  return { token, hash }
}

export function getResetTokenExpiry(): string {
  const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY * 1000)
  return expiresAt.toISOString()
}

export async function getAdminSession(event: H3Event) {
  const config = useRuntimeConfig()
  return useSession(event, {
    password: config.sessionSecret as string,
    name: 'novelacad-admin-session',
    maxAge: 60 * 60 * 8, // 8 hours
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  })
}

export async function requireAdminSession(event: H3Event, masterOnly = false) {
  const session = await getAdminSession(event)
  if (!session.data?.adminLoggedIn) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized: Please log in.' })
  }
  if (masterOnly && session.data?.adminRole !== 'master') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden: Master admin required.' })
  }
  return session
}
