import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('password123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'demo@neoflo.com' },
    update: { passwordHash },
    create: {
      email: 'demo@neoflo.com',
      name: 'Demo User',
      passwordHash,
    },
  })

  // Seed freelancers
  const freelancers = [
    {
      name: 'Ava Bennett',
      email: 'ava@freelance.dev',
      bio: 'Full-stack engineer specializing in Next.js and tRPC.',
      skills: 'nextjs,react,trpc,typescript,prisma,tailwind',
      hourlyRate: '75.00',
      rating: 4.8,
      availability: 'part-time',
      location: 'Remote',
    },
    {
      name: 'Liam Carter',
      email: 'liam@uiux.studio',
      bio: 'Product designer with a focus on conversion-friendly UI.',
      skills: 'ui,ux,figma,design-systems,prototyping',
      hourlyRate: '60.00',
      rating: 4.6,
      availability: 'full-time',
      location: 'NYC',
    },
    {
      name: 'Maya Singh',
      email: 'maya@data.ai',
      bio: 'AI engineer building LLM apps and RAG systems.',
      skills: 'openai,llm,rag,langchain,python,vector-db',
      hourlyRate: '90.00',
      rating: 4.9,
      availability: 'part-time',
      location: 'Remote',
    },
  ]

  for (const f of freelancers) {
    await prisma.freelancerProfile.upsert({
      where: { email: f.email },
      update: {
        name: f.name,
        bio: f.bio,
        skills: f.skills,
        hourlyRate: f.hourlyRate as any,
        rating: f.rating,
        availability: f.availability,
        location: f.location,
      },
      create: {
        name: f.name,
        email: f.email,
        bio: f.bio,
        skills: f.skills,
        hourlyRate: f.hourlyRate as any,
        rating: f.rating,
        availability: f.availability,
        location: f.location,
      },
    })
  }

  // existing seed below (clients/projects/invoices)...
  const client1 = await prisma.client.upsert({
    where: { id: 'client-1' },
    update: {},
    create: {
      id: 'client-1',
      name: 'TechCorp Solutions',
      email: 'contact@techcorp.com',
      userId: user.id,
    },
  })

  const client2 = await prisma.client.upsert({
    where: { id: 'client-2' },
    update: {},
    create: {
      id: 'client-2',
      name: 'Design Studio Pro',
      email: 'hello@designstudio.com',
      userId: user.id,
    },
  })

  const client3 = await prisma.client.upsert({
    where: { id: 'client-3' },
    update: {},
    create: {
      id: 'client-3',
      name: 'Startup Ventures',
      email: 'info@startupventures.com',
      userId: user.id,
    },
  })

  const project1 = await prisma.project.upsert({
    where: { id: 'project-1' },
    update: {},
    create: {
      id: 'project-1',
      name: 'E-commerce Platform Redesign',
      description: 'Complete redesign and development of the e-commerce platform with modern UI/UX and performance.',
      status: 'ACTIVE',
      estimatedCost: '15000.00' as any,
      actualCost: '12000.00' as any,
      currency: 'USD',
      userId: user.id,
      clientId: client1.id,
    },
  })

  const project2 = await prisma.project.upsert({
    where: { id: 'project-2' },
    update: {},
    create: {
      id: 'project-2',
      name: 'Brand Identity Package',
      description: 'Comprehensive brand identity design including logo, color palette, and guidelines.',
      status: 'COMPLETED',
      estimatedCost: '5000.00' as any,
      actualCost: '4800.00' as any,
      currency: 'USD',
      userId: user.id,
      clientId: client2.id,
    },
  })

  await prisma.invoice.upsert({
    where: { id: 'invoice-1' },
    update: {},
    create: {
      id: 'invoice-1',
      invoiceNumber: 'INV-2024-001',
      status: 'PAID',
      amount: '5000.00' as any,
      issueDate: new Date('2024-01-15'),
      dueDate: new Date('2024-02-15'),
      userId: user.id,
      projectId: project1.id,
    },
  })

  console.log('Database seeded successfully!')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
}) 