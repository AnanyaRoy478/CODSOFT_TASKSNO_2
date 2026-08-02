const Activity = require("../models/Activity");
const Project = require("../models/Project");
const Task = require("../models/Task");

// Create Activity (Optional)
exports.createActivity = async (req, res) => {
    try {
        const { project, task, action } = req.body;

        if (!action) {
            return res.status(400).json({
                message: "Action is required."
            });
        }

        const activity = await Activity.create({
            user: req.user.id,
            project,
            task,
            action
        });

        const populatedActivity = await Activity.findById(activity._id)
            .populate("user", "name email")
            .populate("project", "title")
            .populate("task", "title");

        res.status(201).json({
            message: "Activity created successfully.",
            activity: populatedActivity
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get Activities for a Project
exports.getProjectActivities = async (req, res) => {
    try {

        const project = await Project.findById(req.params.projectId);

        if (!project) {
            return res.status(404).json({
                message: "Project not found."
            });
        }

        const activities = await Activity.find({
            project: req.params.projectId
        })
            .populate("user", "name email")
            .populate("task", "title")
            .sort({ createdAt: -1 });

        res.status(200).json(activities);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get Activities for a Task
exports.getTaskActivities = async (req, res) => {
    try {

        const task = await Task.findById(req.params.taskId);

        if (!task) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        const activities = await Activity.find({
            task: req.params.taskId
        })
            .populate("user", "name email")
            .populate("project", "title")
            .sort({ createdAt: -1 });

        res.status(200).json(activities);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};