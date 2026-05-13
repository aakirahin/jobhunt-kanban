import { createSupabaseServerClient } from "@/lib/supabase/server"
import { ensureDefaultColumns } from "@/lib/dbUtils"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (request: NextRequest) => {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get("code")

    if (!code) return NextResponse.redirect(`${origin}/auth?error=missing_code`)

    const supabase = await createSupabaseServerClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    if (error || !data.user) return NextResponse.redirect(`${origin}/auth?error=auth_failed`)

    try {
        await ensureDefaultColumns(data.user)
        return NextResponse.redirect(`${origin}/user/${data.user?.id}`)
    } catch (err) {
        return NextResponse.redirect(`${origin}/auth?error=setup_failed`)
    }
}