import Link from "next/link";
import { Rocket, Mail, Phone, MapPin, Facebook, Linkedin, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
            <Rocket size={20} className="text-accent" />
            EventPilot AI
          </div>
          <p className="text-sm text-slate-400">
            Discover and plan tech events across Dhaka, with an AI co-pilot for descriptions and event Q&A.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/events" className="hover:text-accent">All Events</Link></li>
            <li><Link href="/events/add" className="hover:text-accent">Add an Event</Link></li>
            <li><Link href="/about" className="hover:text-accent">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-accent">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Mail size={14} /> hello@eventpilot.ai</li>
            <li className="flex items-center gap-2"><Phone size={14} /> +880 1XXX-XXXXXX</li>
            <li className="flex items-center gap-2"><MapPin size={14} /> Dhaka, Bangladesh</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Follow Us</h4>
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-accent"><Facebook size={20} /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-accent"><Linkedin size={20} /></a>
            <a href="https://github.com/fahim3101" target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-accent"><Github size={20} /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} EventPilot AI. Built for the Agentic AI project assignment.
      </div>
    </footer>
  );
}
