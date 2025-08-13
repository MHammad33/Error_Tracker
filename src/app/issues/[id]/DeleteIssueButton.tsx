import { Button } from "@radix-ui/themes";
import Link from "next/link";
import type { FC } from "react";
import { RiDeleteBin2Fill } from "react-icons/ri";

interface DeleteIssueButtonProps {
	issueId: string;
}

const DeleteIssueButton: FC<DeleteIssueButtonProps> = ({ issueId }) => {
	return (
		<Button color="red">
			<RiDeleteBin2Fill />
			<Link href={`/issues/${issueId}`}>Delete Issue</Link>
		</Button>
	);
};

export default DeleteIssueButton;
