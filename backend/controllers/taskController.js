const Task = require("../models/Task");
const logAction = require("./logAction");
const User = require("../models/User");

exports.createTask = async (req, res) => {
  try {
    const { title, description, priority ,assignedUser} = req.body;

    const existing = await Task.findOne({ title });
    if (existing) return res.status(400).json({ message: "Task title already exists" });

    const task = await Task.create({
      title,
      description,
      priority,
      assignedUser: assignedUser || null,
      lastUpdatedBy: req.user._id,
    });

    await logAction(req.user._id, "Created", task._id, `Created task "${title}"`);

    global.io.emit("taskCreated", task);


    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Create failed", error: err.message });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
  .populate("assignedUser", "username")
  .populate("lastUpdatedBy", "username")
  .populate("comments.user", "username"); 

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed", error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (updates.version && updates.version !== task.version) {
      return res.status(409).json({
        message: "Conflict detected",
        currentTask: task,
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        ...updates,
        lastUpdatedBy: req.user._id,
        version: task.version + 1,
      },
      { new: true }
    );

    await logAction(req.user._id, "Updated", updatedTask._id, `Updated task "${updatedTask.title}"`);

    global.io.emit("taskUpdated", updatedTask);


    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) return res.status(404).json({ message: "Task not found" });

    await logAction(req.user._id, "Deleted", id, `Deleted task "${deletedTask.title}"`);

    global.io.emit("taskDeleted", deletedTask._id);

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

exports.smartAssign = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const users = await User.find();
    if (users.length === 0) return res.status(400).json({ message: "No users found" });

    // Count active tasks for each user
    const counts = await Promise.all(
      users.map(async (user) => {
        const count = await Task.countDocuments({
          assignedUser: user._id,
          status: { $ne: "Done" },
        });
        return { userId: user._id, count };
      })
    );

    // Find user with least tasks
    const minUser = counts.reduce((min, u) => (u.count < min.count ? u : min), counts[0]);

    // Assign task
    task.assignedUser = minUser.userId;
    task.lastUpdatedBy = req.user._id;
    task.version += 1;
    await task.save();

    // 🧠 Re-fetch the task with populated fields
    const updatedTask = await Task.findById(task._id)
      .populate("assignedUser", "username")
      .populate("lastUpdatedBy", "username");

    await logAction(
      req.user._id,
      "Smart Assign",
      task._id,
      `Smart-assigned "${task.title}" to ${updatedTask.assignedUser?.username || "unknown"}`
    );

    global.io.emit("taskUpdated", updatedTask);

    res.json({
      message: `Assigned to ${updatedTask.assignedUser?.username || "someone"}`,
      task: updatedTask,
    });
  } catch (err) {
    res.status(500).json({ message: "Smart Assign failed", error: err.message });
  }
};


exports.overwriteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const overwritten = await Task.findByIdAndUpdate(
      id,
      {
        ...updates,
        lastUpdatedBy: req.user._id,
        version: updates.version ?? 1,
      },
      { new: true }
    );

    await logAction(req.user._id, "Overwritten", overwritten._id, `Overwrote task "${overwritten.title}"`);
    global.io.emit("taskUpdated", overwritten);

    res.json(overwritten);
  } catch (err) {
    res.status(500).json({ message: "Overwrite failed", error: err.message });
  }
};
