import React, { useState } from "react";
import { Wallet, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import GlassCard from "../components/GlassCard";

const Login = ({ onSwitchPage, onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const success = await login(email, password);
      if (success) {
        onSuccess();
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
          <h2 style={{ fontSize: "24px", fontWeight: 800 }}>Welcome Back</h2>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
            Sign in to access your AI financial grid
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
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>
                PASSWORD
              </label>
              <button
                type="button"
                onClick={() => onSwitchPage("forgot-password")}
                style={{ fontSize: "12px", color: "var(--accent-solid)", fontWeight: 600 }}
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {submitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
            Don't have an account?{" "}
            <button
              onClick={() => onSwitchPage("register")}
              style={{ color: "var(--accent-solid)", fontWeight: 600 }}
            >
              Sign Up
            </button>
          </p>
        </div>
      </GlassCard>
    </div>
  );
};

export default Login;
