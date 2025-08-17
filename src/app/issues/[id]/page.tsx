import { cache, type FC } from "react";
import { prisma } from "@/lib/prisma";
import { Box, Flex, Grid, Button, Heading, Text } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import EditIssueButton from "./EditIssueButton";
import IssueDetails from "./IssueDetails";
import DeleteIssueButton from "./DeleteIssueButton";
import { getServerSession } from "next-auth";
import AssigneeSelect from "./AssigneeSelect";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";

interface IssueDetailsPageProps {
	params: Promise<{ id: string }>;
}

const fetchIssue = cache((issueId: string) =>
	prisma.issue.findUnique({
		where: { id: issueId },
		include: {
			assignedUser: true,
		},
	})
);

const IssueDetailsPage: FC<IssueDetailsPageProps> = async ({ params }) => {
	const session = await getServerSession();
	const { id } = await params;
	const issue = await fetchIssue(id);

	if (!issue) {
		notFound();
	}

	return (
		<div className="space-y-6">
			{/* Back Navigation */}
			<div className="flex items-center gap-4">
				<Link href="/issues/list">
					<Button variant="ghost" size="2">
						<ArrowLeftIcon className="w-4 h-4 mr-2" />
						Back to Issues
					</Button>
				</Link>
			</div>

			{/* Page Header */}
			<div className="border-b border-gray-200 pb-6">
				<Heading size="7" className="text-gray-900 mb-2">
					{issue.title}
				</Heading>
				<Text size="3" className="text-gray-600">
					Issue #{issue.id.slice(-8)}
				</Text>
			</div>

			{/* Issue Content */}
			<Grid columns={{ initial: "1", lg: "3" }} gap="8">
				<Box className="lg:col-span-2">
					<IssueDetails issue={issue} />
				</Box>
				{session && (
					<Box>
						<div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
							<Heading size="4" className="text-gray-900 mb-4">
								Actions
							</Heading>
							<Flex direction="column" gap="3">
								<AssigneeSelect
									issueId={issue.id}
									assignedUserId={issue.assignedUserId}
								/>
								<EditIssueButton issueId={issue.id} />
								<DeleteIssueButton issueId={issue.id} />
							</Flex>
						</div>
					</Box>
				)}
			</Grid>
		</div>
	);
};

export async function generateMetadata({ params }: IssueDetailsPageProps) {
	const { id } = await params;
	const issue = await fetchIssue(id);

	return {
		title: `Issue ${issue?.title || "Details"}`,
		description: `Details for issue ${issue?.title || "not found"
			} with ID ${id}`,
	};
}

export default IssueDetailsPage;
