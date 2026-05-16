import prisma from "@/lib/prisma"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

type Params = { params: Promise<{ id: string }> }

export const PATCH = async (request: Request, { params }: Params) => {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await params
    const { status } = await request.json()

    if (status !== "ACCEPTED" && status !== "DECLINED") return NextResponse.json({ error: "status must be ACCEPTED or DECLINED" }, { status: 400 })

    const friendship = await prisma.friendship.findUnique({ where: { id } })
    if (!friendship) return NextResponse.json({ error: "Not found" }, { status: 404 })
    if (friendship.addressee_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const updated = await prisma.friendship.update({
        where: { id },
        data: { status, responded_at: new Date() },
    })

    return NextResponse.json(updated)
}

export const DELETE = async (_request: Request, { params }: Params) => {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await params

    const friendship = await prisma.friendship.findUnique({ where: { id } })
    if (!friendship) return NextResponse.json({ error: "Not found" }, { status: 404 })
    if (friendship.requester_id !== user.id && friendship.addressee_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    await prisma.friendship.delete({ where: { id } })
    return new NextResponse(null, { status: 204 })
}
