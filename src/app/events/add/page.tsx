"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Sparkles, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

const CATEGORIES = ["Hackathon", "Workshop", "Meetup", "Conference", "Webinar", "Career Fair", "Cultural"];

function AddEventForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    shortDescription: "",
    fullDescription: "",
    category: "Workshop",
    date: "",
    location: "",
    price: "0",
    capacity: "50",
    imageUrl: "",
    imageUrls: "",
    tags: "",
  });
  const [keywords, setKeywords] = useState("");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function update(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function generateDescription() {
    if (!form.title || !form.category) {
      return toast.error("Add a title first so the AI knows what to write about.");
    }
    setGenerating(true);
    try {
      const { data } = await api.post("/ai/generate-description", {
        title: form.title,
        category: form.category,
        keywords,
        length,
      });
      update("fullDescription", data.description);
      update("shortDescription", data.description.slice(0, 150));
      toast.success("Description generated! Feel free to edit it.");
    } catch {
      toast.error("AI generation failed. Check your GROQ_API_KEY in the backend .env.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.shortDescription || !form.fullDescription || !form.date || !form.location) {
      return toast.error("Please fill in all required fields.");
    }
    setSubmitting(true);
    try {
      const coverImage = form.imageUrl || "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800";
      const extraImages = form.imageUrls
        ? form.imageUrls.split(",").map((u) => u.trim()).filter(Boolean)
        : [];
      await api.post("/events", {
        ...form,
        price: Number(form.price),
        capacity: Number(form.capacity),
        imageUrl: coverImage,
        images: [coverImage, ...extraImages],
        tags: keywords ? keywords.split(",").map((t) => t.trim()) : [],
      });
      toast.success("Event created!");
      router.push("/events/manage");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not create event.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800">Add a New Event</h1>
      <p className="text-slate-500 mt-1">Fill in the details, or let the AI draft your description.</p>

      <form onSubmit={handleSubmit} className="card p-6 mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Title *</label>
          <input value={form.title} onChange={(e) => update("title", e.target.value)} className="input mt-1" placeholder="Next.js 15 Deep Dive Workshop" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Category *</label>
            <select value={form.category} onChange={(e) => update("category", e.target.value)} className="input mt-1">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Date *</label>
            <input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} className="input mt-1" />
          </div>
        </div>

        {/* AI Content Generator */}
        <div className="border border-dashed border-primary/40 bg-primary-50 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-primary font-medium text-sm">
            <Sparkles size={16} /> AI Description Generator
          </div>
          <input
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="Keywords / tags, comma separated (e.g. react, hands-on, beginners)"
            className="input"
          />
          <div className="flex flex-wrap gap-3 items-center">
            <select value={length} onChange={(e) => setLength(e.target.value as any)} className="input w-40">
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
            <button type="button" onClick={generateDescription} disabled={generating} className="btn-primary flex items-center gap-2">
              {generating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {generating ? "Generating..." : "Generate Description"}
            </button>
            {form.fullDescription && (
              <button type="button" onClick={generateDescription} disabled={generating} className="btn-outline text-sm">
                Regenerate
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Short Description *</label>
          <input value={form.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} maxLength={200} className="input mt-1" placeholder="One-line summary (max 200 chars)" />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Full Description *</label>
          <textarea value={form.fullDescription} onChange={(e) => update("fullDescription", e.target.value)} rows={6} className="input mt-1" placeholder="Full event description" />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Price (৳)</label>
            <input type="number" min={0} value={form.price} onChange={(e) => update("price", e.target.value)} className="input mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Capacity</label>
            <input type="number" min={1} value={form.capacity} onChange={(e) => update("capacity", e.target.value)} className="input mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Location *</label>
            <input value={form.location} onChange={(e) => update("location", e.target.value)} className="input mt-1" placeholder="Venue, area, Dhaka" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Cover Image URL (optional)</label>
          <input value={form.imageUrl} onChange={(e) => update("imageUrl", e.target.value)} className="input mt-1" placeholder="https://..." />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Additional Gallery Images (optional)</label>
          <input
            value={form.imageUrls}
            onChange={(e) => update("imageUrls", e.target.value)}
            className="input mt-1"
            placeholder="Comma-separated URLs, e.g. https://a.jpg, https://b.jpg"
          />
          <p className="text-xs text-slate-400 mt-1">These show up as a thumbnail gallery on the event details page.</p>
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Creating..." : "Submit Event"}
        </button>
      </form>
    </div>
  );
}

export default function AddEventPage() {
  return (
    <ProtectedRoute>
      <AddEventForm />
    </ProtectedRoute>
  );
}
