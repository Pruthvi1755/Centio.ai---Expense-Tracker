import React from "react";
import { ArrowUpRight, ArrowDownRight, Wallet, Percent } from "lucide-react";
import GlassCard from "./GlassCard";

const DashboardWidgets = ({ summary }) => {
  const { total_income = 0, total_expense = 0, net_balance = 0, savings_rate = 0 } = summary || {};

  // Formatter helper
  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);
  };

  return (
    <div className="grid-cols-4" style={{ marginBottom: "32px" }}>
      {/* Net Balance Card */}
      <GlassCard delay={0.1} hover={true}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Available Balance
            </p>
            <h2 style={{ fontSize: "24px", marginTop: "8px", fontWeight: 800, color: "var(--text-primary)" }}>
              {formatCurrency(net_balance)}
            </h2>
          </div>
          <div
            style={{
              padding: "8px",
              borderRadius: "8px",
              background: "rgba(99, 102, 241, 0.15)",
              color: "var(--accent-solid)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Wallet size={20} />
          </div>
        </div>
      </GlassCard>

      {/* Income Card */}
      <GlassCard delay={0.2} hover={true}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Total Earnings
            </p>
            <h2 style={{ fontSize: "24px", marginTop: "8px", fontWeight: 800, color: "#10B981" }}>
              {formatCurrency(total_income)}
            </h2>
          </div>
          <div
            style={{
              padding: "8px",
              borderRadius: "8px",
              background: "rgba(16, 185, 129, 0.15)",
              color: "#10B981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowUpRight size={20} />
          </div>
        </div>
      </GlassCard>

      {/* Expenses Card */}
      <GlassCard delay={0.3} hover={true}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Total Outlays
            </p>
            <h2 style={{ fontSize: "24px", marginTop: "8px", fontWeight: 800, color: "#EF4444" }}>
              {formatCurrency(total_expense)}
            </h2>
          </div>
          <div
            style={{
              padding: "8px",
              borderRadius: "8px",
              background: "rgba(239, 68, 68, 0.15)",
              color: "#EF4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowDownRight size={20} />
          </div>
        </div>
      </GlassCard>

      {/* Savings Rate Card */}
      <GlassCard delay={0.4} hover={true}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Savings Percentage
            </p>
            <h2 style={{ fontSize: "24px", marginTop: "8px", fontWeight: 800, color: "#06B6D4" }}>
              {savings_rate}%
            </h2>
          </div>
          <div
            style={{
              padding: "8px",
              borderRadius: "8px",
              background: "rgba(6, 182, 212, 0.15)",
              color: "#06B6D4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Percent size={20} />
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default DashboardWidgets;
