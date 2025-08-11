import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import z from "zod";

const createIssueSchema = z.object({
	title: z
		.string()
		.min(1, "Title is required")
		.max(255, "Title is too long, max 255 characters are acceptable"),
	description: z.string().min(1, "Description is required"),
});

export async function POST(req: Request) {
	const body = await req.json();
	const validation = createIssueSchema.safeParse(body);

	if (!validation.success) {
		return NextResponse.json(validation.error, { status: 400 });
	}

	try {
		const newIssue = await prisma.issue.create({
			data: {
				title: body.title,
				description: body.description,
			},
		});

		return NextResponse.json(newIssue, { status: 201 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ message: error.message }, { status: 500 });
		}

		// Fallback for unknown error shapes
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
