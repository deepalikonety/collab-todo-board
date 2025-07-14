import React, { useEffect, useState, useContext,useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import io from "socket.io-client";


const socket = io(process.env.REACT_APP_BASE_URL, {
  transports: ["websocket"], 
  withCredentials: true      
});

const ActivityLog = () => {
  const { token } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);

  const fetchLogs = useCallback(async() => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/tasks/logs/recent`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error("❌ Failed to fetch logs:", err);
    }
  },[token]);

  useEffect(() => {
    fetchLogs(); 
    socket.on("taskCreated", fetchLogs);
    socket.on("taskUpdated", fetchLogs);
    socket.on("taskDeleted", fetchLogs);

    return () => {
      socket.off("taskCreated", fetchLogs);
      socket.off("taskUpdated", fetchLogs);
      socket.off("taskDeleted", fetchLogs);
    };
  }, [fetchLogs]);

  return (
    <div className="activity-log-panel">
      <h3>Activity Log</h3>
      <ul>
        {logs.map((log) => (
          <li key={log._id}>
            <span className="log-user">{log.user?.username}</span> ➝
            <span className="log-action"> {log.actionType}</span>
            {log.task?.title && (
              <span className="log-task"> “{log.task.title}”</span>
            )}
            <span className="log-time">
              {" "}
              ({new Date(log.createdAt).toLocaleTimeString()})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityLog;
