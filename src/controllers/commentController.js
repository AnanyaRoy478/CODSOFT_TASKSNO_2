const Comment = require("../models/Comment");
const Task = require("../models/Task");

// Add Comment
exports.addComment = async (req, res) => {
    try {
        const { task, message } = req.body;

        if (!task || !message) {
            return res.status(400).json({
                message: "Task ID and comment message are required."
            });
        }

        // Check if task exists
        const existingTask = await Task.findById(task);

        if (!existingTask) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        const comment = await Comment.create({
            task,
            user: req.user.id,
            message
        });

        const populatedComment = await Comment.findById(comment._id)
            .populate("user", "name email")
            .populate("task", "title");

        res.status(201).json({
            message: "Comment added successfully.",
            comment: populatedComment
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get Comments for a Task
exports.getComments = async (req, res) => {
    try {

        const comments = await Comment.find({
            task: req.params.taskId
        })
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json(comments);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Delete Comment
exports.deleteComment = async (req, res) => {
    try {

        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found."
            });
        }

        // Only comment owner can delete
        if (comment.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Not authorized to delete this comment."
            });
        }

        await comment.deleteOne();

        res.status(200).json({
            message: "Comment deleted successfully."
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};