import { config } from "dotenv"
config({ path: "../.env" })

import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../lib/generated/prisma/client"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const FAKE_USERS = [
    { id: "a1b2c3d4-0001-4000-8000-000000000001", email: "alex.morgan@example.com",  name: "Alex Morgan",   avatar: "https://i.pravatar.cc/150?u=alex.morgan@example.com",  status: "UNEMPLOYED" as const, mock: true },
    { id: "a1b2c3d4-0002-4000-8000-000000000002", email: "priya.sharma@example.com", name: "Priya Sharma",  avatar: "https://i.pravatar.cc/150?u=priya.sharma@example.com", status: "EMPLOYED"   as const, mock: true },
    { id: "a1b2c3d4-0008-4000-8000-000000000008", email: "chloe.dupont@example.com", name: "Chloé Dupont",  avatar: "https://i.pravatar.cc/150?u=chloe.dupont@example.com", status: "UNEMPLOYED" as const, mock: true },
    { id: "a1b2c3d4-0009-4000-8000-000000000009", email: "daniel.kim@example.com",   name: "Daniel Kim",   avatar: "https://i.pravatar.cc/150?u=daniel.kim@example.com",   status: "EMPLOYED"   as const, mock: true },
    { id: "a1b2c3d4-0010-4000-8000-000000000010", email: "amara.osei@example.com",   name: "Amara Osei",   avatar: "https://i.pravatar.cc/150?u=amara.osei@example.com",   status: "UNEMPLOYED" as const, mock: true },
]

const DEFAULT_COLUMNS = [
    { name: "Saved",       colour: "#A6BBFB", position: 1 },
    { name: "Applied",     colour: "#99D1FB", position: 2 },
    { name: "Interviewed", colour: "#4FE7CD", position: 3 },
    { name: "Accepted",    colour: "#95EC3F", position: 4 },
    { name: "Rejected",    colour: "#FEAAC2", position: 5 },
]

const MOCK_JOBS: Record<string, { title: string; company: string; location: string; work_arrangement: "REMOTE" | "HYBRID" | "ONSITE"; contract_type: "PERMANENT" | "CONTRACT" | "FREELANCE"; application_status: "SAVED" | "APPLIED" | "INTERVIEWED" | "ACCEPTED" | "REJECTED"; salary?: number; company_size: "SMALL" | "MEDIUM" | "LARGE" }[]> = {
    "a1b2c3d4-0001-4000-8000-000000000001": [
        { title: "Frontend Engineer",        company: "Stripe",        location: "London, UK",     work_arrangement: "HYBRID",  contract_type: "PERMANENT", application_status: "APPLIED",      salary: 85000, company_size: "LARGE"  },
        { title: "React Developer",          company: "Monzo",         location: "London, UK",     work_arrangement: "HYBRID",  contract_type: "PERMANENT", application_status: "INTERVIEWED",  salary: 80000, company_size: "MEDIUM" },
        { title: "UI Engineer",              company: "Figma",         location: "Remote",         work_arrangement: "REMOTE",  contract_type: "PERMANENT", application_status: "APPLIED",      salary: 90000, company_size: "MEDIUM" },
        { title: "Software Engineer",        company: "Notion",        location: "Remote",         work_arrangement: "REMOTE",  contract_type: "PERMANENT", application_status: "REJECTED",     salary: 88000, company_size: "MEDIUM" },
        { title: "Web Developer",            company: "Typeform",      location: "Barcelona, ES",  work_arrangement: "REMOTE",  contract_type: "PERMANENT", application_status: "SAVED",                       company_size: "SMALL"  },
        { title: "Junior Frontend Dev",      company: "Deliveroo",     location: "London, UK",     work_arrangement: "ONSITE",  contract_type: "PERMANENT", application_status: "REJECTED",     salary: 65000, company_size: "LARGE"  },
        { title: "TypeScript Engineer",      company: "Linear",        location: "Remote",         work_arrangement: "REMOTE",  contract_type: "PERMANENT", application_status: "APPLIED",      salary: 95000, company_size: "SMALL"  },
    ],
    "a1b2c3d4-0002-4000-8000-000000000002": [
        { title: "Full Stack Engineer",      company: "Vercel",        location: "Remote",         work_arrangement: "REMOTE",  contract_type: "PERMANENT", application_status: "ACCEPTED",     salary: 110000, company_size: "MEDIUM" },
        { title: "Backend Engineer",         company: "Supabase",      location: "Remote",         work_arrangement: "REMOTE",  contract_type: "PERMANENT", application_status: "APPLIED",      salary: 100000, company_size: "SMALL"  },
        { title: "Node.js Developer",        company: "Shopify",       location: "Toronto, CA",    work_arrangement: "HYBRID",  contract_type: "PERMANENT", application_status: "INTERVIEWED",  salary: 105000, company_size: "LARGE"  },
        { title: "Platform Engineer",        company: "GitHub",        location: "Remote",         work_arrangement: "REMOTE",  contract_type: "PERMANENT", application_status: "REJECTED",     salary: 115000, company_size: "LARGE"  },
        { title: "API Engineer",             company: "Twilio",        location: "San Francisco",  work_arrangement: "HYBRID",  contract_type: "PERMANENT", application_status: "APPLIED",      salary: 120000, company_size: "LARGE"  },
        { title: "Software Engineer II",     company: "Loom",          location: "Remote",         work_arrangement: "REMOTE",  contract_type: "PERMANENT", application_status: "SAVED",                        company_size: "MEDIUM" },
    ],
    "a1b2c3d4-0008-4000-8000-000000000008": [
        { title: "Product Designer",         company: "Canva",         location: "Sydney, AU",     work_arrangement: "HYBRID",  contract_type: "PERMANENT", application_status: "INTERVIEWED",  salary: 90000, company_size: "LARGE"  },
        { title: "UX Designer",              company: "Intercom",      location: "Dublin, IE",     work_arrangement: "HYBRID",  contract_type: "PERMANENT", application_status: "APPLIED",      salary: 75000, company_size: "MEDIUM" },
        { title: "UI/UX Designer",           company: "Miro",          location: "Amsterdam, NL",  work_arrangement: "REMOTE",  contract_type: "PERMANENT", application_status: "REJECTED",     salary: 80000, company_size: "MEDIUM" },
        { title: "Senior Designer",          company: "Figma",         location: "Remote",         work_arrangement: "REMOTE",  contract_type: "PERMANENT", application_status: "APPLIED",      salary: 95000, company_size: "MEDIUM" },
        { title: "Design Engineer",          company: "Linear",        location: "Remote",         work_arrangement: "REMOTE",  contract_type: "PERMANENT", application_status: "SAVED",                        company_size: "SMALL"  },
        { title: "Brand Designer",           company: "Notion",        location: "New York, US",   work_arrangement: "HYBRID",  contract_type: "PERMANENT", application_status: "APPLIED",      salary: 88000, company_size: "MEDIUM" },
    ],
    "a1b2c3d4-0009-4000-8000-000000000009": [
        { title: "Data Engineer",            company: "Palantir",      location: "New York, US",   work_arrangement: "ONSITE",  contract_type: "PERMANENT", application_status: "ACCEPTED",     salary: 130000, company_size: "LARGE"  },
        { title: "ML Engineer",              company: "DeepMind",      location: "London, UK",     work_arrangement: "HYBRID",  contract_type: "PERMANENT", application_status: "INTERVIEWED",  salary: 140000, company_size: "LARGE"  },
        { title: "Data Scientist",           company: "Spotify",       location: "Stockholm, SE",  work_arrangement: "HYBRID",  contract_type: "PERMANENT", application_status: "REJECTED",     salary: 100000, company_size: "LARGE"  },
        { title: "Analytics Engineer",       company: "dbt Labs",      location: "Remote",         work_arrangement: "REMOTE",  contract_type: "PERMANENT", application_status: "APPLIED",      salary: 115000, company_size: "SMALL"  },
        { title: "AI Research Engineer",     company: "Anthropic",     location: "San Francisco",  work_arrangement: "ONSITE",  contract_type: "PERMANENT", application_status: "APPLIED",      salary: 160000, company_size: "MEDIUM" },
    ],
    "a1b2c3d4-0010-4000-8000-000000000010": [
        { title: "DevOps Engineer",          company: "HashiCorp",     location: "Remote",         work_arrangement: "REMOTE",  contract_type: "PERMANENT", application_status: "APPLIED",      salary: 100000, company_size: "MEDIUM" },
        { title: "Site Reliability Engineer",company: "Cloudflare",    location: "Remote",         work_arrangement: "REMOTE",  contract_type: "PERMANENT", application_status: "INTERVIEWED",  salary: 110000, company_size: "LARGE"  },
        { title: "Cloud Engineer",           company: "AWS",           location: "Seattle, US",    work_arrangement: "HYBRID",  contract_type: "PERMANENT", application_status: "REJECTED",     salary: 125000, company_size: "LARGE"  },
        { title: "Platform Engineer",        company: "Grafana Labs",  location: "Remote",         work_arrangement: "REMOTE",  contract_type: "PERMANENT", application_status: "APPLIED",      salary: 105000, company_size: "MEDIUM" },
        { title: "Infrastructure Engineer",  company: "Fly.io",        location: "Remote",         work_arrangement: "REMOTE",  contract_type: "PERMANENT", application_status: "SAVED",                        company_size: "SMALL"  },
        { title: "Backend Engineer",         company: "PlanetScale",   location: "Remote",         work_arrangement: "REMOTE",  contract_type: "PERMANENT", application_status: "APPLIED",      salary: 115000, company_size: "SMALL"  },
    ],
}

async function main() {
    console.log("Seeding fake users...")
    for (const user of FAKE_USERS) {
        await prisma.user.upsert({
            where: { email: user.email },
            update: { mock: true },
            create: user,
        })
        console.log(`  ✓ ${user.name}`)
    }

    console.log("Seeding columns and jobs...")
    for (const user of FAKE_USERS) {
        // Upsert columns
        for (const col of DEFAULT_COLUMNS) {
            await prisma.column.upsert({
                where: { id: `${user.id}-col-${col.position}` },
                update: {},
                create: { id: `${user.id}-col-${col.position}`, user_id: user.id, ...col },
            })
        }

        // Delete existing mock jobs then recreate (simplest idempotency)
        await prisma.job.deleteMany({ where: { user_id: user.id } })
        const jobs = MOCK_JOBS[user.id] ?? []
        for (const job of jobs) {
            await prisma.job.create({ data: { user_id: user.id, ...job } })
        }
        console.log(`  ✓ ${user.name}: ${DEFAULT_COLUMNS.length} columns, ${jobs.length} jobs`)
    }

    console.log("Done.")
}

main()
.catch((e) => { console.error(e); process.exit(1) })
.finally(() => prisma.$disconnect())
