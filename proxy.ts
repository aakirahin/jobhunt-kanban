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

    if (!request.nextUrl.pathname.startsWith("/user")) return response

    if (!user) return NextResponse.redirect(new URL("/", request.url))

    const boardUserId = request.nextUrl.pathname.split("/")[2]
    if (user.id === boardUserId) return response

    const { data: friendship } = await supabase
        .from("Friendship")
        .select("id")
        .eq("status", "ACCEPTED")
        .or(
            `and(requester_id.eq.${user?.id},addressee_id.eq.${boardUserId}),` +
            `and(requester_id.eq.${boardUserId},addressee_id.eq.${user?.id})`
        )
        .maybeSingle()

    if (!friendship) return NextResponse.redirect(new URL(`/user/${user?.id}`, request.url))

    return response
}