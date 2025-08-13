import { Box, Card, Flex, Heading } from "@radix-ui/themes";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LoadingIssueDetails = () => {
	return (
		<Box className="max-w-xl">
			<Heading>
				<Skeleton />
			</Heading>
			<Flex className="space-x-2" my="2" align="center">
				<Skeleton width="5rem" />
				<Skeleton width="8rem" />
			</Flex>
			<Card className="prose mt-5">
				<Skeleton count={5} />
			</Card>
		</Box>
	);
};

export default LoadingIssueDetails;
