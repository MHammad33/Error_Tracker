"use client";

import {
	ChevronLeftIcon,
	ChevronRightIcon,
	DoubleArrowLeftIcon,
	DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Button, Flex, Text } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
import type { FC } from "react";

interface PaginationProps {
	itemCount: number;
	itemsPerPage: number;
	currentPage: number;
}

const Pagination: FC<PaginationProps> = ({
	itemCount,
	itemsPerPage,
	currentPage,
}) => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const pageCount = Math.ceil(itemCount / itemsPerPage);
	if (pageCount <= 1) return null;

	const changePage = (newPage: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("page", newPage.toString());
		router.push("?" + params.toString());
	};

	return (
		<Flex align="center" gap="2">
			<Text>
				Page {currentPage} of {pageCount}
			</Text>
			<Button
				color="gray"
				variant="soft"
				disabled={currentPage === 1}
				onClick={() => changePage(1)}
			>
				<DoubleArrowLeftIcon />
			</Button>
			<Button
				color="gray"
				variant="soft"
				disabled={currentPage === 1}
				onClick={() => changePage(currentPage - 1)}
			>
				<ChevronLeftIcon />
			</Button>
			<Button
				color="gray"
				variant="soft"
				disabled={currentPage === pageCount}
				onClick={() => changePage(currentPage + 1)}
			>
				<ChevronRightIcon />
			</Button>
			<Button
				color="gray"
				variant="soft"
				disabled={currentPage === pageCount}
				onClick={() => changePage(pageCount)}
			>
				<DoubleArrowRightIcon />
			</Button>
		</Flex>
	);
};

export default Pagination;
