import React, { useState } from "react";
import { Wallet } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import GlassCard from "../components/GlassCard";

const Register = ({ onSwitchPage }) => {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      const success = await register(email, password);
      if (success) {
        onSwitchPage("login");
      }
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
          <h2 style={{ fontSize: "24px", fontWeight: 800 }}>Create Account</h2>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
            Register to set up predictive savings
          </p>
        </div>

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

          {/* Password input */}
          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: "8px" }}>
              PASSWORD (MIN 6 CHARACTERS)
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-glass"
            />
          </div>

          {/* Confirm Password input */}
          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: "8px" }}>
              CONFIRM PASSWORD
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {submitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
            Already have an account?{" "}
            <button
              onClick={() => onSwitchPage("login")}
              style={{ color: "var(--accent-solid)", fontWeight: 600 }}
            >
              Sign In
            </button>
          </p>
        </div>
      </GlassCard>
    </div>
  );
};

export default Register;
