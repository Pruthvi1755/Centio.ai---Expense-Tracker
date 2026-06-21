import React from "react";
import { ArrowRight, ShieldCheck, Cpu, PieChart, TrendingUp, Sparkles } from "lucide-react";
import GlassCard from "../components/GlassCard";

const LandingPage = ({ onGetStarted }) => {
  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Mesh background effect */}
      <div className="parallax-hero">
        <div className="parallax-layer layer-bg" />
        <div className="parallax-layer layer-fg">
          <div className="container" style={{ textAlign: "center", zIndex: 10 }}>
            {/* AI badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 16px",
                borderRadius: "20px",
                background: "rgba(99, 102, 241, 0.1)",
                border: "1px solid rgba(99, 102, 241, 0.2)",
                color: "var(--accent-solid)",
                fontSize: "12px",
                fontWeight: 700,
                marginBottom: "24px",
              }}
              className="float-anim"
            >
              <Sparkles size={14} /> Powered by Predictive AI Regression Models
            </div>

            {/* Core Titles */}
            <h1
              style={{
                fontSize: "64px",
                fontWeight: 800,
                lineHeight: "1.1",
                letterSpacing: "-0.04em",
                marginBottom: "24px",
                background: "linear-gradient(to right, #FFFFFF, #94A3B8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Take Command of Your Wealth <br />
              With <span style={{ background: "var(--grad-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Predictive Intelligence</span>
            </h1>

            <p
              style={{
                fontSize: "18px",
                color: "var(--text-secondary)",
                maxWidth: "600px",
                margin: "0 auto 40px",
                lineHeight: "1.6",
              }}
            >
              Centio.ai combines glassmorphic tracking grids with statistical regression math to forecast expenses, audit category leakages, and generate custom wealth strategies.
            </p>

            {/* Call to Actions */}
            <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
              <button
                onClick={() => onGetStarted("login")}
                className="btn-glass btn-glass-primary"
                style={{ padding: "16px 32px", fontSize: "16px", borderRadius: "30px" }}
              >
                Launch App Dashboard <ArrowRight size={18} />
              </button>
              <button
                onClick={() => onGetStarted("register")}
                className="btn-glass"
                style={{ padding: "16px 32px", fontSize: "16px", borderRadius: "30px" }}
              >
                Create Free Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature section */}
      <section style={{ padding: "80px 0 120px", position: "relative", zIndex: 10 }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <h2 style={{ fontSize: "36px", fontWeight: 800, marginBottom: "16px" }}>
              Engineered for absolute fiscal command
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "16px" }}>
              All elements built using clean architecture principles, zero third-party tracking, and local math models.
            </p>
          </div>

          <div className="grid-cols-3">
            {/* Feature 1 */}
            <GlassCard delay={0.1}>
              <div
                style={{
                  background: "var(--grad-primary)",
                  color: "#FFFFFF",
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <PieChart size={24} />
              </div>
              <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>Dynamic Visualization</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.5" }}>
                Interactive Recharts components render category splits, weekly transaction patterns, and monthly trend curves in premium dark aesthetics.
              </p>
            </GlassCard>

            {/* Feature 2 */}
            <GlassCard delay={0.2}>
              <div
                style={{
                  background: "var(--grad-accent)",
                  color: "#FFFFFF",
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <Cpu size={24} />
              </div>
              <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>Predictive Forecasting</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.5" }}>
                Python Ordinary Least Squares regression tracks transaction velocity to output next-month spending limits, helping prevent structural deficits.
              </p>
            </GlassCard>

            {/* Feature 3 */}
            <GlassCard delay={0.3}>
              <div
                style={{
                  background: "var(--grad-success)",
                  color: "#FFFFFF",
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>Production Security</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.5" }}>
                Custom PBKDF2 cryptography hashes user records. Authentication secured via stateful JSON Web Tokens (JWT) and request logging middlewares.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
