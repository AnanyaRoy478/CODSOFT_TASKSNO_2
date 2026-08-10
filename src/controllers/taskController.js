const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");
const calculateProgress = require("../utils/calculateProgress");
const sendResponse = require("../utils/responseUtil");

// Create Task
exports.createTask = async (req, res, next) => {
    try {
        const {
            title,
            description,
            project,
            assignedTo,
            priority,
            dueDate
        } = req.body;

        // Validate required fields
        if (!title || !project) {
            return sendResponse(res, 400, false, {
                message: "Title and project are required.",
                data: {}
            });
        }

        // Check project exists
        const existingProject = await Project.findOne({
            _id: project,
            is_delete: false
        });

        if (!existingProject) {
            return sendResponse(res, 404, false, {
                message: "Project not found.",
                data: {}
            });
        }

        // If task is assigned to a user, check user exists
        if (assignedTo) {
            const user = await User.findById(assignedTo);

            if (!user) {
                return sendResponse(res, 404, false, {
                    message: "Assigned user not found.",
                    data: {}
                });
            }
        }

        // Create task
        const task = await Task.create({
            title,
            description,
            project,
            assignedTo,
            createdBy: req.user.id,
            priority,
            dueDate
        });

        // Recalculate project progress
        await calculateProgress(project);

        // Return success response
        return sendResponse(res, 201, true, {
            message: "Task created successfully.",
            data: task
        });

    } catch (error) {
        next(error);
    }
};

// Get All Tasks
exports.getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find()
            .populate("project", "title")
            .populate("assignedTo", "name email")
            .populate("createdBy", "name email");

        if (tasks.length === 0) {
            return sendResponse(res, 200, true, {
                message: "No tasks found.",
                data: []
            });
        }

        return sendResponse(res, 200, true, {
            message: "Tasks retrieved successfully.",
            data: tasks
        });

    } catch (error) {
        next(error);
    }
};

// Get Task By ID
exports.getTaskById = async (req, res, next) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            is_delete: false
        })
            .populate("project", "title")
            .populate("assignedTo", "name email")
            .populate("createdBy", "name email");

        if (!task) {
            return sendResponse(res, 404, false, {
                message: "Task not found.",
                data: {}
            });
        }

        return sendResponse(res, 200, true, {
            message: "Task retrieved successfully.",
            data: task
        });

    } catch (error) {
        next(error);
    }
};


// Update Task
exports.updateTask = async (req, res, next) => {
    try {
        const {
            title,
            description,
            priority,
            dueDate,
            status
        } = req.body;

        const task = await Task.findOne({
            _id: req.params.id,
            is_delete: false
        });

        if (!task) {
            return sendResponse(res, 404, false, {
                message: "Task not found.",
                data: {}
            });
        }

        if (title !== undefined) {
            task.title = title;
        }

        if (description !== undefined) {
            task.description = description;
        }

        if (priority !== undefined) {
            task.priority = priority;
        }

        if (dueDate !== undefined) {
            task.dueDate = dueDate;
        }

        if (status !== undefined) {
            task.status = status;

            if (status === "Completed") {
                task.completedAt = new Date();
            } else {
                task.completedAt = null;
            }
        }

        await task.save();

        // Recalculate project progress
        await calculateProgress(task.project);

        return sendResponse(res, 200, true, {
            message: "Task updated successfully.",
            data: task
        });

    } catch (error) {
        next(error);
    }
};


// Delete Task
exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            is_delete: false
        });

        if (!task) {
            return sendResponse(res, 404, false, {
                message: "Task not found.",
                data: {}
            });
        }

        // Store project ID before changing/deleting task
        const projectId = task.project;

        // Soft delete
        task.is_delete = true;

        await task.save();

        // Recalculate project progress
        await calculateProgress(projectId);

        return sendResponse(res, 200, true, {
            message: "Task deleted successfully.",
            data: {}
        });

    } catch (error) {
        next(error);
    }
};


// Assign Task
exports.assignTask = async (req, res, next) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return sendResponse(res, 400, false, {
                message: "User ID is required.",
                data: {}
            });
        }

        const task = await Task.findOne({
            _id: req.params.id,
            is_delete: false
        });

        if (!task) {
            return sendResponse(res, 404, false, {
                message: "Task not found.",
                data: {}
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return sendResponse(res, 404, false, {
                message: "User not found.",
                data: {}
            });
        }

        task.assignedTo = userId;

        await task.save();

        const updatedTask = await Task.findById(task._id)
            .populate("project", "title")
            .populate("assignedTo", "name email")
            .populate("createdBy", "name email");

        return sendResponse(res, 200, true, {
            message: "Task assigned successfully.",
            data: updatedTask
        });

    } catch (error) {
        next(error);
    }
};


// Update Task Status
exports.updateTaskStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!status) {
            return sendResponse(res, 400, false, {
                message: "Task status is required.",
                data: {}
            });
        }

        const task = await Task.findOne({
            _id: req.params.id,
            is_delete: false
        });

        if (!task) {
            return sendResponse(res, 404, false, {
                message: "Task not found.",
                data: {}
            });
        }

        task.status = status;

        if (status === "Completed") {
            task.completedAt = new Date();
        } else {
            task.completedAt = null;
        }

        await task.save();

        // Recalculate project progress
        await calculateProgress(task.project);

        return sendResponse(res, 200, true, {
            message: "Task status updated successfully.",
            data: task
        });

    } catch (error) {
        next(error);
    }
};


// Update Task Priority
exports.updateTaskPriority = async (req, res, next) => {
    try {
        const { priority } = req.body;

        if (!priority) {
            return sendResponse(res, 400, false, {
                message: "Task priority is required.",
                data: {}
            });
        }

        const task = await Task.findOne({
            _id: req.params.id,
            is_delete: false
        });

        if (!task) {
            return sendResponse(res, 404, false, {
                message: "Task not found.",
                data: {}
            });
        }

        task.priority = priority;

        await task.save();

        return sendResponse(res, 200, true, {
            message: "Task priority updated successfully.",
            data: task
        });

    } catch (error) {
        next(error);
    }
};