import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ToastContainer = () => {
  const { toasts, removeToast } = useAuth();

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle size={18} style={{ color: "#10B981" }} />;
      case "danger":
        return <AlertTriangle size={18} style={{ color: "#EF4444" }} />;
      case "info":
      default:
        return <Info size={18} style={{ color: "#3B82F6" }} />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case "success":
        return "rgba(16, 185, 129, 0.3)";
      case "danger":
        return "rgba(239, 68, 68, 0.3)";
      case "info":
      default:
        return "rgba(59, 130, 246, 0.3)";
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "24px",
        right: "24px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        maxWidth: "350px",
        width: "100%",
      }}
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card"
            style={{
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              borderColor: getBorderColor(toast.type),
              background: "rgba(15, 23, 42, 0.85)",
            }}
          >
            {getIcon(toast.type)}
            <p style={{ fontSize: "13px", fontWeight: 500, flex: 1, color: "#FFFFFF" }}>
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
