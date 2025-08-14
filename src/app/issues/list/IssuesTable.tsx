import { Table } from "@radix-ui/themes";
import { FC } from "react";
import { columns } from "@/constants/columns";
import { StatusBadge } from "@/components";
import { prisma } from "@/lib/prisma";
import { Issue, Status } from "@prisma/client";
import Link from "next/link";
import { ArrowUpIcon } from "@radix-ui/react-icons";

interface IssueTableProps {
	status: Status | undefined;
	searchParams: Promise<{ status?: Status | null; orderBy?: keyof Issue }>;
}

const IssuesTable: FC<IssueTableProps> = async ({ status, searchParams }) => {
	const searchParamsObj = await searchParams;
	const issues = await prisma.issue.findMany({
		where: { status },
	});

	return (
		<Table.Root variant="surface">
			<Table.Header>
				<Table.Row>
					{columns.map((column) => (
						<Table.ColumnHeaderCell
							key={column.value}
							className={column.className}
						>
							<Link
								href={{ query: { ...searchParamsObj, orderBy: column.value } }}
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
	);
};

export default IssuesTable;
