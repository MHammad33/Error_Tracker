import type { FC } from "react";
import { prisma } from "@/lib/prisma";
import { Box, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import EditIssueButton from "./EditIssueButton";
import IssueDetails from "./IssueDetails";

interface IssueDetailsPageProps {
	params: Promise<{ id: string }>;
}

const IssueDetailsPage: FC<IssueDetailsPageProps> = async ({ params }) => {
	const { id } = await params;

	const issue = await prisma.issue.findUnique({
		where: { id },
	});

	if (!issue) {
		notFound();
	}

	return (
		<Grid columns={{ initial: "1", md: "2" }} gap="4">
			<Box>
				<IssueDetails issue={issue} />
			</Box>
			<Box>
				<EditIssueButton issueId={issue.id} />
			</Box>
		</Grid>
	);
};

export default IssueDetailsPage;
