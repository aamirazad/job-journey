"use client";

import { useEffect, useState } from "react";
import { JobFilters } from "./job-filters";
import { JobListings } from "./job-listings";
import { type SearchFilters, initialSearchFilters } from "@/schemas";
import { useSearchParams } from "next/navigation";

export function JobSearch() {
  const [filters, setFilters] = useState<SearchFilters>(initialSearchFilters);
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  const updateFilters = (updates: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const clearFilters = () => {
    setFilters(initialSearchFilters);
  };

  useEffect(() => {
    if (search) {
      setFilters((prev) => ({ ...prev, search }));
    } else {
      setFilters(initialSearchFilters);
    }
  }, [search]);

  return (
    <div className="container mx-auto flex flex-col p-4">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">
        Explore Job Opportunities
      </h1>
      <div className="md:flex">
        <JobFilters
          filters={filters}
          onUpdateFilters={updateFilters}
          onClearFilters={clearFilters}
        />
        <JobListings filters={filters} />
      </div>
    </div>
  );
}
