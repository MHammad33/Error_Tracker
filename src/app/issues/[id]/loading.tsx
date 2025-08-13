import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LoadingIssueDetails = () => {
	return (
		<div>
			<Skeleton count={3} />
		</div>
	);
};

export default LoadingIssueDetails;
