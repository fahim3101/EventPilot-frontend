"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = "Name must be at least 2 characters.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (form.password.length < 6) next.password = "Password must be at least 6 characters.";
    if (form.password !== form.confirm) next.confirm = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-slate-800 text-center">Create your account</h1>
        <p className="text-sm text-slate-500 text-center mt-1">Start hosting and tracking events in minutes.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {[
            { key: "name", label: "Full Name", type: "text", placeholder: "MD Fahim Rana" },
            { key: "email", label: "Email", type: "email", placeholder: "you@example.com" },
            { key: "password", label: "Password", type: "password", placeholder: "••••••••" },
            { key: "confirm", label: "Confirm Password", type: "password", placeholder: "••••••••" },
          ].map((f) => (
            <div key={f.key}>
              <label className="text-sm font-medium text-slate-700">{f.label}</label>
              <input
                type={f.type}
                value={(form as any)[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className="input mt-1"
                placeholder={f.placeholder}
              />
              {errors[f.key] && <p className="text-xs text-red-600 mt-1">{errors[f.key]}</p>}
            </div>
          ))}
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-center text-slate-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
