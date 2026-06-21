import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = [
  "Salary",
  "Freelance",
  "Investments",
  "Food",
  "Rent",
  "Entertainment",
  "Shopping",
  "Travel",
  "Utilities",
  "Healthcare",
  "Others",
];

const TransactionForm = ({ isOpen, onClose, transaction, onSuccess }) => {
  const { showToast } = useAuth();
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);

  // Sync edits
  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setCategory(transaction.category);
      setAmount(transaction.amount);
      setNotes(transaction.notes || "");
      setTags(transaction.tags ? transaction.tags.join(", ") : "");
      
      // Parse ISO date to local datetime input format (YYYY-MM-DDTHH:MM)
      if (transaction.date) {
        const d = new Date(transaction.date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const hour = String(d.getHours()).padStart(2, "0");
        const min = String(d.getMinutes()).padStart(2, "0");
        setDate(`${year}-${month}-${day}T${hour}:${min}`);
      } else {
        setDate("");
      }
    } else {
      setType("expense");
      setCategory("Food");
      setAmount("");
      setDate("");
      setNotes("");
      setTags("");
    }
  }, [transaction, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      showToast("Please enter a valid positive amount.", "danger");
      return;
    }

    setSaving(true);
    
    // Parse tag inputs
    const parsedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      type,
      category,
      amount: parseFloat(amount),
      notes: notes.trim() || null,
      tags: parsedTags,
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
    };

    try {
      if (transaction) {
        await api.updateTransaction(transaction.id, payload);
        showToast("Transaction updated successfully!");
      } else {
        await api.createTransaction(payload);
        showToast("Transaction added successfully!");
      }
      onSuccess();
      onClose();
    } catch (err) {
      showToast(err.message || "Failed to save transaction.", "danger");
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
          maxWidth: "480px",
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
          {transaction ? "Modify Transaction" : "New Transaction"}
        </h3>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Type Toggle */}
          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: "8px" }}>
              TRANSACTION TYPE
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setType("expense")}
                className="btn-glass"
                style={{
                  flex: 1,
                  background: type === "expense" ? "var(--grad-warning)" : "rgba(255,255,255,0.03)",
                  borderColor: type === "expense" ? "transparent" : "var(--glass-border)",
                  color: "#FFFFFF",
                }}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setType("income")}
                className="btn-glass"
                style={{
                  flex: 1,
                  background: type === "income" ? "var(--grad-success)" : "rgba(255,255,255,0.03)",
                  borderColor: type === "income" ? "transparent" : "var(--glass-border)",
                  color: "#FFFFFF",
                }}
              >
                Income
              </button>
            </div>
          </div>

          {/* Amount input */}
          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: "8px" }}>
              AMOUNT ($)
            </label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-glass"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: "8px" }}>
              CATEGORY
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-glass"
              style={{ appearance: "none" }}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Transaction Date */}
          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: "8px" }}>
              TIMESTAMP (OPTIONAL)
            </label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-glass"
            />
          </div>

          {/* Tags */}
          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: "8px" }}>
              TAGS (COMMA SEPARATED)
            </label>
            <input
              type="text"
              placeholder="e.g. food, daily, dinner"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="input-glass"
            />
          </div>

          {/* Notes */}
          <div>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: "8px" }}>
              NOTES / REMARKS
            </label>
            <textarea
              rows={3}
              placeholder="Add details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-glass"
              style={{ resize: "none" }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="btn-glass btn-glass-primary"
            style={{ marginTop: "8px" }}
          >
            {saving ? "Saving..." : transaction ? "Save Changes" : "Create Transaction"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default TransactionForm;
