import React, { useState } from "react";
import { BookOpen, Cpu, ShieldCheck, Database, LayoutDashboard, Terminal, CheckCircle2 } from "lucide-react";
import GlassCard from "../components/GlassCard";

const ProjectDocs = () => {
  const [activeSubTab, setActiveSubTab] = useState("architecture"); // architecture, techstack, math, security

  const subTabs = [
    { id: "architecture", label: "🏗️ System Architecture", icon: <LayoutDashboard size={16} /> },
    { id: "techstack", label: "💻 Technical Stack", icon: <Terminal size={16} /> },
    { id: "math", label: "🧮 Predictive Math Logic", icon: <Cpu size={16} /> },
    { id: "security", label: "🔐 Security & Database", icon: <ShieldCheck size={16} /> },
  ];

  const renderContent = () => {
    switch (activeSubTab) {
      case "architecture":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px", color: "#FFFFFF" }}>
              🏗️ Flow Architecture & Data Lifecycle
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6" }}>
              Centio.ai is engineered as a decoupled single-page application (SPA) backed by a high-performance Python ASGI backend service. The diagrams below display how requests navigate through layers of validations, database triggers, and math components.
            </p>

            {/* Custom SVG flow chart */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid var(--glass-border)",
                borderRadius: "16px",
                padding: "24px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflowX: "auto",
              }}
            >
              <svg width="680" height="260" viewBox="0 0 680 260" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* User Browser Node */}
                <rect x="10" y="90" width="120" height="60" rx="12" fill="url(#grad-blue)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <text x="70" y="125" fill="#FFFFFF" fontSize="12" fontWeight="700" textAnchor="middle">React SPA (Vite)</text>
                <text x="70" y="140" fill="rgba(255,255,255,0.7)" fontSize="9" textAnchor="middle">User Interface</text>

                {/* Arrow 1 */}
                <path d="M 130 120 L 190 120" stroke="var(--accent-solid)" strokeWidth="2" strokeDasharray="4 4" />
                <polygon points="190,120 182,116 182,124" fill="var(--accent-solid)" />
                <text x="160" y="112" fill="var(--accent-solid)" fontSize="8" fontWeight="600" textAnchor="middle">HTTPS/JWT</text>

                {/* FastAPI Backend Node */}
                <rect x="200" y="50" width="160" height="140" rx="12" fill="rgba(255,255,255,0.05)" stroke="var(--glass-border)" strokeWidth="1.5" />
                <text x="280" y="75" fill="#FFFFFF" fontSize="13" fontWeight="800" textAnchor="middle">FastAPI Backend</text>
                
                {/* FastAPI Inner Details */}
                <rect x="215" y="95" width="130" height="28" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.3)" />
                <text x="280" y="113" fill="#A5B4FC" fontSize="10" fontWeight="600" textAnchor="middle">Auth & Route Guards</text>
                <rect x="215" y="135" width="130" height="28" rx="6" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.3)" />
                <text x="280" y="153" fill="#6EE7B7" fontSize="10" fontWeight="600" textAnchor="middle">Services & Controllers</text>

                {/* Arrow 2 */}
                <path d="M 360 110 L 420 80" stroke="var(--text-secondary)" strokeWidth="1.5" />
                <polygon points="420,80 411,79 415,87" fill="var(--text-secondary)" />
                <text x="390" y="87" fill="var(--text-secondary)" fontSize="8" textAnchor="middle">OLS Math</text>

                {/* Regression Service Node */}
                <rect x="430" y="40" width="140" height="50" rx="10" fill="rgba(16,185,129,0.05)" stroke="rgba(16,185,129,0.3)" strokeWidth="1" />
                <text x="500" y="68" fill="#6EE7B7" fontSize="11" fontWeight="700" textAnchor="middle">AI Regressor Solver</text>
                <text x="500" y="80" fill="rgba(110,231,183,0.7)" fontSize="8" textAnchor="middle">Linear Regression Math</text>

                {/* Arrow 3 */}
                <path d="M 360 135 L 420 165" stroke="var(--text-secondary)" strokeWidth="1.5" />
                <polygon points="420,165 415,158 411,166" fill="var(--text-secondary)" />
                <text x="390" y="158" fill="var(--text-secondary)" fontSize="8" textAnchor="middle">SQLAlchemy</text>

                {/* Database Node */}
                <rect x="430" y="150" width="140" height="50" rx="10" fill="rgba(99,102,241,0.05)" stroke="rgba(99,102,241,0.3)" strokeWidth="1" />
                <text x="500" y="178" fill="#A5B4FC" fontSize="11" fontWeight="700" textAnchor="middle">PostgreSQL / SQLite</text>
                <text x="500" y="190" fill="rgba(165,180,252,0.7)" fontSize="8" textAnchor="middle">Cascading DB Triggers</text>

                {/* Arrow 4 (PDF export) */}
                <path d="M 360 120 L 450 120" stroke="var(--text-secondary)" strokeWidth="1.5" />
                <polygon points="450,120 442,116 442,124" fill="var(--text-secondary)" />
                <text x="405" y="112" fill="var(--text-secondary)" fontSize="8" textAnchor="middle">PDF Generator</text>

                {/* Report PDF Node */}
                <rect x="460" y="100" width="100" height="40" rx="6" fill="rgba(244,63,94,0.05)" stroke="rgba(244,63,94,0.3)" strokeWidth="1" />
                <text x="510" y="125" fill="#FDA4AF" fontSize="10" fontWeight="700" textAnchor="middle">ReportLab PDF</text>

                {/* Definitions */}
                <defs>
                  <linearGradient id="grad-blue" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#4F46E5" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="grid-cols-2" style={{ marginTop: "16px" }}>
              <GlassCard>
                <h4 style={{ fontSize: "15px", color: "var(--accent-solid)", marginBottom: "8px", fontWeight: 600 }}>
                  Frontend Flow
                </h4>
                <p style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: "1.5" }}>
                  The client side builds stateful dashboards with React using hooks, sharing auth states via contexts. API network layers communicate with FastAPI routers, attaching stateful JWT verification headers dynamically.
                </p>
              </GlassCard>

              <GlassCard>
                <h4 style={{ fontSize: "15px", color: "#10B981", marginBottom: "8px", fontWeight: 600 }}>
                  Backend Processing
                </h4>
                <p style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: "1.5" }}>
                  FastAPI intercepts requests, triggers middleware logging to capture runtimes, validates inputs using strongly typed Pydantic models, runs forecasting calculations, and coordinates database sessions cleanly.
                </p>
              </GlassCard>
            </div>
          </div>
        );

      case "techstack":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px", color: "#FFFFFF" }}>
              💻 Technology Stack & Dependency Layer
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6" }}>
              The system uses premium, modern, open-source technology frameworks chosen to enforce developer safety, high speed, and beautiful visual experiences.
            </p>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", color: "#FFFFFF", fontSize: "13px" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--glass-border)", textAlign: "left" }}>
                    <th style={{ padding: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>Layer / Component</th>
                    <th style={{ padding: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>Technology / Tool</th>
                    <th style={{ padding: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>Key Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid var(--glass-border)" }}>
                    <td style={{ padding: "12px", fontWeight: 700 }}>Frontend Core</td>
                    <td style={{ padding: "12px", color: "#A5B4FC" }}>React.js & Vite</td>
                    <td style={{ padding: "12px", color: "var(--text-secondary)" }}>Ultra-fast Hot Module Replacement (HMR) bundling & declarative view UI.</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--glass-border)" }}>
                    <td style={{ padding: "12px", fontWeight: 700 }}>Styling System</td>
                    <td style={{ padding: "12px", color: "#A5B4FC" }}>Vanilla CSS + CSS Custom Tokens</td>
                    <td style={{ padding: "12px", color: "var(--text-secondary)" }}>Responsive Glassmorphic UI with backdrop-filters and customizable color themes.</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--glass-border)" }}>
                    <td style={{ padding: "12px", fontWeight: 700 }}>Data Visuals</td>
                    <td style={{ padding: "12px", color: "#34D399" }}>Recharts & Lucide Icons</td>
                    <td style={{ padding: "12px", color: "var(--text-secondary)" }}>Interactive graphs (line, pie, area, bar) for weekly and category splits.</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--glass-border)" }}>
                    <td style={{ padding: "12px", fontWeight: 700 }}>Backend API Framework</td>
                    <td style={{ padding: "12px", color: "#60A5FA" }}>FastAPI (Python)</td>
                    <td style={{ padding: "12px", color: "var(--text-secondary)" }}>High speed async handlers, self-documenting OpenAPI Swagger endpoints.</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--glass-border)" }}>
                    <td style={{ padding: "12px", fontWeight: 700 }}>Database Engine</td>
                    <td style={{ padding: "12px", color: "#F472B6" }}>PostgreSQL / SQLite</td>
                    <td style={{ padding: "12px", color: "var(--text-secondary)" }}>Relational schema mapping, local database storage file, zero config setup.</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--glass-border)" }}>
                    <td style={{ padding: "12px", fontWeight: 700 }}>Object Relational Mapper</td>
                    <td style={{ padding: "12px", color: "#F472B6" }}>SQLAlchemy Core & ORM</td>
                    <td style={{ padding: "12px", color: "var(--text-secondary)" }}>Python Database abstraction layer, handling automatic connection pooling.</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--glass-border)" }}>
                    <td style={{ padding: "12px", fontWeight: 700 }}>Statistical AI Core</td>
                    <td style={{ padding: "12px", color: "#FB7185" }}>Ordinary Least Squares (OLS) Solver</td>
                    <td style={{ padding: "12px", color: "var(--text-secondary)" }}>Mathematical matrix-free regression formula written from scratch.</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--glass-border)" }}>
                    <td style={{ padding: "12px", fontWeight: 700 }}>PDF compilation</td>
                    <td style={{ padding: "12px", color: "#FB7185" }}>ReportLab PDF Canvas</td>
                    <td style={{ padding: "12px", color: "var(--text-secondary)" }}>Binary table stream builder compiling ledger transactions into custom reports.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case "math":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px", color: "#FFFFFF" }}>
              🧮 AI Projections & Ordinary Least Squares (OLS) Regression
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6" }}>
              Rather than importing bulky and resource-intensive cloud-hosted AI algorithms, Centio.ai utilizes an active statistical solver built right into the Python service layer using <strong>Ordinary Least Squares (OLS) Linear Regression</strong>.
            </p>

            <div style={{ background: "rgba(255, 255, 255, 0.01)", border: "1px solid var(--glass-border)", padding: "20px", borderRadius: "12px" }}>
              <h4 style={{ fontSize: "15px", color: "#FFFFFF", marginBottom: "12px", fontWeight: 600 }}>The Mathematical Solver</h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: "1.6" }}>
                The algorithm fits a linear path representing daily transactions. Given a series of coordinates where $x$ represents the chronological day offset and $y$ represents the accumulated outflow of that day, we resolve the line $y = mx + c$:
              </p>

              {/* Math Display block */}
              <div style={{ textAlign: "center", margin: "20px 0", padding: "12px", background: "rgba(0,0,0,0.2)", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ fontSize: "18px", color: "#A5B4FC", fontWeight: 700 }}>
                  Slope (m) = <span style={{ fontSize: "14px" }}>[ N∑(xy) - ∑x∑y ] / [ N∑(x²) - (∑x)² ]</span>
                </div>
                <div style={{ fontSize: "18px", color: "#6EE7B7", fontWeight: 700 }}>
                  Intercept (c) = <span style={{ fontSize: "14px" }}>[ ∑y - m∑x ] / N</span>
                </div>
              </div>

              <p style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: "1.6" }}>
                By mapping days offsets (e.g. $1, 2, \dots, N$) onto $x$, and daily expenses on $y$, the backend solves for $m$ (velocity of daily spend) and $c$ (base baseline load).
                It projects this line into the future ($x = N+1, N+2, \dots, N+30$) to construct the forecast. The model also calculates a <strong>Confidence Level (R-Squared coefficient)</strong> to measure data variance and predictability.
              </p>
            </div>

            <GlassCard>
              <h4 style={{ fontSize: "14px", color: "#FFFFFF", marginBottom: "8px", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={16} style={{ color: "#10B981" }} /> Custom AI Heuristic Rules Engine
              </h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: "1.5" }}>
                Parallel to regression curves, the backend executes auditing engines to analyze budget utilization rates. If current transaction velocity predicts a breach of category budget ceiling thresholds before the monthly period ends, warning nodes are pushed to the client notification grid.
              </p>
            </GlassCard>
          </div>
        );

      case "security":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px", color: "#FFFFFF" }}>
              🔐 Cryptographic Protection & Relational Database Design
            </h3>
            
            <div className="grid-cols-2">
              <GlassCard>
                <h4 style={{ fontSize: "15px", color: "#FDA4AF", marginBottom: "12px", fontWeight: 600 }}>
                  PBKDF2 Password Hashing
                </h4>
                <p style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: "1.6", marginBottom: "12px" }}>
                  Centio.ai implements secure password storage using the **PBKDF2-SHA256 (Password-Based Key Derivation Function 2)** standard:
                </p>
                <div style={{ color: "rgba(253,164,175,0.8)", fontSize: "12px", background: "rgba(0,0,0,0.2)", padding: "10px", borderRadius: "6px", fontFamily: "monospace" }}>
                  Iterations: 100,000<br/>
                  Salt: 16-byte random salt<br/>
                  Algorithm: SHA-256 Key derivation
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "12px", lineHeight: "1.5", marginTop: "12px" }}>
                  This mathematically guarantees defense against pre-computed dictionary and rainbow table decryption attacks.
                </p>
              </GlassCard>

              <GlassCard>
                <h4 style={{ fontSize: "15px", color: "#93C5FD", marginBottom: "12px", fontWeight: 600 }}>
                  JWT Bearer Authentication
                </h4>
                <p style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: "1.6", marginBottom: "12px" }}>
                  All protected resources (transactions, limits, PDF exports) require a stateless authentication bearer handshake:
                </p>
                <div style={{ color: "rgba(147,197,253,0.8)", fontSize: "12px", background: "rgba(0,0,0,0.2)", padding: "10px", borderRadius: "6px", fontFamily: "monospace" }}>
                  Authorization: Bearer &lt;Token&gt;
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "12px", lineHeight: "1.5", marginTop: "12px" }}>
                  Tokens expire automatically after 24 hours, signed securely with a `JWT_SECRET` key loaded on the backend.
                </p>
              </GlassCard>
            </div>

            <GlassCard>
              <h4 style={{ fontSize: "15px", color: "#6EE7B7", marginBottom: "8px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
                <Database size={16} /> Relational Cascading Database Enforcement
              </h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: "1.6" }}>
                To maintain database referential integrity, the backend leverages SQLAlchemy ORM schemas mapping User, Transaction, and Budget ceilings. 
                In development environments using SQLite, connection hooks are registered to explicitly execute:
              </p>
              <div style={{ color: "#6EE7B7", fontSize: "12px", background: "rgba(0,0,0,0.2)", padding: "10px", borderRadius: "6px", fontFamily: "monospace", margin: "10px 0" }}>
                PRAGMA foreign_keys=ON;
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: "1.6" }}>
                This guarantees database-level constraints execution—ensuring that removing a user profile automatically performs recursive cascading deletes of all transactions and budget ceilings directly.
              </p>
            </GlassCard>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ padding: "16px 0", maxWidth: "980px", margin: "0 auto" }}>
      {/* Title & Badge */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <div
          style={{
            background: "var(--grad-primary)",
            color: "#FFFFFF",
            padding: "8px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <BookOpen size={22} />
        </div>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.03em", margin: 0 }}>
            Project Reference & System Architecture
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "13px", margin: "4px 0 0" }}>
            An interactive compilation of technical layouts, algorithms, databases, and cryptographic protocols for Viva review.
          </p>
        </div>
      </div>

      {/* Segment Selector tabs */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          background: "var(--glass-bg)",
          border: "1px solid var(--glass-border)",
          padding: "6px",
          borderRadius: "14px",
          marginBottom: "28px",
          overflowX: "auto",
        }}
      >
        {subTabs.map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                transition: "all var(--transition-fast)",
                background: isActive ? "var(--grad-primary)" : "transparent",
                color: isActive ? "#FFFFFF" : "var(--text-secondary)",
                boxShadow: isActive ? "0 4px 12px 0 rgba(99, 102, 241, 0.3)" : "none",
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active Tab Panel */}
      <div
        className="glass-card"
        style={{
          padding: "32px",
          background: "var(--glass-bg)",
          border: "1px solid var(--glass-border)",
          borderRadius: "20px",
          backdropFilter: "blur(20px)",
          minHeight: "400px",
        }}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default ProjectDocs;
