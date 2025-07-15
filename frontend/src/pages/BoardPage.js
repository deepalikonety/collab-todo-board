import React, { useEffect, useState, useContext,useCallback } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "../components/Column";
import { AuthContext } from "../context/AuthContext";
import ActivityLog from "../components/ActivityLog";
import { useNavigate } from "react-router-dom";
import ConflictModal from "../components/ConflictModal";
const statusMap = {
  Todo: "Todo",
  In_Progress: "In Progress",
  Done: "Done",
};

const BoardPage = () => {
  const { token, user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [showLog, setShowLog] = useState(true);
  const [conflict, setConflict] = useState(null);

  const navigate = useNavigate();
const [newTask, setNewTask] = useState({
  title: "",
  description: "",
  priority: "Medium",
  assignedUser: "",
});

const [users, setUsers] = useState([]);
const [showTaskForm, setShowTaskForm] = useState(false);
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/auth/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUsers(data); 
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  fetchUsers();
}, [token]);


  const fetchTasks = useCallback( async () => {
    const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setTasks(data);
  },[token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDragEnd = async (result) => {
  const { destination, source, draggableId } = result;
  if (!destination) return;

  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  )
    return;

  const newStatus = statusMap[destination.droppableId];
  const taskId = draggableId;

  // 🧠 Get the task we're moving, to access its version
  const task = tasks.find((t) => t._id === taskId);
  if (!task) return;

  try {
    const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus, version: task.version }),
    });

    if (res.status === 409) {
      const conflictData = await res.json();
      setConflict({
       currentTask: conflictData.currentTask,
       userVersion: {
        ...task,
        status: newStatus,
       },
      });
      alert("⚠️ Conflict detected: Task was updated elsewhere. Please refresh or overwrite manually.");
      console.warn("Conflict details:", conflict);
      return;
    }

    const updated = await res.json();
    setTasks((prev) =>
      prev.map((t) => (t._id === updated._id ? updated : t))
    );
  } catch (err) {
    console.error("Drag update failed:", err);
  }
};


  const getTasksByStatus = (status) =>
    tasks.filter(
      (t) =>
        t &&
        typeof t.status === "string" &&
        t.status.trim().toLowerCase() === status.toLowerCase()
    );

  return (
    <div
      className="board-wrapper"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "#fff6e6",
        padding: "1rem",
      }}
    >
      
<div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1.5rem",
    width: "100%",
  }}
>
  <div style={{ textAlign: "center" }}>
    <h1 style={{ fontSize: "1.8rem", marginBottom: "0.2rem" }}>📋 Your Tasks</h1>
    <p style={{ fontSize: "1rem", wordBreak: "break-word" }}>
      Welcome, <strong>{user?.username}</strong> 👋
    </p>
  </div>

  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "0.5rem",
      width: "100%",
    }}
  >
    <button
      style={{
        background: "#0077cc",
        color: "white",
        padding: "8px 14px",
        borderRadius: "6px",
        border: "none",
      }}
      onClick={() => setShowLog((prev) => !prev)}
    >
      {showLog ? "🙈 Hide Activity Log" : "📜 Show Activity Log"}
    </button>
    <button
      style={{
        background: "#ff4d4f",
        color: "white",
        padding: "8px 14px",
        borderRadius: "6px",
        border: "none",
      }}
      onClick={() => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        navigate("/");
      }}
    >
      🚪 Logout
    </button>
  </div>
</div>


<div style={{ marginBottom: "1rem" }}>
  <button
    onClick={() => setShowTaskForm((prev) => !prev)}
    style={{
      padding: "8px 14px",
      background: "#28a745",
      color: "white",
      border: "none",
      borderRadius: "12px",
      fontWeight: "500",
      cursor: "pointer",
    }}
  >
    {showTaskForm ? "Cancel" : "+ Add Task to Todo"}
  </button>

  {showTaskForm && (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/tasks`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ...newTask,
              status: "Todo",
            }),
          });

          await res.json();
          setShowTaskForm(false);
          setNewTask({
            title: "",
            description: "",
            priority: "Medium",
            assignedUser: "",
          });
          fetchTasks();
        } catch (err) {
          console.error("Error adding task:", err);
        }
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.8rem",
        marginTop: "1rem",
        background: "#fff",
        padding: "1rem",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "300px",
      }}
    >
      <input
        type="text"
        placeholder="Task Title *"
        value={newTask.title}
        required
        onChange={(e) =>
          setNewTask({ ...newTask, title: e.target.value })
        }
        style={{
          padding: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      <textarea
        placeholder="Description"
        value={newTask.description}
        onChange={(e) =>
          setNewTask({ ...newTask, description: e.target.value })
        }
        style={{
          padding: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          minHeight: "80px",
        }}
      />

      <select
        value={newTask.priority}
        onChange={(e) =>
          setNewTask({ ...newTask, priority: e.target.value })
        }
        style={{
          padding: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      >
        <option value="Low">Low Priority</option>
        <option value="Medium">Medium Priority</option>
        <option value="High">High Priority</option>
      </select>

      <select
  value={newTask.assignedUser}
  onChange={(e) =>
    setNewTask({ ...newTask, assignedUser: e.target.value })
  }
  style={{
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  }}
>
  <option value="">Assign to (optional)</option>
  {users.length > 0 ? (
    users.map((u) => (
      <option key={u._id} value={u._id}>
        {u.username}
      </option>
    ))
  ) : (
    <option disabled>Loading users...</option>
  )}
</select>


      <button
        type="submit"
        style={{
          padding: "10px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "6px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        ➕ Add Task to Todo
      </button>
    </form>
  )}
</div>


<div
  className="columns-container"
  style={{
    display: "flex",
    flexWrap: "nowrap",
    overflowX: "auto",
    overflowY: "hidden",
    gap: "1.5rem",
    paddingBottom: "1rem",
    scrollSnapType: "x mandatory",
  }}
>


  <DragDropContext onDragEnd={handleDragEnd}>
    <Column
      columnId="Todo"
      title="📌 Todo"
      tasks={getTasksByStatus("Todo")}
      refetchTasks={fetchTasks}
    />
    <Column
      columnId="In_Progress"
      title="⏳ In Progress"
      tasks={getTasksByStatus("In Progress")}
      refetchTasks={fetchTasks}
    />
    <Column
      columnId="Done"
      title="✅ Done"
      tasks={getTasksByStatus("Done")}
      refetchTasks={fetchTasks}
    />
  </DragDropContext>

  {showLog && <ActivityLog />}
  {conflict && (
  <ConflictModal
    currentTask={conflict.currentTask}
    userVersion={conflict.userVersion}
    onMerge={async () => {
      try {
        const merged = {
          ...conflict.currentTask,
          ...conflict.userVersion,
          version: conflict.currentTask.version + 1,
        };
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/tasks/${merged._id}/overwrite`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(merged),
        });
        await res.json();
        setConflict(null);
        fetchTasks();
      } catch (err) {
        console.error("Merge failed", err);
      }
    }}
    onOverwrite={async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/tasks/${conflict.userVersion._id}/overwrite`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(conflict.userVersion),
        });
        await res.json();
        setConflict(null);
        fetchTasks();
      } catch (err) {
        console.error("Overwrite failed", err);
      }
    }}
    onClose={() => setConflict(null)}
  />
)}

</div> 
    </div>
  );
};

export default BoardPage;
