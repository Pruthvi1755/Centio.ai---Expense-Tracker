import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ToastContainer from "./components/Toast";
import Layout from "./components/Layout";

// Guest views
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

// Main Dashboard tabs
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Analytics from "./pages/Analytics";
import AIInsights from "./pages/AIInsights";

// Import core stylesheet layouts
import "./styles/variables.css";
import "./styles/global.css";
import "./styles/glass.css";
import "./styles/animations.css";

const MainAppContent = () => {
  const { user, loading } = useAuth();
  const [guestPage, setGuestPage] = useState("landing"); // landing, login, register, forgot-password
  const [currentTab, setCurrentTab] = useState("dashboard"); // dashboard, transactions, budgets, analytics, ai

  // Handle loading skeleton screen
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#090D1A",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            className="skeleton-pulse"
            style={{ width: "64px", height: "64px", borderRadius: "16px", margin: "0 auto 16px" }}
          />
          <div
            className="skeleton-pulse"
            style={{ width: "120px", height: "14px", borderRadius: "4px", margin: "0 auto" }}
          />
        </div>
      </div>
    );
  }

  // Render Guest flow
  if (!user) {
    switch (guestPage) {
      case "login":
        return <Login onSwitchPage={setGuestPage} onSuccess={() => setCurrentTab("dashboard")} />;
      case "register":
        return <Register onSwitchPage={setGuestPage} />;
      case "forgot-password":
        return <ForgotPassword onSwitchPage={setGuestPage} />;
      case "landing":
      default:
        return <LandingPage onGetStarted={setGuestPage} />;
    }
  }

  // Render Dashboard flow
  const renderTabContent = () => {
    switch (currentTab) {
      case "transactions":
        return <Transactions />;
      case "budgets":
        return <Budgets />;
      case "analytics":
        return <Analytics />;
      case "ai":
        return <AIInsights />;
      case "dashboard":
      default:
        return <Dashboard setCurrentTab={setCurrentTab} />;
    }
  };

  return (
    <Layout currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {renderTabContent()}
    </Layout>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <MainAppContent />
      <ToastContainer />
    </AuthProvider>
  );
};

export default App;
