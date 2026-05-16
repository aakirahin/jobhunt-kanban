import prisma from "@/lib/prisma"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Job } from "@/lib/types"
import { MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const dynamic = "force-dynamic"

type Props = { params: Promise<{ userId: string; friendId: string }> }

const pillClass = "py-1 px-2 rounded-full bg-gray-100 text-[11px] text-gray-500 font-medium border border-gray-300"
const secondaryText = "text-[13px] text-gray-500"

const ReadOnlyJobCard = ({ job }: { job: Job }) => (
    <div className="bg-white w-full border rounded-lg p-3 flex flex-col gap-1">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium leading-snug">{job.title}</p>
                <p className={`${secondaryText} font-medium`}>{job.company}</p>
            </div>
        </div>
        <span className={`flex gap-1 ${secondaryText}`}>
            <span className="font-medium flex items-center gap-0.5">
                <MapPin size={12} />
                {job.location}
            </span>
            {job.salary && <span>• £{job.salary.toLocaleString()}</span>}
        </span>
        <div className="flex justify-between items-center mt-1">
            <div className="flex gap-1.5 flex-wrap">
                <span className={pillClass}>{job.work_arrangement}</span>
                <span className={pillClass}>{job.contract_type}</span>
            </div>
            <span className={secondaryText}>
                {new Date(job.created_at).toLocaleDateString()}
            </span>
        </div>
    </div>
)

export default async function FriendBoardPage({ params }: Props) {
    const { userId, friendId } = await params

    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.id !== userId) redirect(`/`)

    const friendship = await prisma.friendship.findFirst({
        where: {
            status: "ACCEPTED",
            OR: [
                { requester_id: userId, addressee_id: friendId },
                { requester_id: friendId, addressee_id: userId },
            ],
        },
    })
    if (!friendship) redirect(`/user/${userId}/friends`)

    const [friend, columns, jobs] = await Promise.all([
        prisma.user.findUnique({
            where: { id: friendId },
            select: { name: true, avatar: true, status: true, email: true },
        }),
        prisma.column.findMany({
            where: { user_id: friendId },
            orderBy: { position: "asc" },
        }),
        prisma.job.findMany({
            where: { user_id: friendId },
            orderBy: { created_at: "desc" },
        }),
    ])

    if (!friend) redirect(`/user/${userId}/friends`)

    const columnJobs = Object.fromEntries(
        columns.map((col) => [
            col.name.toUpperCase(),
            (jobs as Job[]).filter((j) => j.application_status === col.name.toUpperCase()),
        ])
    )

    // TODO FIX
    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    {friend.avatar && (
                        <Image
                            src={friend.avatar}
                            alt={friend.name ?? ""}
                            width={28}
                            height={28}
                            className="rounded-full"
                        />
                    )}
                    <span className="font-semibold text-[#3A3A3A]">
                        {friend.name ?? friend.email}&apos;s Board
                    </span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border ml-auto">
                    Read-only
                </span>
            </div>
            {columns.length === 0 ? (
                <p className="text-sm text-gray-400">This board has no columns yet.</p>
            ) : (
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {columns.map((col) => {
                        const colJobs = columnJobs[col.name.toUpperCase()] ?? []
                        return (
                            <div
                                key={col.id}
                                className="min-w-[260px] w-[260px] shadow-[0px_6px_0px_#3A3A3A] rounded-xl border border-[#3A3A3A] py-3 px-4 shrink-0"
                                style={{ backgroundColor: col.colour }}
                            >
                                <h3 className="text-lg font-medium mb-3">
                                    {col.name} ({colJobs.length})
                                </h3>
                                <div className="flex flex-col gap-3">
                                    {colJobs.map((job) => (
                                        <ReadOnlyJobCard key={job.id} job={job} />
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
