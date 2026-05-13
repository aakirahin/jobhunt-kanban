"use client"

import Board from "@/app/_components/KanbanBoard/Board"
import { GuestProvider, useGuest } from "@/app/_context/guest"

function GuestBoard() {
    const guest = useGuest()!
    return <Board initialColumns={guest.columns} initialJobs={guest.jobs} />
}

export default function GuestPage() {
    return (
        <GuestProvider>
            <GuestBoard />
        </GuestProvider>
    )
}
