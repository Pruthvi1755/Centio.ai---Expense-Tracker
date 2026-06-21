import React, { useState, useEffect } from "react";
import { Plus, PiggyBank, Trash2, Edit3, AlertTriangle, CheckCircle } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import GlassCard from "../components/GlassCard";
import SkeletonLoader from "../components/SkeletonLoader";
import BudgetForm from "../components/BudgetForm";

const Budgets = () => {
  const { showToast } = useAuth();
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState([]);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const data = await api.getBudgets();
      setBudgets(data);
    } catch (err) {
      showToast("Failed to fetch budget definitions.", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this budget rule?")) return;
    try {
      await api.deleteBudget(id);
      showToast("Budget rule deleted successfully!");
      fetchBudgets();
    } catch (err) {
      showToast("Failed to remove budget configuration.", "danger");
    }
  };

  return (
    <div className="fade-in-slide">
      {/* Top Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800 }}>Category Budgets</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
            Configure spending ceilings to protect your savings rate
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedBudget(null);
            setIsFormOpen(true);
          }}
          className="btn-glass btn-glass-primary"
        >
          <Plus size={18} /> Establish Budget
        </button>
      </div>

      {/* Grid listing */}
      {loading ? (
        <div className="grid-cols-3">
          <SkeletonLoader count={1} />
          <SkeletonLoader count={1} />
          <SkeletonLoader count={1} />
        </div>
      ) : budgets.length === 0 ? (
        <GlassCard hover={false} style={{ textAlign: "center", padding: "64px" }}>
          <div
            style={{
              display: "inline-flex",
              padding: "16px",
              borderRadius: "50%",
              background: "rgba(99, 102, 241, 0.1)",
              color: "var(--accent-solid)",
              marginBottom: "16px",
            }}
          >
            <PiggyBank size={36} />
          </div>
          <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>No Budget Limits Established</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", maxWidth: "400px", margin: "0 auto 24px", lineHeight: "1.5" }}>
            Add category-specific limits to audit leaks and keep track of budget compliance logs.
          </p>
          <button onClick={() => setIsFormOpen(true)} className="btn-glass btn-glass-primary">
            Create First Budget
          </button>
        </GlassCard>
      ) : (
        <div className="grid-cols-3">
          {budgets.map((b, idx) => {
            const percentage = Math.min((b.current_spent / b.amount) * 100, 100);
            const remaining = Math.max(b.amount - b.current_spent, 0);
            const isOver = b.current_spent >= b.amount;
            const isWarning = !isOver && percentage >= 80;

            return (
              <GlassCard key={b.id} delay={idx * 0.05} hover={true} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Upper line: category & Actions */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ fontSize: "18px", textTransform: "capitalize" }}>{b.category}</h3>
                    <span style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: 700 }}>
                      {b.period} LIMIT
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => {
                        setSelectedBudget(b);
                        setIsFormOpen(true);
                      }}
                      style={{ color: "var(--text-secondary)", padding: "4px" }}
                      title="Edit limit"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      style={{ color: "#EF4444", padding: "4px" }}
                      title="Delete rule"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Mid: Large balance view */}
                <div>
                  <div style={{ fontSize: "28px", fontWeight: 800, color: isOver ? "#EF4444" : "var(--text-primary)" }}>
                    ${b.current_spent.toFixed(2)}
                    <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-secondary)" }}>
                      {" "}
                      spent of ${b.amount.toFixed(0)}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div
                    style={{
                      height: "8px",
                      width: "100%",
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: "4px",
                      overflow: "hidden",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${percentage}%`,
                        background: isOver
                          ? "var(--grad-warning)"
                          : isWarning
                          ? "linear-gradient(90deg, #F59E0B, #EF4444)"
                          : "var(--grad-primary)",
                        borderRadius: "4px",
                        transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-secondary)" }}>
                    <span>{percentage.toFixed(0)}% Utilized</span>
                    <span style={{ fontWeight: 600, color: isOver ? "#EF4444" : remaining > 0 ? "#10B981" : "var(--text-secondary)" }}>
                      {isOver ? "Over budget" : `$${remaining.toFixed(0)} remaining`}
                    </span>
                  </div>
                </div>

                {/* Warning status block */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    background: isOver
                      ? "rgba(239, 68, 68, 0.08)"
                      : isWarning
                      ? "rgba(245, 158, 11, 0.08)"
                      : "rgba(16, 185, 129, 0.08)",
                    color: isOver ? "#EF4444" : isWarning ? "#F59E0B" : "#10B981",
                    border: isOver
                      ? "1px solid rgba(239, 68, 68, 0.15)"
                      : isWarning
                      ? "1px solid rgba(245, 158, 11, 0.15)"
                      : "1px solid rgba(16, 185, 129, 0.15)",
                  }}
                >
                  {isOver ? (
                    <>
                      <AlertTriangle size={14} /> Critical: Budget Limit Exceeded!
                    </>
                  ) : isWarning ? (
                    <>
                      <AlertTriangle size={14} /> Alert: Exceeded 80% ceiling limit.
                    </>
                  ) : (
                    <>
                      <CheckCircle size={14} /> Healthy: Safe margin remaining.
                    </>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Creation popup */}
      <BudgetForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        budget={selectedBudget}
        onSuccess={fetchBudgets}
      />
    </div>
  );
};

export default Budgets;
