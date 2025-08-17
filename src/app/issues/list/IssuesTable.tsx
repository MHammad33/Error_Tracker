"use client";

import { StatusBadge } from "@/components";
import { columns } from "@/constants/columns";
import { Issue, Status, User } from "@prisma/client";
import { ArrowUpIcon, ArrowDownIcon } from "@radix-ui/react-icons";
import { Avatar, Text } from "@radix-ui/themes";
import Link from "next/link";
import { FC, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useIssueActions } from "@/hooks/useIssueActions";

export interface IssueSearchParams {
	status: Status | null;
	orderBy: keyof Issue;
	orderDirection: "asc" | "desc";
	page: string;
	search: string | null;
	view: string | null;
}

interface IssueWithUser extends Issue {
	assignedUser?: User | null;
}

interface IssueTableProps {
	issues: IssueWithUser[];
	searchParamsObj: IssueSearchParams;
}

const IssuesTable: FC<IssueTableProps> = ({ searchParamsObj, issues }) => {
	const { openIssueDrawer } = useIssueActions();
	const [loadingIssueId, setLoadingIssueId] = useState<string | null>(null);

	const handleIssueClick = async (issueId: string) => {
		setLoadingIssueId(issueId);
		try {
			await openIssueDrawer(issueId);
		} finally {
			setLoadingIssueId(null);
		}
	};

	const getSortIcon = (columnValue: string) => {
		if (columnValue !== searchParamsObj.orderBy) return null;
		return searchParamsObj.orderDirection === "asc" ? (
			<ArrowUpIcon className="inline w-4 h-4 ml-1" />
		) : (
			<ArrowDownIcon className="inline w-4 h-4 ml-1" />
		);
	};

	const getNextSortDirection = (columnValue: string) => {
		if (columnValue !== searchParamsObj.orderBy) return "asc";
		return searchParamsObj.orderDirection === "asc" ? "desc" : "asc";
	};

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
			{/* Desktop Table */}
			<div className="hidden md:block overflow-x-auto">
				<table className="w-full">
					<thead className="bg-gray-50 border-b border-gray-200">
						<tr>
							{columns.map((column) => (
								<th
									key={String(column.value ?? column.label)}
									className={`px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ""}`}
								>
									<Link
										href={{
											query: {
												...searchParamsObj,
												orderBy: String(column.value) ?? undefined,
												orderDirection: getNextSortDirection(String(column.value)),
											},
										}}
										className="flex items-center hover:text-gray-700 transition-colors"
									>
										{column.label}
										{getSortIcon(String(column.value))}
									</Link>
								</th>
							))}
							<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Assignee
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{issues.map((issue) => (
							<tr key={issue.id} className="hover:bg-gray-50 transition-colors">
								<td className="px-6 py-4">
									<button
										onClick={() => handleIssueClick(issue.id)}
										disabled={loadingIssueId === issue.id}
										className="font-medium text-gray-900 hover:text-violet-600 transition-colors text-left disabled:opacity-50"
									>
										{loadingIssueId === issue.id ? (
											<span className="flex items-center gap-2">
												<svg className="animate-spin h-4 w-4 text-violet-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
													<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
													<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
												</svg>
												{issue.title}
											</span>
										) : (
											issue.title
										)}
									</button>
								</td>
								<td className="px-6 py-4">
									<StatusBadge status={issue.status} />
								</td>
								<td className="px-6 py-4 text-sm text-gray-500">
									{formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
								</td>
								<td className="px-6 py-4">
									{issue.assignedUser ? (
										<div className="flex items-center gap-2">
											<Avatar
												src={issue.assignedUser.image || ""}
												fallback={issue.assignedUser.name?.[0] || "?"}
												size="1"
												radius="full"
											/>
											<Text size="2" className="text-gray-600">
												{issue.assignedUser.name || issue.assignedUser.email}
											</Text>
										</div>
									) : (
										<Text size="2" className="text-gray-400">
											Unassigned
										</Text>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Mobile Cards */}
			<div className="md:hidden divide-y divide-gray-200">
				{issues.map((issue) => (
					<div key={issue.id} className="p-4">
						<button
							onClick={() => handleIssueClick(issue.id)}
							disabled={loadingIssueId === issue.id}
							className="block w-full text-left disabled:opacity-50"
						>
							<div className="flex justify-between items-start mb-2">
								<h3 className="font-medium text-gray-900 pr-2">
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
										<span className="text-xs">
											{issue.assignedUser.name || issue.assignedUser.email}
										</span>
									</div>
								)}
							</div>
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default IssuesTable;
