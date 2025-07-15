import React from "react";

const ConflictModal = ({ currentTask, userVersion, onMerge, onOverwrite, onClose }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "10px",
          maxWidth: "800px",
          width: "90%",
          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        }}
      >
        <h2>⚠️ Conflict Detected</h2>
        <p>This task was updated elsewhere. Choose how to proceed:</p>

        <div style={{ display: "flex", gap: "1rem", overflowX: "auto" }}>
          <div style={{ flex: 1 }}>
            <h4>💾 Current Saved Version</h4>
            <p><strong>Title:</strong> {currentTask.title}</p>
            <p><strong>Status:</strong> {currentTask.status}</p>
            <p><strong>Priority:</strong> {currentTask.priority}</p>
            <p><strong>Updated By:</strong> {currentTask.lastUpdatedBy?.username || "N/A"}</p>
          </div>

          <div style={{ flex: 1 }}>
            <h4>📝 Your Version</h4>
            <p><strong>Title:</strong> {userVersion.title}</p>
            <p><strong>Status:</strong> {userVersion.status}</p>
            <p><strong>Priority:</strong> {userVersion.priority}</p>
            <p><strong>Updated By:</strong> You</p>
          </div>
        </div>

        <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
          <button onClick={onMerge} style={{ padding: "10px 14px", background: "#007bff", color: "#fff", border: "none", borderRadius: "6px" }}>
            ✅ Merge
          </button>
          <button onClick={onOverwrite} style={{ padding: "10px 14px", background: "#ffc107", color: "#000", border: "none", borderRadius: "6px" }}>
            🧨 Overwrite
          </button>
          <button onClick={onClose} style={{ padding: "10px 14px", background: "#f0f0f0", color: "#333", border: "1px solid #ccc", borderRadius: "6px" }}>
            ❌ Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConflictModal;
