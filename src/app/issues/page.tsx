"use client";

import { Status } from "../../generated/prisma";
import { Button, Select } from "@radix-ui/themes";
import Link from "next/link";
import type { FC } from "react";

interface IssuesPageProps {}

const IssuesPage: FC<IssuesPageProps> = ({}) => {
	const statuses: { label: string; value?: Status }[] = [
		{ label: "All", value: undefined },
		{ label: "Open", value: "OPEN" },
		{ label: "In Progress", value: "IN_PROGRESS" },
		{ label: "Closed", value: "CLOSED" },
	];

	return (
		<div className="flex gap-4 items-center space-between">
			<Select.Root defaultValue={statuses[0].value ?? statuses[0].label}>
				<Select.Trigger placeholder="Filter by status..." />
				<Select.Content>
					{statuses.map((status) => (
						<Select.Item
							key={status.value ?? status.label}
							value={status.value || status.label}
						>
							{status.label}
						</Select.Item>
					))}
				</Select.Content>
			</Select.Root>

			<Button>
				<Link href="/issues/new">New Issue</Link>
			</Button>
		</div>
	);
};

export default IssuesPage;
