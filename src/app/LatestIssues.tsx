"use client";

import { StatusBadge } from "@/components";
import { Avatar, Card, Flex, Heading, Text } from "@radix-ui/themes";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useIssueActions } from "@/hooks/useIssueActions";
import { Issue, User } from "@prisma/client";

interface IssueWithUser extends Issue {
	assignedUser?: User | null;
}

interface LatestIssuesProps {
	issues: IssueWithUser[];
}

const LatestIssues = ({ issues }: LatestIssuesProps) => {
	const { openIssueDrawer } = useIssueActions();

	return (
		<Card className="p-6 shadow-sm border border-gray-200">
			<Flex justify="between" align="center" mb="6">
				<Heading size="5" className="text-gray-900">
					Recent Activity
				</Heading>
				<Link
					href="/issues/list"
					className="text-sm text-violet-600 hover:text-violet-700 font-medium"
				>
					View all →
				</Link>
			</Flex>

			<div className="space-y-4">
				{issues.length === 0 ? (
					<div className="text-center py-8">
						<Text size="3" className="text-gray-500">
							No issues yet. Create your first issue to get started.
						</Text>
					</div>
				) : (
					issues.map((issue) => (
						<button
							key={issue.id}
							onClick={() => openIssueDrawer(issue.id)}
							className="w-full flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left"
						>
							<div className="flex-1 min-w-0">
								<h4 className="font-medium text-gray-900 hover:text-violet-600 transition-colors line-clamp-2">
									{issue.title}
								</h4>
								<div className="mt-2 flex items-center gap-3">
									<StatusBadge status={issue.status} />
									<Text size="2" className="text-gray-500">
										{formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
									</Text>
								</div>
							</div>
							{issue.assignedUserId && (
								<div className="flex-shrink-0">
									<Avatar
										src={issue.assignedUser?.image || ""}
										fallback={issue.assignedUser?.name?.[0] || "?"}
										size="2"
										radius="full"
										className="ring-2 ring-white"
									/>
								</div>
							)}
						</button>
					))
				)}
			</div>
		</Card>
	);
};

export default LatestIssues;
