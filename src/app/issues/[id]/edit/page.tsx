import type { FC } from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditIssueClient from "./EditIssueClient";

interface EditPageProps {
	params: Promise<{ id: string }>;
}

const EditPage: FC<EditPageProps> = async ({ params }) => {
	const { id } = await params;

	const issue = await prisma.issue.findUnique({
		where: { id },
	});
	if (!issue) notFound();

	return <EditIssueClient issue={issue} />;
};

export default EditPage;
