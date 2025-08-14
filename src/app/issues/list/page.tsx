import { Flex } from "@radix-ui/themes";
import NewIssueButton from "./NewIssueButton";
import StatusFilter from "./StatusFilter";
import IssuesTable from "./IssuesTable";
import { Status } from "@prisma/client";
import { FC } from "react";

interface IssuesPageProps {
	searchParams: { status?: Status | null };
}

const IssuesPage: FC<IssuesPageProps> = ({ searchParams }) => {
	const statuses = Object.values(Status);
	const statusFilter = statuses.includes(searchParams.status as Status)
		? (searchParams.status as Status)
		: undefined;

	return (
		<>
			<Flex justify="between" align="center" className="mb-4">
				<StatusFilter />
				<NewIssueButton />
			</Flex>

			<IssuesTable status={statusFilter} />
		</>
	);
};

export const dynamic = "force-dynamic";

export default IssuesPage;
