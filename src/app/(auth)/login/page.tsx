"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import "@/app/abh-plaza-brand.css";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("The details you entered are incorrect.");
      setLoading(false);
      return;
    }

    const role = data.user?.user_metadata?.role || data.user?.app_metadata?.role;

    if (role === "tenant") {
      router.push("/tenant/home");
    } else if (role === "owner") {
      router.push("/owner/home");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="abh-login-page">
      {/* Brand panel */}
      <section className="abh-brand-panel" aria-label="ABH Plaza">
        <div className="abh-brand-content">
          <img className="abh-logo" src="/favicon.png" alt="ABH Plaza" />
          <p className="abh-tagline">
            Professional property management for modern buildings. Manage units,
            billing, maintenance, and communications from one secure platform.
          </p>
        </div>
      </section>

      {/* Auth panel */}
      <main className="abh-auth-panel">
        <section className="abh-auth-card" aria-labelledby="login-title">
          <h1 id="login-title">Sign in</h1>
          <p className="abh-auth-subtitle">
            Enter your credentials to access the system.
          </p>

          {error && (
            <div style={{ marginBottom: 24, padding: "12px 16px", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10 }}>
              <p style={{ margin: 0, color: "#dc2626", fontSize: 14 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="abh-field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="you@abhplaza.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="abh-field" style={{ position: "relative" }}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{ paddingRight: 48 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: 38,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#85827a",
                  padding: 4,
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="abh-form-row">
              <label className="abh-remember">
                <input type="checkbox" className="abh-checkbox" />
                Remember me
              </label>
              <a href="/recover" className="abh-forgot">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="abh-submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="abh-security-note">
            Secure access for authorized personnel only.
          </p>
        </section>
      </main>
    </div>
  );
}
