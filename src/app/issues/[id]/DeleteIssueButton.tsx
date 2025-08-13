import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import type { FC } from "react";
import { RiDeleteBin2Fill } from "react-icons/ri";

interface DeleteIssueButtonProps {
	issueId: string;
}

const DeleteIssueButton: FC<DeleteIssueButtonProps> = ({ issueId }) => {
	return (
		<AlertDialog.Root>
			<AlertDialog.Trigger>
				<Button color="red">
					<RiDeleteBin2Fill /> Delete Issue
				</Button>
			</AlertDialog.Trigger>
			<AlertDialog.Content maxWidth="450px">
				<AlertDialog.Title>Confirm Deletion</AlertDialog.Title>
				<AlertDialog.Description size="2">
					Are you sure you want to delete this issue? This action cannot be
					undone.
				</AlertDialog.Description>

				<Flex gap="3" mt="4" justify="end">
					<AlertDialog.Cancel>
						<Button variant="soft" color="gray">
							Cancel
						</Button>
					</AlertDialog.Cancel>
					<AlertDialog.Action>
						<Button variant="solid" color="red">
							Delete Issue
						</Button>
					</AlertDialog.Action>
				</Flex>
			</AlertDialog.Content>
		</AlertDialog.Root>
	);
};

export default DeleteIssueButton;
