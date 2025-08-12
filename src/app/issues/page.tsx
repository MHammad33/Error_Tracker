"use client";

import IssuesTable from "@/components/IssuesTable";
import StatusFilter from "@/components/StatusFilter";
import { Button, Flex } from "@radix-ui/themes";
import Link from "next/link";

const IssuesPage = ({}) => {
	return (
		<>
			<Flex justify="between" align="center" className="mb-4">
				<StatusFilter />
				<Button>
					<Link href="/issues/new">New Issue</Link>
				</Button>
			</Flex>

			<IssuesTable />
		</>
	);
};

export default IssuesPage;
