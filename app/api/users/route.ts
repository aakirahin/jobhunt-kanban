import { withAuth } from "@/lib/apiUtils"
import prisma from "@/lib/prisma"
import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export const DELETE = withAuth(async (_request, user) => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) return NextResponse.json({ message: "Server misconfiguration" }, { status: 500 })

    // Delete DB record first — cascades to Columns and Jobs via Prisma schema relations
    await prisma.user.delete({ where: { id: user.id } })

    // Then delete the auth identity
    const adminClient = createClient(supabaseUrl, serviceRoleKey)
    const { error } = await adminClient.auth.admin.deleteUser(user.id)
    if (error) return NextResponse.json({ message: error.message }, { status: 400 })

    return NextResponse.json({ message: "Account deleted" })
})
