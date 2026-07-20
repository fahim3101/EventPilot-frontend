"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

declare global {
  interface Window {
    google?: any;
  }
}

export default function LoginPage() {
  const { login, demoLogin, googleLogin, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const next: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (password.length < 6) next.password = "Password must be at least 6 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Google Identity Services button
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || user) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: any) => {
          try {
            await googleLogin(response.credential);
          } catch {
            toast.error("Google sign-in failed.");
          }
        },
      });
      window.google?.accounts.id.renderButton(document.getElementById("googleBtn"), {
        theme: "outline",
        size: "large",
        width: 320,
      });
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-slate-800 text-center">Welcome back</h1>
        <p className="text-sm text-slate-500 text-center mt-1">Log in to manage and host events.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input mt-1"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input mt-1"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <button
          onClick={async () => {
            try {
              await demoLogin();
            } catch {
              toast.error("Demo login failed. Is the backend running?");
            }
          }}
          className="btn-secondary w-full mt-3"
        >
          Try Demo Login (no signup needed)
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="h-px bg-slate-200 flex-1" />
          <span className="text-xs text-slate-400">or</span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        <div id="googleBtn" className="flex justify-center" />

        <p className="text-sm text-center text-slate-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
