"use client";

import { Issue, Status, User } from "@prisma/client";
import { useState, useEffect, useCallback } from "react";

interface IssueWithUser extends Issue {
  assignedUser?: User | null;
}

interface UseInfiniteIssuesProps {
  status?: Status;
  search?: string;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
  pageSize?: number;
}

interface UseInfiniteIssuesReturn {
  issues: IssueWithUser[];
  loading: boolean;
  error: string | null;
  hasNextPage: boolean;
  loadMore: () => void;
  refresh: () => void;
}

export const useInfiniteIssues = ({
  status,
  search,
  orderBy = "createdAt",
  orderDirection = "desc",
  pageSize = 50,
}: UseInfiniteIssuesProps): UseInfiniteIssuesReturn => {
  const [issues, setIssues] = useState<IssueWithUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const fetchIssues = useCallback(async (pageNum: number, reset = false) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        pageSize: pageSize.toString(),
        orderBy,
        orderDirection,
      });

      if (status) params.append("status", status);
      if (search) params.append("search", search);

      const response = await fetch(`/api/issues?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch issues");
      }

      const data = await response.json();
      const newIssues = data.issues || [];
      
      if (reset) {
        setIssues(newIssues);
      } else {
        setIssues(prev => [...prev, ...newIssues]);
      }

      setHasNextPage(newIssues.length === pageSize);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [status, search, orderBy, orderDirection, pageSize]);

  const loadMore = useCallback(() => {
    if (!loading && hasNextPage) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchIssues(nextPage);
    }
  }, [loading, hasNextPage, page, fetchIssues]);

  const refresh = useCallback(() => {
    setPage(1);
    setIssues([]);
    setHasNextPage(true);
    fetchIssues(1, true);
  }, [fetchIssues]);

  // Initial load and refresh when dependencies change
  useEffect(() => {
    refresh();
  }, [status, search, orderBy, orderDirection]);

  return {
    issues,
    loading,
    error,
    hasNextPage,
    loadMore,
    refresh,
  };
};
