import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { issueSchema } from "@/lib/validationSchema";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/AuthOptions";

export async function POST(req: NextRequest) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const body = await req.json();
	const validation = issueSchema.safeParse(body);

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
