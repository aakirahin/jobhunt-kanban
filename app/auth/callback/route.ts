import { createSupabaseServerClient } from "@/lib/supabase/server"
import { ensureDefaultColumns } from "@/lib/dbUtils"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (request: NextRequest) => {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get("code")

    if (!code) return NextResponse.redirect(`${origin}/auth?error=missing_code`)

    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) return NextResponse.redirect(`${origin}/auth?error=auth_failed`)

    const { data: { user } } = await supabase.auth.getUser()
    if (user) await ensureDefaultColumns(user)
    else return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    return NextResponse.redirect(`${origin}/user/${user?.id}`)
}