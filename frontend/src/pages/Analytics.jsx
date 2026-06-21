import React, { useState, useEffect } from "react";
import { Download, FileSpreadsheet, FileJson, FileText, PieChart as PieIcon, BarChart3, LineChart as LineIcon } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import GlassCard from "../components/GlassCard";
import SkeletonLoader from "../components/SkeletonLoader";

const COLORS = ["#6366F1", "#06B6D4", "#10B981", "#A855F7", "#F59E0B", "#EF4444", "#3B82F6", "#EC4899"];

const Analytics = () => {
  const { showToast } = useAuth();
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [downloading, setDownloading] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [catRes, monthRes, weekRes] = await Promise.all([
        api.getCategoryBreakdown(),
        api.getMonthlyTrend(),
        api.getWeeklyTrend(),
      ]);

      setCategoryData(catRes);
      setMonthlyData(monthRes);
      setWeeklyData(weekRes);
    } catch (err) {
      showToast("Failed to load financial visualizations.", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleDownload = async (format) => {
    try {
      setDownloading(format);
      const blob = await api.downloadExport(format);
      
      const fileExtension = format === "excel" ? "xlsx" : format;
      const mimeType = format === "pdf" ? "application/pdf" : format === "excel" ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : "text/csv";
      
      const fileBlob = new Blob([blob], { type: mimeType });
      const url = window.URL.createObjectURL(fileBlob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `Centio_Financial_Report_${Date.now()}.${fileExtension}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      
      window.URL.revokeObjectURL(url);
      showToast(`Successfully exported ${format.toUpperCase()} report!`);
    } catch (err) {
      showToast("Download compilation failed.", "danger");
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <div>
        <div style={{ height: "80px", marginBottom: "32px" }} className="glass-card skeleton-pulse" />
        <div className="grid-cols-2">
          <SkeletonLoader count={1} />
          <SkeletonLoader count={1} />
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in-slide">
      {/* Header section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800 }}>Analytics & Exports</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
            Generate audits and download spreadsheet models
          </p>
        </div>
      </div>

      {/* Export Options Grid */}
      <GlassCard hover={false} style={{ marginBottom: "32px", padding: "24px" }}>
        <h3 style={{ fontSize: "16px", marginBottom: "20px" }}>Export Data Formats</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
          }}
          className="grid-cols-3"
        >
          {/* CSV Card */}
          <div
            onClick={() => handleDownload("csv")}
            className="glass-card"
            style={{
              padding: "20px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              cursor: "pointer",
              background: "rgba(255, 255, 255, 0.02)",
            }}
          >
            <div style={{ color: "var(--text-secondary)", padding: "10px", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: "15px" }}>Comma-Separated Values (CSV)</h4>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
                {downloading === "csv" ? "Exporting..." : "Download raw ledger rows"}
              </p>
            </div>
          </div>

          {/* Excel Card */}
          <div
            onClick={() => handleDownload("excel")}
            className="glass-card"
            style={{
              padding: "20px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              cursor: "pointer",
              background: "rgba(255, 255, 255, 0.02)",
            }}
          >
            <div style={{ color: "#10B981", padding: "10px", background: "rgba(16,185,129,0.1)", borderRadius: "8px" }}>
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: "15px" }}>Excel Worksheet (XLSX)</h4>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
                {downloading === "excel" ? "Exporting..." : "Download formatted tables"}
              </p>
            </div>
          </div>

          {/* PDF Card */}
          <div
            onClick={() => handleDownload("pdf")}
            className="glass-card"
            style={{
              padding: "20px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              cursor: "pointer",
              background: "rgba(255, 255, 255, 0.02)",
            }}
          >
            <div style={{ color: "#EF4444", padding: "10px", background: "rgba(239,68,68,0.1)", borderRadius: "8px" }}>
              <FileText size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: "15px" }}>Structured PDF Audit Report</h4>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
                {downloading === "pdf" ? "Exporting..." : "Download styled statement document"}
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Visual Analytics Layout */}
      <div className="grid-cols-2" style={{ alignItems: "start", marginBottom: "32px" }}>
        {/* Category Breakdown (Pie) */}
        <GlassCard hover={false} style={{ height: "420px", display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontSize: "16px", display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
            <PieIcon size={18} style={{ color: "var(--accent-solid)" }} /> Category Expenditures
          </h3>
          <div style={{ flex: 1, position: "relative" }}>
            {categoryData.length === 0 ? (
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "var(--text-secondary)" }}>
                No expense data recorded.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ category, percentage }) => `${category} (${percentage}%)`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "rgba(15, 23, 42, 0.9)",
                      border: "1px solid var(--glass-border)",
                      borderRadius: "8px",
                      color: "#FFF",
                    }}
                    formatter={(val) => [`$${val.toFixed(2)}`, "Spent"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </GlassCard>

        {/* Monthly Trend (Bar) */}
        <GlassCard hover={false} style={{ height: "420px", display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontSize: "16px", display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
            <BarChart3 size={18} style={{ color: "#10B981" }} /> Income vs Expense Trends
          </h3>
          <div style={{ flex: 1, position: "relative" }}>
            {monthlyData.length === 0 ? (
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "var(--text-secondary)" }}>
                Insufficient transaction periods.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={11} />
                  <YAxis stroke="var(--text-secondary)" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(15, 23, 42, 0.9)",
                      border: "1px solid var(--glass-border)",
                      borderRadius: "8px",
                      color: "#FFF",
                    }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} name="Total Earnings" />
                  <Bar dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} name="Total Outlays" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Weekly details (Line Chart) */}
      <GlassCard hover={false} style={{ height: "350px", display: "flex", flexDirection: "column" }}>
        <h3 style={{ fontSize: "16px", display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
          <LineIcon size={18} style={{ color: "#06B6D4" }} /> Past 7 Days Cash Velocity
        </h3>
        <div style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={11} />
              <YAxis stroke="var(--text-secondary)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "rgba(15, 23, 42, 0.9)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "8px",
                  color: "#FFF",
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={3} name="Earnings Flow" dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={3} name="Outlays Velocity" dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
};

export default Analytics;
