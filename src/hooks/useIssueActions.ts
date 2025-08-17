"use client";

import { useIssueDrawer } from "@/contexts/IssueDrawerContext";
import { Issue, User } from "@prisma/client";
import { useRouter } from "next/navigation";

interface IssueWithUser extends Issue {
  assignedUser?: User | null;
}

export const useIssueActions = () => {
  const { openDrawer } = useIssueDrawer();
  const router = useRouter();

  const openIssueDrawer = async (issueId: string) => {
    try {
      const response = await fetch(`/api/issues/${issueId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch issue");
      }
      const issue: IssueWithUser = await response.json();
      openDrawer(issue);
    } catch (error) {
      console.error("Error fetching issue:", error);
      // Fallback to navigation if drawer fails
      navigateToIssue(issueId);
    }
  };

  const navigateToIssue = (issueId: string) => {
    router.push(`/issues/${issueId}`);
  };

  return {
    openIssueDrawer,
    navigateToIssue,
  };
};
