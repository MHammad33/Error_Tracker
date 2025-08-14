import { Flex } from "@radix-ui/themes";
import NewIssueButton from "./NewIssueButton";
import StatusFilter from "./StatusFilter";
import IssuesTable from "./IssuesTable";

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
