import { StatusBadge } from "@/components";
import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import ReactMarkdown from "react-markdown";
import type { FC } from "react";
import { Issue } from "@prisma/client";

interface IssueDetailsProps {
	issue: Issue;
}

const IssueDetails: FC<IssueDetailsProps> = async ({ issue }) => {
	return (
		<>
			<Heading>{issue.title}</Heading>
			<Flex className="space-x-2" my="2" align="center">
				<StatusBadge status={issue.status} />
				<Text>{new Date(issue.createdAt).toDateString()}</Text>
			</Flex>
			<Card className="prose mt-5 max-w-full">
				<ReactMarkdown>{issue.description}</ReactMarkdown>
			</Card>
		</>
	);
};

export default IssueDetails;
