import { Issue } from "../generated/prisma";

export const columns: {
	label: string;
	value: keyof Issue;
	className?: string;
}[] = [
	{ label: "Issue", value: "title" },
	{
		label: "Status",
		value: "status",
		className: "hidden md:table-cell",
	},
	{
		label: "Created",
		value: "createdAt",
		className: "hidden md:table-cell",
	},
];
