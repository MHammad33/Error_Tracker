import { Status } from "@prisma/client";
import { Card, Flex, Text } from "@radix-ui/themes";
import Link from "next/link";
import type { FC } from "react";
import {
	ExclamationTriangleIcon,
	ClockIcon,
	CheckCircledIcon
} from "@radix-ui/react-icons";

interface IssueSummaryProps {
	open: number;
	inProgress: number;
	closed: number;
}

const IssueSummary: FC<IssueSummaryProps> = ({ open, inProgress, closed }) => {
	const statuses = [
		{
			label: "Open Issues",
			value: open,
			status: Status.OPEN,
			icon: ExclamationTriangleIcon,
			color: "text-red-600",
			bgColor: "bg-red-50",
			borderColor: "border-red-200"
		},
		{
			label: "In Progress",
			value: inProgress,
			status: Status.IN_PROGRESS,
			icon: ClockIcon,
			color: "text-orange-600",
			bgColor: "bg-orange-50",
			borderColor: "border-orange-200"
		},
		{
			label: "Closed Issues",
			value: closed,
			status: Status.CLOSED,
			icon: CheckCircledIcon,
			color: "text-green-600",
			bgColor: "bg-green-50",
			borderColor: "border-green-200"
		},
	];

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			{statuses.map((status) => {
				const Icon = status.icon;
				return (
					<Link
						key={status.label}
						href={`/issues/list?status=${status.status}`}
						className="group"
					>
						<Card className={`p-6 hover:shadow-lg transition-all duration-200 border ${status.borderColor} ${status.bgColor}`}>
							<Flex direction="column" gap="4">
								<Flex justify="between" align="center">
									<div className={`p-3 rounded-xl ${status.bgColor}`}>
										<Icon className={`w-6 h-6 ${status.color}`} />
									</div>
									<Text size="2" className="text-gray-500 group-hover:text-gray-700 transition-colors">
										View all →
									</Text>
								</Flex>
								<div>
									<Text size="8" weight="bold" className={`${status.color} block`}>
										{status.value}
									</Text>
									<Text size="3" className="text-gray-600 mt-1">
										{status.label}
									</Text>
								</div>
							</Flex>
						</Card>
					</Link>
				);
			})}
		</div>
	);
};

export default IssueSummary;
