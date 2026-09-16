"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

export default function RecoverPage() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code" | "success">("phone");
  const [loading, setLoading] = useState(false);

  const handleRequestCode = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("code");
    }, 1500);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("success");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <img src="/logo.jpeg" alt="ABH Plaza" className="h-10 w-auto rounded-[var(--radius-md)]" />
        </div>

        {step === "phone" && (
          <>
            <h2 className="text-2xl font-semibold text-text-primary mb-2">Account recovery</h2>
            <p className="text-sm text-text-3 mb-8">
              Enter your phone number and we&apos;ll send you a verification code.
            </p>

            <form onSubmit={handleRequestCode} className="space-y-4">
              <Input
                label="Phone number"
                type="tel"
                id="phone"
                placeholder="07XX XXX XXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <Button type="submit" className="w-full" loading={loading}>
                Send verification code
              </Button>
            </form>
          </>
        )}

        {step === "code" && (
          <>
            <h2 className="text-2xl font-semibold text-text-primary mb-2">Verify code</h2>
            <p className="text-sm text-text-3 mb-8">
              Enter the verification code sent to {phone}.
            </p>

            <form onSubmit={handleVerifyCode} className="space-y-4">
              <Input
                label="Verification code"
                type="text"
                id="code"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <Button type="submit" className="w-full" loading={loading}>
                Verify code
              </Button>
            </form>
          </>
        )}

        {step === "success" && (
          <>
            <h2 className="text-2xl font-semibold text-text-primary mb-2">Password reset</h2>
            <p className="text-sm text-text-3 mb-8">
              Your password has been reset. You can now sign in with your new password.
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
