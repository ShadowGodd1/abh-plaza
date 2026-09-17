"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, ChevronLeft, Smartphone, MessageSquare, CheckCircle, Copy, AlertTriangle } from "lucide-react";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { cn } from "@/lib/utils";

type Step = "method" | "verify" | "success";

const DEMO_BACKUP_CODES = [
  "A7K2-M9X4", "B3L8-N5Y1", "C6P2-Q8R5", "D1S7-T4U9",
  "E5V3-W2X6", "F8Y1-Z3A7", "G2B5-C9D4", "H6E8-F1G3",
];

export default function MfaPage() {
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [step, setStep] = useState<Step>("method");
  const [method, setMethod] = useState<"authenticator" | "sms">("authenticator");
  const [code, setCode] = useState("");
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);

  const handleEnable = () => {
    setStep("method");
    setCode("");
    setShowSetupModal(true);
  };

  const handleVerify = () => {
    if (code.length === 6) {
      setStep("success");
    }
  };

  const handleConfirmEnable = () => {
    setMfaEnabled(true);
    setShowSetupModal(false);
    setStep("method");
    setCode("");
  };

  const handleDisable = () => {
    setMfaEnabled(false);
    setShowDisableConfirm(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-text-3 mb-1">
          <Link href="/dashboard" className="hover:text-gold transition-colors">Dashboard</Link>
          <span>/</span>
          <Link href="/settings" className="hover:text-gold transition-colors">Settings</Link>
          <span>/</span>
          <span className="text-text-primary">MFA</span>
        </div>
        <h1 className="text-2xl font-semibold text-text-primary">Multi-Factor Authentication</h1>
        <p className="text-sm text-text-3 mt-1">Add an extra layer of security to your account.</p>
      </div>

      <div className="bg-surface rounded-[var(--radius-lg)] border border-border p-6">
        <div className="flex items-start gap-4">
          <div className={cn(
            "w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0",
            mfaEnabled ? "bg-success-bg" : "bg-surface-2"
          )}>
            <Shield size={24} className={mfaEnabled ? "text-success" : "text-text-3"} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-text-primary">Multi-Factor Authentication</h2>
            <p className="text-sm text-text-3 mt-1">
              {mfaEnabled
                ? "MFA is currently enabled on your account. An additional verification step is required when signing in."
                : "MFA is not enabled. Add an extra layer of security by requiring a verification code when signing in."}
            </p>
            <div className="mt-4">
              {mfaEnabled ? (
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success-bg border border-success/20">
                    <CheckCircle size={14} className="text-success" />
                    <span className="text-sm font-medium text-success">Enabled</span>
                  </div>
                  <Button variant="danger" size="sm" onClick={() => setShowDisableConfirm(true)}>
                    Disable MFA
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-2">
                    <span className="text-sm font-medium text-text-3">Not enabled</span>
                  </div>
                  <Button size="sm" onClick={handleEnable}>
                    Enable MFA
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Setup Modal */}
      <Modal
        open={showSetupModal}
        onClose={() => { setShowSetupModal(false); setStep("method"); setCode(""); }}
        title={step === "success" ? undefined : "Enable MFA"}
        size="md"
      >
        {step === "method" && (
          <div className="space-y-4">
            <p className="text-sm text-text-3">Choose your preferred verification method.</p>
            <div className="space-y-2">
              <label className={cn(
                "flex items-center gap-3 p-4 rounded-[var(--radius-md)] border cursor-pointer transition-colors",
                method === "authenticator"
                  ? "border-gold bg-gold/5"
                  : "border-border hover:border-gold/50"
              )}>
                <input
                  type="radio"
                  name="mfa-method"
                  value="authenticator"
                  checked={method === "authenticator"}
                  onChange={() => setMethod("authenticator")}
                  className="sr-only"
                />
                <div className={cn(
                  "w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0",
                  method === "authenticator" ? "bg-gold/10" : "bg-surface-2"
                )}>
                  <Smartphone size={20} className={method === "authenticator" ? "text-gold" : "text-text-3"} />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">Authenticator App</p>
                  <p className="text-xs text-text-3">Use Google Authenticator, Authy, or similar app</p>
                </div>
              </label>
              <label className={cn(
                "flex items-center gap-3 p-4 rounded-[var(--radius-md)] border cursor-pointer transition-colors",
                method === "sms"
                  ? "border-gold bg-gold/5"
                  : "border-border hover:border-gold/50"
              )}>
                <input
                  type="radio"
                  name="mfa-method"
                  value="sms"
                  checked={method === "sms"}
                  onChange={() => setMethod("sms")}
                  className="sr-only"
                />
                <div className={cn(
                  "w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0",
                  method === "sms" ? "bg-gold/10" : "bg-surface-2"
                )}>
                  <MessageSquare size={20} className={method === "sms" ? "text-gold" : "text-text-3"} />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">SMS Code</p>
                  <p className="text-xs text-text-3">Receive a code via text message</p>
                </div>
              </label>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="secondary" onClick={() => { setShowSetupModal(false); setStep("method"); }}>
                Cancel
              </Button>
              <Button onClick={() => setStep("verify")}>Continue</Button>
            </div>
          </div>
        )}

        {step === "verify" && (
          <div className="space-y-4">
            <p className="text-sm text-text-3">
              {method === "authenticator"
                ? "Scan the QR code below with your authenticator app, then enter the 6-digit code."
                : "A verification code has been sent to your phone. Enter the 6-digit code below."}
            </p>
            {method === "authenticator" && (
              <div className="flex justify-center">
                <div className="w-48 h-48 bg-surface-2 rounded-[var(--radius-md)] flex items-center justify-center border border-border">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto bg-white rounded-[var(--radius-sm)] flex items-center justify-center">
                      <div className="grid grid-cols-8 gap-px">
                        {Array.from({ length: 64 }).map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              "w-3 h-3",
                              Math.random() > 0.5 ? "bg-ink" : "bg-white"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-text-3 mt-3">Scan with authenticator app</p>
                  </div>
                </div>
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-text-3 uppercase tracking-wider block mb-1.5">Verification Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="w-full h-12 px-4 text-center text-lg tracking-[0.3em] bg-surface border border-border rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-gold font-tabular"
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="secondary" onClick={() => setStep("method")}>
                Back
              </Button>
              <Button disabled={code.length !== 6} onClick={handleVerify}>
                Verify & Enable
              </Button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-success-bg flex items-center justify-center">
              <CheckCircle size={32} className="text-success" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary">MFA Enabled</h3>
            <p className="text-sm text-text-3">
              Multi-factor authentication has been successfully enabled on your account.
            </p>

            <div className="bg-surface-2/50 rounded-[var(--radius-md)] p-4 text-left">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-text-primary">Backup Codes</h4>
                <button
                  onClick={() => navigator.clipboard.writeText(DEMO_BACKUP_CODES.join("\n"))}
                  className="inline-flex items-center gap-1 text-xs text-gold hover:text-gold-dark transition-colors"
                >
                  <Copy size={12} />
                  Copy
                </button>
              </div>
              <p className="text-xs text-text-3 mb-3">
                Save these codes in a secure location. Each code can only be used once.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_BACKUP_CODES.map((c) => (
                  <div key={c} className="bg-surface rounded px-3 py-2 text-sm font-tabular text-text-primary text-center">
                    {c}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-2 text-left bg-warning-bg border border-warning/20 rounded-[var(--radius-md)] p-3">
              <AlertTriangle size={16} className="text-warning mt-0.5 flex-shrink-0" />
              <p className="text-xs text-text-primary">
                Store these backup codes safely. If you lose access to your authenticator device, you can use these codes to sign in.
              </p>
            </div>

            <Button className="w-full" onClick={handleConfirmEnable}>
              Done
            </Button>
          </div>
        )}
      </Modal>

      {/* Disable Confirmation */}
      <Modal
        open={showDisableConfirm}
        onClose={() => setShowDisableConfirm(false)}
        title="Disable MFA"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={20} className="text-danger" />
            </div>
            <div>
              <p className="text-sm text-text-primary">
                Are you sure you want to disable multi-factor authentication?
              </p>
              <p className="text-sm text-text-3 mt-1">
                Your account will be less secure without MFA. You will only need your password to sign in.
              </p>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setShowDisableConfirm(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDisable}>
              Disable MFA
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
