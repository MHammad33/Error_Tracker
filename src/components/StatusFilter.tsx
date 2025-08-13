import { ISSUE_STATUSES } from "@/constants/statuses";
import { Select } from "@radix-ui/themes";
import type { FC } from "react";

interface StatusFilterProps {}

const StatusFilter: FC<StatusFilterProps> = ({}) => {
	return (
		<Select.Root defaultValue={"all"}>
			<Select.Trigger placeholder="Filter by status..." />
			<Select.Content>
				{ISSUE_STATUSES.map((status) => (
					<Select.Item
						key={status.value ?? status.label}
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
