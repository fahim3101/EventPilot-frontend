import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin, Tag } from "lucide-react";
import { EventItem } from "@/types";

export default function EventCard({ event }: { event: EventItem }) {
  const dateLabel = new Date(event.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="card flex flex-col h-full overflow-hidden">
      <div className="relative w-full h-40">
        <Image src={event.imageUrl} alt={event.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 25vw" />
        <span className="absolute top-2 left-2 bg-primary text-white text-xs font-semibold px-2 py-1 rounded-full">
          {event.category}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-semibold text-slate-800 line-clamp-1">{event.title}</h3>
        <p className="text-sm text-slate-500 mt-1 line-clamp-2 flex-1">{event.shortDescription}</p>

        <div className="mt-3 space-y-1 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <CalendarDays size={13} /> {dateLabel}
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={13} /> <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-sm font-semibold text-primary">
            {event.price === 0 ? "Free" : `৳${event.price}`}
          </span>
          <Link href={`/events/${event._id}`} className="text-sm font-medium text-secondary hover:underline">
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
