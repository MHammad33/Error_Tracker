import Pagination from "@/components/Pagination";

export default async function Home({
	searchParams,
}: {
	searchParams: Promise<{ page?: string }>;
}) {
	const searchParamsObj = await searchParams;
	return (
		<Pagination
			itemCount={100}
			itemsPerPage={10}
			currentPage={Number(searchParamsObj.page) || 1}
		/>
	);
}
