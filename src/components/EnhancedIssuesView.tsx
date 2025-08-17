"use client";

import { useState } from "react";
import { Issue, Status, User } from "@prisma/client";
import IssuesTable from "@/app/issues/list/IssuesTable";
import KanbanBoard from "@/components/KanbanBoard";
import VirtualizedIssuesList from "@/components/VirtualizedIssuesList";
import { useInfiniteIssues } from "@/hooks/useInfiniteIssues";
import { Button, Text } from "@radix-ui/themes";
import { ReloadIcon } from "@radix-ui/react-icons";

interface IssueWithUser extends Issue {
  assignedUser?: User | null;
}

interface EnhancedIssuesViewProps {
  initialIssues: IssueWithUser[];
  searchParams: {
    status: Status | null;
    orderBy: keyof Issue;
    orderDirection: "asc" | "desc";
    page: string;
    search: string | null;
    view: string | null;
  };
  totalCount: number;
}

const EnhancedIssuesView = ({
  initialIssues,
  searchParams,
  totalCount
}: EnhancedIssuesViewProps) => {
  const [useVirtualization, setUseVirtualization] = useState(totalCount > 100);
  const currentView = searchParams.view || "table";

  const {
    issues: infiniteIssues,
    loading,
    error,
    hasNextPage,
    loadMore,
    refresh,
  } = useInfiniteIssues({
    status: searchParams.status || undefined,
    search: searchParams.search || undefined,
    orderBy: String(searchParams.orderBy),
    orderDirection: searchParams.orderDirection,
    pageSize: 50,
  });

  // Use infinite loading data if virtualization is enabled, otherwise use server-side pagination
  const issuesToDisplay = useVirtualization ? infiniteIssues : initialIssues;

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <Text size="3" className="text-red-600 mb-4 block">
          Error loading issues: {error}
        </Text>
        <Button onClick={refresh} variant="outline">
          <ReloadIcon className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Performance Toggle for Large Datasets */}
      {totalCount > 50 && (
        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div>
            <Text size="3" className="text-blue-900 font-medium">
              Large Dataset Detected ({totalCount.toLocaleString()} issues)
            </Text>
            <Text size="2" className="text-blue-700">
              {useVirtualization
                ? "Using virtualized rendering for better performance"
                : "Using standard pagination"
              }
            </Text>
          </div>
          <Button
            variant="outline"
            onClick={() => setUseVirtualization(!useVirtualization)}
          >
            {useVirtualization ? "Use Standard View" : "Use Virtual Scrolling"}
          </Button>
        </div>
      )}

      {/* Issues Display */}
      {currentView === "kanban" ? (
        <KanbanBoard issues={issuesToDisplay} />
      ) : useVirtualization ? (
        <div className="space-y-4">
          <VirtualizedIssuesList
            issues={issuesToDisplay}
            height={600}
          />
          {hasNextPage && (
            <div className="text-center">
              <Button
                onClick={loadMore}
                disabled={loading}
                variant="outline"
              >
                {loading ? (
                  <>
                    <ReloadIcon className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More Issues"
                )}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <IssuesTable issues={issuesToDisplay} searchParamsObj={searchParams} />
      )}
    </div>
  );
};

export default EnhancedIssuesView;
