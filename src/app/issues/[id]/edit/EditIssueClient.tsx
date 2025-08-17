"use client";

import { Issue } from "@prisma/client";
import dynamic from "next/dynamic";
import type { FC } from "react";
import IssueFormSkeleton from "../../_components/IssueFormSkeleton";
import { Heading, Text, Button } from "@radix-ui/themes";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const IssueForm = dynamic(() => import("@/app/issues/_components/IssueForm"), {
	ssr: false,
	loading: () => <IssueFormSkeleton />,
});

interface EditIssueClientProps {
	issue: Issue;
}

const EditIssueClient: FC<EditIssueClientProps> = ({ issue }) => {
	return (
		<div className="space-y-6">
			{/* Back Navigation */}
			<div className="flex items-center gap-4">
				<Link href={`/issues/${issue.id}`}>
					<Button variant="ghost" size="2">
						<ArrowLeftIcon className="w-4 h-4 mr-2" />
						Back to Issue
					</Button>
				</Link>
			</div>

			{/* Page Header */}
			<div className="border-b border-gray-200 pb-6">
				<Heading size="7" className="text-gray-900 mb-2">
					Edit Issue
				</Heading>
				<Text size="3" className="text-gray-600">
					Update the details for: {issue.title}
				</Text>
			</div>

			{/* Form */}
			<div className="max-w-4xl">
				<IssueForm issue={issue} />
			</div>
		</div>
	);
};

export default EditIssueClient;
