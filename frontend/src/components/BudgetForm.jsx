import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

const BUDGET_CATEGORIES = [
  "Overall",
  "Food",
  "Rent",
  "Entertainment",
  "Shopping",
  "Travel",
  "Utilities",
  "Healthcare",
  "Others",
];

const BudgetForm = ({ isOpen, onClose, budget, onSuccess }) => {
  const { showToast } = useAuth();
  const [category, setCategory] = useState("Overall");
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState("monthly");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (budget) {
      setCategory(budget.category);
      setAmount(budget.amount);
      setPeriod(budget.period);
    } else {
      setCategory("Overall");
      setAmount("");
      setPeriod("monthly");
    }
  }, [budget, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      showToast("Please enter a valid positive limit.", "danger");
      return;
    }

    setSaving(true);
    const payload = {
      category,
      amount: parseFloat(amount),
      period,
    };

    try {
      if (budget) {
        await api.updateBudget(budget.id, payload);
        showToast("Budget limit updated successfully!");
      } else {
        await api.createBudget(payload);
        showToast("Budget limit established successfully!");
      }
      onSuccess();
      onClose();
    } catch (err) {
      showToast(err.message || "Failed to set budget rule.", "danger");
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(9, 13, 26, 0.7)",
        backdropFilter: "blur(8px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
        overflowY: "auto",
      }}
    >
      <div
        className="glass-card"
        style={{
          maxWidth: "400px",
          width: "100%",
          padding: "32px",
          position: "relative",
          margin: "auto",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "24px",
            right: "24px",
            color: "var(--text-secondary)",
          }}
        >
          <X size={20} />
        </button>

        <h3 style={{ marginBottom: "24px", fontSize: "20px" }}>
          {budget ? "Update Budget Limit" : "New Budget Limit"}
        </h3>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Category Select */}
          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: "8px" }}>
              BUDGET SCOPE (CATEGORY)
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-glass"
              disabled={!!budget} // Cannot change category of existing budget rule
              style={{ appearance: "none" }}
            >
              {BUDGET_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Amount input */}
          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: "8px" }}>
              LIMIT AMOUNT ($)
            </label>
            <input
              type="number"
              step="1"
              required
              placeholder="e.g. 500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-glass"
            />
          </div>

          {/* Period Select */}
          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: "8px" }}>
              PERIOD
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="input-glass"
              style={{ appearance: "none" }}
            >
              <option value="monthly" style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}>Monthly</option>
              <option value="weekly" style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}>Weekly</option>
              <option value="yearly" style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}>Yearly</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="btn-glass btn-glass-primary"
            style={{ marginTop: "8px" }}
          >
            {saving ? "Saving..." : budget ? "Save Changes" : "Establish Budget"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default BudgetForm;
