import { Flex } from "@radix-ui/themes";
import NewIssueButton from "./NewIssueButton";
import StatusFilter from "./StatusFilter";
import IssuesTable from "./IssuesTable";
import { Status } from "@prisma/client";
import { FC } from "react";

interface IssuesPageProps {
	searchParams: Promise<{ status?: Status | null }>;
}

const IssuesPage: FC<IssuesPageProps> = async ({ searchParams }) => {
	const status = (await searchParams).status as Status;
	const statuses = Object.values(Status);
	const statusFilter = statuses.includes(status) ? status : undefined;
	console.log("Current status filter:", statusFilter);

	return (
		<>
			<Flex justify="between" align="center" className="mb-4">
				<StatusFilter />
				<NewIssueButton />
			</Flex>

			<IssuesTable status={statusFilter} searchParams={searchParams} />
		</>
	);
};

export const dynamic = "force-dynamic";

export default IssuesPage;
