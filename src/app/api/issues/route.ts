import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createIssueSchema } from "@/lib/validationSchema";

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

export async function GET() {
	try {
		const issues = await prisma.issue.findMany({
			orderBy: { createdAt: "desc" },
		});

		return NextResponse.json(issues, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ message: error.message }, { status: 500 });
		}
	}
}
