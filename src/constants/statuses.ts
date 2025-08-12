import { Status } from "../generated/prisma";

export const ISSUE_STATUSES: { label: string; value: string }[] = [
	{ label: "All", value: "all" },
	{ label: "Open", value: Status.OPEN },
	{ label: "In Progress", value: Status.IN_PROGRESS },
	{ label: "Closed", value: Status.CLOSED },
];
