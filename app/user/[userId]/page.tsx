import Board from "@/app/_components/KanbanBoard/Board"
import prisma from "@/lib/prisma"

type Props = {
  params: Promise<{
    userId: string
  }>
}

const Page = async ({ params }: Props) => {
  const { userId } = await params

  const columns = await prisma.column.findMany({
    where: { user_id: userId },
    orderBy: { position: "asc" },
  })

  const jobs = await prisma.job.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
  })

  return (
    <Board initialColumns={columns} initialJobs={jobs}/>
  )
}

export default Page