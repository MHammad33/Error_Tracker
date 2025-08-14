import { Select } from "@radix-ui/themes";
import type { FC } from "react";

interface AssigneeSelectProps {}

const AssigneeSelect: FC<AssigneeSelectProps> = ({}) => {
	return (
		<Select.Root>
			<Select.Trigger placeholder="Assign..." />
			<Select.Content>
				<Select.Group>
					<Select.Label>Suggestions</Select.Label>
					<Select.Item value="user1">User 1</Select.Item>
					<Select.Item value="user2">User 2</Select.Item>
				</Select.Group>
			</Select.Content>
		</Select.Root>
	);
};

export default AssigneeSelect;
