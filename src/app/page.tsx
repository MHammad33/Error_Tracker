import Pagination from "@/components/Pagination";

export default function Home() {
	return <Pagination itemCount={100} itemsPerPage={10} currentPage={10} />;
}
