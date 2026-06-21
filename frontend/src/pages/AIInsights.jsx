import React, { useState, useEffect } from "react";
import { BrainCircuit, Sparkles, TrendingUp, AlertCircle, HelpCircle, ArrowRight } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import GlassCard from "../components/GlassCard";
import SkeletonLoader from "../components/SkeletonLoader";

const AIInsights = () => {
  const { showToast } = useAuth();
  const [loading, setLoading] = useState(true);
  const [forecast, setForecast] = useState({});
  const [insights, setInsights] = useState({});

  const fetchAIInsights = async () => {
    try {
      setLoading(true);
      const [foreRes, insRes] = await Promise.all([
        api.getForecast(),
        api.getInsights(),
      ]);

      setForecast(foreRes);
      setInsights(insRes);
    } catch (err) {
      showToast("Failed to compile AI insights report.", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIInsights();
  }, []);

  if (loading) {
    return (
      <div>
        <div style={{ height: "140px", marginBottom: "32px" }} className="glass-card skeleton-pulse" />
        <div className="grid-cols-2">
          <SkeletonLoader count={1} />
          <SkeletonLoader count={1} />
        </div>
      </div>
    );
  }

  const { next_month_forecast = 0, points = [], confidence = "" } = forecast || {};
  const { insights: alertInsights = [], spending_pattern = "", savings_suggestions = [] } = insights || {};

  return (
    <div className="fade-in-slide">
      {/* Top Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800 }}>AI Financial Advisor</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
          Heuristic audits and linear-regression spending projections
        </p>
      </div>

      {/* Large Hero Card: Next Month Forecast Projection */}
      <GlassCard hover={false} style={{ marginBottom: "32px", overflow: "hidden", position: "relative" }}>
        {/* Glow styling ornament */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", zIndex: 10, position: "relative" }} className="grid-cols-2">
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "16px",
                background: "rgba(168, 85, 247, 0.15)",
                border: "1px solid rgba(168, 85, 247, 0.25)",
                color: "#C084FC",
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "16px",
              }}
            >
              <Sparkles size={12} /> Predictive Spending forecast
            </div>
            
            <h2 style={{ fontSize: "40px", fontWeight: 800, letterSpacing: "-0.03em" }}>
              ${next_month_forecast.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "8px", maxWidth: "450px", lineHeight: "1.6" }}>
              Based on historical daily spending velocity, this is your projected total expenditure for the next 30 days. Maintain budget ceilings to match savings goals.
            </p>

            <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
              <div style={{ fontSize: "12px", background: "rgba(255,255,255,0.03)", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--glass-border)" }}>
                <span style={{ color: "var(--text-secondary)", display: "block" }}>MODEL CONFIDENCE</span>
                <span style={{ fontWeight: 700, color: "#FFF", marginTop: "2px", display: "block" }}>{confidence}</span>
              </div>
              <div style={{ fontSize: "12px", background: "rgba(255,255,255,0.03)", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--glass-border)" }}>
                <span style={{ color: "var(--text-secondary)", display: "block" }}>ALGORITHM</span>
                <span style={{ fontWeight: 700, color: "#FFF", marginTop: "2px", display: "block" }}>Least Squares OLS</span>
              </div>
            </div>
          </div>

          {/* Right: Small Projection Mini-Chart */}
          <div style={{ width: "100%", height: "180px", marginTop: "16px" }} className="forecast-mini-chart">
            {points.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={points}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="date" hide={true} />
                  <YAxis hide={true} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(15, 23, 42, 0.9)",
                      border: "1px solid var(--glass-border)",
                      borderRadius: "8px",
                      color: "#FFF",
                      fontSize: "11px",
                    }}
                    formatter={(val) => [`$${val}`, "Projected Spend"]}
                  />
                  <Line type="monotone" dataKey="amount" stroke="#A855F7" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
            <span style={{ display: "block", textAlign: "center", fontSize: "10px", color: "var(--text-muted)", marginTop: "8px" }}>
              Projected day-by-day expenditure rate for next 30 days
            </span>
          </div>
        </div>
      </GlassCard>

      {/* Grid: Left (Insights), Right (Savings Checklist) */}
      <div className="grid-cols-2" style={{ alignItems: "start" }}>
        {/* Left: Behavioral insights list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <GlassCard hover={false}>
            <h3 style={{ fontSize: "16px", display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <BrainCircuit size={18} style={{ color: "var(--accent-solid)" }} /> Behavioral Audit Logs
            </h3>

            {/* Spending pattern summary */}
            <div
              style={{
                background: "rgba(99, 102, 241, 0.05)",
                border: "1px solid rgba(99, 102, 241, 0.15)",
                padding: "16px 20px",
                borderRadius: "8px",
                fontSize: "14px",
                color: "var(--text-primary)",
                lineHeight: "1.6",
                marginBottom: "24px",
              }}
              dangerouslySetInnerHTML={{ __html: spending_pattern.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}
            />

            {/* List of custom warnings */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {alertInsights.map((insight, idx) => {
                const isWarning = insight.type === "warning";
                const isSuggestion = insight.type === "suggestion";
                return (
                  <div
                    key={idx}
                    style={{
                      borderBottom: "1px solid var(--glass-border)",
                      paddingBottom: "16px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <AlertCircle
                        size={15}
                        style={{
                          color: isWarning ? "#EF4444" : isSuggestion ? "#F59E0B" : "#3B82F6",
                        }}
                      />
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          color: isWarning ? "#EF4444" : isSuggestion ? "#F59E0B" : "#3B82F6",
                        }}
                      >
                        {insight.type}
                      </span>
                      {insight.potential_savings && (
                        <span
                          style={{
                            marginLeft: "auto",
                            fontSize: "11px",
                            fontWeight: 700,
                            background: "rgba(16,185,129,0.15)",
                            color: "#10B981",
                            padding: "3px 8px",
                            borderRadius: "4px",
                          }}
                        >
                          Save up to ${insight.potential_savings.toFixed(0)}
                        </span>
                      )}
                    </div>
                    <p
                      style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.5" }}
                      dangerouslySetInnerHTML={{ __html: insight.message.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}
                    />
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Right: Saving Tips / Checklist */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <GlassCard hover={false}>
            <h3 style={{ fontSize: "16px", display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <TrendingUp size={18} style={{ color: "#10B981" }} /> Strategy Recommendations
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {savings_suggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "16px",
                    borderRadius: "8px",
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid var(--glass-border)",
                  }}
                >
                  <div
                    style={{
                      background: "rgba(16, 185, 129, 0.15)",
                      color: "#10B981",
                      padding: "4px",
                      borderRadius: "50%",
                      fontSize: "11px",
                      fontWeight: 700,
                      width: "22px",
                      height: "22px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--text-primary)", lineHeight: "1.5" }}>
                    {suggestion}
                  </p>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: "24px",
                padding: "16px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(6,182,212,0.05) 100%)",
                border: "1px solid rgba(99, 102, 241, 0.1)",
              }}
            >
              <h4 style={{ fontSize: "14px", display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                <HelpCircle size={15} style={{ color: "var(--accent-solid)" }} /> Did you know?
              </h4>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                The OLS regression matches the daily slope of expenditures. A negative slope represents compounding savings velocities, while a positive slope indicates accelerating consumption patterns.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
