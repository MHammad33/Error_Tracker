"use client";

import { Issue } from "@prisma/client";
import dynamic from "next/dynamic";
import type { FC } from "react";
import IssueFormSkeleton from "../../_components/IssueFormSkeleton";

const IssueForm = dynamic(() => import("@/app/issues/_components/IssueForm"), {
	ssr: false,
	loading: () => <IssueFormSkeleton />,
});

interface EditIssueClientProps {
	issue: Issue;
}

const EditIssueClient: FC<EditIssueClientProps> = ({ issue }) => {
	return <IssueForm issue={issue} />;
};

export default EditIssueClient;
