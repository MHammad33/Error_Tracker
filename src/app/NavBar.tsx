"use client";

import Skeleton from "@/components/Skeleton";
import {
	Avatar,
	Box,
	DropdownMenu,
	Flex,
	Text,
} from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { AiFillBug } from "react-icons/ai";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

interface NavbarProps {
	onMenuToggle?: () => void;
	showLogo?: boolean;
}

const Navbar = ({ onMenuToggle, showLogo = true }: NavbarProps) => {
	return (
		<nav className="h-16 px-4 lg:px-6 bg-white border-b border-gray-200">
			<Flex justify="between" align="center" height="100%">
				<Flex align="center" gap="3">
					{/* Mobile menu button */}
					{onMenuToggle && (
						<button
							onClick={onMenuToggle}
							className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
						>
							<HamburgerMenuIcon className="w-5 h-5" />
						</button>
					)}

					{/* Logo for mobile */}
					{showLogo && <Logo />}
				</Flex>
				<Box>
					<AuthStatus />
				</Box>
			</Flex>
		</nav>
	);
};

const Logo = () => {
	return (
		<Link href="/" className="flex items-center gap-2 text-violet-600 hover:text-violet-700 transition-colors">
			<AiFillBug className="w-6 h-6" />
			<Text size="4" weight="bold" className="hidden sm:block text-gray-900">
				Issue Tracker
			</Text>
		</Link>
	);
};

const AuthStatus = () => {
	const { data: session, status } = useSession();

	if (status === "loading") return <Skeleton width="3rem" />;

	if (status === "unauthenticated") {
		return (
			<Link
				href="/api/auth/signin"
				className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium"
			>
				Sign In
			</Link>
		);
	}

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Avatar
					src={session!.user!.image!}
					fallback="?"
					size="2"
					radius="full"
					referrerPolicy="no-referrer"
					className="cursor-pointer ring-2 ring-offset-2 ring-transparent hover:ring-violet-200 transition-all"
				/>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end" className="min-w-48">
				<DropdownMenu.Label>
					<Text size="2" color="gray">{session!.user!.email}</Text>
				</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Item>
					<Link href="/settings" className="w-full">Settings</Link>
				</DropdownMenu.Item>
				<DropdownMenu.Item>
					<Link href="/api/auth/signout" className="w-full">Sign Out</Link>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
};

export default Navbar;
