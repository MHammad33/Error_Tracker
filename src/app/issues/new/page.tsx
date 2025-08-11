"use client";

import { Button, Callout, Text, TextField } from "@radix-ui/themes";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createIssueSchema } from "@/lib/validationSchema";
import z from "zod";
import ErrorMessage from "@/components/ErrorMessage";
import Spinner from "@/components/Spinner";

type IssueForm = z.infer<typeof createIssueSchema>;

const NewIssuePage = () => {
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<IssueForm>({
		resolver: zodResolver(createIssueSchema),
	});
	const router = useRouter();

	const handleCreateIssue = handleSubmit(async (data) => {
		try {
			setIsSubmitting(true);
			await axios.post("/api/issues", data);
			router.push("/issues");
		} catch (error) {
			setError("Failed to create issue. Please try again.");
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
					placeholder="Title"
					{...register("title")}
				></TextField.Root>
				<ErrorMessage>{errors.title?.message}</ErrorMessage>

				<Controller
					name="description"
					control={control}
					render={({ field }) => (
						<SimpleMDE placeholder="Description" {...field} />
					)}
				/>
				<ErrorMessage>{errors.description?.message}</ErrorMessage>

				<Button style={{ cursor: "pointer" }}>
					Submit New Issue {isSubmitting && <Spinner />}
				</Button>
			</form>
		</div>
	);
};

export default NewIssuePage;
