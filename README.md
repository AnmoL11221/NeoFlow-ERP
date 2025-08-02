# NeoFlow ERP

> **Proactive Project & Profitability Engine for Freelancers**

NeoFlow ERP is an AI-native enterprise resource planning system designed specifically for freelancers. It helps you scope projects, get paid, and understand your financial health through intelligent automation and data-driven insights.

![NeoFlow ERP Dashboard](https://img.shields.io/badge/Status-Active-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.4.5-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-orange)

## 🚀 Features

### 📊 **Project Management**
- **Smart Project Scoping**: AI-powered project proposal generation
- **Status Tracking**: Monitor projects from proposal to completion
- **Client Management**: Organize and track client relationships
- **Cost Estimation**: Track estimated vs actual project costs

### 💰 **Financial Health**
- **Invoice Management**: Create and track invoices with automated status updates
- **Payment Tracking**: Monitor payment status and overdue invoices
- **Profitability Analysis**: Understand your business performance
- **Revenue Forecasting**: Predict future income based on current projects

### 🤖 **AI-Powered Features**
- **Proposal Generation**: Transform project descriptions into professional proposals
- **Risk Assessment**: Identify potential project ambiguities and risks
- **Timeline Estimation**: AI-generated project timelines and milestones
- **Smart Recommendations**: Data-driven insights for better decision making

### 🎨 **Modern UI/UX**
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Mode**: Built-in theme support
- **Real-time Updates**: Live data synchronization
- **Intuitive Navigation**: Clean, modern interface

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **API**: [tRPC](https://trpc.io/) for type-safe APIs
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **AI Integration**: [OpenAI GPT-4](https://openai.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (planned)

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- OpenAI API key (for AI features)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd neoflo-erp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/neoflo_erp"
   
   # OpenAI API Key for AI features
   OPENAI_API_KEY="your-openai-api-key-here"
   
   # NextAuth (for future authentication)
   NEXTAUTH_SECRET="your-nextauth-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev --name init
   
   # (Optional) Seed the database with sample data
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── actions/                  # Server actions (AI features)
│   │   └── generateProposal.ts
│   ├── api/trpc/                # tRPC API endpoint
│   │   └── [trpc]/route.ts
│   ├── dashboard/               # Dashboard pages
│   │   ├── page.tsx            # Main dashboard
│   │   └── projects/
│   │       └── page.tsx        # Projects view
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout with providers
│   └── page.tsx                # Landing page
├── components/                  # Reusable UI components
│   ├── providers/              # Context providers
│   │   └── trpc-provider.tsx
│   └── ui/                     # shadcn/ui components
├── lib/                        # Utility functions
│   └── utils.ts
├── server/                     # Backend API
│   └── api/
│       ├── routers/            # tRPC routers
│       │   ├── client.ts
│       │   └── project.ts
│       └── root.ts             # tRPC app router
├── trpc/                       # tRPC configuration
│   ├── client.ts
│   └── server.ts
└── types/                      # TypeScript definitions

prisma/
└── schema.prisma               # Database schema
```

## 🗄️ Database Schema

### Core Models

- **User**: Freelancer accounts with authentication
- **Client**: Client management with user relationships  
- **Project**: Core project management with status tracking
- **Invoice**: Billing and payment tracking

### Key Features

- **Relationships**: Proper foreign key relationships with cascade deletes
- **Enums**: Status tracking for projects and invoices
- **Timestamps**: Automatic created/updated timestamps
- **Soft Deletes**: Data integrity with proper cleanup

## 🔌 API Endpoints

### Project Management
- `POST /api/trpc/project.create` - Create new project
- `GET /api/trpc/project.getAllByClient` - Get projects by client
- `GET /api/trpc/project.getById` - Get specific project
- `PUT /api/trpc/project.updateStatus` - Update project status

### Client Management
- `POST /api/trpc/client.create` - Create new client
- `GET /api/trpc/client.getAll` - Get all clients

### AI Features
- `POST /api/actions/generateProposal` - Generate AI proposal

## 🎯 Usage Examples

### Creating a New Project

```typescript
// Using tRPC client
const createProject = api.project.create.useMutation();

createProject.mutate({
  name: "Website Redesign",
  description: "Modern responsive website for tech startup",
  clientId: "client-id-here"
});
```

### Generating AI Proposal

```typescript
// Using Server Action
import { generateProposalScope } from "~/app/actions/generateProposal";

const proposal = await generateProposalScope(
  "Build a modern e-commerce platform with payment integration"
);
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** with automatic database migrations

### Self-Hosted

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

3. **Set up PostgreSQL** database
4. **Configure environment variables**
5. **Run database migrations**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Commands

- `npx prisma generate` - Generate Prisma client
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma studio` - Open database GUI
- `npx prisma db seed` - Seed database with sample data

### Adding New Features

1. **Database**: Update `prisma/schema.prisma`
2. **API**: Add new router in `src/server/api/routers/`
3. **UI**: Create components in `src/components/`
4. **Pages**: Add routes in `src/app/`

## 🔮 Roadmap

### Phase 1: Core Features ✅
- [x] Project management
- [x] Client management
- [x] Basic invoicing
- [x] AI proposal generation

### Phase 2: Advanced Features 🚧
- [ ] User authentication
- [ ] Advanced analytics
- [ ] Time tracking
- [ ] Expense management
- [ ] Tax reporting

### Phase 3: AI Enhancement 🤖
- [ ] Project risk assessment
- [ ] Automated invoice reminders
- [ ] Revenue forecasting
- [ ] Client communication automation

### Phase 4: Enterprise Features 🏢
- [ ] Team collaboration
- [ ] Multi-currency support
- [ ] Advanced reporting
- [ ] API integrations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [SETUP.md](SETUP.md) for detailed setup instructions
- **Issues**: [GitHub Issues](https://github.com/your-repo/neoflo-erp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/neoflo-erp/discussions)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [tRPC](https://trpc.io/) for type-safe APIs
- [Prisma](https://www.prisma.io/) for the excellent ORM
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [OpenAI](https://openai.com/) for AI capabilities

---

**Built with ❤️ for freelancers everywhere**
