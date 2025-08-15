import { Status } from "@prisma/client";
import { Card, Flex, Text } from "@radix-ui/themes";
import Link from "next/link";
import type { FC } from "react";

interface IssueSummaryProps {
	open: number;
	inProgress: number;
	closed: number;
}

const IssueSummary: FC<IssueSummaryProps> = ({ open, inProgress, closed }) => {
	const statuses = [
		{ label: "Open", value: open, status: Status.OPEN },
		{ label: "In Progress", value: inProgress, status: Status.IN_PROGRESS },
		{ label: "Closed", value: closed, status: Status.CLOSED },
	];

	return (
		<Flex gap="3">
			{statuses.map((status) => (
				<Card key={status.label}>
					<Flex direction="column" gap="1">
						<Link
							href={`/issues/list?status=${status.status}`}
							className="text-sm font-medium"
						>
							{status.label} Issues
						</Link>
						<Text size="5" className="font-bold">
							{status.value}
						</Text>
					</Flex>
				</Card>
			))}
		</Flex>
	);
};

export default IssueSummary;
