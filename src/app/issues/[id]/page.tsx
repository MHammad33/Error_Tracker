import StatusBadge from "@/components/StatusBadge";
import { prisma } from "@/lib/prisma";
import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import type { FC } from "react";

interface IssueDetailsPageProps {
	params: { id: string };
}

const IssueDetailsPage: FC<IssueDetailsPageProps> = async ({ params }) => {
	const { id } = params;

	const issue = await prisma.issue.findUnique({
		where: { id },
	});

	if (!issue) {
		notFound();
	}

	return (
		<div>
			<Heading>{issue.title}</Heading>
			<Flex className="space-x-2" my="2" align="center">
				<StatusBadge status={issue.status} />
				<Text>{new Date(issue.createdAt).toDateString()}</Text>
			</Flex>
			<Card className="prose mt-5">
				<ReactMarkdown>{issue.description}</ReactMarkdown>
			</Card>
		</div>
	);
};

export default IssueDetailsPage;
