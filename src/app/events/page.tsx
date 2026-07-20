"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { api } from "@/lib/api";
import { EventItem, Pagination } from "@/types";
import EventCard from "@/components/EventCard";
import EventCardSkeleton from "@/components/EventCardSkeleton";

const CATEGORIES = ["Hackathon", "Workshop", "Meetup", "Conference", "Webinar", "Career Fair", "Cultural"];

export default function EventsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "date");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["events", search, category, maxPrice, sort, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      if (maxPrice) params.set("maxPrice", maxPrice);
      params.set("sort", sort);
      params.set("page", String(page));
      params.set("limit", "8");
      const { data } = await api.get<{ events: EventItem[]; pagination: Pagination }>(
        `/events?${params.toString()}`
      );
      return data;
    },
  });

  function applyFilters() {
    setPage(1);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Explore Events</h1>
      <p className="text-slate-500 mt-1">Search, filter, and sort through every event on EventPilot.</p>

      {/* Filters */}
      <div className="card p-4 mt-6 grid grid-cols-1 md:grid-cols-5 gap-3">
        <div className="md:col-span-2 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            placeholder="Search events..."
            className="input pl-9"
          />
        </div>

        <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="input">
          <option value="">Any Price</option>
          <option value="0">Free only</option>
          <option value="500">Under ৳500</option>
          <option value="1000">Under ৳1000</option>
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)} className="input">
          <option value="date">Date (soonest)</option>
          <option value="-date">Date (latest)</option>
          <option value="price">Price (low to high)</option>
          <option value="-price">Price (high to low)</option>
          <option value="newest">Recently added</option>
        </select>

        <button onClick={applyFilters} className="btn-primary md:col-span-5 md:w-fit md:justify-self-end">
          Apply Filters
        </button>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <EventCardSkeleton key={i} />)
          : data?.events.length
          ? data.events.map((e) => <EventCard key={e._id} event={e} />)
          : (
            <p className="col-span-full text-center text-slate-500 py-10">
              No events match your filters. Try widening your search.
            </p>
          )}
      </div>

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: data.pagination.totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-lg text-sm font-medium ${
                page === i + 1 ? "bg-primary text-white" : "border border-slate-300 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
