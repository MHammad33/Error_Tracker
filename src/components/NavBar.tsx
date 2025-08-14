"use client";

import { Box } from "@radix-ui/themes";
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
		<nav className="flex space-x-6 border-b mb-5 px-5 h-14 items-center">
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
			<Box>
				{status === "authenticated" && (
					<Link href="/api/auth/signout">Log out</Link>
				)}
				{status === "unauthenticated" && (
					<Link href="/api/auth/signin">Log In</Link>
				)}
			</Box>
		</nav>
	);
};

export default Navbar;
