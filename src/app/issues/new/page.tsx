"use client";

import dynamic from "next/dynamic";
import IssueFormSkeleton from "../_components/IssueFormSkeleton";
import { Heading, Text, Button } from "@radix-ui/themes";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const IssueForm = dynamic(() => import("@/app/issues/_components/IssueForm"), {
	ssr: false,
	loading: () => <IssueFormSkeleton />,
});

const NewIssuePage = () => {
	return (
		<div className="space-y-6">
			{/* Back Navigation */}
			<div className="flex items-center gap-4">
				<Link href="/issues/list">
					<Button variant="ghost" size="2">
						<ArrowLeftIcon className="w-4 h-4 mr-2" />
						Back to Issues
					</Button>
				</Link>
			</div>

			{/* Page Header */}
			<div className="border-b border-gray-200 pb-6">
				<Heading size="7" className="text-gray-900 mb-2">
					Create New Issue
				</Heading>
				<Text size="3" className="text-gray-600">
					Report a bug, request a feature, or track any project issue.
				</Text>
			</div>

			{/* Form */}
			<div className="max-w-4xl">
				<IssueForm />
			</div>
		</div>
	);
};

export default NewIssuePage;
