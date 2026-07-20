"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Rocket } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const loggedOutLinks = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/login", label: "Login" },
  ];

  const loggedInLinks = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    { href: "/events/add", label: "Add Event" },
    { href: "/events/manage", label: "Manage Events" },
    { href: "/about", label: "About" },
  ];

  const links = user ? loggedInLinks : loggedOutLinks;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-slate-200">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
          <Rocket size={22} />
          EventPilot <span className="text-accent">AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors ${
                pathname === l.href ? "text-primary" : "text-slate-600 hover:text-primary"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {user && (
            <button onClick={logout} className="text-sm font-medium text-slate-600 hover:text-red-600">
              Logout
            </button>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-slate-200 px-4 py-3 flex flex-col gap-3">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm font-medium text-slate-700">
              {l.label}
            </Link>
          ))}
          {user && (
            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="text-left text-sm font-medium text-red-600"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}
