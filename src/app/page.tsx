import { Status } from "@prisma/client";
import IssueSummary from "./IssueSummary";
import LatestIssues from "./LatestIssues";
import { prisma } from "@/lib/prisma";
import IssueChart from "./IssueChart";
import { Flex, Grid } from "@radix-ui/themes";

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
		<Grid columns={{ initial: "1", md: "2" }} gap="6">
			<Flex direction="column" gap="6">
				<IssueSummary open={open} inProgress={inProgress} closed={closed} />
				<IssueChart open={open} inProgress={inProgress} closed={closed} />
			</Flex>
			<LatestIssues />;
		</Grid>
	);
}
