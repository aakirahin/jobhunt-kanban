import type { User as SupabaseUser } from "@supabase/supabase-js"
import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/internal/prismaNamespace"
import prisma from "@/lib/prisma"

export const defaultColumns = [
    { name: "Saved", position: 0, colour: "#A6BBFB" },
    { name: "Applied", position: 1, colour: "#99D1FB" },
    { name: "Interviewed", position: 2, colour: "#4FE7CD" },
    { name: "Accepted", position: 3, colour: "#95EC3F" },
    { name: "Rejected", position: 4, colour: "#FEAAC2" },
] as const

export const ensureDefaultColumns = async (authUser: SupabaseUser) => {
    const avatarFromMetadata =
        typeof authUser.user_metadata?.avatar_url === "string"
        ? authUser.user_metadata.avatar_url
        : null

    try {
        await prisma.user.upsert({
            where: { id: authUser.id },
            update: {},
            create: {
                id: authUser.id,
                email: authUser.email!,
                name: authUser.user_metadata.name ?? undefined,
                avatar: avatarFromMetadata,
            },
        })
    } catch (err) {
        // P2002 = unique constraint violation on email:
        // a stale user row exists with the same email but a different UUID
        // (happens when Supabase auth is reset but the DB is not).
        // Delete the stale row (cascades to columns/jobs) and retry.
        if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") {
            await prisma.user.delete({ where: { email: authUser.email! } })
            await prisma.user.create({
                data: {
                    id: authUser.id,
                    email: authUser.email!,
                    name: authUser.user_metadata.name ?? undefined,
                    avatar: avatarFromMetadata,
                },
            })
        } else {
            throw err
        }
    }

    const columnCount = await prisma.column.count({
        where: { user_id: authUser.id },
    })

    if (columnCount === 0) {
        await prisma.column.createMany({
            data: defaultColumns.map((column) => ({
                user_id: authUser.id,
                name: column.name,
                position: column.position,
                colour: column.colour,
            })),
        })
    }
}