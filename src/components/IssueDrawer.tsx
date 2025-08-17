"use client";

import { Issue, Status, User } from "@prisma/client";
import { Cross2Icon, Pencil1Icon, CheckIcon, ArrowLeftIcon } from "@radix-ui/react-icons";
import { Avatar, Button, Text, Heading, TextField, Callout } from "@radix-ui/themes";
import { StatusBadge } from "@/components";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { issueSchema } from "@/lib/validationSchema";
import SimpleMDE from "react-simplemde-editor";
import axios from "axios";
import z from "zod";
import Link from "next/link";

type IssueFormData = z.infer<typeof issueSchema>;

interface IssueWithUser extends Issue {
  assignedUser?: User | null;
}

interface IssueDrawerProps {
  issue: IssueWithUser | null;
  isOpen: boolean;
  onClose: () => void;
  onIssueUpdated?: (updatedIssue: IssueWithUser) => void;
}

const IssueDrawer = ({ issue, isOpen, onClose, onIssueUpdated }: IssueDrawerProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: issue?.title || "",
      description: issue?.description || "",
    },
  });

  // Reset form when issue changes
  useEffect(() => {
    if (issue) {
      reset({
        title: issue.title,
        description: issue.description,
      });
    }
  }, [issue, reset]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Reset editing state when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
      setError(null);
    }
  }, [isOpen]);

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError(null);
    reset({
      title: issue?.title || "",
      description: issue?.description || "",
    });
  };

  const handleSave = handleSubmit(async (data) => {
    if (!issue) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await axios.patch(`/api/issues/${issue.id}`, data);
      const updatedIssue = response.data;

      // Update the issue in parent component if callback provided
      if (onIssueUpdated) {
        onIssueUpdated(updatedIssue);
      }

      setIsEditing(false);

      // Refresh the issue data by fetching it again
      const refreshResponse = await fetch(`/api/issues/${issue.id}`);
      if (refreshResponse.ok) {
        const refreshedIssue = await refreshResponse.json();
        if (onIssueUpdated) {
          onIssueUpdated(refreshedIssue);
        }
      }
    } catch (error) {
      console.error("Error updating issue:", error);
      setError("Failed to update issue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      // ESC to close drawer or exit edit mode
      if (e.key === 'Escape') {
        if (isEditing) {
          if (isDirty) {
            if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
              handleCancelEdit();
            }
          } else {
            handleCancelEdit();
          }
        } else {
          onClose();
        }
      }

      // Ctrl/Cmd + S to save when editing
      if ((e.ctrlKey || e.metaKey) && e.key === 's' && isEditing) {
        e.preventDefault();
        if (isDirty && !isSubmitting) {
          handleSave();
        }
      }

      // E to edit when in view mode
      if (e.key === 'e' && !isEditing && e.target === document.body) {
        handleEdit();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isEditing, isDirty, isSubmitting, handleSave, handleCancelEdit, onClose]);

  if (!issue) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-3xl bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${isOpen ? "translate-x-0" : "translate-x-full"
        }`}>
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            {isEditing && (
              <Button
                variant="ghost"
                size="2"
                onClick={handleCancelEdit}
                className="mr-2"
              >
                <ArrowLeftIcon className="w-4 h-4" />
              </Button>
            )}
            <Heading size="5" className="text-gray-900">
              {isEditing ? "Edit Issue" : "Issue Details"}
            </Heading>
            {!isEditing && <StatusBadge status={issue.status} />}
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="2"
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  size="2"
                  onClick={handleSave}
                  disabled={isSubmitting || !isDirty}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckIcon className="w-4 h-4 mr-1" />
                      Save
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="2" onClick={handleEdit}>
                  <Pencil1Icon className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button variant="ghost" size="2" onClick={onClose}>
                  <Cross2Icon className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <Callout.Root color="red" className="mb-6">
              <Callout.Text>{error}</Callout.Text>
            </Callout.Root>
          )}

          <div className="space-y-6">
            {isEditing ? (
              /* Edit Mode */
              <>
                {/* Title Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <TextField.Root
                    placeholder="Enter issue title..."
                    className="w-full"
                    {...register("title")}
                  />
                  {errors.title && (
                    <Text size="2" className="text-red-600 mt-1">
                      {errors.title.message}
                    </Text>
                  )}
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <SimpleMDE
                        placeholder="Describe the issue in detail..."
                        {...field}
                        options={{
                          autofocus: false,
                          spellChecker: false,
                          minHeight: "200px",
                          toolbar: [
                            "bold", "italic", "heading", "|",
                            "quote", "unordered-list", "ordered-list", "|",
                            "link", "preview"
                          ],
                        }}
                      />
                    )}
                  />
                  {errors.description && (
                    <Text size="2" className="text-red-600 mt-1">
                      {errors.description.message}
                    </Text>
                  )}
                </div>
              </>
            ) : (
              /* View Mode */
              <>
                {/* Issue Title */}
                <div>
                  <Text size="2" className="text-gray-500 font-medium mb-2 block">
                    Title
                  </Text>
                  <Heading size="6" className="text-gray-900">
                    {issue.title}
                  </Heading>
                </div>

                {/* Issue Description */}
                <div>
                  <Text size="2" className="text-gray-500 font-medium mb-2 block">
                    Description
                  </Text>
                  <div className="prose prose-sm max-w-none">
                    {issue.description ? (
                      <Text size="3" className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {issue.description}
                      </Text>
                    ) : (
                      <Text size="3" className="text-gray-400 italic">
                        No description provided
                      </Text>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Issue Metadata - Only show in view mode */}
            {!isEditing && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status */}
                <div>
                  <Text size="2" className="text-gray-500 font-medium mb-2 block">
                    Status
                  </Text>
                  <StatusBadge status={issue.status} />
                </div>

                {/* Assignee */}
                <div>
                  <Text size="2" className="text-gray-500 font-medium mb-2 block">
                    Assignee
                  </Text>
                  {issue.assignedUser ? (
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={issue.assignedUser.image || ""}
                        fallback={issue.assignedUser.name?.[0] || "?"}
                        size="2"
                        radius="full"
                      />
                      <div>
                        <Text size="3" className="text-gray-900 font-medium">
                          {issue.assignedUser.name || "Unknown"}
                        </Text>
                        <Text size="2" className="text-gray-500">
                          {issue.assignedUser.email}
                        </Text>
                      </div>
                    </div>
                  ) : (
                    <Text size="3" className="text-gray-400">
                      Unassigned
                    </Text>
                  )}
                </div>

                {/* Created */}
                <div>
                  <Text size="2" className="text-gray-500 font-medium mb-2 block">
                    Created
                  </Text>
                  <Text size="3" className="text-gray-700">
                    {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                  </Text>
                  <Text size="2" className="text-gray-500">
                    {new Date(issue.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </div>

                {/* Updated */}
                <div>
                  <Text size="2" className="text-gray-500 font-medium mb-2 block">
                    Last Updated
                  </Text>
                  <Text size="3" className="text-gray-700">
                    {formatDistanceToNow(new Date(issue.updatedAt), { addSuffix: true })}
                  </Text>
                  <Text size="2" className="text-gray-500">
                    {new Date(issue.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        {!isEditing && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <Text size="2" className="text-gray-500">
                  Issue ID: {issue.id.slice(-8)}
                </Text>
                <Text size="1" className="text-gray-400 mt-1">
                  Press E to edit, ESC to close
                </Text>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={onClose}>
                  Close
                </Button>
                <Link href={`/issues/${issue.id}`} onClick={onClose}>
                  <Button variant="outline">
                    View Full Page
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Edit Mode Footer */}
        {isEditing && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <Text size="2" className="text-gray-500">
                  {isDirty ? "You have unsaved changes" : "No changes made"}
                </Text>
                <Text size="1" className="text-gray-400 mt-1">
                  Ctrl+S to save, ESC to cancel
                </Text>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSubmitting || !isDirty}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckIcon className="w-4 h-4 mr-1" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default IssueDrawer;
