import { cache, type FC } from "react";
import { prisma } from "@/lib/prisma";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import EditIssueButton from "./EditIssueButton";
import IssueDetails from "./IssueDetails";
import DeleteIssueButton from "./DeleteIssueButton";
import { getServerSession } from "next-auth";
import AssigneeSelect from "./AssigneeSelect";

interface IssueDetailsPageProps {
	params: Promise<{ id: string }>;
}

const fetchIssue = cache((issueId: string) =>
	prisma.issue.findUnique({
		where: { id: issueId },
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
		<Grid columns={{ initial: "1", sm: "5" }} gap="4">
			<Box className="md:col-span-4">
				<IssueDetails issue={issue} />
			</Box>
			{session && (
				<Box>
					<Flex direction="column" gap="3">
						<AssigneeSelect
							issueId={issue.id}
							assignedUserId={issue.assignedUserId}
						/>
						<EditIssueButton issueId={issue.id} />
						<DeleteIssueButton issueId={issue.id} />
					</Flex>
				</Box>
			)}
		</Grid>
	);
};

export async function generateMetadata({ params }: IssueDetailsPageProps) {
	const { id } = await params;
	const issue = await fetchIssue(id);

	return {
		title: `Issue ${issue?.title || "Details"}`,
		description: `Details for issue ${
			issue?.title || "not found"
		} with ID ${id}`,
	};
}

export default IssueDetailsPage;
