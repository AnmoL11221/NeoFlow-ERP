import { NextResponse } from 'next/server'
import { getAuthCookieOptions } from '~/lib/auth'

export async function POST() {
  const { name, options } = getAuthCookieOptions()
  const res = NextResponse.json({ ok: true })
  res.cookies.set(name, '', { ...options, maxAge: 0 })
  return res
}