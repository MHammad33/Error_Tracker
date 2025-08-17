"use client";

import { TableIcon, DashboardIcon } from "@radix-ui/react-icons";
import { useRouter, useSearchParams } from "next/navigation";
import classNames from "classnames";

const ViewToggle = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") || "table";

  const handleViewChange = (view: string) => {
    const params = new URLSearchParams(searchParams);
    if (view === "table") {
      params.delete("view");
    } else {
      params.set("view", view);
    }
    router.replace(`?${params.toString()}`);
  };

  const views = [
    { id: "table", label: "Table", icon: TableIcon },
    { id: "kanban", label: "Kanban", icon: DashboardIcon },
  ];

  return (
    <div className="flex items-center bg-gray-100 rounded-lg p-1">
      {views.map((view) => {
        const Icon = view.icon;
        const isActive = currentView === view.id;

        return (
          <button
            key={view.id}
            onClick={() => handleViewChange(view.id)}
            className={classNames(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
              {
                "bg-white text-violet-700 shadow-sm": isActive,
                "text-gray-600 hover:text-gray-900": !isActive,
              }
            )}
          >
            <Icon className="w-4 h-4" />
            {view.label}
          </button>
        );
      })}
    </div>
  );
};

export default ViewToggle;
