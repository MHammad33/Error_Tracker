import type { FC } from "react";
import { prisma } from "@/lib/prisma";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import EditIssueButton from "./EditIssueButton";
import IssueDetails from "./IssueDetails";
import DeleteIssueButton from "./DeleteIssueButton";
import { getServerSession } from "next-auth";

interface IssueDetailsPageProps {
	params: Promise<{ id: string }>;
}

const IssueDetailsPage: FC<IssueDetailsPageProps> = async ({ params }) => {
	const session = await getServerSession();
	const { id } = await params;

	const issue = await prisma.issue.findUnique({
		where: { id },
	});

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
						<EditIssueButton issueId={issue.id} />
						<DeleteIssueButton issueId={issue.id} />
					</Flex>
				</Box>
			)}
		</Grid>
	);
};

export default IssueDetailsPage;
