import { PrismaClient, Status } from "@prisma/client";

const prisma = new PrismaClient();

const issuesData = [
	{
		title: "Payment gateway integration failing for some cards",
		description:
			"Certain credit cards fail during checkout, with the payment gateway returning authentication errors. Logs suggest either API key misconfiguration or unsupported card types, impacting customer transactions.",
		status: Status.IN_PROGRESS,
		createdAt: new Date("2025-08-06T14:30:00Z"),
		updatedAt: new Date("2025-08-07T09:45:00Z"),
	},
	{
		title: "Wrong language displayed on user profile",
		description:
			"Some users see the wrong language on their profile page despite selecting a preferred language. The localization files may not be loaded correctly or caching is interfering with dynamic language selection.",
		status: Status.OPEN,
		createdAt: new Date("2025-08-07T10:00:00Z"),
		updatedAt: new Date("2025-08-07T10:00:00Z"),
	},
	{
		title: "404 page styling broken",
		description:
			"The custom 404 page is missing proper styling and appears plain. CSS files may not be loaded correctly in the build output or paths could be incorrect, affecting user experience when visiting non-existent routes.",
		status: Status.CLOSED,
		createdAt: new Date("2025-08-07T15:20:00Z"),
		updatedAt: new Date("2025-08-08T08:50:00Z"),
	},
	{
		title: "Chat messages delayed in real-time conversations",
		description:
			"Users notice a delay of several seconds when sending or receiving chat messages. Investigation indicates possible WebSocket server overload or slow message queuing logic, affecting communication.",
		status: Status.IN_PROGRESS,
		createdAt: new Date("2025-08-08T09:40:00Z"),
		updatedAt: new Date("2025-08-08T10:20:00Z"),
	},
	{
		title: "Settings page changes not persisting",
		description:
			"Users report that updates on the settings page revert to previous values after refresh. Backend API may not commit updates correctly or caching might serve stale data.",
		status: Status.OPEN,
		createdAt: new Date("2025-08-08T12:15:00Z"),
		updatedAt: new Date("2025-08-08T12:15:00Z"),
	},
	{
		title: "Homepage carousel not rotating automatically",
		description:
			"The homepage image carousel does not rotate on its own. Console logs reveal JavaScript errors, suggesting initialization issues or conflicts with other scripts preventing automatic rotation.",
		status: Status.CLOSED,
		createdAt: new Date("2025-08-09T07:50:00Z"),
		updatedAt: new Date("2025-08-09T09:10:00Z"),
	},
	{
		title: "User roles not updating after admin changes",
		description:
			"Admin users report that role changes for other users do not take effect. The backend may not commit updates correctly, or caching may return stale data, causing inconsistent permissions.",
		status: Status.IN_PROGRESS,
		createdAt: new Date("2025-08-09T14:00:00Z"),
		updatedAt: new Date("2025-08-10T08:45:00Z"),
	},
	{
		title: "Search autocomplete shows irrelevant suggestions",
		description:
			"Autocomplete suggestions frequently include unrelated items. This might be due to improper ranking logic, lack of filtering, or outdated search indexes affecting relevance.",
		status: Status.OPEN,
		createdAt: new Date("2025-08-10T09:20:00Z"),
		updatedAt: new Date("2025-08-10T09:20:00Z"),
	},
	{
		title: "Forgot password emails delayed",
		description:
			"Password reset emails are delayed by several hours for some users. SMTP server performance or queuing mechanisms may be causing latency in email delivery.",
		status: Status.IN_PROGRESS,
		createdAt: new Date("2025-08-10T13:40:00Z"),
		updatedAt: new Date("2025-08-11T07:30:00Z"),
	},
	{
		title: "Two-factor authentication codes rejected",
		description:
			"Valid two-factor authentication codes are sometimes rejected. Possible causes include clock drift, incorrect generation logic, or session inconsistencies affecting code validation.",
		status: Status.OPEN,
		createdAt: new Date("2025-08-11T08:25:00Z"),
		updatedAt: new Date("2025-08-11T08:25:00Z"),
	},
	{
		title: "Invoice PDF generation failing for large orders",
		description:
			"Generating PDF invoices for orders with many line items occasionally fails. Memory usage spikes and server timeouts indicate that the PDF generation library may need optimization for large datasets.",
		status: Status.IN_PROGRESS,
		createdAt: new Date("2025-08-11T12:00:00Z"),
		updatedAt: new Date("2025-08-12T09:10:00Z"),
	},
	{
		title: "API returns inconsistent data formats",
		description:
			"Some endpoints return inconsistent JSON structures, causing frontend rendering errors. Schema validation or transformation logic may be missing for certain API responses.",
		status: Status.OPEN,
		createdAt: new Date("2025-08-12T10:15:00Z"),
		updatedAt: new Date("2025-08-12T10:15:00Z"),
	},
	{
		title: "Notification emails sent multiple times",
		description:
			"Users receive duplicate notification emails for the same event. Duplicate triggers in the backend job scheduler or incorrect retry logic may be causing repeated sends.",
		status: Status.CLOSED,
		createdAt: new Date("2025-08-12T14:25:00Z"),
		updatedAt: new Date("2025-08-13T08:40:00Z"),
	},
	{
		title: "Profile update fails on special characters",
		description:
			"Updating profiles with names containing special characters fails. Backend validation or database encoding may be improperly handling non-alphanumeric characters.",
		status: Status.IN_PROGRESS,
		createdAt: new Date("2025-08-13T09:35:00Z"),
		updatedAt: new Date("2025-08-14T07:20:00Z"),
	},
	{
		title: "File upload progress bar not updating",
		description:
			"During large file uploads, the progress bar does not accurately reflect upload completion. JavaScript event handling may not be reporting upload progress correctly.",
		status: Status.OPEN,
		createdAt: new Date("2025-08-13T11:50:00Z"),
		updatedAt: new Date("2025-08-13T11:50:00Z"),
	},
	{
		title: "Search filters not applied correctly",
		description:
			"Applying multiple filters in the search page sometimes returns incorrect results. Backend query logic may not combine filter criteria properly, causing inaccurate outputs.",
		status: Status.IN_PROGRESS,
		createdAt: new Date("2025-08-14T08:15:00Z"),
		updatedAt: new Date("2025-08-14T08:15:00Z"),
	},
	{
		title: "Homepage hero image fails to load on slow connections",
		description:
			"The main hero image occasionally fails to load on low-speed networks. Image optimization or lazy loading strategies may need adjustment to improve reliability and performance.",
		status: Status.OPEN,
		createdAt: new Date("2025-08-14T09:25:00Z"),
		updatedAt: new Date("2025-08-14T09:25:00Z"),
	},
	{
		title: "Notifications not marked as read",
		description:
			"Clicking on notifications does not mark them as read in the system. This could be caused by missing database updates or frontend state management errors.",
		status: Status.CLOSED,
		createdAt: new Date("2025-08-14T10:30:00Z"),
		updatedAt: new Date("2025-08-14T11:05:00Z"),
	},
	{
		title: "Error page lacks retry options",
		description:
			"When server errors occur, the error page does not provide users with retry buttons or guidance. Improving UX here could reduce frustration and improve user retention during downtime.",
		status: Status.IN_PROGRESS,
		createdAt: new Date("2025-08-14T11:45:00Z"),
		updatedAt: new Date("2025-08-14T12:10:00Z"),
	},
	{
		title: "User activity logs missing timestamps",
		description:
			"Certain user activity logs do not record timestamps correctly, leading to gaps in audit trails. Backend logging mechanisms may need adjustments to capture accurate time information.",
		status: Status.OPEN,
		createdAt: new Date("2025-08-14T12:30:00Z"),
		updatedAt: new Date("2025-08-14T12:30:00Z"),
	},
	{
		title: "Report generation slow for large datasets",
		description:
			"Generating reports with thousands of entries takes several minutes. Query optimization and server-side caching could improve performance significantly for heavy datasets.",
		status: Status.IN_PROGRESS,
		createdAt: new Date("2025-08-14T13:10:00Z"),
		updatedAt: new Date("2025-08-14T13:10:00Z"),
	},
	{
		title: "Exported CSV missing headers",
		description:
			"Exported CSV files sometimes miss column headers, making the data difficult to interpret. Backend CSV export logic may need validation to ensure all columns are included consistently.",
		status: Status.CLOSED,
		createdAt: new Date("2025-08-14T13:45:00Z"),
		updatedAt: new Date("2025-08-14T14:05:00Z"),
	},
	{
		title: "Session refresh token not expiring correctly",
		description:
			"Refresh tokens sometimes remain valid longer than expected, posing a security risk. Token expiration logic may need adjustment to enforce proper lifecycle.",
		status: Status.OPEN,
		createdAt: new Date("2025-08-14T14:30:00Z"),
		updatedAt: new Date("2025-08-14T14:30:00Z"),
	},
	{
		title: "Bulk user import fails on duplicate emails",
		description:
			"Importing users in bulk fails when duplicate emails are present. The process should skip duplicates gracefully and provide a summary of skipped records to the admin.",
		status: Status.IN_PROGRESS,
		createdAt: new Date("2025-08-14T15:00:00Z"),
		updatedAt: new Date("2025-08-14T15:00:00Z"),
	},
	{
		title: "Form validation not consistent across browsers",
		description:
			"Client-side form validation behaves differently in Chrome and Safari, leading to errors not caught on some browsers. Validation logic needs to be standardized for cross-browser reliability.",
		status: Status.OPEN,
		createdAt: new Date("2025-08-14T15:40:00Z"),
		updatedAt: new Date("2025-08-14T15:40:00Z"),
	},
	{
		title: "Admin dashboard statistics incorrect",
		description:
			"Some statistics in the admin dashboard show incorrect values. Aggregation queries may not account for all records correctly, leading to misrepresentation of data metrics.",
		status: Status.CLOSED,
		createdAt: new Date("2025-08-14T16:15:00Z"),
		updatedAt: new Date("2025-08-14T16:40:00Z"),
	},
	{
		title: "Push notifications not received on iOS devices",
		description:
			"Users on iOS report missing push notifications. Possible causes include APNs configuration errors, expired certificates, or frontend subscription issues.",
		status: Status.IN_PROGRESS,
		createdAt: new Date("2025-08-14T17:00:00Z"),
		updatedAt: new Date("2025-08-14T17:30:00Z"),
	},
	{
		title: "API rate limits exceeded unexpectedly",
		description:
			"Some clients experience rate-limit errors even under normal usage. Backend API throttling logic may be misconfigured, affecting legitimate traffic and causing service disruption.",
		status: Status.OPEN,
		createdAt: new Date("2025-08-14T18:10:00Z"),
		updatedAt: new Date("2025-08-14T18:10:00Z"),
	},
	{
		title: "Live chat typing indicator not showing",
		description:
			"Users report that typing indicators in live chat do not appear consistently. WebSocket events or frontend state handling may be dropping updates intermittently.",
		status: Status.IN_PROGRESS,
		createdAt: new Date("2025-08-14T18:50:00Z"),
		updatedAt: new Date("2025-08-14T19:10:00Z"),
	},
	{
		title: "Dark mode theme not applied to all pages",
		description:
			"Dark mode works on some pages but not others, causing inconsistent UI experience. CSS class toggling or theme context propagation may be missing on certain components.",
		status: Status.CLOSED,
		createdAt: new Date("2025-08-14T19:40:00Z"),
		updatedAt: new Date("2025-08-14T20:00:00Z"),
	},
	{
		title: "Video playback freezes on slow networks",
		description:
			"Embedded videos freeze or fail to start on low-speed connections. Buffering logic and adaptive bitrate streaming may need enhancement to improve playback reliability.",
		status: Status.OPEN,
		createdAt: new Date("2025-08-14T20:30:00Z"),
		updatedAt: new Date("2025-08-14T20:30:00Z"),
	},
	{
		title: "Incorrect total displayed in shopping cart",
		description:
			"The total price in the shopping cart sometimes does not include taxes or discounts correctly. Calculation logic needs review to ensure accurate pricing.",
		status: Status.IN_PROGRESS,
		createdAt: new Date("2025-08-14T21:05:00Z"),
		updatedAt: new Date("2025-08-14T21:30:00Z"),
	},
	{
		title: "Account deletion confirmation not working",
		description:
			"Users attempting to delete their accounts do not receive confirmation, and the deletion does not complete. Backend deletion logic and email notifications need correction.",
		status: Status.OPEN,
		createdAt: new Date("2025-08-14T21:50:00Z"),
		updatedAt: new Date("2025-08-14T21:50:00Z"),
	},
	{
		title: "Incorrect timezone applied to events",
		description:
			"Events created in different time zones show incorrect times to users. Backend time conversion and storage may need review to ensure correct timezone handling.",
		status: Status.CLOSED,
		createdAt: new Date("2025-08-14T22:30:00Z"),
		updatedAt: new Date("2025-08-14T22:50:00Z"),
	},
	{
		title: "Mobile push notifications delayed",
		description:
			"Push notifications on mobile devices are delayed by several minutes. Possible causes include notification queue backlog, network latency, or device-specific limitations.",
		status: Status.IN_PROGRESS,
		createdAt: new Date("2025-08-14T23:10:00Z"),
		updatedAt: new Date("2025-08-14T23:35:00Z"),
	},
	{
		title: "Payment confirmation email not sent",
		description:
			"After completing a payment, users do not receive confirmation emails immediately. SMTP configuration or asynchronous email jobs may be failing intermittently.",
		status: Status.OPEN,
		createdAt: new Date("2025-08-14T23:50:00Z"),
		updatedAt: new Date("2025-08-14T23:50:00Z"),
	},
	{
		title: "API documentation outdated",
		description:
			"The API documentation does not reflect recent endpoint changes, causing confusion for developers integrating with the API. Updating docs and adding changelogs is recommended.",
		status: Status.CLOSED,
		createdAt: new Date("2025-08-15T00:25:00Z"),
		updatedAt: new Date("2025-08-15T00:50:00Z"),
	},
	{
		title: "Image gallery thumbnails not loading",
		description:
			"Gallery thumbnails fail to load for some images, leaving blank placeholders. CDN paths or caching issues may be causing this intermittent failure.",
		status: Status.IN_PROGRESS,
		createdAt: new Date("2025-08-15T01:10:00Z"),
		updatedAt: new Date("2025-08-15T01:40:00Z"),
	},
	{
		title: "Forgot password link expired immediately",
		description:
			"Password reset links expire immediately after generation, preventing users from resetting their passwords. Token expiration logic needs adjustment.",
		status: Status.OPEN,
		createdAt: new Date("2025-08-15T02:00:00Z"),
		updatedAt: new Date("2025-08-15T02:00:00Z"),
	},
	{
		title: "Order confirmation page shows wrong totals",
		description:
			"After placing orders, the confirmation page sometimes displays incorrect totals. Calculation logic or rounding issues may be causing discrepancies.",
		status: Status.IN_PROGRESS,
		createdAt: new Date("2025-08-15T02:35:00Z"),
		updatedAt: new Date("2025-08-15T03:00:00Z"),
	},
	{
		title: "Account lockout after multiple login attempts too aggressive",
		description:
			"Users are locked out too quickly after failed login attempts, even for minor errors. The lockout threshold may need review to balance security with usability.",
		status: Status.OPEN,
		createdAt: new Date("2025-08-15T03:25:00Z"),
		updatedAt: new Date("2025-08-15T03:25:00Z"),
	},
];

async function main() {
	await prisma.issue.createMany({ data: issuesData });
	console.log("✅ Seeded issues successfully!");
}

main()
	.catch((e) => console.error(e))
	.finally(async () => {
		await prisma.$disconnect();
	});
