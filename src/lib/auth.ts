import { SignJWT, jwtVerify } from 'jose'

const encoder = new TextEncoder()

function getSecret() {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error('AUTH_SECRET is not set')
  return encoder.encode(secret)
}

export type SessionPayload = {
  userId: string
  email: string
  name: string | null
}

export async function createSessionToken(payload: SessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret())
  return token
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return {
      userId: String(payload.userId),
      email: String(payload.email),
      name: payload.name ? String(payload.name) : null,
    }
  } catch {
    return null
  }
}

export function getAuthCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production'
  return {
    name: 'neoflow_session',
    options: {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax' as const,
      path: '/' as const,
      maxAge: 60 * 60 * 24 * 7,
    },
  }
}