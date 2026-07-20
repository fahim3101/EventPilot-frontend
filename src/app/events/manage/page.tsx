"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Eye, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { EventItem } from "@/types";
import ProtectedRoute from "@/components/ProtectedRoute";

function ManageEventsContent() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["events", "mine"],
    queryFn: async () => (await api.get<{ events: EventItem[] }>("/events/mine")).data,
  });

  async function handleDelete(id: string) {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    try {
      await api.delete(`/events/${id}`);
      toast.success("Event deleted.");
      queryClient.invalidateQueries({ queryKey: ["events", "mine"] });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not delete event.");
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Your Events</h1>
          <p className="text-slate-500 mt-1">View and remove events you've created.</p>
        </div>
        <Link href="/events/add" className="btn-primary">+ Add New Event</Link>
      </div>

      {isLoading ? (
        <p className="text-slate-500 mt-8 text-center">Loading your events...</p>
      ) : !data?.events.length ? (
        <div className="card p-10 text-center mt-8">
          <p className="text-slate-500">You haven't created any events yet.</p>
          <Link href="/events/add" className="btn-primary inline-block mt-4">Create your first event</Link>
        </div>
      ) : (
        <div className="card mt-8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.events.map((e) => (
                <tr key={e._id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-800">{e.title}</td>
                  <td className="px-4 py-3 text-slate-500">{e.category}</td>
                  <td className="px-4 py-3 text-slate-500">{new Date(e.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-slate-500">{e.price === 0 ? "Free" : `৳${e.price}`}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link href={`/events/${e._id}`} className="text-secondary hover:underline flex items-center gap-1">
                        <Eye size={14} /> View
                      </Link>
                      <button onClick={() => handleDelete(e._id)} className="text-red-600 hover:underline flex items-center gap-1">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function ManageEventsPage() {
  return (
    <ProtectedRoute>
      <ManageEventsContent />
    </ProtectedRoute>
  );
}
