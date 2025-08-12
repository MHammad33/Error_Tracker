"use client";

import StatusFilter from "@/components/StatusFilter";
import { Button, Flex } from "@radix-ui/themes";
import Link from "next/link";
import type { FC } from "react";

interface IssuesPageProps {}

const IssuesPage: FC<IssuesPageProps> = ({}) => {
	return (
		<Flex justify="between">
			<StatusFilter />
			<Button>
				<Link href="/issues/new">New Issue</Link>
			</Button>
		</Flex>
	);
};

export default IssuesPage;
