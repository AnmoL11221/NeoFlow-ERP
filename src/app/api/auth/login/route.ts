import { NextResponse } from 'next/server'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { createSessionToken, getAuthCookieOptions } from '~/lib/auth'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const { email, password } = bodySchema.parse(json)

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = await createSessionToken({ userId: user.id, email: user.email, name: user.name })
    const { name: cookieName, options } = getAuthCookieOptions()

    const res = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } })
    res.cookies.set(cookieName, token, options)
    return res
  } catch (err: any) {
    if (err?.name === 'ZodError') {
      return NextResponse.json({ error: err.flatten() }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}