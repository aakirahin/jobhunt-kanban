import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { getEnvironmentVariables } from "./utils"

// AUTHENTICATES INBOUND REQUESTS TO BACKEND
export const createSupabaseServerClient = async () => {
    const { supabaseUrl, supabaseKey } = getEnvironmentVariables()
    const cookieStore = await cookies()

    return createServerClient(supabaseUrl, supabaseKey, {
        // COOKIES CONFIGURATION
        cookies: {
            getAll() {
                return cookieStore.getAll()
            },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
                } 
                catch (e) {
                    // Middleware will handle
                }
            }
        }
    })
}