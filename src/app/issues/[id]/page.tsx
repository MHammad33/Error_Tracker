import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
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
			<p>{issue.title}</p>
			<p>{issue.description}</p>
			<p>{issue.status}</p>
			<p>{new Date(issue.createdAt).toDateString()}</p>
		</div>
	);
};

export default IssueDetailsPage;
