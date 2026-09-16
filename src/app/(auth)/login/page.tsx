"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
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
    <div className="min-h-screen flex">
      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-ink relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink-2 to-ink" />
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="w-16 h-16 rounded-[var(--radius-xl)] bg-gold flex items-center justify-center mb-8">
            <span className="text-ink font-bold text-2xl">ABH</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            ABH PLAZA
          </h1>
          <p className="text-gold/80 text-lg mb-2">
            Property Management System
          </p>
          <p className="text-white/40 text-sm max-w-sm mt-6">
            Professional property management for modern buildings. 
            Manage units, billing, maintenance, and communications 
            from one secure platform.
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute top-20 right-20 w-32 h-32 border border-gold/10 rounded-[var(--radius-xl)] rotate-12" />
      </div>

      {/* Right side - login form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-paper">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-[var(--radius-md)] bg-gold flex items-center justify-center">
              <span className="text-ink font-bold text-sm">ABH</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">ABH PLAZA</p>
              <p className="text-[10px] text-text-3">PROPERTY MANAGEMENT SYSTEM</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-text-primary mb-2">Sign in</h2>
          <p className="text-sm text-text-3 mb-8">
            Enter your credentials to access the system.
          </p>

          {error && (
            <div className="mb-6 p-3 bg-danger-bg border border-danger/20 rounded-[var(--radius-md)]">
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              id="email"
              placeholder="you@abhplaza.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-text-3 hover:text-text-primary transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-text-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border accent-gold"
                />
                Remember me
              </label>
              <a
                href="/recover"
                className="text-sm text-gold hover:text-gold-dark transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={loading}
            >
              Sign in
            </Button>
          </form>

          <p className="text-xs text-text-3 text-center mt-8">
            Secure access for authorized personnel only.
          </p>
        </div>
      </div>
    </div>
  );
}
