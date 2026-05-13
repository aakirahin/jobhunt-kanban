import { withAuth } from "@/lib/apiUtils"
import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export const DELETE = withAuth(async (_request, user) => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) return NextResponse.json({ message: "Server misconfiguration" }, { status: 500 })

    const adminClient = createClient(supabaseUrl, serviceRoleKey)

    const { error } = await adminClient.auth.admin.deleteUser(user.id)
    if (error) return NextResponse.json({ message: error.message }, { status: 400 })

    return NextResponse.json({ message: "Account deleted" })
})
