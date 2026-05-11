import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "./lib/supabase/server"

export const proxy = async (request: NextRequest) => {
    const response = NextResponse.next({
        request: {
            headers: request.headers
        }
    })

    const supabase = await createSupabaseServerClient() // REFRESHES TOKENS IF NECESSARY
    const { data: { user } } = await supabase.auth.getUser()

    if (!user && request.nextUrl.pathname.startsWith("/user")) {
        return NextResponse.redirect(new URL("/auth", request.url))
    }

    return response
}