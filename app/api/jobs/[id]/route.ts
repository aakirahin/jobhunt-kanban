import { withAuth } from "@/lib/apiUtils"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export const PATCH = withAuth(async (request, user) => {
    const body = await request.json()
    
    const jobId = body.id
    if (!jobId) return NextResponse.json({ message: "jobId is required" }, { status: 400 })

    const existing = await prisma.job.findFirst({ where: { id: jobId, user_id: user.id } })
    if (!existing) return NextResponse.json({ message: "Job not found" }, { status: 404 })

    const job = await prisma.job.update({
        where: { id: jobId },
        data: {
            ...(body.title !== undefined && { title: body.title.trim() }),
            ...(body.company !== undefined && { company: body.company.trim() }),
            ...(body.url !== undefined && { url: body.url.trim() }),
            ...(body.location !== undefined && { location: body.location.trim() }),
            ...(body.work_arrangement !== undefined && { work_arrangement: body.work_arrangement.trim() }),
            ...(body.contract_type !== undefined && { contract_type: body.contract_type.trim() }),
            ...(body.application_status !== undefined && { application_status: body.application_status.trim() }),
            ...(body.notes !== undefined && { notes: body.notes.trim() }),
        },
    })

    return NextResponse.json(job, { status: 200 })
})