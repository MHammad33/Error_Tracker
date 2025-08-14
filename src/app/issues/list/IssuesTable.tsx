import { Table } from "@radix-ui/themes";
import { FC } from "react";
import { columns } from "@/constants/columns";
import { Link, StatusBadge } from "@/components";
import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";

interface IssueTableProps {
	status: Status | undefined;
}

const IssuesTable: FC<IssueTableProps> = async ({ status }) => {
	const issues = await prisma.issue.findMany({
		where: {
			status: status,
		},
	});

	console.log("Issues fetched:", issues);

	return (
		<Table.Root variant="surface">
			<Table.Header>
				<Table.Row>
					{columns.map((column) => (
						<Table.ColumnHeaderCell
							key={column.value}
							className={column.className}
						>
							{column.label}
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
