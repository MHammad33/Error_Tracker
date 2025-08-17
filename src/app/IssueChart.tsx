"use client";

import { Card, Heading } from "@radix-ui/themes";
import type { FC } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";

interface IssueChartProps {
	open: number;
	inProgress: number;
	closed: number;
}

const IssueChart: FC<IssueChartProps> = ({ open, inProgress, closed }) => {
	const data = [
		{ label: "Open", value: open, color: "#ef4444" },
		{ label: "In Progress", value: inProgress, color: "#f97316" },
		{ label: "Closed", value: closed, color: "#22c55e" },
	];

	return (
		<Card className="p-6 shadow-sm border border-gray-200">
			<Heading size="5" className="text-gray-900 mb-6">
				Issues Overview
			</Heading>
			<ResponsiveContainer width="100%" height={320}>
				<BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
					<XAxis
						dataKey="label"
						axisLine={false}
						tickLine={false}
						tick={{ fontSize: 12, fill: '#6b7280' }}
					/>
					<YAxis
						axisLine={false}
						tickLine={false}
						tick={{ fontSize: 12, fill: '#6b7280' }}
						tickFormatter={(value) => value.toString()}
					/>
					<Tooltip
						contentStyle={{
							backgroundColor: '#ffffff',
							border: '1px solid #e5e7eb',
							borderRadius: '8px',
							boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
						}}
						cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
					/>
					<Bar
						dataKey="value"
						radius={[8, 8, 0, 0]}
						maxBarSize={80}
					>
						{data.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={entry.color} />
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</Card>
	);
};

export default IssueChart;
