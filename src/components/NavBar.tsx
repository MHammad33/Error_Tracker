"use client";

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
	const currentPath = usePathname();
	const { data: session, status } = useSession();

	const links = [
		{ href: "/", label: "Dashboard" },
		{ href: "/issues/list", label: "Issues" },
	];

	return (
		<nav className="border-b mb-5 px-5 h-14 py-3">
			<Container>
				<Flex justify="between">
					<Flex align="center" gap="3">
						<Link href="/">
							<AiFillBug />
						</Link>
						<ul className="flex space-x-6">
							{links.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className={classNames({
											"text-zinc-900 font-semibold": currentPath === link.href,
											"text-zinc-500": currentPath !== link.href,
											"hover:text-zinc-800 transition-colors": true,
										})}
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</Flex>
					<Box>
						{status === "authenticated" && (
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									<Avatar
										src={session.user?.image!}
										fallback="?"
										size="2"
										radius="full"
										referrerPolicy="no-referrer"
										className="cursor-pointer"
									/>
								</DropdownMenu.Trigger>
								<DropdownMenu.Content align="end">
									<DropdownMenu.Label>
										<Text size="3">{session.user?.email}</Text>
									</DropdownMenu.Label>
									<DropdownMenu.Item>
										<Link href="/api/auth/signout">Log Out</Link>
									</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						)}
						{status === "unauthenticated" && (
							<Link href="/api/auth/signin">Log In</Link>
						)}
					</Box>
				</Flex>
			</Container>
		</nav>
	);
};

export default Navbar;
