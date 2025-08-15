import { Status } from "@prisma/client";
import IssueSummary from "./IssueSummary";
import LatestIssues from "./LatestIssues";
import { prisma } from "@/lib/prisma";
import IssueChart from "./IssueChart";

export default async function Home() {
	const open = await prisma.issue.count({
		where: { status: Status.OPEN },
	});
	const inProgress = await prisma.issue.count({
		where: { status: Status.IN_PROGRESS },
	});
	const closed = await prisma.issue.count({
		where: { status: Status.CLOSED },
	});

	return (
		<>
			<IssueChart open={open} inProgress={inProgress} closed={closed} />
			<IssueSummary open={open} inProgress={inProgress} closed={closed} />
			<LatestIssues />;
		</>
	);
}
