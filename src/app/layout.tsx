import "@radix-ui/themes/styles.css";
import "./globals.css";
import "./theme-config.css";

import { Theme } from "@radix-ui/themes";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AuthProvider from "./auth/Provider";
import QueryClientProvider from "./providers/QueryClientProvider";
import LayoutWrapper from "./LayoutWrapper";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Issue Tracker",
	description: "Modern issue tracking application",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
			>
				<QueryClientProvider>
					<AuthProvider>
						<Theme appearance="light" accentColor="violet">
							<LayoutWrapper>{children}</LayoutWrapper>
						</Theme>
					</AuthProvider>
				</QueryClientProvider>
			</body>
		</html>
	);
}
