const ActionLog = require("../models/ActionLog");

const logAction = async (userId, actionType, taskId, message) => {
  await ActionLog.create({
    user: userId,
    actionType,
    task: taskId,
    message,
  });
};

module.exports = logAction;
