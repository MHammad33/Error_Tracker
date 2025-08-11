import { Button } from "@radix-ui/themes";
import type { FC } from "react";

interface IssuesPageProps {}

const IssuesPage: FC<IssuesPageProps> = ({}) => {
	return (
		<div>
			<Button>New Issue</Button>
		</div>
	);
};

export default IssuesPage;
