import Avatar from "@/app/_components/Avatar"
import Notification from "@/app/_components/Notification"
import Sidebar from "@/app/_components/Sidebar"
import { Input } from "@/app/_components/ui/input"
import { createSupabaseServerClient } from "@/lib/supabase/server-client"

type Props = { 
    children: React.ReactNode 
}

const Layout = async ({ 
    children 
}: Props) => {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <div className="flex">
            <Sidebar/>
            <div className="bg-white rounded-[20px] min-h-[calc(100vh-2rem)] w-full m-4 p-6 ml-0 flex flex-col gap-4">
                <div className="flex justify-between">
                    <Input 
                        className="w-1/5"
                        placeholder="Search"
                    />
                    <div className="flex gap-4 items-center">
                        <Notification/>
                        <Avatar user={user}/>
                    </div>
                </div>
                {children}
            </div>
        </div>
    )
}

export default Layout