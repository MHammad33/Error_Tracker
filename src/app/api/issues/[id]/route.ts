import authOptions from "@/app/auth/AuthOptions";
import { prisma } from "@/lib/prisma";
import { issueSchema } from "@/lib/validationSchema";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const { id } = await params;

	const body = await request.json();
	const validation = issueSchema.safeParse(body);

	if (!validation.success) {
		return NextResponse.json(validation.error, { status: 400 });
	}

	const issue = await prisma.issue.findUnique({
		where: { id },
	});

	if (!issue) {
		return NextResponse.json({ message: "Issue not found" }, { status: 404 });
	}

	const updatedIssue = await prisma.issue.update({
		where: { id },
		data: {
			title: body.title,
			description: body.description,
		},
	});

	return NextResponse.json(updatedIssue, { status: 200 });
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;

	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const issue = await prisma.issue.findUnique({
		where: { id },
	});

	if (!issue) {
		return NextResponse.json({ message: "Issue not found" }, { status: 404 });
	}

	await prisma.issue.delete({
		where: { id },
	});

	return NextResponse.json(
		{ message: "Issue deleted successfully" },
		{ status: 200 }
	);
}
