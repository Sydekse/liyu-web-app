"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(false);
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    setChecking(true);

    const verifyToken = async () => {
      try {
        const response = await fetch("/api/admin/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("token");
        }
      } catch {
        localStorage.removeItem("token");
      } finally {
        setChecking(false);
      }
    };

    verifyToken();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        setIsAuthenticated(true);
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // Cookie clear is best-effort; local session is already gone.
    }
  };

  return (
    <div>
      <Navbar />
      {checking ? (
        <div className="pt-24 pb-16 text-center text-gray-600">
          Checking your session...
        </div>
      ) : isAuthenticated ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <div className="pt-24 pb-16">
          <div className="max-w-md mx-auto px-4">
            <Card className="p-6">
              <h1 className="text-2xl font-bold text-[#532516] mb-6">
                Admin Login
              </h1>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={userName}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error ? <p className="text-sm text-red-600">{error}</p> : null}
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#532516] hover:bg-[#E8982E]"
                >
                  {submitting ? "Signing in..." : "Login"}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
