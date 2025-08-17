import { Status } from "@prisma/client";
import IssueSummary from "./IssueSummary";
import LatestIssues from "./LatestIssues";
import { prisma } from "@/lib/prisma";
import IssueChart from "./IssueChart";
import { Heading, Text } from "@radix-ui/themes";
import { Metadata } from "next";

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

	const latestIssues = await prisma.issue.findMany({
		orderBy: { createdAt: "desc" },
		take: 5,
		include: {
			assignedUser: true,
		},
	});

	return (
		<div className="space-y-8">
			{/* Dashboard Header */}
			<div>
				<Heading size="7" className="text-gray-900 mb-2">
					Dashboard
				</Heading>
				<Text size="3" className="text-gray-600">
					Overview of your project's issue tracking and progress.
				</Text>
			</div>

			{/* Issue Summary Cards */}
			<IssueSummary open={open} inProgress={inProgress} closed={closed} />

			{/* Chart and Recent Activity */}
			<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
				<div className="xl:col-span-2">
					<IssueChart open={open} inProgress={inProgress} closed={closed} />
				</div>
				<div className="xl:col-span-1">
					<LatestIssues issues={latestIssues} />
				</div>
			</div>
		</div>
	);
}

export const metadata: Metadata = {
	title: "Error Tracker - Dashboard",
	description: "View a summary of issues and their statuses",
};
