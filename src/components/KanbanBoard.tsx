"use client";

import { Issue, Status, User } from "@prisma/client";
import { Card, Avatar, Text } from "@radix-ui/themes";
import { StatusBadge } from "@/components";
import { formatDistanceToNow } from "date-fns";
import { useIssueActions } from "@/hooks/useIssueActions";
import { useState } from "react";

interface IssueWithUser extends Issue {
  assignedUser?: User | null;
}

interface KanbanBoardProps {
  issues: IssueWithUser[];
}

const KanbanBoard = ({ issues }: KanbanBoardProps) => {
  const columns = [
    {
      status: Status.OPEN,
      title: "To Do",
      color: "bg-red-50 border-red-200",
      headerColor: "text-red-700 bg-red-100",
    },
    {
      status: Status.IN_PROGRESS,
      title: "In Progress",
      color: "bg-orange-50 border-orange-200",
      headerColor: "text-orange-700 bg-orange-100",
    },
    {
      status: Status.CLOSED,
      title: "Done",
      color: "bg-green-50 border-green-200",
      headerColor: "text-green-700 bg-green-100",
    },
  ];

  const getIssuesForStatus = (status: Status) => {
    return issues.filter((issue) => issue.status === status);
  };

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-w-full md:min-w-0">
        {columns.map((column) => {
          const columnIssues = getIssuesForStatus(column.status);

          return (
            <div key={column.status} className="flex flex-col min-w-80 md:min-w-0">
              {/* Column Header */}
              <div className={`rounded-t-xl p-4 border-2 ${column.color}`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{column.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${column.headerColor}`}>
                    {columnIssues.length}
                  </span>
                </div>
              </div>

              {/* Column Content */}
              <div className={`flex-1 border-l-2 border-r-2 border-b-2 rounded-b-xl ${column.color} p-4 min-h-96 custom-scrollbar overflow-y-auto`}>
                <div className="space-y-3">
                  {columnIssues.length === 0 ? (
                    <div className="text-center py-8">
                      <Text size="2" className="text-gray-500">
                        No issues in {column.title.toLowerCase()}
                      </Text>
                    </div>
                  ) : (
                    columnIssues.map((issue) => (
                      <KanbanCard key={issue.id} issue={issue} />
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface KanbanCardProps {
  issue: IssueWithUser;
}

const KanbanCard = ({ issue }: KanbanCardProps) => {
  const { openIssueDrawer } = useIssueActions();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await openIssueDrawer(issue.id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      className={`p-4 hover:shadow-md transition-all duration-200 cursor-pointer bg-white border border-gray-200 hover:border-violet-300 ${isLoading ? 'opacity-50 pointer-events-none' : ''
        }`}
      onClick={handleClick}
    >
      <div className="space-y-3">
        {/* Issue Title */}
        <h4 className="font-medium text-gray-900 text-sm leading-5 line-clamp-2">
          {issue.title}
        </h4>

        {/* Issue Description Preview */}
        {issue.description && (
          <p className="text-xs text-gray-600 line-clamp-2">
            {issue.description}
          </p>
        )}

        {/* Issue Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusBadge status={issue.status} />
            <Text size="1" className="text-gray-500">
              {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
            </Text>
          </div>

          {/* Assignee */}
          {issue.assignedUser && (
            <div className="flex items-center gap-1">
              <Avatar
                src={issue.assignedUser.image || ""}
                fallback={issue.assignedUser.name?.[0] || "?"}
                size="1"
                radius="full"
                className="ring-2 ring-white"
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default KanbanBoard;
