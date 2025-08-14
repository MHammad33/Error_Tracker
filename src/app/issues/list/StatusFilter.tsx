import { Status } from "@prisma/client";
import { Select } from "@radix-ui/themes";

const statuses: { label: string; value?: Status }[] = [
	{ label: "All" },
	{ label: "Open", value: Status.OPEN },
	{ label: "In Progress", value: Status.IN_PROGRESS },
	{ label: "Closed", value: Status.CLOSED },
];

const StatusFilter = ({}) => {
	return (
		<Select.Root>
			<Select.Trigger placeholder="Filter by status..." />
			<Select.Content>
				{statuses.map((status) => (
					<Select.Item
						key={status.value || status.label}
						value={status.value || status.label}
					>
						{status.label}
					</Select.Item>
				))}
			</Select.Content>
		</Select.Root>
	);
};

export default StatusFilter;
