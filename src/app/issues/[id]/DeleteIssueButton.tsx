"use client";

import { Spinner } from "@/components";
import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, type FC } from "react";
import { RiDeleteBin2Fill } from "react-icons/ri";

interface DeleteIssueButtonProps {
	issueId: string;
}

const DeleteIssueButton: FC<DeleteIssueButtonProps> = ({ issueId }) => {
	const [error, setError] = useState<boolean>(false);
	const [isDeleting, setIsDeleting] = useState<boolean>(false);
	const router = useRouter();

	const handleDelete = async () => {
		try {
			setIsDeleting(true);
			await axios.delete(`/api/issues/${issueId}`);
			router.push("/issues");
			router.refresh();
		} catch (error) {
			console.error("Failed to delete issue:", error);
			setError(true);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<>
			<AlertDialog.Root>
				<AlertDialog.Trigger>
					<Button color="red" disabled={isDeleting}>
						<RiDeleteBin2Fill /> Delete Issue {isDeleting && <Spinner />}
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
							<Button variant="solid" color="red" onClick={handleDelete}>
								Delete Issue
							</Button>
						</AlertDialog.Action>
					</Flex>
				</AlertDialog.Content>
			</AlertDialog.Root>
			<AlertDialog.Root open={error}>
				<AlertDialog.Content maxWidth="450px">
					<AlertDialog.Title>Error</AlertDialog.Title>
					<AlertDialog.Description size="2">
						An error occurred while trying to delete the issue. Please try again
						later.
					</AlertDialog.Description>
					<Button
						color="gray"
						variant="soft"
						mt="2"
						onClick={() => setError(false)}
					>
						OK
					</Button>
				</AlertDialog.Content>
			</AlertDialog.Root>
		</>
	);
};

export default DeleteIssueButton;
