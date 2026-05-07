import { PrismaClient } from "../lib/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  	connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({ adapter });

const defaultColumns = [
	{
		name: "Saved",
		position: 0,
		colour: "#A6BBFB",
	},
	{
		name: "Applied",
		position: 1,
		colour: "#99D1FB",
	},
	{
		name: "Interviewed",
		position: 2,
		colour: "#4FE7CD",
	},
	{
		name: "Accepted",
		position: 3,
		colour: "#95EC3F",
	},
	{
		name: "Rejected",
		position: 4,
		colour: "#FEAAC2",
	},
] as const

const seedDefaultColumns = async () => {
	const users = await prisma.user.findMany({
		select: {
			id: true,
			columns: {
				select: {
					id: true,
				},
			},
		},
	})

	const usersMissingColumns = users.filter((user) => user.columns.length === 0)

	if (usersMissingColumns.length === 0) {
		console.log("No users require default columns.")
		return
	}

	await prisma.$transaction(
		usersMissingColumns.map((user) =>
			prisma.columns.createMany({
				data: defaultColumns.map((column) => ({
					user_id: user.id,
					name: column.name,
					position: column.position,
					colour: column.colour,
				})),
			}),
		),
	)

	console.log(`Seeded default columns for ${usersMissingColumns.length} user(s).`)
}

const main = async () => {
	await seedDefaultColumns()
}

main()
	.catch((error) => {
		console.error("Seeding failed:", error)
		process.exitCode = 1
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
