import { Status } from "@prisma/client";
import IssueSummary from "./IssueSummary";
import LatestIssues from "./LatestIssues";
import { prisma } from "@/lib/prisma";

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
			<IssueSummary open={open} inProgress={inProgress} closed={closed} />
			<LatestIssues />;
		</>
	);
}
