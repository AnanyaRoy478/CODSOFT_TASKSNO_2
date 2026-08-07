const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");
const calculateProgress = require("../utils/calculateProgress");

// Create Task
exports.createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            project,
            assignedTo,
            priority,
            dueDate
        } = req.body;

        if (!title || !project) {
            return res.status(400).json({
                message: "Title and project are required."
            });
        }

        const existingProject = await Project.findById(project);

        if (!existingProject) {
            return res.status(404).json({
                message: "Project not found."
            });
        }

        const task = await Task.create({
            title,
            description,
            project,
            assignedTo,
            createdBy: req.user.id,
            priority,
            dueDate
        });
        await calculateProgress(project);
        
        res.status(201).json({
            message: "Task created successfully.",
            task
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get All Tasks
exports.getTasks = async (req, res) => {
    try {

        const tasks = await Task.find()
            .populate("project", "title")
            .populate("assignedTo", "name email")
            .populate("createdBy", "name email");

        res.status(200).json(tasks);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get Task By ID
exports.getTaskById = async (req, res) => {
    try {

        const task = await Task.findById(req.params.id)
            .populate("project", "title")
            .populate("assignedTo", "name email")
            .populate("createdBy", "name email");

        if (!task) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        res.status(200).json(task);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Update Task
exports.updateTask = async (req, res) => {
    try {

        const {
            title,
            description,
            priority,
            dueDate,
            status
        } = req.body;

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        if (title) task.title = title;
        if (description) task.description = description;
        if (priority) task.priority = priority;
        if (dueDate) task.dueDate = dueDate;
        if (status) task.status = status;

        if (status === "Completed") {
            task.completedAt = new Date();
        }

        await task.save();

        res.status(200).json({
            message: "Task updated successfully.",
            task
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Delete Task
exports.deleteTask = async (req, res) => {
    try {

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        task.is_delete = true;
        await task.save();
        await calculateProgress(projectId);
        res.status(200).json({
            message: "Task deleted successfully."
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Assign Task
exports.assignTask = async (req, res) => {
    try {

        const { userId } = req.body;

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        task.assignedTo = userId;

        await task.save();

        res.status(200).json({
            message: "Task assigned successfully.",
            task
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Update Task Status
exports.updateTaskStatus = async (req, res) => {
    try {

        const { status } = req.body;

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        task.status = status;

        if (status === "Completed") {
            task.completedAt = new Date();
        } else {
            task.completedAt = null;
        }
        
        await task.save();
        await calculateProgress(task.project);

        res.status(200).json({
            message: "Task status updated successfully.",
            task
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Update Task Priority
exports.updateTaskPriority = async (req, res) => {
    try {

        const { priority } = req.body;

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        task.priority = priority;

        await task.save();

        res.status(200).json({
            message: "Task priority updated successfully.",
            task
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};