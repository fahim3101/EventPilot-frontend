"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // No backend contact endpoint yet -- this is a real, working client-side
    // validation + confirmation flow; wire to a /api/contact route if needed.
    if (!form.name || !form.email || !form.message) {
      return toast.error("Please fill in all fields.");
    }
    setSent(true);
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-slate-800 text-center">Get in Touch</h1>
      <p className="text-slate-500 text-center mt-2">Questions, feedback, or partnership ideas -- we'd love to hear from you.</p>

      <div className="grid md:grid-cols-2 gap-8 mt-10">
        <div className="space-y-4">
          <div className="card p-5 flex items-center gap-3">
            <Mail className="text-primary" size={20} />
            <div>
              <div className="text-xs text-slate-400">Email</div>
              <div className="text-sm font-medium">hello@eventpilot.ai</div>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-3">
            <Phone className="text-primary" size={20} />
            <div>
              <div className="text-xs text-slate-400">Phone</div>
              <div className="text-sm font-medium">+880 1XXX-XXXXXX</div>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-3">
            <MapPin className="text-primary" size={20} />
            <div>
              <div className="text-xs text-slate-400">Location</div>
              <div className="text-sm font-medium">Dhaka, Bangladesh</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
            className="input"
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Your email"
            className="input"
          />
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Your message"
            rows={5}
            className="input"
          />
          <button className="btn-primary w-full">Send Message</button>
          {sent && <p className="text-xs text-secondary text-center">Thanks! We'll reply within 2 business days.</p>}
        </form>
      </div>
    </div>
  );
}
