import { Button } from "@radix-ui/themes";
import Link from "next/link";

const NewIssueButton = ({}) => {
	return (
		<div className="mb-4">
			<Button asChild>
				<Link href="/issues/new">New Issue</Link>
			</Button>
		</div>
	);
};

export default NewIssueButton;
