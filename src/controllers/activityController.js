const Activity = require("../models/Activity");
const Project = require("../models/Project");
const Task = require("../models/Task");
const sendResponse = require("../utils/responseUtil");

// Create Activity
exports.createActivity = async (req, res, next) => {
  try {
    const { project, task, action } = req.body;

    // Validate action
    if (!action) {
      return sendResponse(res, 200, false, {
        message: "Action is required.",
        data: {},
      });
    }

    // Create activity
    const activity = await Activity.create({
      user: req.user.id,
      project,
      task,
      action,
    });

    // Populate related data
    const populatedActivity = await Activity.findById(activity._id)
      .populate("user", "name email")
      .populate("project", "title")
      .populate("task", "title");

    return sendResponse(res, 200, true, {
      message: "Activity created successfully.",
      data: populatedActivity,
    });
  } catch (error) {
    next(error);
  }
};

// Get Activities for a Project
exports.getProjectActivities = async (req, res, next) => {
  try {
    const activities = await Activity.find({
      project: req.params.projectId,
    })
      .populate("user", "name email")
      .populate("task", "title")
      .sort({ createdAt: -1 });

    if (activities.length === 0) {
      return sendResponse(res, 200, true, {
        message: "No activities found.",
        data: [],
      });
    }

    return sendResponse(res, 200, true, {
      message: "Activities retrieved successfully.",
      data: activities,
    });
  } catch (error) {
    next(error);
  }
};

// Get Activities for a Task
exports.getTaskActivities = async (req, res, next) => {
  try {
    // Check if task exists and is not deleted
    const task = await Task.findOne({
      _id: req.params.taskId,
      is_delete: false,
    });

    if (!task) {
      return sendResponse(res, 200, false, {
        message: "Task not found.",
        data: {},
      });
    }

    // Get activities
    const activities = await Activity.find({
      task: req.params.taskId,
      is_delete: false,
    })
      .populate("user", "name email")
      .populate("project", "title")
      .sort({ createdAt: -1 });

    // Empty state
    if (activities.length === 0) {
      return sendResponse(res, 200, true, {
        message: "No activities found for this task.",
        data: [],
      });
    }

    return sendResponse(res, 200, true, {
      message: "Task activities retrieved successfully.",
      data: activities,
    });
  } catch (error) {
    next(error);
  }
};
