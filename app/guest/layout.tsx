import TopBar from "@/app/_components/TopBar/TopBar"
import { Toaster } from "@/app/_components/ui/sonner"
import Sidebar from "../_components/Sidebar"

type Props = {
    children: React.ReactNode
}

const GuestLayout = ({ children }: Props) => {
    return (
        <div className="flex">
            <Sidebar guest/>
            <div className="bg-white rounded-[20px] min-h-[calc(100vh-2rem)] w-full m-4 p-6 ml-0 flex flex-col gap-2">
                <TopBar user={null} guest/>
                <Toaster/>
                {children}
            </div>
        </div>
    )
}

export default GuestLayout
