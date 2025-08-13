import { prisma } from "@/lib/prisma";
import { Box, Button, Card, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { StatusBadge } from "@/components";
import type { FC } from "react";
import Link from "next/link";

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
		<Grid columns={{ initial: "1", md: "2" }} gap="4">
			<Box>
				<Heading>{issue.title}</Heading>
				<Flex className="space-x-2" my="2" align="center">
					<StatusBadge status={issue.status} />
					<Text>{new Date(issue.createdAt).toDateString()}</Text>
				</Flex>
				<Card className="prose mt-5">
					<ReactMarkdown>{issue.description}</ReactMarkdown>
				</Card>
			</Box>
			<Box>
				<Button>
					<Pencil2Icon />
					<Link href={`/issues/${issue.id}/edit`}>Edit Issue</Link>
				</Button>
			</Box>
		</Grid>
	);
};

export default IssueDetailsPage;
