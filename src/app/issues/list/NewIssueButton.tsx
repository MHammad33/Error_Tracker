import { PlusIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const NewIssueButton = () => {
	return (
		<Link
			href="/issues/new"
			className="inline-flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors shadow-sm"
		>
			<PlusIcon className="w-4 h-4" />
			New Issue
		</Link>
	);
};

export default NewIssueButton;
