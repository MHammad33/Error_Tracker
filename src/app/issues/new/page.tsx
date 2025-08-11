"use client";

import { Button, Callout, TextField } from "@radix-ui/themes";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface IssueForm {
	title: string;
	description: string;
}

const NewIssuePage = () => {
	const [error, setError] = useState<string | null>(null);

	const { register, control, handleSubmit } = useForm<IssueForm>();
	const router = useRouter();

	const handleCreateIssue = handleSubmit(async (data) => {
		try {
			await axios.post("/api/issues", data);
			router.push("/issues");
		} catch (error) {
			setError("Failed to create issue. Please try again.");
		}
	});

	return (
		<div className="max-w-xl">
			{error && (
				<Callout.Root color="red" className="mb-4">
					<Callout.Text>{error}</Callout.Text>
				</Callout.Root>
			)}
			<form className=" space-y-3" onSubmit={handleCreateIssue}>
				<TextField.Root
					placeholder="Title"
					{...register("title")}
				></TextField.Root>
				<Controller
					name="description"
					control={control}
					render={({ field }) => (
						<SimpleMDE placeholder="Description" {...field} />
					)}
				></Controller>
				<Button style={{ cursor: "pointer" }}>Submit New Issue</Button>
			</form>
		</div>
	);
};

export default NewIssuePage;
