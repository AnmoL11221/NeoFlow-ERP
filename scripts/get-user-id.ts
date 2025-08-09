import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findFirst({
    where: { email: 'demo@neoflo.com' }
  })
  
  if (user) {
    console.log('Demo User ID:', user.id)
    console.log('Demo User Email:', user.email)
    console.log('Demo User Name:', user.name)
  } else {
    console.log('No demo user found')
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect()) 