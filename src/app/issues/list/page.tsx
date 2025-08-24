import Pagination from "@/components/Pagination";
import SearchInput from "@/components/SearchInput";
import QuickFilters from "@/components/QuickFilters";
import ViewToggle from "@/components/ViewToggle";
import KanbanBoard from "@/components/KanbanBoard";
import { columns } from "@/constants/columns";
import { prisma } from "@/lib/prisma";
import { Issue, Prisma, Status } from "@prisma/client";
import { Heading, Text } from "@radix-ui/themes";
import { FC } from "react";
import IssuesTable, { IssueSearchParams } from "./IssuesTable";
import NewIssueButton from "./NewIssueButton";
import { Metadata } from "next";

interface IssuesPageProps {
	searchParams: Promise<IssueSearchParams>;
}

const IssuesPage: FC<IssuesPageProps> = async ({ searchParams }) => {
	const searchParamsObj = await searchParams;
	const searchStatus = searchParamsObj.status as Status;
	const searchTerm = searchParamsObj.search;
	const currentView = searchParamsObj.view || "table";
	const statuses = Object.values(Status);
	const status = statuses.includes(searchStatus) ? searchStatus : undefined;

	const validOrderFields = columns.map((col) => col.value);
	const orderByField = searchParamsObj.orderBy;
	const orderDirection = searchParamsObj.orderDirection || "asc";

	const isValidOrderBy =
		orderByField !== undefined &&
		(validOrderFields as string[]).includes(orderByField as string);

	const orderBy = isValidOrderBy
		? ({ [orderByField as string]: orderDirection } as Record<
			keyof Issue,
			"asc" | "desc"
		>)
		: { createdAt: "desc" as const };

	const page = Number(searchParamsObj.page) || 1;
	const pageSize = 12;

	// Build where clause with search
	const where: Prisma.IssueWhereInput = {};
	if (status) {
		where.status = status;
	}
	if (searchTerm) {
		where.OR = [
			{ title: { contains: searchTerm, mode: "insensitive" } },
			{ description: { contains: searchTerm, mode: "insensitive" } },
		];
	}

	const issues = await prisma.issue.findMany({
		where,
		orderBy,
		skip: (page - 1) * pageSize,
		take: pageSize,
		include: {
			assignedUser: true,
		},
	});

	const issueCount = await prisma.issue.count({ where });

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
				<div>
					<Heading size="7" className="text-gray-900 mb-2">
						Issues
					</Heading>
					<Text size="3" className="text-gray-600">
						Manage and track project issues
					</Text>
				</div>
				<NewIssueButton />
			</div>

			{/* Search and Filters */}
			<div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
				<div className="flex flex-col lg:flex-row gap-4">
					<div className="flex-1">
						<SearchInput placeholder="Search issues by title or description..." />
					</div>
					<ViewToggle />
				</div>
				<QuickFilters />
			</div>

			{/* Issues View */}
			{currentView === "kanban" ? (
				<KanbanBoard issues={issues} />
			) : (
				<IssuesTable issues={issues} searchParamsObj={{
					...searchParamsObj,
					orderDirection: orderDirection as "asc" | "desc"
				}} />
			)}

			{/* Pagination */}
			{currentView === "table" && issueCount > pageSize && (
				<div className="flex justify-center">
					<Pagination
						itemCount={issueCount}
						itemsPerPage={pageSize}
						currentPage={page}
					/>
				</div>
			)}
		</div>
	);
};

export default IssuesPage;

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Error Tracker - Issues List",
	description: "View all issues and their statuses",
};
