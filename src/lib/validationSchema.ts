import z from "zod";

export const issueSchema = z.object({
	title: z
		.string()
		.min(1, "Title is required")
		.max(255, "Title is too long, max 255 characters are acceptable"),
	description: z
		.string()
		.min(1, "Description is required")
		.max(65535, "Description is too long, max 65535 characters are acceptable"),
});

export const patchIssueSchema = z.object({
	title: z
		.string()
		.min(1, "Title is required")
		.max(255, "Title is too long, max 255 characters are acceptable")
		.optional(),
	description: z
		.string()
		.min(1, "Description is required")
		.max(65535, "Description is too long, max 65535 characters are acceptable")
		.optional(),
	assignedUserId: z
		.string()
		.min(1, "Assigned user ID is required")
		.max(255, "Assigned user ID is too long, max 255 characters are acceptable")
		.optional(),
});
