# Jobhunt Kanban

A full-stack job search tracker with a visual Kanban board. Organize your applications across stages, filter by role or location, drag-and-drop between columns, and connect with friends on the same hunt.

## Features

- **Kanban board** — track jobs across Saved, Applied, Interviewed, Accepted, and Rejected columns
- **Custom columns** — create, rename, reorder, and color columns to match your workflow
- **Job management** — add and edit jobs with title, company, location, work arrangement, contract type, URL, and notes
- **Filtering** — filter jobs by title, location, work arrangement, contract type, and date range
- **Drag and drop** — move jobs between columns and reorder columns
- **Friend system** — send friend requests and view other users' boards
- **Authentication** — email/password and Google OAuth via Supabase
- **Auto-setup** — default columns are created automatically on first login

## Tech Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4, shadcn/ui |
| Database | PostgreSQL + Prisma 7 |
| Auth | Supabase |
| Data fetching | React Query 5 |
| Drag and drop | dnd-kit |
| Validation | Zod 4 |
| Toasts | Sonner |

## Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database
- A [Supabase](https://supabase.com) project with Google OAuth enabled

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the project root:

```env
DATABASE_URL=postgresql://user:password@host:port/dbname
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### 3. Set up the database

```bash
npx prisma migrate dev
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev     # Start dev server (Turbopack)
npm run build   # Generate Prisma client and build for production
npm start       # Start production server
npm run lint    # Run ESLint
```

## Project Structure

```
app/
├── _components/        # UI components (KanbanBoard, JobDialog, TopBar, etc.)
├── _context/           # Auth context
├── api/                # API route handlers (jobs, columns)
├── auth/               # Login/register page and OAuth callback
├── user/[userId]/      # User dashboard, friends, and profile pages
├── layout.tsx
└── page.tsx            # Landing page

lib/
├── prisma.ts           # Prisma client singleton
├── dbUtils.ts          # First-login setup logic
├── apiUtils.ts         # Auth middleware for API routes
├── hooks/              # React Query hooks
├── supabase/           # Supabase client helpers
└── types.ts            # Shared TypeScript types

prisma/
├── schema.prisma       # Database schema
└── migrations/
```

## Database Schema

- **User** — linked to Supabase auth, has columns, jobs, and friendships
- **Job** — belongs to a user; tracks title, company, location, status, and more
- **Column** — a Kanban column with a name, position, and hex color
- **Friendship** — many-to-many between users with PENDING / ACCEPTED / DECLINED / CANCELED status

## Supabase Setup Notes

- Enable **Google OAuth** under Authentication → Providers
- Enable **"Link email and OAuth accounts"** under Authentication → Sign In / Up to prevent duplicate accounts when the same email is used across providers
- Add `http://localhost:3000/auth/callback` (and your production URL) to the allowed redirect URLs

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# jobhunt-kanban
