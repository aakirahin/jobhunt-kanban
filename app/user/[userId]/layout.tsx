import Sidebar from "@/app/_components/Sidebar"
import TopBar from "@/app/_components/TopBar/TopBar"
import { Toaster } from "@/app/_components/ui/sonner"
import { createSupabaseServerClient } from "@/lib/supabase/server"

type Props = { 
    children: React.ReactNode 
}

const Layout = async ({ 
    children 
}: Props) => {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    console.log(user)

    return (
        <div className="flex">
            <Sidebar userId={user?.id}/>
            <div className="bg-white rounded-[20px] min-h-[calc(100vh-2rem)] w-full m-4 p-6 ml-0 flex flex-col gap-2">
                <TopBar user={user} guest={false}/>
                <Toaster/>
                {children}
            </div>
        </div>
    )
}

export default Layout