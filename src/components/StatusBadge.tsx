import { Badge } from "@radix-ui/themes";
import type { Status } from "@prisma/client";
import type { FC } from "react";

interface StatusBadgeProps {
	status: Status;
}

const StatusBadge: FC<StatusBadgeProps> = ({ status }) => {
	const statusMap: Record<
		Status,
		{ label: string; color: "red" | "orange" | "green" }
	> = {
		OPEN: { label: "Open", color: "red" },
		IN_PROGRESS: { label: "In Progress", color: "orange" },
		CLOSED: { label: "Closed", color: "green" },
	};

	return (
		<Badge color={statusMap[status].color}>{statusMap[status].label}</Badge>
	);
};

export default StatusBadge;
