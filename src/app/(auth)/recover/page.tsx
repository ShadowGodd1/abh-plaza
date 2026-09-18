"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function RecoverPage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "success">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    setLoading(false);
    if (resetError) {
      setError(resetError.message || "Failed to send reset email. Please try again.");
    } else {
      setStep("success");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <img src="/logo.jpeg" alt="ABH Plaza" className="h-10 w-auto rounded-[var(--radius-md)]" />
        </div>

        {step === "email" && (
          <>
            <h2 className="text-2xl font-semibold text-text-primary mb-2">Account recovery</h2>
            <p className="text-sm text-text-3 mb-8">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-[var(--radius-md)] bg-danger-bg border border-danger/20">
                <p className="text-sm text-danger">{error}</p>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                id="email"
                placeholder="you@abhplaza.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="w-full" loading={loading}>
                Send reset link
              </Button>
            </form>
          </>
        )}

        {step === "success" && (
          <>
            <h2 className="text-2xl font-semibold text-text-primary mb-2">Check your email</h2>
            <p className="text-sm text-text-3 mb-8">
              We&apos;ve sent a password reset link to <span className="font-medium text-text-primary">{email}</span>. Check your inbox and follow the instructions.
            </p>
            <Button
              className="w-full"
              onClick={() => (window.location.href = "/login")}
            >
              Go to sign in
            </Button>
          </>
        )}

        <a
          href="/login"
          className="block text-center text-sm text-gold hover:text-gold-dark mt-6 transition-colors"
        >
          Back to sign in
        </a>
      </div>
    </div>
  );
}
