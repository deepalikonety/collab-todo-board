const express = require("express");
const router = express.Router();
const {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  smartAssign,
  overwriteTask,
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");
const Task = require("../models/Task");
const logAction = require("../controllers/logAction");
const ActionLog = require("../models/ActionLog");

router.get("/", protect, getAllTasks);
router.post("/", protect, createTask);

router.post("/:id/comment", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const comment = {
      user: req.user._id,
      text: req.body.text,
      timestamp: new Date(),
    };

    task.comments.push(comment);
    await task.save();

    await logAction(req.user._id, "Commented", task._id, `Added comment: "${req.body.text}"`);

    res.status(201).json({ message: "Comment added", comment });
  } catch (err) {
    res.status(500).json({ message: "Comment failed", error: err.message });
  }
});

router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);
router.put("/:id/smart-assign", protect, smartAssign);
router.put("/:id/overwrite", protect, overwriteTask);

router.get("/logs/recent", protect, async (req, res) => {
  try {
    const logs = await ActionLog.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("user", "username")
      .populate("task", "title");

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Log fetch failed", error: err.message });
  }
});

module.exports = router;
