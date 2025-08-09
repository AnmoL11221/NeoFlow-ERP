# NeoFlow ERP

> **Proactive Project & Profitability Engine for Freelancers**

NeoFlow ERP is an AI-native enterprise resource planning system designed specifically for freelancers. It helps you scope projects, get paid, and understand your financial health through intelligent automation and data-driven insights.

![NeoFlow ERP Dashboard](https://img.shields.io/badge/Status-Active-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.4.5-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-orange)

## 🚀 Features

### 📊 Project Management
- Smart scoping, status tracking, client relationships
- Cost tracking: estimated vs actual

### 💰 Financial Health
- Invoice creation and tracking
- Payments and overdue insights

### 🤖 AI Features
- Proposal generation with OpenAI

### 🎨 Modern UI
- Responsive design, clean components, shadcn/ui

## 🛠️ Tech Stack
- Next.js 15 (App Router), TypeScript
- Prisma ORM (SQLite dev by default; Postgres-ready)
- tRPC v11 (typed API)
- Tailwind CSS + shadcn/ui
- NextAuth (OAuth + Credentials)

## 📦 Installation

### 1) Install dependencies
```bash
npm install --legacy-peer-deps
```
> Tip: We use `--legacy-peer-deps` to bypass the OpenAI/Zod peer conflict.

### 2) Environment variables
Create `.env.local` (not committed) with:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret

# OAuth providers (optional but recommended)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# AI
OPENAI_API_KEY=...
```

Also add placeholders to `.env.example` if you share the repo.

### 3) Database (SQLite dev by default)
```bash
npx prisma db push
npm run db:seed
```
This seeds a demo user and sample data.

### 4) Start dev server
```bash
npm run dev
```
- If port 3000 is taken, Next uses 3001. Open the printed URL.

## 🔐 Authentication

### What’s included
- NextAuth configured with:
  - Credentials provider (email/password)
  - Google & GitHub OAuth
- Prisma Adapter models (`Account`, `VerificationToken`) are in the schema
- Session is JWT-based and wired into tRPC context
- Protected routes via `/dashboard/layout.tsx` (redirects to `/login`)

### Sign in
- Credentials (seeded):
  - Email: `demo@neoflo.com`
  - Password: `password123`
- Or use “Continue with Google/GitHub” (after configuring provider envs)

### OAuth setup
- **Google**
  - Create OAuth Client (Web) in Google Cloud Console
  - Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
- **GitHub**
  - Create OAuth App in GitHub settings
  - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

## 🧭 Project Structure (highlights)
```
src/
├─ app/
│  ├─ (auth)/
│  │  ├─ login/page.tsx            # OAuth + credentials UI
│  │  └─ register/page.tsx         # Credentials signup UI
│  ├─ api/auth/[...nextauth]/route.ts  # NextAuth handler
│  ├─ api/trpc/[trpc]/route.ts     # tRPC endpoint
│  ├─ dashboard/
│  │  ├─ layout.tsx               # Auth guard (redirects to /login)
│  │  ├─ page.tsx                 # Dashboard
│  │  ├─ clients/page.tsx         # Clients UI
│  │  ├─ invoices/page.tsx        # Invoices UI
│  │  └─ projects/page.tsx        # Projects UI
│  ├─ actions/generateProposal.ts  # OpenAI proposal action
│  ├─ layout.tsx                   # Root layout
│  └─ page.tsx                     # Landing page
├─ components/
│  └─ providers/
│     ├─ trpc-provider.tsx         # tRPC provider (client)
│     └─ app-provider.tsx          # Session + tRPC (client)
├─ server/
│  └─ api/
│     ├─ trpc.ts                    # tRPC context + primitives
│     ├─ root.ts                    # appRouter merge
│     └─ routers/
│        ├─ client.ts
│        ├─ invoice.ts
│        └─ project.ts
└─ lib/
   └─ auth.ts                       # Legacy JWT utils (not used by NextAuth)
```

## 🗄️ Database Schema

### Core Models
- **User**: Freelancer accounts (with `passwordHash`, optional OAuth `Account`)
- **Client**: Belongs to `User`; has many `Project`
- **Project**: Belongs to `User` and `Client`; status enum (PROPOSED, ACTIVE, COMPLETED, PAUSED)
- **Invoice**: Belongs to `User` and `Project`; status enum (DRAFT, SENT, PAID, OVERDUE)
- **Account** / **VerificationToken**: NextAuth adapter models

### Key Features
- Proper foreign keys with cascade
- Enums for statuses
- Created/updated timestamps

## 🔌 API Endpoints (tRPC)
- `project.create`, `project.getAllByClient`, `project.getById`, `project.updateStatus`
- `client.create`, `client.getAll`
- `invoice.create`, `invoice.getAll`, `invoice.getById`, `invoice.updateStatus`

## 🎯 Usage Examples

### Create a new project (client)
```ts
import { api } from "~/trpc/client";

const createProject = api.project.create.useMutation();
createProject.mutate({
  name: "Website Redesign",
  description: "Modern responsive website for a startup",
  clientId: "client-1",
});
```

### Generate an AI proposal (server action)
```ts
import { generateProposalScope } from "~/app/actions/generateProposal";

const proposal = await generateProposalScope(
  "Build an e-commerce platform with payments and admin dashboard"
);
```

## 🧯 Troubleshooting
- Peer dependency conflicts:
  - Always install with `npm install --legacy-peer-deps`
- Port already in use:
  - Next will switch to 3001; open the printed URL or stop the previous server
- “React Context is unavailable in Server Components”:
  - Providers must be client components. We wrap them in `AppProvider` and include that in `app/layout.tsx`.
- “Cannot access 'createTRPCRouter' before initialization”:
  - We split TRPC setup into `src/server/api/trpc.ts` to avoid circular imports.
- 401/Not authenticated on tRPC:
  - Sign in at `/login` first. `/dashboard` routes auto-redirect when unauthenticated.

## 🚀 Deployment
- Set env vars (same names) in your hosting provider (e.g., Vercel)
- Switch database to Postgres by updating `datasource db` in `prisma/schema.prisma` and setting `DATABASE_URL`
- Run `npx prisma migrate deploy` during build

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch: `git checkout -b feat/awesome`
3. Commit: `git commit -m "feat: add awesome thing"`
4. Push: `git push origin feat/awesome`
5. Open a Pull Request

## 📝 Development

### Scripts
- `npm run dev` – Start dev server
- `npm run build` – Build for production
- `npm run start` – Start production server
- `npm run lint` – Lint
- `npm run db:seed` – Seed database

### Prisma
- `npx prisma db push` – Sync schema (dev)
- `npx prisma migrate dev` – Create/apply migration
- `npx prisma studio` – DB GUI

### Adding Features
1. Update `prisma/schema.prisma` if needed
2. Add tRPC procedures under `src/server/api/routers/`
3. Consume via `~/trpc/client` hooks in UI
4. Add pages in `src/app/`

## 🔮 Roadmap
- Auth polish: email verification, password reset
- Project creation wizard & proposal editor
- Invoice PDF generation & payments integration
- Analytics dashboards
- Time tracking & expenses
- Multi-currency & advanced reporting

## 📄 License
MIT

## 🆘 Support
- Issues: GitHub Issues
- Discussions: GitHub Discussions

## 🙏 Acknowledgments
- Next.js, Prisma, tRPC, shadcn/ui, NextAuth, OpenAI

---

Built with ❤️ for freelancers.
