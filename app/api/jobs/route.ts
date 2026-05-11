import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { withAuth } from "@/lib/apiUtils"
import { ContractType, WorkArrangement } from "@/lib/generated/prisma/enums"

export const GET = withAuth(async (request, user) => {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title')
    const location = searchParams.get('location')
    const work_arrangement = searchParams.get('work_arrangement')
    const contract_type = searchParams.get('contract_type')
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    const jobs = await prisma.job.findMany({
        where: {
            user_id: user.id,
            ...(title && { title: { contains: title, mode: 'insensitive' } }),
            ...(location && { location: { contains: location, mode: 'insensitive' } }),
            ...(work_arrangement && { work_arrangement: work_arrangement as WorkArrangement }),
            ...(contract_type && { contract_type: contract_type as ContractType }),
            ...((from || to) && {
                created_at: {
                    ...(from && { gte: new Date(from) }),
                    ...(to && { lte: new Date(to) }),
                },
            }),
        },
        orderBy: { created_at: "desc" },
    })

    return NextResponse.json(jobs)
})

export const POST = withAuth(async (request, user) => {
    const body = await request.json()

    if (
        !body.title || body.title.trim().length === 0 ||
        !body.company || body.company.trim().length === 0 ||
        !body.application_status || body.application_status.trim().length === 0
    ) {
        return NextResponse.json({ message: "Job title, company, and application status are required" }, { status: 400 })
    }

    const job = await prisma.job.create({
        data: {
            user_id: user.id,
            title: body.title.trim(),
            company: body.company.trim(),
            url: body.url.trim() ?? "",
            location: body.location.trim() ?? "",
            work_arrangement: body.work_arrangement.trim() ?? "",
            contract_type: body.contract_type.trim() ?? "",
            application_status: body.application_status.trim(),
            notes: body.notes.trim() ?? "",
        },
    })

    return NextResponse.json(job, { status: 201 })
})

export const DELETE = withAuth(async (request, user) => {
    const body = await request.json()
    const jobId = body.jobId

    if (!jobId) return NextResponse.json({ message: "jobId is required" }, { status: 400 })

    const { count } = await prisma.job.deleteMany({
        where: { id: jobId, user_id: user.id },
    })

    if (count === 0) return NextResponse.json({ message: "Job not found" }, { status: 404 })
    return NextResponse.json({ success: true })
})