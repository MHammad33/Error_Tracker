import { Table } from "@radix-ui/themes";
import { FC } from "react";
import { columns } from "@/constants/columns";
import { StatusBadge } from "@/components";
import { prisma } from "@/lib/prisma";
import { Issue, Status } from "@prisma/client";
import Link from "next/link";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import Pagination from "@/components/Pagination";

interface IssueTableProps {
	status: Status | undefined;
	searchParams: Promise<{
		status?: Status | null;
		orderBy?: keyof Issue;
		page?: string;
	}>;
}

const IssuesTable: FC<IssueTableProps> = async ({ status, searchParams }) => {
	const searchParamsObj = await searchParams;
	const validOrderFields = columns.map((col) => col.value);
	const orderByField = searchParamsObj.orderBy;

	const isValidOrderBy =
		orderByField !== undefined &&
		(validOrderFields as string[]).includes(orderByField as string);

	const orderBy = isValidOrderBy
		? ({ [orderByField as string]: "asc" } as Record<
				keyof Issue,
				"asc" | "desc"
		  >)
		: undefined;

	const page = Number(searchParamsObj.page) || 1;
	const pageSize = 10;

	const where = { status };
	const issues = await prisma.issue.findMany({
		where,
		orderBy,
		skip: (page - 1) * pageSize,
		take: pageSize,
	});

	const issueCount = await prisma.issue.count({ where });

	return (
		<>
			<Table.Root variant="surface">
				<Table.Header>
					<Table.Row>
						{columns.map((column) => (
							<Table.ColumnHeaderCell
								key={column.value}
								className={column.className}
							>
								<Link
									href={{
										query: { ...searchParamsObj, orderBy: column.value },
									}}
								>
									{column.label}
								</Link>
								{column.value === searchParamsObj.orderBy && (
									<ArrowUpIcon className="inline" />
								)}
							</Table.ColumnHeaderCell>
						))}
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{issues &&
						issues.map((issue) => (
							<Table.Row key={issue.id}>
								<Table.Cell>
									<Link href={`/issues/${issue.id}`}>{issue.title}</Link>
									<div className="block md:hidden">
										<StatusBadge status={issue.status} />
									</div>
								</Table.Cell>
								<Table.Cell className="hidden md:table-cell">
									<StatusBadge status={issue.status} />
								</Table.Cell>
								<Table.Cell className="hidden md:table-cell">
									{new Date(issue.createdAt).toDateString()}
								</Table.Cell>
							</Table.Row>
						))}
				</Table.Body>
			</Table.Root>
			<Pagination
				itemCount={issueCount}
				itemsPerPage={pageSize}
				currentPage={page}
			/>
		</>
	);
};

export default IssuesTable;
