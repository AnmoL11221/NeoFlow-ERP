import { NextResponse } from 'next/server'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { createSessionToken, getAuthCookieOptions } from '~/lib/auth'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const bodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const { name, email, password } = bodySchema.parse(json)

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
      select: { id: true, name: true, email: true },
    })

    const token = await createSessionToken({ userId: user.id, email: user.email, name: user.name })
    const { name: cookieName, options } = getAuthCookieOptions()

    const res = NextResponse.json({ user })
    res.cookies.set(cookieName, token, options)
    return res
  } catch (err: any) {
    if (err?.name === 'ZodError') {
      return NextResponse.json({ error: err.flatten() }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}