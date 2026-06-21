import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, ArrowDownWideNarrow, Trash2, Edit3, X } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import GlassCard from "../components/GlassCard";
import SkeletonLoader from "../components/SkeletonLoader";
import TransactionForm from "../components/TransactionForm";

const Transactions = () => {
  const { showToast } = useAuth();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  
  // Search & Filter state
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Sorting state
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Popup form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = {
        search,
        type,
        category,
        tag,
        start_date: startDate ? new Date(startDate).toISOString() : undefined,
        end_date: endDate ? new Date(endDate).toISOString() : undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
      };

      const data = await api.getTransactions(params);
      setTransactions(data);
    } catch (err) {
      showToast("Failed to fetch transactions list.", "danger");
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when parameters or filters update
  useEffect(() => {
    fetchTransactions();
  }, [type, category, sortBy, sortOrder, startDate, endDate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTransactions();
  };

  const handleResetFilters = () => {
    setSearch("");
    setType("");
    setCategory("");
    setTag("");
    setStartDate("");
    setEndDate("");
    setSortBy("date");
    setSortOrder("desc");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    try {
      await api.deleteTransaction(id);
      showToast("Transaction deleted successfully!");
      fetchTransactions();
    } catch (err) {
      showToast("Failed to delete transaction.", "danger");
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
          <h1 style={{ fontSize: "28px", fontWeight: 800 }}>Transactions</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
            Query, manage, and audit your monetary cashflows
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedTx(null);
            setIsFormOpen(true);
          }}
          className="btn-glass btn-glass-primary"
        >
          <Plus size={18} /> New Transaction
        </button>
      </div>

      {/* Filter panel */}
      <GlassCard hover={false} style={{ marginBottom: "32px", padding: "24px" }}>
        <form onSubmit={handleSearchSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Row 1: Global search & filter values */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr 100px",
              gap: "12px",
              alignItems: "center",
            }}
            className="grid-cols-4" // Responsive fallback
          >
            {/* Search */}
            <div style={{ position: "relative" }}>
              <Search
                size={16}
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }}
              />
              <input
                type="text"
                placeholder="Search notes, category, tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-glass"
                style={{ paddingLeft: "36px" }}
              />
            </div>

            {/* Type */}
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="input-glass"
              style={{ appearance: "none" }}
            >
              <option value="">All Types</option>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            {/* Category */}
            <input
              type="text"
              placeholder="Filter Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-glass"
            />

            {/* Tag */}
            <input
              type="text"
              placeholder="Filter Tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="input-glass"
            />

            {/* Reset */}
            <button type="button" onClick={handleResetFilters} className="btn-glass" style={{ padding: "12px 0", width: "100%" }}>
              Reset
            </button>
          </div>

          {/* Row 2: Date constraints & sorting */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              gap: "12px",
            }}
            className="grid-cols-4"
          >
            <div>
              <label style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                START DATE
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-glass"
              />
            </div>
            
            <div>
              <label style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                END DATE
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input-glass"
              />
            </div>

            <div>
              <label style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                SORT BY
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-glass"
                style={{ appearance: "none" }}
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                DIRECTION
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="input-glass"
                style={{ appearance: "none" }}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
          
          {/* Submit Search */}
          <button type="submit" style={{ display: "none" }} />
        </form>
      </GlassCard>

      {/* Transactions Table Log */}
      {loading ? (
        <SkeletonLoader type="table" />
      ) : transactions.length === 0 ? (
        <GlassCard hover={false} style={{ textAlign: "center", padding: "48px" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>
            No transactions matched your filtering criteria.
          </p>
        </GlassCard>
      ) : (
        <GlassCard hover={false} style={{ padding: "0" }}>
          <div className="table-container">
            <table className="table-glass">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Tags</th>
                  <th>Amount</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>
                        {new Date(tx.date).toLocaleDateString()}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                        {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{tx.category}</div>
                      {tx.notes && <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 400, marginTop: "2px" }}>{tx.notes}</div>}
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: "10px",
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
                    <td>
                      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                        {tx.tags && tx.tags.length > 0 ? (
                          tx.tags.map((tag_name) => (
                            <span
                              key={tag_name}
                              style={{
                                fontSize: "10px",
                                background: "rgba(255, 255, 255, 0.05)",
                                padding: "3px 8px",
                                borderRadius: "4px",
                                border: "1px solid var(--glass-border)",
                                color: "var(--text-secondary)",
                              }}
                            >
                              {tag_name}
                            </span>
                          ))
                        ) : (
                          <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>-</span>
                        )}
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, fontSize: "15px", color: tx.type === "expense" ? "#EF4444" : "#10B981" }}>
                      {tx.type === "expense" ? "-" : "+"}${tx.amount.toFixed(2)}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                        <button
                          onClick={() => {
                            setSelectedTx(tx);
                            setIsFormOpen(true);
                          }}
                          style={{
                            color: "var(--text-secondary)",
                            padding: "8px",
                            borderRadius: "50%",
                            border: "1px solid var(--glass-border)",
                            background: "rgba(255,255,255,0.02)",
                            display: "flex",
                            alignItems: "center",
                          }}
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(tx.id)}
                          style={{
                            color: "#EF4444",
                            padding: "8px",
                            borderRadius: "50%",
                            border: "1px solid rgba(239, 68, 68, 0.15)",
                            background: "rgba(239, 68, 68, 0.02)",
                            display: "flex",
                            alignItems: "center",
                          }}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Creation popup */}
      <TransactionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        transaction={selectedTx}
        onSuccess={fetchTransactions}
      />
    </div>
  );
};

export default Transactions;
