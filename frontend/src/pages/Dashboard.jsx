import React, { useState, useEffect } from "react";
import { Plus, AlertTriangle, ArrowRight, TrendingUp, PiggyBank, Receipt, Sparkles } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import GlassCard from "../components/GlassCard";
import DashboardWidgets from "../components/DashboardWidgets";
import SkeletonLoader from "../components/SkeletonLoader";
import TransactionForm from "../components/TransactionForm";

const Dashboard = ({ setCurrentTab }) => {
  const { showToast } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({});
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [activeBudgets, setActiveBudgets] = useState([]);
  const [aiAlerts, setAiAlerts] = useState([]);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [sumRes, txsRes, budRes, aiRes] = await Promise.all([
        api.getSummary(),
        api.getTransactions({ limit: 5 }), // API returns sorted, we can list top 5
        api.getBudgets(),
        api.getInsights(),
      ]);

      setSummary(sumRes);
      setRecentTransactions(txsRes.slice(0, 5));
      setActiveBudgets(budRes);
      // Filter warning type insights for dashboard notifications
      setAiAlerts(aiRes.insights.filter((ins) => ins.type === "warning"));
    } catch (err) {
      showToast("Failed to compile dashboard analytics.", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleDeleteTx = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    try {
      await api.deleteTransaction(id);
      showToast("Transaction removed successfully!");
      loadDashboardData();
    } catch (err) {
      showToast("Failed to remove transaction.", "danger");
    }
  };

  if (loading) {
    return (
      <div>
        <SkeletonLoader type="widgets" />
        <div className="grid-cols-3">
          <SkeletonLoader count={1} />
          <SkeletonLoader count={1} />
          <SkeletonLoader count={1} />
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in-slide">
      {/* Upper header action area */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800 }}>Financial Overview</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
            Real-time analytics and predictive projections
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedTx(null);
            setIsFormOpen(true);
          }}
          className="btn-glass btn-glass-primary"
        >
          <Plus size={18} /> Add Transaction
        </button>
      </div>

      {/* Numerical metric widgets */}
      <DashboardWidgets summary={summary} />

      {/* Warning/Limit Notification banners */}
      {aiAlerts.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
          {aiAlerts.map((alert, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                borderColor: "rgba(239, 68, 68, 0.2)",
                background: "rgba(239, 68, 68, 0.05)",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "16px 24px",
              }}
            >
              <AlertTriangle size={20} style={{ color: "#EF4444", flexShrink: 0 }} />
              <p
                style={{ fontSize: "14px", color: "var(--text-primary)", flex: 1 }}
                dangerouslySetInnerHTML={{ __html: alert.message.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Grid: Left column (Recent log), Right column (Budgets overview) */}
      <div className="grid-cols-3" style={{ alignItems: "start" }}>
        {/* Left Column: Recent transactions (2/3 width equivalent) */}
        <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "24px" }} className="dashboard-left-span">
          <GlassCard hover={false}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Receipt size={18} style={{ color: "var(--accent-solid)" }} /> Recent Transactions
              </h3>
              <button
                onClick={() => setCurrentTab("transactions")}
                style={{ fontSize: "12px", color: "var(--accent-solid)", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}
              >
                View All <ArrowRight size={14} />
              </button>
            </div>

            {recentTransactions.length === 0 ? (
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", padding: "20px 0", textAlign: "center" }}>
                No transactions recorded yet. Click "Add Transaction" to start!
              </p>
            ) : (
              <div className="table-container">
                <table className="table-glass">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Category</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((tx) => (
                      <tr key={tx.id}>
                        <td>{new Date(tx.date).toLocaleDateString()}</td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{tx.category}</div>
                          {tx.notes && <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 400 }}>{tx.notes}</div>}
                        </td>
                        <td>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              padding: "4px 8px",
                              borderRadius: "12px",
                              background: tx.type === "expense" ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
                              color: tx.type === "expense" ? "#EF4444" : "#10B981",
                            }}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td style={{ fontWeight: 700, color: tx.type === "expense" ? "#EF4444" : "#10B981" }}>
                          {tx.type === "expense" ? "-" : "+"}${tx.amount.toFixed(2)}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            onClick={() => {
                              setSelectedTx(tx);
                              setIsFormOpen(true);
                            }}
                            style={{ color: "var(--accent-solid)", fontSize: "12px", marginRight: "12px", fontWeight: 600 }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTx(tx.id)}
                            style={{ color: "#EF4444", fontSize: "12px", fontWeight: 600 }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right Column: Active budget scopes (1/3 width) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} className="dashboard-right-span">
          <GlassCard hover={false}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <PiggyBank size={18} style={{ color: "#EF4444" }} /> Budget Utilization
              </h3>
              <button
                onClick={() => setCurrentTab("budgets")}
                style={{ fontSize: "12px", color: "var(--accent-solid)", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}
              >
                Manage <ArrowRight size={14} />
              </button>
            </div>

            {activeBudgets.length === 0 ? (
              <p style={{ color: "var(--text-secondary)", fontSize: "13px", padding: "20px 0", textAlign: "center", lineHeight: "1.5" }}>
                No active budget limits configured yet. Configure category boundaries to monitor leakages!
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {activeBudgets.map((b) => {
                  const percentage = Math.min((b.current_spent / b.amount) * 100, 100);
                  const isOver = b.current_spent >= b.amount;
                  return (
                    <div key={b.id}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                        <span style={{ fontWeight: 600 }}>{b.category.toUpperCase()}</span>
                        <span style={{ color: isOver ? "#EF4444" : "var(--text-secondary)" }}>
                          ${b.current_spent.toFixed(0)} / ${b.amount.toFixed(0)}
                        </span>
                      </div>
                      
                      {/* Bar indicator */}
                      <div
                        style={{
                          height: "6px",
                          width: "100%",
                          background: "rgba(255,255,255,0.05)",
                          borderRadius: "3px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${percentage}%`,
                            background: isOver
                              ? "var(--grad-warning)"
                              : percentage >= 80
                              ? "linear-gradient(90deg, #F59E0B, #EF4444)"
                              : "var(--grad-primary)",
                            borderRadius: "3px",
                            transition: "width 0.5s ease-out",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>
        </div>
      </div>

      {/* Transaction popup form */}
      <TransactionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        transaction={selectedTx}
        onSuccess={loadDashboardData}
      />
    </div>
  );
};

export default Dashboard;
