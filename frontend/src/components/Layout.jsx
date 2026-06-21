import React from "react";
import { LogOut, Sun, Moon, LayoutDashboard, Receipt, PiggyBank, BarChart3, BrainCircuit, Wallet } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children, currentTab, setCurrentTab }) => {
  const { user, logout, theme, toggleTheme } = useAuth();

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "transactions", label: "Transactions", icon: <Receipt size={18} /> },
    { id: "budgets", label: "Budgets", icon: <PiggyBank size={18} /> },
    { id: "analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
    { id: "ai", label: "AI Advisor", icon: <BrainCircuit size={18} /> },
  ];

  return (
    <div className="app-layout">
      {/* Premium Top Navigation Bar */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "70px",
          background: "var(--glass-bg)",
          borderBottom: "1px solid var(--glass-border)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
        }}
      >
        {/* Branding Brand logo */}
        <div
          onClick={() => setCurrentTab("dashboard")}
          style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
        >
          <div
            style={{
              background: "var(--grad-primary)",
              color: "#FFFFFF",
              padding: "6px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px 0 rgba(99, 102, 241, 0.3)",
            }}
          >
            <Wallet size={20} />
          </div>
          <span style={{ fontWeight: 800, fontSize: "18px", letterSpacing: "-0.03em" }}>
            Centio<span style={{ color: "var(--accent-solid)" }}>.ai</span>
          </span>
        </div>

        {/* Mid-Navigation tabs */}
        <div style={{ display: "flex", gap: "8px", height: "100%", alignItems: "center" }} className="nav-links-container">
          {navigationItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: 600,
                  transition: "all var(--transition-fast)",
                  background: isActive ? "rgba(255, 255, 255, 0.06)" : "transparent",
                  color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                  border: isActive ? "1px solid var(--glass-border)" : "1px solid transparent",
                }}
              >
                {item.icon}
                <span className="nav-label-text">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right side user options */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* User profile identifier (hidden on tiny screens) */}
          {user && (
            <span
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                fontWeight: 500,
                background: "rgba(255, 255, 255, 0.03)",
                padding: "6px 12px",
                borderRadius: "12px",
                border: "1px solid var(--glass-border)",
              }}
              className="user-profile-tag"
            >
              {user.email}
            </span>
          )}

          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            style={{
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--glass-border)",
              transition: "transform var(--transition-fast)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "rotate(15deg)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "rotate(0deg)")}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Logout button */}
          <button
            onClick={logout}
            style={{
              color: "#EF4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px",
              borderRadius: "50%",
              background: "rgba(239, 68, 68, 0.05)",
              border: "1px solid rgba(239, 68, 68, 0.15)",
              transition: "all var(--transition-fast)",
            }}
            title="Log Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      {/* Main content body spacing */}
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
