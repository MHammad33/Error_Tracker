import Pagination from "@/components/Pagination";
import { columns } from "@/constants/columns";
import { prisma } from "@/lib/prisma";
import { Issue, Status } from "@prisma/client";
import { Flex } from "@radix-ui/themes";
import { FC } from "react";
import IssuesTable, { IssueSearchParams } from "./IssuesTable";
import NewIssueButton from "./NewIssueButton";
import StatusFilter from "./StatusFilter";

interface IssuesPageProps {
	searchParams: Promise<IssueSearchParams>;
}

const IssuesPage: FC<IssuesPageProps> = async ({ searchParams }) => {
	const searchParamsObj = await searchParams;
	const searchStatus = searchParamsObj.status as Status;
	const statuses = Object.values(Status);
	const status = statuses.includes(searchStatus) ? searchStatus : undefined;

	const validOrderFields = columns.map((col) => col.value);
	const orderByField = searchParamsObj.orderBy;

	const isValidOrderBy =
		orderByField !== undefined &&
		(validOrderFields as string[]).includes(orderByField as string);

	const orderBy = isValidOrderBy
		? ({ [orderByField as string]: "asc" } as Record<
				keyof Issue,
				"asc" | "desc"
		  >)
		: undefined;

	const page = Number(searchParamsObj.page) || 1;
	const pageSize = 10;

	const where = { status };
	const issues = await prisma.issue.findMany({
		where,
		orderBy,
		skip: (page - 1) * pageSize,
		take: pageSize,
	});

	const issueCount = await prisma.issue.count({ where });

	return (
		<Flex direction="column" gap="4">
			<Flex justify="between" align="center">
				<StatusFilter />
				<NewIssueButton />
			</Flex>

			<IssuesTable issues={issues} searchParamsObj={searchParamsObj} />

			<Flex justify="end">
				<Pagination
					itemCount={issueCount}
					itemsPerPage={pageSize}
					currentPage={page}
				/>
			</Flex>
		</Flex>
	);
};

export const dynamic = "force-dynamic";

export default IssuesPage;
