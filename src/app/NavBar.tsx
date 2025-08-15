"use client";

import Skeleton from "@/components/Skeleton";
import {
	Avatar,
	Box,
	Container,
	DropdownMenu,
	Flex,
	Text,
} from "@radix-ui/themes";
import classNames from "classnames";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiFillBug } from "react-icons/ai";

const Navbar = ({}) => {
	return (
		<nav className="border-b mb-5 px-5 h-14 py-3">
			<Container>
				<Flex justify="between">
					<Flex align="center" gap="3">
						<Logo />
						<NavLinks />
					</Flex>
					<Box>
						<AuthStatus />
					</Box>
				</Flex>
			</Container>
		</nav>
	);
};

const Logo = () => {
	return (
		<Link href="/">
			<AiFillBug />
		</Link>
	);
};

const NavLinks = () => {
	const currentPath = usePathname();

	const links = [
		{ href: "/", label: "Dashboard" },
		{ href: "/issues/list", label: "Issues" },
	];

	return (
		<ul className="flex space-x-6">
			{links.map((link) => (
				<li key={link.href}>
					<Link
						href={link.href}
						className={classNames({
							"nav-link": true,
							"!text-zinc-900 font-semibold": currentPath === link.href,
						})}
					>
						{link.label}
					</Link>
				</li>
			))}
		</ul>
	);
};

const AuthStatus = () => {
	const { data: session, status } = useSession();

	if (status === "loading") return <Skeleton width="3rem" />;

	if (status === "unauthenticated") {
		console.log("User is not authenticated");
		return (
			<Link href="/api/auth/signin" className="nav-link">
				Log In
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
					className="cursor-pointer"
				/>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				<DropdownMenu.Label>
					<Text size="3">{session!.user!.email}</Text>
				</DropdownMenu.Label>
				<DropdownMenu.Item>
					<Link href="/api/auth/signout">Log Out</Link>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
};

export default Navbar;
