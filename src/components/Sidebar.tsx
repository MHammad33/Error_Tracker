"use client";

import { Box, Flex, Text } from "@radix-ui/themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  ExclamationTriangleIcon,
  GearIcon,
  HamburgerMenuIcon
} from "@radix-ui/react-icons";
import { useState } from "react";
import classNames from "classnames";

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar = ({ isCollapsed = false, onToggle }: SidebarProps) => {
  const currentPath = usePathname();

  const links = [
    {
      href: "/",
      label: "Dashboard",
      icon: HomeIcon,
      isActive: currentPath === "/"
    },
    {
      href: "/issues/list",
      label: "Issues",
      icon: ExclamationTriangleIcon,
      isActive: currentPath.startsWith("/issues")
    },
    {
      href: "/settings",
      label: "Settings",
      icon: GearIcon,
      isActive: currentPath.startsWith("/settings")
    },
  ];

  return (
    <aside className={classNames(
      "fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40",
      {
        "w-64": !isCollapsed,
        "w-16": isCollapsed,
      }
    )}>
      {/* Header */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
        {!isCollapsed && (
          <Text size="4" weight="bold" className="text-gray-900">
            Issue Tracker
          </Text>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <HamburgerMenuIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="mt-6">
        <ul className="space-y-2 px-3">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={classNames(
                    "flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 group",
                    {
                      "bg-violet-50 text-violet-700 shadow-sm": link.isActive,
                      "text-gray-600 hover:bg-gray-50 hover:text-gray-900": !link.isActive,
                    }
                  )}
                >
                  <Icon
                    className={classNames("w-5 h-5 flex-shrink-0", {
                      "text-violet-600": link.isActive,
                      "text-gray-500 group-hover:text-gray-700": !link.isActive,
                    })}
                  />
                  {!isCollapsed && (
                    <Text size="3" weight={link.isActive ? "medium" : "regular"}>
                      {link.label}
                    </Text>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
