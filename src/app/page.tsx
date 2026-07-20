"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Sparkles, Users, CalendarCheck, TrendingUp, Bot, Search, ShieldCheck, Quote } from "lucide-react";
import { api } from "@/lib/api";
import { EventItem, CategoryStat } from "@/types";
import EventCard from "@/components/EventCard";
import EventCardSkeleton from "@/components/EventCardSkeleton";

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600",
    tag: "AI-powered event discovery",
    title: "Find your next Dhaka tech event, before everyone else does.",
    desc: "Hackathons, workshops, meetups and conferences — searchable, filterable, and paired with an AI co-pilot that writes your event description for you.",
  },
  {
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600",
    tag: "Built for hackathon organizers",
    title: "Host your hackathon and let AI handle the busywork.",
    desc: "Generate a polished event description in seconds, then manage registrations from a clean dashboard.",
  },
  {
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1600",
    tag: "Answers on demand",
    title: "Got a question? Ask the floating AI assistant, anytime.",
    desc: "Context-aware, remembers your conversation, and suggests relevant follow-up questions.",
  },
];

export default function HomePage() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["events", "home"],
    queryFn: async () => (await api.get<{ events: EventItem[] }>("/events?limit=4&sort=date")).data,
  });

  const { data: statsData } = useQuery({
    queryKey: ["events", "category-stats"],
    queryFn: async () => (await api.get<{ stats: CategoryStat[] }>("/events/stats/categories")).data,
  });

  const active = HERO_SLIDES[slide];

  return (
    <div>
      {/* ---------- HERO SECTION (60-70% viewport height, auto-rotating slider) ---------- */}
      <section className="relative h-[65vh] min-h-[420px] flex items-center bg-gradient-to-br from-primary via-primary-600 to-slate-900 text-white overflow-hidden">
        {HERO_SLIDES.map((s, i) => (
          <div
            key={s.image}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === slide ? "opacity-20" : "opacity-0"}`}
          >
            <Image src={s.image} alt="" fill className="object-cover" priority={i === 0} />
          </div>
        ))}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <span className="inline-flex items-center gap-2 bg-white/10 text-accent text-xs font-semibold px-3 py-1 rounded-full mb-4">
            <Sparkles size={14} /> {active.tag}
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold max-w-2xl leading-tight transition-all">
            {active.title}
          </h1>
          <p className="mt-4 text-slate-200 max-w-xl">{active.desc}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/events" className="btn-primary bg-accent hover:bg-accent-600">
              Explore Events
            </Link>
            <Link href="/events/add" className="btn-outline border-white text-white hover:bg-white/10">
              Host an Event
            </Link>
          </div>

          {/* Slider dot indicators */}
          <div className="flex gap-2 mt-10">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all ${i === slide ? "w-8 bg-accent" : "w-2 bg-white/40"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- SECTION 1: STATS ---------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {[
          { label: "Events Hosted", value: "180+", icon: CalendarCheck },
          { label: "Active Members", value: "6,200+", icon: Users },
          { label: "Cities Covered", value: "Dhaka & 3 more", icon: TrendingUp },
          { label: "AI Descriptions Generated", value: "1,400+", icon: Bot },
        ].map((s) => (
          <div key={s.label} className="card p-5">
            <s.icon className="mx-auto text-primary mb-2" size={24} />
            <div className="text-xl font-bold text-slate-800">{s.value}</div>
            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ---------- SECTION 2: EVENTS BY CATEGORY (real Recharts bar chart) ---------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-800">Events by Category</h2>
          <p className="text-sm text-slate-500 mt-1">Live breakdown pulled from the database.</p>
          <div className="h-64 mt-4">
            {statsData?.stats.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statsData.stats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4338CA" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="skeleton w-full h-full" />
            )}
          </div>
        </div>
      </section>

      {/* ---------- SECTION 3: FEATURES ---------- */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-800">Why EventPilot AI</h2>
          <p className="text-center text-slate-500 mt-2 max-w-xl mx-auto">
            Built for organizers and attendees who don't want to waste time.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
            {[
              { icon: Search, title: "Smart Search & Filters", desc: "Filter by category and price, sort by date, and paginate through hundreds of listings instantly." },
              { icon: Bot, title: "AI Description Generator", desc: "Stuck writing a description? Let the AI co-pilot draft one from your title and a few keywords." },
              { icon: Sparkles, title: "Context-Aware Assistant", desc: "Ask the floating AI assistant anything about events, navigation, or how to host your own." },
              { icon: ShieldCheck, title: "Secure Auth", desc: "Email/password, Google Sign-In, and a one-click demo login so you can try it instantly." },
              { icon: CalendarCheck, title: "Manage Your Events", desc: "Add, view, and delete the events you organize from a clean management dashboard." },
              { icon: Users, title: "Community Reviews", desc: "Read real attendee reviews and ratings before you commit your evening." },
            ].map((f) => (
              <div key={f.title} className="card p-6">
                <f.icon className="text-primary mb-3" size={26} />
                <h3 className="font-semibold text-slate-800">{f.title}</h3>
                <p className="text-sm text-slate-500 mt-2">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- SECTION 3: CATEGORIES ---------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-800">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {["Hackathon", "Workshop", "Meetup", "Conference", "Webinar", "Career Fair", "Cultural"].map((c) => (
            <Link
              key={c}
              href={`/events?category=${encodeURIComponent(c)}`}
              className="card p-5 text-center font-medium text-slate-700 hover:text-primary hover:border-primary"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- SECTION 4: FEATURED EVENTS (live data) ---------- */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Upcoming Events</h2>
            <Link href="/events" className="text-sm font-medium text-secondary hover:underline">
              See all →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <EventCardSkeleton key={i} />)
              : data?.events.map((e) => <EventCard key={e._id} event={e} />)}
          </div>
        </div>
      </section>

      {/* ---------- SECTION 5: HOW IT WORKS ---------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-800">How It Works</h2>
        <div className="grid sm:grid-cols-3 gap-6 mt-10">
          {[
            { step: "1", title: "Search & Filter", desc: "Browse events by category, price, and date on the Events page." },
            { step: "2", title: "View Details", desc: "Check the full description, reviews, and related events before deciding." },
            { step: "3", title: "Host Your Own", desc: "Log in, hit Add Event, and let the AI generate your description in seconds." },
          ].map((s) => (
            <div key={s.step} className="card p-6 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-primary text-white flex items-center justify-center font-bold">
                {s.step}
              </div>
              <h3 className="font-semibold text-slate-800 mt-4">{s.title}</h3>
              <p className="text-sm text-slate-500 mt-2">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- SECTION 6: TESTIMONIALS ---------- */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center">What Organizers Say</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[
              { name: "Tasnim Rahman", role: "Hackathon Organizer, DU", quote: "The AI description generator saved me an hour of writing copy for our hackathon listing." },
              { name: "Arif Hossain", role: "Meetup Host, Dhaka Frontend Devs", quote: "Filtering and sorting made it dead simple for attendees to find our monthly meetup." },
              { name: "Nusrat Jahan", role: "Workshop Facilitator", quote: "The chat assistant kept answering FAQs so I didn't have to reply to the same DM twenty times." },
            ].map((t) => (
              <div key={t.name} className="bg-slate-800 rounded-card p-6">
                <Quote className="text-accent mb-3" size={22} />
                <p className="text-sm text-slate-300">{t.quote}</p>
                <div className="mt-4 text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-slate-400">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- SECTION 7: NEWSLETTER + CTA ---------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="card p-10 text-center bg-gradient-to-br from-primary-50 to-white">
          <h2 className="text-2xl font-bold text-slate-800">Never miss a Dhaka tech event again</h2>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">
            Subscribe for a weekly digest of new hackathons, workshops, and meetups.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input type="email" required placeholder="you@example.com" className="input" />
            <button className="btn-primary whitespace-nowrap">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
}
