"use client";

import { Issue } from "../generated/prisma";
import { Table } from "@radix-ui/themes";
import Link from "next/link";
import apiService from "@/services/apiService";
import { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge";
import { columns } from "@/constants/columns";

const IssuesTable = () => {
	const [issues, setIssues] = useState<Issue[]>([]);

	useEffect(() => {
		apiService.fetchIssues().then((issues) => {
			if (!issues) {
				return <div>Error loading issues</div>;
			}
			if (issues.length === 0) {
				return <div>No issues found</div>;
			}
			setIssues(issues);
		});
	}, []);

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
