import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [toasts, setToasts] = useState([]);

  // Toast notifications helper
  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Sync theme to document element
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // On initial mount, fetch user profile if token is available
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/api/v1/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Token expired or invalid
          logout();
        }
      } catch (err) {
        console.error("Failed to load user session:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Authentication credentials failed.");
      }

      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);
      setUser(data.user);
      showToast("Successfully logged in!", "success");
      return true;
    } catch (err) {
      showToast(err.message, "danger");
      throw err;
    }
  };

  const register = async (email, password) => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Registration failed.");
      }

      showToast("Registration successful! Please login.", "success");
      return true;
    } catch (err) {
      showToast(err.message, "danger");
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    showToast("Successfully logged out.", "info");
  };

  const forgotPassword = async (email) => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password: "dummy_password_unused" }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Request failed.");
      }

      showToast("Simulation link written to backend terminal logs!", "success");
      return true;
    } catch (err) {
      showToast(err.message, "danger");
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        theme,
        toggleTheme,
        login,
        register,
        logout,
        forgotPassword,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be called within an AuthProvider");
  }
  return context;
};
