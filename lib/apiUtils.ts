import type { User } from "@supabase/supabase-js"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

type AuthHandler = (request: Request, user: User) => Promise<NextResponse>

// Wrapper function
export const withAuth = (handler: AuthHandler) => async (request: Request) => {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    return handler(request, user)
}
