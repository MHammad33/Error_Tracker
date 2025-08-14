import { prisma } from "@/lib/prisma";

export async function GET() {
	const users = await prisma.user.findMany({
		orderBy: {
			name: "asc",
		},
	});
	return Response.json(users);
}
