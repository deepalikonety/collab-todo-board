const mongoose = require("mongoose");

const actionLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    actionType: String, 
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
    message: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActionLog", actionLogSchema);
