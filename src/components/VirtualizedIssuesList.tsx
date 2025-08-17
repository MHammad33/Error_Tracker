"use client";

import { Issue, Status, User } from "@prisma/client";
import { Avatar, Text } from "@radix-ui/themes";
import { StatusBadge } from "@/components";
import { formatDistanceToNow } from "date-fns";
import { useIssueActions } from "@/hooks/useIssueActions";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import { memo } from "react";

interface IssueWithUser extends Issue {
  assignedUser?: User | null;
}

interface VirtualizedIssuesListProps {
  issues: IssueWithUser[];
  height?: number;
}

const VirtualizedIssuesList = ({ issues, height = 600 }: VirtualizedIssuesListProps) => {
  const { openIssueDrawer } = useIssueActions();

  const IssueRow = memo(({ index, style }: ListChildComponentProps) => {
    const issue = issues[index];

    if (!issue) return null;

    return (
      <div style={style}>
        <div className="px-6 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
          <button
            onClick={() => openIssueDrawer(issue.id)}
            className="w-full text-left"
          >
            {/* Desktop Layout */}
            <div className="hidden md:grid md:grid-cols-4 md:gap-4 md:items-center">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 hover:text-violet-600 transition-colors">
                  {issue.title}
                </h3>
              </div>
              <div>
                <StatusBadge status={issue.status} />
              </div>
              <div className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
              </div>
              <div>
                {issue.assignedUser ? (
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={issue.assignedUser.image || ""}
                      fallback={issue.assignedUser.name?.[0] || "?"}
                      size="1"
                      radius="full"
                    />
                    <Text size="2" className="text-gray-600 truncate">
                      {issue.assignedUser.name || issue.assignedUser.email}
                    </Text>
                  </div>
                ) : (
                  <Text size="2" className="text-gray-400">
                    Unassigned
                  </Text>
                )}
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900 pr-2 flex-1">
                  {issue.title}
                </h3>
                <StatusBadge status={issue.status} />
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                </span>
                {issue.assignedUser && (
                  <div className="flex items-center gap-1">
                    <Avatar
                      src={issue.assignedUser.image || ""}
                      fallback={issue.assignedUser.name?.[0] || "?"}
                      size="1"
                      radius="full"
                    />
                    <span className="text-xs truncate max-w-20">
                      {issue.assignedUser.name || issue.assignedUser.email}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  });

  IssueRow.displayName = "IssueRow";

  if (issues.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <Text size="3" className="text-gray-500">
          No issues found. Try adjusting your search or filters.
        </Text>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Table Header - Desktop */}
      <div className="hidden md:block bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-4 gap-4 px-6 py-4">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Title
          </div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Created
          </div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Assignee
          </div>
        </div>
      </div>

      {/* Virtualized List */}
      <List
        height={height}
        itemCount={issues.length}
        itemSize={80} // Height per row in pixels
        className="custom-scrollbar"
      >
        {IssueRow}
      </List>
    </div>
  );
};

export default VirtualizedIssuesList;
