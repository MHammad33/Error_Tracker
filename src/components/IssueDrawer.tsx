"use client";

import { Issue, User } from "@prisma/client";
import { Cross2Icon, Pencil1Icon, CheckIcon, ArrowLeftIcon } from "@radix-ui/react-icons";
import { Avatar, Button, Text, Heading, TextField, Callout } from "@radix-ui/themes";
import { StatusBadge } from "@/components";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { issueSchema } from "@/lib/validationSchema";
import dynamic from "next/dynamic";
import axios from "axios";
import z from "zod";
import Link from "next/link";

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

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setError(null);
    reset({
      title: issue?.title || "",
      description: issue?.description || "",
    });
  }, [issue, reset]);

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
          className="fixed inset-0 bg-black/20 backdrop-blur-md z-40 transition-all duration-500 ease-out"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-4xl bg-white z-50 transform transition-all duration-500 ease-out shadow-2xl border-l border-gray-100 flex flex-col ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}>
        {/* Drawer Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-8 py-6 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            {isEditing && (
              <Button
                variant="ghost"
                size="2"
                onClick={handleCancelEdit}
                className="rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <ArrowLeftIcon className="w-4 h-4" />
              </Button>
            )}
            <div className="flex items-center gap-3">
              <Heading size="6" className="text-gray-900 font-semibold tracking-tight">
                {isEditing ? "Edit Issue" : "Issue Details"}
              </Heading>
              {!isEditing && <StatusBadge status={issue.status} />}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="3"
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                  className="rounded-lg hover:bg-gray-100 text-gray-600 transition-all duration-200 font-medium"
                >
                  Cancel
                </Button>
                <Button
                  size="3"
                  onClick={handleSave}
                  disabled={isSubmitting || !isDirty}
                  className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg font-medium"
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
                      <CheckIcon className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="3"
                  onClick={handleEdit}
                  className="rounded-lg hover:bg-gray-100 text-gray-600 transition-all duration-200 font-medium"
                >
                  <Pencil1Icon className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="3"
                  onClick={onClose}
                  className="rounded-full hover:bg-gray-100 text-gray-500 transition-all duration-200"
                >
                  <Cross2Icon className="w-5 h-5" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100/50">
          <div className="p-8 pb-16 space-y-8">
            {error && (
              <Callout.Root color="red" className="mb-8 rounded-xl shadow-sm border-red-200">
                <Callout.Text className="font-medium">{error}</Callout.Text>
              </Callout.Root>
            )}

            <div className="space-y-8">
              {isEditing ? (
                /* Edit Mode */
                <>
                  {/* Title Input */}
                  <div className="group">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
                      <label className="block text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                        Title *
                      </label>
                      <TextField.Root
                        placeholder="Enter a clear and descriptive title..."
                        className="w-full bg-gray-50 border-gray-200 focus:border-violet-300 focus:ring-violet-100 rounded-lg"
                        {...register("title")}
                      />
                      {errors.title && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <Text size="2" className="text-red-700 font-medium">
                            {errors.title.message}
                          </Text>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description Input */}
                  <div className="group">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
                      <label className="block text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                        Description
                      </label>
                      <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                        <Controller
                          name="description"
                          control={control}
                          render={({ field }) => (
                            <SimpleMDE
                              placeholder="Provide a detailed description of the issue, including steps to reproduce, expected behavior, and any relevant context..."
                              {...field}
                              options={{
                                autofocus: false,
                                spellChecker: false,
                                minHeight: "250px",
                                toolbar: [
                                  "bold", "italic", "heading", "|",
                                  "quote", "unordered-list", "ordered-list", "|",
                                  "link", "preview", "side-by-side"
                                ],
                              }}
                            />
                          )}
                        />
                      </div>
                      {errors.description && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <Text size="2" className="text-red-700 font-medium">
                            {errors.description.message}
                          </Text>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                /* View Mode */
                <>
                  {/* Issue Title */}
                  <div className="group">
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-3 h-3 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"></div>
                        <Text size="2" className="text-violet-600 font-bold uppercase tracking-wider text-xs">
                          Issue Title
                        </Text>
                      </div>
                      <Heading size="7" className="text-gray-900 leading-relaxed font-bold tracking-tight">
                        {issue.title}
                      </Heading>
                    </div>
                  </div>

                  {/* Issue Description */}
                  <div className="group">
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-3 h-3 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"></div>
                        <Text size="2" className="text-violet-600 font-bold uppercase tracking-wider text-xs">
                          Description
                        </Text>
                      </div>
                      <div className="prose prose-lg max-w-none">
                        {issue.description ? (
                          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap bg-gradient-to-br from-gray-50 to-gray-100/50 p-6 rounded-xl border border-gray-200 shadow-sm">
                            {issue.description}
                          </div>
                        ) : (
                          <div className="text-gray-400 italic bg-gradient-to-br from-gray-50 to-gray-100/50 p-8 rounded-xl border border-dashed border-gray-300 text-center">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Text className="text-gray-400 text-lg">📝</Text>
                            </div>
                            No description provided
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Issue Metadata - Only show in view mode */}
              {!isEditing && (
                <div className="group">
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-3 h-3 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"></div>
                      <Text size="2" className="text-violet-600 font-bold uppercase tracking-wider text-xs">
                        Issue Metadata
                      </Text>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Status */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-6 rounded-xl border border-blue-200 hover:shadow-md hover:border-blue-300 transition-all duration-200">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <Text size="2" className="text-gray-600 font-semibold">
                            Status
                          </Text>
                        </div>
                        <div className="min-h-[48px] flex items-center">
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0">
                              <StatusBadge status={issue.status} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Assignee */}
                      <div className="bg-gradient-to-br from-emerald-50 to-green-50/50 p-6 rounded-xl border border-emerald-200 hover:shadow-md hover:border-emerald-300 transition-all duration-200">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <Text size="2" className="text-gray-600 font-semibold">
                            Assignee
                          </Text>
                        </div>
                        {issue.assignedUser ? (
                          <div className="flex items-center gap-4 min-h-[48px]">
                            <div className="flex-shrink-0">
                              <div className="relative">
                                <Avatar
                                  src={issue.assignedUser.image || ""}
                                  fallback={issue.assignedUser.name?.[0] || "?"}
                                  size="4"
                                  radius="full"
                                  className="ring-2 ring-white shadow-lg"
                                />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <Text size="3" className="text-emerald-900 font-semibold truncate">
                                {issue.assignedUser.name || "Unknown"}
                              </Text>
                              <Text size="2" className="text-emerald-700 truncate mt-1">
                                {issue.assignedUser.email}
                              </Text>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4 min-h-[48px]">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-sm border-2 border-dashed border-gray-300">
                                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                  <Text size="1" className="text-gray-500 font-bold">?</Text>
                                </div>
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <Text size="3" className="text-emerald-700 font-semibold">
                                Unassigned
                              </Text>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Created */}
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-6 rounded-xl border border-amber-200 hover:shadow-md hover:border-amber-300 transition-all duration-200">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <Text size="2" className="text-gray-600 font-semibold">
                            Created
                          </Text>
                        </div>
                        <div className="min-h-[48px]">
                          <Text size="3" className="text-amber-900 font-semibold">
                            {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                          </Text>
                          <Text size="2" className="text-amber-700 mt-2 block">
                            {new Date(issue.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Text>
                        </div>
                      </div>

                      {/* Updated */}
                      <div className="bg-gradient-to-br from-purple-50 to-violet-50/50 p-6 rounded-xl border border-purple-200 hover:shadow-md hover:border-purple-300 transition-all duration-200">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <Text size="2" className="text-gray-600 font-semibold">
                            Last Updated
                          </Text>
                        </div>
                        <div className="min-h-[48px]">
                          <Text size="3" className="text-purple-900 font-semibold">
                            {formatDistanceToNow(new Date(issue.updatedAt), { addSuffix: true })}
                          </Text>
                          <Text size="2" className="text-purple-700 mt-2 block">
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
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        {!isEditing && (
          <div className="flex-shrink-0 p-8 border-t border-gray-100 bg-white/95 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 rounded-xl border border-gray-200 shadow-sm">
                <Text size="2" className="text-gray-700 font-semibold">
                  Issue ID: #{issue.id.slice(-8)}
                </Text>
                <Text size="1" className="text-gray-500 mt-1 flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs font-mono">E</kbd>
                  to edit •
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs font-mono">ESC</kbd>
                  to close
                </Text>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="3"
                  onClick={onClose}
                  className="rounded-lg hover:bg-gray-100 text-gray-600 transition-all duration-200 font-medium"
                >
                  Close
                </Button>
                <Link href={`/issues/${issue.id}`} onClick={onClose}>
                  <Button
                    variant="outline"
                    size="3"
                    className="rounded-lg border-violet-200 text-violet-600 hover:bg-violet-50 hover:border-violet-300 transition-all duration-200 font-medium shadow-sm"
                  >
                    View Full Page
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Edit Mode Footer */}
        {isEditing && (
          <div className="flex-shrink-0 p-8 border-t border-gray-100 bg-white/95 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className={`px-4 py-3 rounded-xl border shadow-sm transition-all duration-200 ${isDirty
                ? "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200"
                : "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200"
                }`}>
                <Text size="2" className={`font-semibold ${isDirty ? "text-orange-700" : "text-gray-700"
                  }`}>
                  {isDirty ? "⚠️ Unsaved changes" : "✅ No changes made"}
                </Text>
                <Text size="1" className="text-gray-500 mt-1 flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs font-mono">Ctrl+S</kbd>
                  to save •
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs font-mono">ESC</kbd>
                  to cancel
                </Text>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="3"
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                  className="rounded-lg hover:bg-gray-100 text-gray-600 transition-all duration-200 font-medium"
                >
                  Cancel
                </Button>
                <Button
                  size="3"
                  onClick={handleSave}
                  disabled={isSubmitting || !isDirty}
                  className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg font-medium"
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
                      <CheckIcon className="w-4 h-4 mr-2" />
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
