import { StatusBadge } from "@/components";
import { columns } from "@/constants/columns";
import { Issue, Status } from "@prisma/client";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Table } from "@radix-ui/themes";
import Link from "next/link";
import { FC } from "react";

export interface IssueSearchParams {
	status: Status | null;
	orderBy: keyof Issue;
	page: string;
}

interface IssueTableProps {
	issues: Issue[];
	searchParamsObj: IssueSearchParams;
}

const IssuesTable: FC<IssueTableProps> = ({ searchParamsObj, issues }) => {
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
	);
};

export default IssuesTable;
