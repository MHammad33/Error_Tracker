import IssuesTable from "@/components/IssuesTable";
import StatusFilter from "@/components/StatusFilter";
import { Flex } from "@radix-ui/themes";
import NewIssueButton from "./NewIssueButton";

const IssuesPage = ({}) => {
	return (
		<>
			<Flex justify="between" align="center" className="mb-4">
				<StatusFilter />
				<NewIssueButton />
			</Flex>

			<IssuesTable />
		</>
	);
};

export default IssuesPage;
