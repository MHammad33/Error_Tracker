import { Button } from "@radix-ui/themes";
import Link from "next/link";
import type { FC } from "react";

const NewIssueButton = ({}) => {
	return (
		<div className="mb-4">
			<Button>
				<Link href="/issues/new">New Issue</Link>
			</Button>
		</div>
	);
};

export default NewIssueButton;
