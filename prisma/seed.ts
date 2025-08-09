import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create a sample user
  const user = await prisma.user.upsert({
    where: { email: 'demo@neoflo.com' },
    update: {},
    create: {
      email: 'demo@neoflo.com',
      name: 'Demo User',
    },
  })

  // Create sample clients
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

  // Create sample projects
  const project1 = await prisma.project.upsert({
    where: { id: 'project-1' },
    update: {},
    create: {
      id: 'project-1',
      name: 'E-commerce Platform Redesign',
      description: 'Complete redesign and development of the main e-commerce platform with modern UI/UX, improved performance, and enhanced user experience.',
      status: 'ACTIVE',
      estimatedCost: 15000,
      actualCost: 12000,
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
      description: 'Comprehensive brand identity design including logo, color palette, typography, and brand guidelines for the new product launch.',
      status: 'COMPLETED',
      estimatedCost: 5000,
      actualCost: 4800,
      userId: user.id,
      clientId: client2.id,
    },
  })

  const project3 = await prisma.project.upsert({
    where: { id: 'project-3' },
    update: {},
    create: {
      id: 'project-3',
      name: 'Mobile App Development',
      description: 'Native iOS and Android app development for the fitness tracking platform with real-time data synchronization and social features.',
      status: 'PROPOSED',
      estimatedCost: 25000,
      userId: user.id,
      clientId: client3.id,
    },
  })

  const project4 = await prisma.project.upsert({
    where: { id: 'project-4' },
    update: {},
    create: {
      id: 'project-4',
      name: 'Website Maintenance',
      description: 'Ongoing website maintenance, security updates, and content management for the corporate website.',
      status: 'ACTIVE',
      estimatedCost: 2000,
      actualCost: 1800,
      userId: user.id,
      clientId: client1.id,
    },
  })

  const project5 = await prisma.project.upsert({
    where: { id: 'project-5' },
    update: {},
    create: {
      id: 'project-5',
      name: 'Marketing Campaign Design',
      description: 'Design and development of marketing materials for the Q4 campaign including social media graphics, email templates, and landing pages.',
      status: 'PAUSED',
      estimatedCost: 8000,
      actualCost: 3500,
      userId: user.id,
      clientId: client2.id,
    },
  })

  // Create sample invoices
  await prisma.invoice.upsert({
    where: { id: 'invoice-1' },
    update: {},
    create: {
      id: 'invoice-1',
      invoiceNumber: 'INV-2024-001',
      status: 'PAID',
      amount: 5000,
      issueDate: new Date('2024-01-15'),
      dueDate: new Date('2024-02-15'),
      userId: user.id,
      projectId: project1.id,
    },
  })

  await prisma.invoice.upsert({
    where: { id: 'invoice-2' },
    update: {},
    create: {
      id: 'invoice-2',
      invoiceNumber: 'INV-2024-002',
      status: 'SENT',
      amount: 4800,
      issueDate: new Date('2024-02-01'),
      dueDate: new Date('2024-03-01'),
      userId: user.id,
      projectId: project2.id,
    },
  })

  await prisma.invoice.upsert({
    where: { id: 'invoice-3' },
    update: {},
    create: {
      id: 'invoice-3',
      invoiceNumber: 'INV-2024-003',
      status: 'DRAFT',
      amount: 7000,
      issueDate: new Date('2024-02-15'),
      dueDate: new Date('2024-03-15'),
      userId: user.id,
      projectId: project1.id,
    },
  })

  await prisma.invoice.upsert({
    where: { id: 'invoice-4' },
    update: {},
    create: {
      id: 'invoice-4',
      invoiceNumber: 'INV-2024-004',
      status: 'OVERDUE',
      amount: 1800,
      issueDate: new Date('2024-01-20'),
      dueDate: new Date('2024-02-20'),
      userId: user.id,
      projectId: project4.id,
    },
  })

  console.log('Database seeded successfully!')
  console.log('Created user:', user.email)
  console.log('Created clients:', [client1.name, client2.name, client3.name])
  console.log('Created projects:', [project1.name, project2.name, project3.name, project4.name, project5.name])
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 