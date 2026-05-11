import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { withAuth } from "@/lib/apiUtils"

// GET COLUMNS UNDER USER
export const GET = withAuth(async (_request, user) => {
  const columns = await prisma.column.findMany({
    where: { user_id: user.id },
    orderBy: { position: "asc" },
  })

  return NextResponse.json(columns)
})

// ADD NEW COLUMN
export const POST = withAuth(async (request, user) => {
  const body = await request.json()

  if (
    !body.name || body.name.trim().length === 0 ||
    !body.colour || body.colour.trim().length === 0
  ) {
    return NextResponse.json({ message: "Column name and colour are required" }, { status: 400 })
  }

  const highestPositionColumn = await prisma.column.findFirst({
    where: { user_id: user.id },
    orderBy: { position: "desc" },
    select: { position: true },
  })

  const column = await prisma.column.create({
    data: {
      user_id: user.id,
      name: body.name.trim(),
      colour: body.colour.trim(),
      position: highestPositionColumn ? highestPositionColumn.position + 1 : 0,
    },
  })

  return NextResponse.json(column, { status: 201 })
})

// EDIT COLUMN POSITION
// TODO: ADD RENAME + CHANGE COLOUR FUNCTIONALITY
export const PATCH = withAuth(async (request, user) => {
  const body = await request.json()
  const columnIds = body.columnIds ?? []

  if (columnIds.length === 0) return NextResponse.json({ message: "columnIds is required" }, { status: 400 })

  const existingColumns = await prisma.column.findMany({
    where: { user_id: user.id },
    select: { id: true },
  })

  const existingIds = existingColumns.map((column) => column.id)
  if (existingIds.length !== columnIds.length) return NextResponse.json({ message: "Invalid reorder payload" }, { status: 400 })

  const incomingSet = new Set(columnIds)
  if (incomingSet.size !== columnIds.length) return NextResponse.json({ message: "Duplicate column IDs" }, { status: 400 })

  const isSameSet = existingIds.every((id) => columnIds.includes(id)) && columnIds.every((id: string) => existingIds.includes(id))
  if (!isSameSet) return NextResponse.json({ message: "Invalid reorder payload" }, { status: 400 })

  await prisma.$transaction(
    columnIds.map((columnId: string, index: number) =>
      prisma.column.update({
        where: { id: columnId },
        data: { position: index },
      })
    )
  )

  return NextResponse.json({ success: true })
})

// DELETE COLUMN
export const DELETE = withAuth(async (request, user) => {
  const body = await request.json()
  const columnId = body.columnId

  if (!columnId) return NextResponse.json({ message: "columnId is required" }, { status: 400 })

  const { count } = await prisma.column.deleteMany({
    where: { id: columnId, user_id: user.id },
  })

  if (count === 0) return NextResponse.json({ message: "Column not found" }, { status: 404 })
  return NextResponse.json({ success: true })
})