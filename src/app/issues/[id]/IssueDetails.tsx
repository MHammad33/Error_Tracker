import { StatusBadge } from "@/components";
import { Card, Heading, Text } from "@radix-ui/themes";
import ReactMarkdown from "react-markdown";
import type { FC } from "react";
import { Issue, User } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";

interface IssueWithUser extends Issue {
	assignedUser?: User | null;
}

interface IssueDetailsProps {
	issue: IssueWithUser;
}

const IssueDetails: FC<IssueDetailsProps> = ({ issue }) => {
	return (
		<div className="space-y-6">
			{/* Issue Metadata */}
			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<div className="flex items-start justify-between mb-4">
					<div className="flex-1">
						<Heading size="6" className="text-gray-900 mb-3">
							{issue.title}
						</Heading>
						<div className="flex items-center gap-4 text-sm text-gray-600">
							<StatusBadge status={issue.status} />
							<span>
								Created {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
							</span>
							{issue.updatedAt !== issue.createdAt && (
								<span>
									Updated {formatDistanceToNow(new Date(issue.updatedAt), { addSuffix: true })}
								</span>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Issue Description */}
			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<Heading size="4" className="text-gray-900 mb-4">
					Description
				</Heading>
				{issue.description ? (
					<Card className="prose prose-sm max-w-none">
						<ReactMarkdown>{issue.description}</ReactMarkdown>
					</Card>
				) : (
					<Text size="3" className="text-gray-500 italic">
						No description provided for this issue.
					</Text>
				)}
			</div>
		</div>
	);
};

export default IssueDetails;
