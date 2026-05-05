import { createBrowserClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";
import { getEnvironmentVariables } from "./utils";

type SupabaseSchema = Record<string, never>

let client: SupabaseClient<SupabaseSchema> | null = null

// MANAGES USER SESSIONS INSIDE BROWSER
export const createSupabaseBrowserClient = (): SupabaseClient<SupabaseSchema> => {
    if (client) return client
    
    const { supabaseUrl, supabaseKey } = getEnvironmentVariables()
    return createBrowserClient(supabaseUrl, supabaseKey);
}