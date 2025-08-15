// When Next.js renders a page, it can show a loading state while the page is being prepared.
// This file is used to display a loading message or spinner while the page is being loaded.

import { Table } from "@radix-ui/themes";
import NewIssueButton from "./NewIssueButton";
import { columns } from "@/constants/columns";
import Skeleton from "@/components/Skeleton";

const LoadingIssues = ({}) => {
	const issues = [1, 2, 3, 4, 5];

	return (
		<div>
			<NewIssueButton />

			<Table.Root variant="surface">
				<Table.Header>
					<Table.Row>
						{columns.map((column) => (
							<Table.ColumnHeaderCell
								key={String(column.value ?? column.label)}
								className={column.className}
							>
								{column.label}
							</Table.ColumnHeaderCell>
						))}
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{issues.map((issue) => (
						<Table.Row key={issue}>
							<Table.Cell>
								<Skeleton />
								<div className="block md:hidden">
									<Skeleton />
								</div>
							</Table.Cell>
							<Table.Cell className="hidden md:table-cell">
								<Skeleton />
							</Table.Cell>
							<Table.Cell className="hidden md:table-cell">
								<Skeleton />
							</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table.Root>
		</div>
	);
};

export default LoadingIssues;
