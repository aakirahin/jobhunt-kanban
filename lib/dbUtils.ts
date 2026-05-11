import type { User as SupabaseUser } from "@supabase/supabase-js"
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

    await prisma.$transaction(async (tx) => {
        await tx.user.upsert({
            where: { id: authUser.id },
            update: {
                email: authUser.email ?? undefined,
            },
            create: {
                id: authUser.id,
                email: authUser.email!,
                name: authUser.user_metadata.name ?? undefined,
                avatar: avatarFromMetadata,
            },
        })

        const columnCount = await tx.column.count({
            where: { user_id: authUser.id },
        })

        if (columnCount === 0) {
            await tx.column.createMany({
                data: defaultColumns.map((column) => ({
                    user_id: authUser.id,
                    name: column.name,
                    position: column.position,
                    colour: column.colour,
                })),
            })
        }
    })
}