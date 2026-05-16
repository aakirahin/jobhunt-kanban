# Jobhunt Kanban

A full-stack job application tracker with a Kanban board, drag-and-drop, multi-dimension filtering, and Supabase authentication. Built with Next.js App Router, Prisma, PostgreSQL, and React Query.

> **Note:** This project is currently desktop-first. Mobile and tablet responsiveness is a work in progress.

## Technical Highlights

**SSR + client cache hydration** — The board page server-fetches the initial columns and jobs via Prisma, then calls `queryClient.setQueryData()` on the client to pre-populate the React Query cache. This avoids a loading flash on first render while keeping the client cache as the authoritative source for all subsequent mutations.

**Optimistic updates with cache invalidation** — All job and column mutations (create, update, delete, reorder) update the React Query cache optimistically before the server response resolves. On error, React Query rolls back. On success, `invalidateQueries()` re-syncs with the database.

**Drag-and-drop with position integrity** — `@dnd-kit` handles both column reordering and job card movement across columns. Dropping a card on a column automatically updates its `application_status`. Bulk column reordering uses `prisma.$transaction()` to update all positions atomically — preventing partial writes if one update fails.

**`withAuth` middleware wrapper** — All API routes are protected by a composable `withAuth(handler)` wrapper that verifies the Supabase session server-side and injects the authenticated user into the handler, eliminating repeated auth boilerplate across routes.

**Guest mode with localStorage persistence** — Unauthenticated users can try the full board at `/guest` without signing up. `GuestContext` stores jobs and columns in `localStorage`. All job hooks (`useGetJobsQuery`, `useCreateJobMutation`, etc.) check `useGuest()` first — if a guest session is active, mutations bypass the API entirely and write directly to the context state + localStorage. Filters are applied client-side via `applyGuestFilters()` rather than via a server fetch.

**Job report** — A per-user analytics report covering application stats (response rate, interview rate, offer rate), timing insights (avg days applied → interview → offer), breakdowns by role/location/arrangement, and an AI-generated summary via the OpenAI API. The summary is generated from pre-computed structured stats rather than raw job data, keeping prompts small and costs minimal. The feature unlocks at 10 applications, with a preview shown below that threshold.

## Roadmap

**Browser extension** *(planned)* — A companion Chrome/Firefox extension that detects job applications submitted on third-party boards (LinkedIn, Indeed etc.) and automatically posts them to the kanban board. Content scripts scrape the job title and company from the page on form submission; a linked account token authenticates the POST to `/api/jobs`. This removes the manual tracking step entirely.

**Friends & social layer** *(in-progress)* — The `Friendship` model and request/accept/decline flow are already in the schema. The planned surface includes a friends list, the ability to view a friend's board in a read-only mode, and comparison stats (e.g. response rates, activity trends) to add an accountability layer to the job search.

## Architecture

```
app/
  page.tsx                  # Landing page with auth form (email + Google OAuth)
  user/[userId]/
    page.tsx                # SSR: fetches board state, hydrates React Query cache
    friends/                # Friend list and requests
    profile/                # User profile
  _components/
    KanbanBoard/            # Board, SortableColumn, JobCard, drag-drop orchestration
    JobDialog/              # Add/edit job form with validation
    TopBar/                 # Filter bar, column management, add job
    AuthForm/               # Login/register form
  _context/
    authentication.tsx      # useAuth() — global Supabase session context
    guest.tsx               # GuestContext — localStorage-backed jobs/columns for unauthenticated users
  api/
    jobs/                   # GET (filtered), POST, DELETE
    jobs/[id]/              # PATCH
    columns/                # GET, POST, PATCH (reorder), DELETE
    users/                  # DELETE (account deletion via Supabase Admin API)
  guest/
    layout.tsx              # Guest layout (sidebar + topbar, no auth)
    page.tsx                # Guest board — mounts GuestProvider, renders Board

lib/
  prisma.ts                 # Prisma singleton with pg connection pool adapter
  apiUtils.ts               # withAuth() middleware wrapper
  dbUtils.ts                # ensureDefaultColumns() on first login
  hooks/
    jobs.ts                 # useGetJobsQuery, useCreateJobMutation, useEditJobMutation, useDeleteJobsMutation, useMoveJobMutation
    columns.ts              # useGetColumnsQuery, useEditColumnOrderMutation
    users.ts                # useDeleteUserMutation
  supabase/
    server.ts               # Cookie-based server client
    client.ts               # Browser client
    middleware.ts           # Request-level session refresh

prisma/
  schema.prisma             # User, Job, Column, Friendship + enums
```

## Data Model

```
User        — linked to Supabase auth UID; has many Jobs, Columns, Friendships
Job         — title, company, location, status, work_arrangement, contract_type, notes, url
Column      — name, color (hex), position (int), user_id
Friendship  — requester_id, addressee_id, status (PENDING | ACCEPTED | DECLINED | CANCELED)
```

**Enums:** `JobApplicationStatus` (SAVED, APPLIED, INTERVIEWED, ACCEPTED, REJECTED, WITHDRAWN) · `WorkArrangement` (REMOTE, HYBRID, ONSITE) · `ContractType` (FREELANCE, CONTRACT, PERMANENT) · `FriendshipStatus`

## Tech Stack

- **Next.js 16** (App Router, Turbopack) + TypeScript
- **Prisma 7** + PostgreSQL (`@prisma/adapter-pg` for connection pooling)
- **Supabase** — email/password + Google OAuth
- **TanStack React Query 5** — server state, optimistic updates, cache invalidation
- **@dnd-kit** — drag-and-drop (sortable, collision detection)
- **shadcn/ui** + Tailwind CSS 4
- **Sonner** — toast notifications

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- [Supabase](https://supabase.com) project with Google OAuth enabled

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create `.env.local`:

```env
DATABASE_URL=postgresql://user:password@host:port/dbname
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Run database migrations

```bash
npx prisma migrate dev
```

### 4. Start the dev server

```bash
npm run dev
# → http://localhost:3000
```

## Available Scripts

```bash
npm run dev     # Start dev server (Turbopack)
npm run build   # Generate Prisma client + build for production
npm start       # Start production server
npm run lint    # Run ESLint
```

## Supabase Setup Notes

- Enable **Google OAuth** under Authentication → Providers
- Enable **"Link email and OAuth accounts"** under Authentication → Sign In / Up to prevent duplicate accounts when the same email is used across providers
- Add `http://localhost:3000/auth/callback` (and your production URL) to the allowed redirect URLs
