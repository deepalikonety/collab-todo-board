import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";

const TaskCard = ({ task, index, status, refetchTasks }) => {
  const [animate, setAnimate] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!task || !task._id || !task.title) return null;

  const handleSmartAssign = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/tasks/${task._id}/smart-assign`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = await res.json();
      console.log("✅ Smart assigned:", data.message);
      setAnimate(true);
      setTimeout(() => setAnimate(false), 500);
      refetchTasks();
    } catch (err) {
      console.error("❌ Smart assign failed", err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/tasks/${task._id}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ text: comment }),
        }
      );
      const data = await res.json();
      console.log("📝 Comment added:", data);
      setComment("");
      setShowCommentBox(false);
      refetchTasks();
    } catch (err) {
      console.error("❌ Failed to submit comment", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Draggable draggableId={String(task._id)} index={index}>
      {(provided) => (
        <div
          className={`task-card ${animate ? "pulse" : ""}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <h4>{task.title}</h4>
          <p>{task.description || "No description"}</p>

          {task.priority && (
            <span className={`priority ${task.priority.toLowerCase()}`}>
              {task.priority}
            </span>
          )}

          <div
            style={{
              display: "flex",
              gap: "8px",
              marginTop: "8px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {task.assignedUser?.username && (
              <p className="assigned-to" style={{ margin: 0 }}>
                Assigned to: {task.assignedUser.username}
              </p>
            )}

            {status !== "Done" && (
              <button className="smart-assign-btn" onClick={handleSmartAssign}>
                {task.assignedUser?.username
                  ? "🔄 Reassign Smartly"
                  : "Smart Assign"}
              </button>
            )}

            <button
              className="comment-btn"
              onClick={() => setShowCommentBox((prev) => !prev)}
            >
              💬 Comment
            </button>
          </div>

          {showCommentBox && (
            <form
              className="comment-box"
              onSubmit={handleCommentSubmit}
              style={{ marginTop: "8px" }}
            >
              <textarea
                placeholder="Type your comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                style={{ width: "100%", borderRadius: "4px", padding: "6px" }}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  marginTop: "6px",
                  fontSize: "0.85rem",
                  padding: "6px 10px",
                }}
              >
                {isSubmitting ? "Submitting..." : "Submit Comment"}
              </button>
            </form>
          )}

          {task.comments?.length > 0 && (
            <div className="comments" style={{ marginTop: "10px" }}>
              <strong>Recent Comments:</strong>
              <ul style={{ paddingLeft: "1rem", fontSize: "0.85rem" }}>
                {task.comments
                  .slice(-2)
                  .reverse()
                  .map((c, idx) => (
                    <li key={idx}>
                      {c.text}{" "}
                      <span style={{ color: "#888" }}>
                        — {c.user?.username || "user"}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
