"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { User } from "@/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function fetchMe() {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMe();
  }, []);

  function persistSession(token: string, u: User) {
    localStorage.setItem("eventpilot_token", token);
    setUser(u);
  }

  async function login(email: string, password: string) {
    const { data } = await api.post("/auth/login", { email, password });
    persistSession(data.token, data.user);
    toast.success(`Welcome back, ${data.user.name}!`);
    router.push("/events");
  }

  async function register(name: string, email: string, password: string) {
    const { data } = await api.post("/auth/register", { name, email, password });
    persistSession(data.token, data.user);
    toast.success("Account created!");
    router.push("/events");
  }

  async function demoLogin() {
    const { data } = await api.post("/auth/demo-login");
    persistSession(data.token, data.user);
    toast.success("Logged in as Demo User");
    router.push("/events");
  }

  async function googleLogin(credential: string) {
    const { data } = await api.post("/auth/google", { credential });
    persistSession(data.token, data.user);
    toast.success(`Welcome, ${data.user.name}!`);
    router.push("/events");
  }

  async function logout() {
    await api.post("/auth/logout");
    localStorage.removeItem("eventpilot_token");
    setUser(null);
    router.push("/");
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, demoLogin, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
