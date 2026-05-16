import prisma from "@/lib/prisma"
import { withAuth } from "@/lib/apiUtils"
import { NextResponse } from "next/server"

export const GET = withAuth(async (request, user) => {
    const { searchParams } = new URL(request.url)

    if (searchParams.has("q")) {
        const query = searchParams.get("q")!.trim()

        const existing = await prisma.friendship.findMany({
            where: {
                OR: [{ requester_id: user.id }, { addressee_id: user.id }],
            },
            select: { requester_id: true, addressee_id: true },
        })

        const excludeIds = new Set([user.id]) // Exclude existing friendships
        for (const f of existing) {
            excludeIds.add(f.requester_id)
            excludeIds.add(f.addressee_id)
        }

        const users = await prisma.user.findMany({
            where: {
                id: { notIn: Array.from(excludeIds) },
                ...(query
                    ? {
                          OR: [
                              { name: { contains: query, mode: "insensitive" } },
                              { email: { contains: query, mode: "insensitive" } },
                          ],
                      }
                    : { mock: true }),
            },
            select: { id: true, name: true, email: true, avatar: true, status: true },
            take: 10,
        })

        return NextResponse.json(users)
    }

    const [accepted, incoming] = await Promise.all([ // Friends + friend requests
        prisma.friendship.findMany({
            where: {
                OR: [
                    { requester_id: user.id, status: "ACCEPTED" },
                    { addressee_id: user.id, status: "ACCEPTED" },
                ],
            },
            include: {
                requester: { select: { id: true, name: true, email: true, avatar: true, status: true } },
                addressee: { select: { id: true, name: true, email: true, avatar: true, status: true } },
            },
        }),
        prisma.friendship.findMany({
            where: { addressee_id: user.id, status: "PENDING" },
            include: {
                requester: { select: { id: true, name: true, email: true, avatar: true, status: true } },
            },
            orderBy: { requested_at: "desc" },
        }),
    ])

    const friends = accepted.map((f) => ({
        friendshipId: f.id,
        ...(f.requester_id === user.id ? f.addressee : f.requester),
    }))

    return NextResponse.json({ friends, requests: incoming })
})

export const POST = withAuth(async (request, user) => {
    const { addressee_id } = await request.json()

    if (!addressee_id) return NextResponse.json({ error: "addressee_id is required" }, { status: 400 })
    if (addressee_id === user.id) return NextResponse.json({ error: "Cannot add yourself" }, { status: 400 })

    const existing = await prisma.friendship.findFirst({
        where: {
            OR: [
                { requester_id: user.id, addressee_id },
                { requester_id: addressee_id, addressee_id: user.id },
            ],
        },
    })

    if (existing) return NextResponse.json({ error: "Already connected" }, { status: 409 })

    const addressee = await prisma.user.findUnique({
        where: { id: addressee_id },
        select: { mock: true },
    })

    const autoAccept = addressee?.mock ?? false

    const friendship = await prisma.friendship.create({
        data: {
            requester_id: user.id,
            addressee_id,
            status: autoAccept ? "ACCEPTED" : "PENDING",
            ...(autoAccept && { responded_at: new Date() }),
        },
    })

    return NextResponse.json(friendship, { status: 201 })
})
