import React, { useState } from "react";
import { Wallet, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import GlassCard from "../components/GlassCard";

const ForgotPassword = ({ onSwitchPage }) => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      // Toast notification is fired by AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <GlassCard hover={false} className="fade-in-slide" style={{ maxWidth: "420px", width: "100%", padding: "40px" }}>
        {/* Logo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "32px" }}>
          <div
            style={{
              background: "var(--grad-primary)",
              color: "#FFFFFF",
              padding: "10px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
              boxShadow: "0 8px 24px -4px rgba(99, 102, 241, 0.4)",
            }}
          >
            <Wallet size={28} />
          </div>
          <h2 style={{ fontSize: "24px", fontWeight: 800 }}>Reset Password</h2>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px", textAlign: "center" }}>
            Recover account password using simulations
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Email input */}
            <div>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: "8px" }}>
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                required
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-glass"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-glass btn-glass-primary"
              style={{ width: "100%", marginTop: "8px" }}
            >
              {submitting ? "Requesting Reset..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              style={{
                background: "rgba(16, 185, 129, 0.1)",
                color: "#10B981",
                padding: "12px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Reset link generated successfully!
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
              Since this is a simulated local environment, we have logged the recovery link directly in the **backend application console logs**. Look for "Simulation reset link".
            </p>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <button
            onClick={() => onSwitchPage("login")}
            style={{ color: "var(--accent-solid)", fontWeight: 600, fontSize: "13px" }}
          >
            Back to Sign In
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

export default ForgotPassword;
