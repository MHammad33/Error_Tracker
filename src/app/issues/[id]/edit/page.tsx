import type { FC } from "react";
import IssueForm from "../../_components/IssueForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface EditPageProps {
	params: Promise<{ id: string }>;
}

const EditPage: FC<EditPageProps> = async ({ params }) => {
	const { id } = await params;

	const issue = await prisma.issue.findUnique({
		where: { id },
	});

	if (!issue) {
		notFound();
	}

	return <IssueForm issue={issue} />;
};

export default EditPage;
