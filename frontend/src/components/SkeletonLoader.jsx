import React from "react";

const SkeletonLoader = ({ type = "card", count = 1 }) => {
  const skeletons = Array.from({ length: count });

  if (type === "table") {
    return (
      <div className="table-container">
        <div style={{ padding: "16px", borderBottom: "1px solid var(--glass-border)" }} className="skeleton-pulse">
          <div style={{ height: "16px", width: "40%", borderRadius: "4px" }} className="skeleton-pulse" />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ display: "flex", gap: "16px", padding: "20px 16px" }}>
            <div style={{ height: "14px", width: "20%", borderRadius: "4px" }} className="skeleton-pulse" />
            <div style={{ height: "14px", width: "15%", borderRadius: "4px" }} className="skeleton-pulse" />
            <div style={{ height: "14px", width: "25%", borderRadius: "4px" }} className="skeleton-pulse" />
            <div style={{ height: "14px", width: "10%", marginLeft: "auto", borderRadius: "4px" }} className="skeleton-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (type === "widgets") {
    return (
      <div className="grid-cols-4" style={{ marginBottom: "32px" }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ height: "110px" }} className="glass-card skeleton-pulse" />
        ))}
      </div>
    );
  }

  return (
    <>
      {skeletons.map((_, idx) => (
        <div
          key={idx}
          style={{ height: "180px", width: "100%" }}
          className="glass-card skeleton-pulse"
        />
      ))}
    </>
  );
};

export default SkeletonLoader;
