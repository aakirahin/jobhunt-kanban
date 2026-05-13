import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export const useDeleteUserMutation = () => {
    const { mutate: deleteUser } = useMutation({
        mutationKey: ["users"],
        mutationFn: async (userId: string) => {
            const res = await fetch('/api/users', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            })
            // if (!res.ok) toast.error("Failed to delete user.")
            return res.json()
        },
        onSuccess: () => {
            toast.success("User deleted successfully!")
            window.location.href = "/"
        },
        onError: (_err, _userId) => {
            toast.error("Could not delete user. Something went wrong.")
        },
    })

    return { deleteUser }
}