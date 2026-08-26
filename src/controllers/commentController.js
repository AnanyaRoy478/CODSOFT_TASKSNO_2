const Comment = require("../models/Comment");
const Task = require("../models/Task");
const sendResponse = require("../utils/responseUtil");

// Add Comment
exports.addComment = async (req, res, next) => {
  try {
    const { task, message } = req.body;

    // Validate required fields
    if (!task || !message) {
      return sendResponse(res, 200, false, {
        message: "Task ID and comment message are required.",
        data: {},
      });
    }

    // Check if task exists and is not deleted
    const existingTask = await Task.findOne({
      _id: task,
      is_delete: false,
    });

    if (!existingTask) {
      return sendResponse(res, 200, false, {
        message: "Task not found.",
        data: {},
      });
    }

    // Create comment
    const comment = await Comment.create({
      task,
      user: req.user.id,
      message,
    });

    // Populate user and task information
    const populatedComment = await Comment.findById(comment._id)
      .populate("user", "name email")
      .populate("task", "title");

    return sendResponse(res, 201, true, {
      message: "Comment added successfully.",
      data: populatedComment,
    });
  } catch (error) {
    next(error);
  }
};

// Get Comments for a Task
exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({
      task: req.params.taskId,
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    if (comments.length === 0) {
      return sendResponse(res, 200, true, {
        message: "No comments found.",
        data: [],
      });
    }

    return sendResponse(res, 200, true, {
      message: "Comments retrieved successfully.",
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Comment
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findOne({
      _id: req.params.id,
      is_delete: false,
    });

    if (!comment) {
      return sendResponse(res, 200, false, {
        message: "Comment not found.",
        data: {},
      });
    }

    // Only comment owner can delete
    if (!comment.user || comment.user.toString() !== req.user.id) {
      return sendResponse(res, 200, false, {
        message: "Not authorized to delete this comment.",
        data: {},
      });
    }

    // Soft delete
    comment.is_delete = true;

    await comment.save();

    return sendResponse(res, 200, true, {
      message: "Comment deleted successfully.",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
