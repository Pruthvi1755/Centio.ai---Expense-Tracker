const BASE_URL = "http://localhost:8000/api/v1";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // TRANSACTIONS
  async getTransactions(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, value);
      }
    });

    const response = await fetch(`${BASE_URL}/transactions/?${query.toString()}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch transactions");
    return response.json();
  },

  async createTransaction(data) {
    const response = await fetch(`${BASE_URL}/transactions/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create transaction");
    return response.json();
  },

  async updateTransaction(id, data) {
    const response = await fetch(`${BASE_URL}/transactions/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update transaction");
    return response.json();
  },

  async deleteTransaction(id) {
    const response = await fetch(`${BASE_URL}/transactions/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete transaction");
    return true;
  },

  // BUDGETS
  async getBudgets() {
    const response = await fetch(`${BASE_URL}/budgets/`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to load budgets");
    return response.json();
  },

  async createBudget(data) {
    const response = await fetch(`${BASE_URL}/budgets/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.detail || "Failed to set budget limit");
    return result;
  },

  async updateBudget(id, data) {
    const response = await fetch(`${BASE_URL}/budgets/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update budget limit");
    return response.json();
  },

  async deleteBudget(id) {
    const response = await fetch(`${BASE_URL}/budgets/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to remove budget configuration");
    return true;
  },

  // ANALYTICS
  async getSummary() {
    const response = await fetch(`${BASE_URL}/analytics/summary`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch dashboard summary");
    return response.json();
  },

  async getCategoryBreakdown() {
    const response = await fetch(`${BASE_URL}/analytics/categories`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch category metrics");
    return response.json();
  },

  async getMonthlyTrend() {
    const response = await fetch(`${BASE_URL}/analytics/monthly-trend`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch monthly balance trends");
    return response.json();
  },

  async getWeeklyTrend() {
    const response = await fetch(`${BASE_URL}/analytics/weekly-trend`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch weekly spending profiles");
    return response.json();
  },

  // AI & FORECAST
  async getForecast() {
    const response = await fetch(`${BASE_URL}/ai/forecast`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to run predictive AI calculations");
    return response.json();
  },

  async getInsights() {
    const response = await fetch(`${BASE_URL}/ai/insights`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to query heuristic insights engine");
    return response.json();
  },

  // DOWNLOAD EXPORTS
  getExportUrl(format) {
    const token = localStorage.getItem("token") || "";
    // Pass JWT token in URL query parameter, but standard fetch download is better.
    // However, since exports return stream files, opening them in new tab or triggering 
    // a fetch-based download is standard. Let's write the trigger functions directly in components
    // for download stream blobs! That is 100% clean and supports Bearer headers safely!
    return `${BASE_URL}/analytics/export/${format}`;
  },

  async downloadExport(format) {
    const response = await fetch(`${BASE_URL}/analytics/export/${format}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to generate export file");
    return response.blob();
  }
};
