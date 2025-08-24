"use client";

import ErrorMessage from "@/components/ErrorMessage";
import Spinner from "@/components/Spinner";
import { issueSchema } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Issue } from "@prisma/client";
import { Button, Callout, TextField } from "@radix-ui/themes";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import z from "zod";

// Dynamically import SimpleMDE to avoid SSR issues
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
	ssr: false,
	loading: () => (
		<div className="min-h-[200px] border border-gray-300 rounded-md p-3 bg-gray-50 animate-pulse">
			<div className="text-gray-500">Loading editor...</div>
		</div>
	),
});

type IssueFormData = z.infer<typeof issueSchema>;

interface IssueFormProps {
	issue?: Issue;
}

const IssueForm: FC<IssueFormProps> = ({ issue }) => {
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<IssueFormData>({
		resolver: zodResolver(issueSchema),
	});
	const router = useRouter();

	const handleCreateIssue = handleSubmit(async (data) => {
		try {
			setIsSubmitting(true);

			if (issue) {
				await axios.patch(`/api/issues/${issue.id}`, data);
				router.push(`/issues/${issue.id}`);
				router.refresh(); // Refresh to show updated data
			} else {
				await axios.post("/api/issues", data);
				router.push("/issues/list");
			}
		} catch (error) {
			console.error("Error creating/updating issue:", error);
			if (issue) {
				setError("Failed to update issue. Please try again.");
			} else {
				setError("Failed to create issue. Please try again.");
			}
		} finally {
			setIsSubmitting(false);
		}
	});

	return (
		<div className="space-y-6">
			{error && (
				<Callout.Root color="red" className="mb-4">
					<Callout.Text>{error}</Callout.Text>
				</Callout.Root>
			)}

			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<form className="space-y-6" onSubmit={handleCreateIssue}>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Title *
						</label>
						<TextField.Root
							defaultValue={issue?.title || ""}
							placeholder="Enter issue title..."
							className="w-full"
							{...register("title")}
						/>
						<ErrorMessage>{errors.title?.message}</ErrorMessage>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Description
						</label>
						<Controller
							name="description"
							defaultValue={issue?.description || ""}
							control={control}
							render={({ field }) => (
								<SimpleMDE
									placeholder="Describe the issue in detail..."
									{...field}
									options={{
										autofocus: false,
										spellChecker: false,
										toolbar: [
											"bold", "italic", "heading", "|",
											"quote", "unordered-list", "ordered-list", "|",
											"link", "preview", "side-by-side", "fullscreen"
										],
									}}
								/>
							)}
						/>
						<ErrorMessage>{errors.description?.message}</ErrorMessage>
					</div>

					<div className="flex items-center gap-3 pt-4 border-t border-gray-200">
						<Button
							type="submit"
							disabled={isSubmitting}
							className="cursor-pointer"
						>
							{isSubmitting ? (
								<>
									<Spinner />
									{issue ? "Updating..." : "Creating..."}
								</>
							) : (
								issue ? "Update Issue" : "Create Issue"
							)}
						</Button>

						<Button
							type="button"
							variant="ghost"
							onClick={() => router.back()}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default IssueForm;
