"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CalendarDays, MapPin, Users, Star, Ticket } from "lucide-react";
import { api } from "@/lib/api";
import { EventItem, Review } from "@/types";
import EventCard from "@/components/EventCard";
import { useAuth } from "@/context/AuthContext";

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: async () =>
      (await api.get<{ event: EventItem; reviews: Review[]; related: EventItem[] }>(`/events/${id}`)).data,
  });

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return toast.error("Please log in to leave a review.");
    setSubmitting(true);
    try {
      await api.post(`/events/${id}/reviews`, { rating, comment });
      toast.success("Review submitted!");
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["event", id] });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not submit review.");
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) {
    return <div className="max-w-5xl mx-auto px-4 py-20 text-center text-slate-500">Loading event...</div>;
  }
  if (!data) {
    return <div className="max-w-5xl mx-auto px-4 py-20 text-center text-slate-500">Event not found.</div>;
  }

  const { event, reviews, related } = data;
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;
  const gallery = event.images && event.images.length > 0 ? event.images : [event.imageUrl];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Media gallery: main image + thumbnail strip (only 1 media API call needed) */}
      <div className="relative w-full h-64 sm:h-80 rounded-card overflow-hidden">
        <Image src={gallery[activeImage]} alt={event.title} fill className="object-cover" priority />
      </div>
      {gallery.length > 1 && (
        <div className="flex gap-3 mt-3 overflow-x-auto pb-1">
          {gallery.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActiveImage(i)}
              className={`relative w-20 h-14 flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                activeImage === i ? "border-primary" : "border-transparent"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image src={src} alt={`${event.title} thumbnail ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4 mt-6">
        <div>
          <span className="text-xs font-semibold bg-primary-100 text-primary px-2 py-1 rounded-full">
            {event.category}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">{event.title}</h1>
          <p className="text-sm text-slate-500 mt-1">Hosted by {event.organizer?.name}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{event.price === 0 ? "Free" : `৳${event.price}`}</div>
          {avgRating && (
            <div className="flex items-center gap-1 text-sm text-slate-500 justify-end mt-1">
              <Star size={14} className="fill-accent text-accent" /> {avgRating} ({reviews.length} reviews)
            </div>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        <div className="card p-4 flex items-center gap-3">
          <CalendarDays className="text-primary" size={20} />
          <div>
            <div className="text-xs text-slate-400">Date</div>
            <div className="text-sm font-medium">{new Date(event.date).toLocaleDateString()}</div>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <MapPin className="text-primary" size={20} />
          <div>
            <div className="text-xs text-slate-400">Location</div>
            <div className="text-sm font-medium">{event.location}</div>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <Users className="text-primary" size={20} />
          <div>
            <div className="text-xs text-slate-400">Capacity</div>
            <div className="text-sm font-medium">{event.attendeesCount} / {event.capacity} registered</div>
          </div>
        </div>
      </div>

      {/* Description */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-800">Overview</h2>
        <p className="text-slate-600 mt-2 leading-relaxed whitespace-pre-line">{event.fullDescription}</p>
      </section>

      {/* Key info */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-800">Key Information</h2>
        <div className="flex flex-wrap gap-2 mt-3">
          {event.tags.map((t) => (
            <span key={t} className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full flex items-center gap-1">
              <Ticket size={12} /> {t}
            </span>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-800">Reviews & Ratings</h2>
        <div className="space-y-4 mt-4">
          {reviews.length === 0 && <p className="text-sm text-slate-500">No reviews yet. Be the first!</p>}
          {reviews.map((r) => (
            <div key={r._id} className="card p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{r.user.name}</span>
                <span className="flex items-center gap-1 text-xs text-accent">
                  <Star size={12} className="fill-accent" /> {r.rating}/5
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-2">{r.comment}</p>
            </div>
          ))}
        </div>

        <form onSubmit={submitReview} className="card p-4 mt-4 space-y-3">
          <label className="text-sm font-medium text-slate-700">Leave a review</label>
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="input w-32">
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} Star{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            placeholder="Share your experience..."
            className="input"
            rows={3}
          />
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </section>

      {/* Related events */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold text-slate-800">Related Events</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mt-4">
            {related.map((e) => (
              <EventCard key={e._id} event={e} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
