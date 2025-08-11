import { Button } from "@radix-ui/themes";
import Link from "next/link";
import type { FC } from "react";

interface IssuesPageProps {}

const IssuesPage: FC<IssuesPageProps> = ({}) => {
	return (
		<div>
			<Button>
				<Link href="/issues/new">New Issue</Link>
			</Button>
		</div>
	);
};

export default IssuesPage;
