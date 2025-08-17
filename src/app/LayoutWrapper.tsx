"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import MobileSidebar from "@/components/MobileSidebar";
import IssueDrawer from "@/components/IssueDrawer";
import { IssueDrawerProvider, useIssueDrawer } from "@/contexts/IssueDrawerContext";
import Navbar from "./NavBar";
import classNames from "classnames";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapperContent = ({ children }: LayoutWrapperProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { issue, isOpen, closeDrawer, updateIssue } = useIssueDrawer();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <div className={classNames(
        "transition-all duration-300",
        {
          "lg:ml-64": !sidebarCollapsed,
          "lg:ml-16": sidebarCollapsed,
          "ml-0": true, // Always no margin on mobile
        }
      )}>
        {/* Top Navigation for Mobile */}
        <div className="lg:hidden">
          <Navbar onMenuToggle={toggleMobileMenu} />
        </div>

        {/* Desktop Top Bar */}
        <div className="hidden lg:block h-16 bg-white border-b border-gray-200">
          <div className="h-full flex items-center justify-end px-6">
            <Navbar showLogo={false} />
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Issue Drawer */}
      <IssueDrawer
        issue={issue}
        isOpen={isOpen}
        onClose={closeDrawer}
        onIssueUpdated={updateIssue}
      />
    </div>
  );
};

const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  return (
    <IssueDrawerProvider>
      <LayoutWrapperContent>{children}</LayoutWrapperContent>
    </IssueDrawerProvider>
  );
};

export default LayoutWrapper;
