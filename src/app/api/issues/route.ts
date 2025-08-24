import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { issueSchema } from "@/lib/validationSchema";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/AuthOptions";
import { Prisma, Status } from "@prisma/client";

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

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		
		const page = parseInt(searchParams.get("page") || "1");
		const pageSize = parseInt(searchParams.get("pageSize") || "10");
		const status = searchParams.get("status");
		const search = searchParams.get("search");
		const orderBy = searchParams.get("orderBy") || "createdAt";
		const orderDirection = searchParams.get("orderDirection") || "desc";

		// Build where clause
		const where: Prisma.IssueWhereInput = {};
		if (status) {
			where.status = status as Status;
		}
		if (search) {
			where.OR = [
				{ title: { contains: search, mode: "insensitive" } },
				{ description: { contains: search, mode: "insensitive" } },
			];
		}

		// Build orderBy clause
		const orderByClause = { [orderBy]: orderDirection };

		const [issues, totalCount] = await Promise.all([
			prisma.issue.findMany({
				where,
				orderBy: orderByClause,
				skip: (page - 1) * pageSize,
				take: pageSize,
				include: {
					assignedUser: true,
				},
			}),
			prisma.issue.count({ where }),
		]);

		return NextResponse.json({
			issues,
			totalCount,
			page,
			pageSize,
			totalPages: Math.ceil(totalCount / pageSize),
		}, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ message: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
