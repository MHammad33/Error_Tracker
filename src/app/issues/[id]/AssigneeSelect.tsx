"use client";

import Skeleton from "@/components/Skeleton";
import { User } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FC } from "react";
import toast, { Toaster } from "react-hot-toast";

interface AssigneeSelectProps {
	issueId: string;
	assignedUserId: string | null;
}

const AssigneeSelect: FC<AssigneeSelectProps> = ({
	issueId,
	assignedUserId,
}) => {
	const { data: users, error, isLoading } = useUsers();
	if (error) return null;
	if (isLoading) return <Skeleton height="2rem" />;

	const assignIssue = async (userId: string) => {
		try {
			await axios.patch(`/api/issues/${issueId}`, {
				assignedUserId: userId !== "unassigned" ? userId : null,
			});
			toast.success("Assignee updated successfully");
		} catch (error) {
			toast.error("The assignee could not be updated");
			console.error("Error updating assignee:", error);
		}
	};

	return (
		<>
			<Select.Root
				defaultValue={assignedUserId || "unassigned"}
				onValueChange={assignIssue}
			>
				<Select.Trigger placeholder="Assign..." />
				<Select.Content>
					<Select.Group>
						<Select.Label>Suggestions</Select.Label>
						<Select.Item value="unassigned">Unassigned</Select.Item>
						{users?.map((user) => (
							<Select.Item key={user.id} value={user.id}>
								{user.name}
							</Select.Item>
						))}
					</Select.Group>
				</Select.Content>
			</Select.Root>
			<Toaster />
		</>
	);
};

const useUsers = () => {
	return useQuery<User[]>({
		queryKey: ["users"],
		queryFn: async () => axios.get("/api/users").then((res) => res.data),
		staleTime: 1000 * 60 * 10,
		retry: 3,
	});
};

export default AssigneeSelect;
