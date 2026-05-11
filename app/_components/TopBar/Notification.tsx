import { Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

type Props = {}

const Notification = (props: Props) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Bell size={20} className="cursor-pointer"/>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-45 mt-2" align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuItem className="text-muted-foreground my-1 p-2">
                    No notifications.
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default Notification