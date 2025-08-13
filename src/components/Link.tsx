import { Link as RadixLink } from "@radix-ui/themes";
import NextLink from "next/link";
import type { FC } from "react";

interface LinkProps {
	href: string;
	children: React.ReactNode;
}

const Link: FC<LinkProps> = ({ href, children }) => {
	return (
		<RadixLink asChild>
			<NextLink href={href}>{children}</NextLink>
		</RadixLink>
	);
};

export default Link;
