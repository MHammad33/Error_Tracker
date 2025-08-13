"use client";

import { Button, Callout, TextField } from "@radix-ui/themes";
import "easymde/dist/easymde.min.css";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { issueSchema } from "@/lib/validationSchema";
import ErrorMessage from "@/components/ErrorMessage";
import Spinner from "@/components/Spinner";
import dynamic from "next/dynamic";
import z from "zod";
import { Issue } from "@prisma/client";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
	ssr: false,
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
			} else {
				await axios.post("/api/issues", data);
				router.push("/issues");
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
		<div className="max-w-xl">
			{error && (
				<Callout.Root color="red" className="mb-4">
					<Callout.Text>{error}</Callout.Text>
				</Callout.Root>
			)}
			<form className="space-y-2" onSubmit={handleCreateIssue}>
				<TextField.Root
					defaultValue={issue?.title || ""}
					placeholder="Title"
					{...register("title")}
				></TextField.Root>
				<ErrorMessage>{errors.title?.message}</ErrorMessage>

				<Controller
					name="description"
					defaultValue={issue?.description || ""}
					control={control}
					render={({ field }) => (
						<SimpleMDE placeholder="Description" {...field} />
					)}
				/>
				<ErrorMessage>{errors.description?.message}</ErrorMessage>

				<Button style={{ cursor: "pointer" }}>
					{issue ? "Update Issue" : "Submit New Issue"}{" "}
					{isSubmitting && <Spinner />}
				</Button>
			</form>
		</div>
	);
};

export default IssueForm;
