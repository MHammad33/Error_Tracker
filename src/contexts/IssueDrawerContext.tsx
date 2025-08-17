"use client";

import { Issue, User } from "@prisma/client";
import { createContext, useContext, useState, ReactNode } from "react";

interface IssueWithUser extends Issue {
  assignedUser?: User | null;
}

interface IssueDrawerContextType {
  issue: IssueWithUser | null;
  isOpen: boolean;
  openDrawer: (issue: IssueWithUser) => void;
  closeDrawer: () => void;
  updateIssue: (updatedIssue: IssueWithUser) => void;
}

const IssueDrawerContext = createContext<IssueDrawerContextType | undefined>(undefined);

export const useIssueDrawer = () => {
  const context = useContext(IssueDrawerContext);
  if (!context) {
    throw new Error("useIssueDrawer must be used within an IssueDrawerProvider");
  }
  return context;
};

interface IssueDrawerProviderProps {
  children: ReactNode;
}

export const IssueDrawerProvider = ({ children }: IssueDrawerProviderProps) => {
  const [issue, setIssue] = useState<IssueWithUser | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openDrawer = (issueData: IssueWithUser) => {
    setIssue(issueData);
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
    // Delay resetting issue to allow for exit animation
    setTimeout(() => setIssue(null), 300);
  };

  const updateIssue = (updatedIssue: IssueWithUser) => {
    setIssue(updatedIssue);
  };

  return (
    <IssueDrawerContext.Provider
      value={{
        issue,
        isOpen,
        openDrawer,
        closeDrawer,
        updateIssue,
      }}
    >
      {children}
    </IssueDrawerContext.Provider>
  );
};
