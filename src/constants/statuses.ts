import { Status } from "@prisma/client";

export const ISSUE_STATUSES: { label: string; value?: Status }[] = [
	{ label: "All" },
	{ label: "Open", value: Status.OPEN },
	{ label: "In Progress", value: Status.IN_PROGRESS },
	{ label: "Closed", value: Status.CLOSED },
];
