"use client";

import { Button } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
import classNames from "classnames";

const QuickFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status");

  const filters = [
    { label: "All Issues", value: null },
    { label: "Open", value: "OPEN" },
    { label: "In Progress", value: "IN_PROGRESS" },
    { label: "Closed", value: "CLOSED" },
  ];

  const handleFilterClick = (value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("status", value);
    } else {
      params.delete("status");
    }
    params.set("page", "1"); // Reset to first page when filtering
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {filters.map((filter) => (
        <button
          key={filter.label}
          onClick={() => handleFilterClick(filter.value)}
          className={classNames(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            {
              "bg-violet-100 text-violet-700 shadow-sm": currentStatus === filter.value,
              "bg-gray-100 text-gray-600 hover:bg-gray-200": currentStatus !== filter.value,
            }
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default QuickFilters;
