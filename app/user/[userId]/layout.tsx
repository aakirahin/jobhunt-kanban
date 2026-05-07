import Sidebar from "@/app/_components/Sidebar"
import TopBar from "@/app/_components/TopBar"

type Props = { 
    children: React.ReactNode 
}

const Layout = async ({ 
    children 
}: Props) => {
    return (
        <div className="flex">
            <Sidebar/>
            <div className="bg-white rounded-[20px] min-h-[calc(100vh-2rem)] w-full m-4 p-6 ml-0 flex flex-col gap-4">
                <TopBar/>
                {children}
            </div>
        </div>
    )
}

export default Layout