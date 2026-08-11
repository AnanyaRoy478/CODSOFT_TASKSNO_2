const Project = require("../models/Project");
const User = require("../models/User");
const sendResponse = require("../utils/responseUtil");

// Create Project
exports.createProject = async (req, res, next) => {
    try {
        const { title, description, startDate, deadline } = req.body;

        if (!title) {
            return sendResponse(res, 200, false, {
                message: "Project title is required.",
            });
        }

        const project = await Project.create({
            title,
            description,
            owner: req.user.id,
            members: [req.user.id],
            startDate,
            deadline,
        });

        const populatedProject = await Project.findById(project._id)
            .populate("owner", "name email")
            .populate("members", "name email");

        return sendResponse(res, 200, true, {
            message: "Project created successfully.",
            project: populatedProject,
        });
    } catch (error) {
        next(error);
    }
};

// Get All Projects
exports.getProjects = async (req, res, next) => {
    try {
        const projects = await Project.find({
            members: req.user.id
        })
            .populate("owner", "name email")
            .populate("members", "name email");

        if (projects.length === 0) {
            return sendResponse(res, 200, true, {
                message: "No projects found.",
                data: []
            });
        }

        return sendResponse(res, 200, true, {
            message: "Projects retrieved successfully.",
            data: projects
        });

    } catch (error) {
        next(error);
    }
};

// Get Project By ID
exports.getProjectById = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate("owner", "name email")
            .populate("members", "name email");

        if (!project) {
            return sendResponse(res, 200, false, {
                message: "Project not found.",
                data: {}
            });
        }

        return sendResponse(res, 200, true, {
            message: "Project retrieved successfully.",
            data: project
        });

    } catch (error) {
        next(error);
    }
};

// Update Project
exports.updateProject = async (req, res, next) => {
    try {
        const {
            title,
            description,
            startDate,
            deadline,
            status,
            progress
        } = req.body;

        const project = await Project.findById(req.params.id);

        if (!project) {
            return sendResponse(res, 200, false, {
                message: "Project not found.",
                data: {}
            });
        }

        if (project.owner.toString() !== req.user.id) {
            return sendResponse(res, 200, false, {
                message: "Not authorized.",
                data: {}
            });
        }

        if (title) project.title = title;
        if (description) project.description = description;
        if (startDate) project.startDate = startDate;
        if (deadline) project.deadline = deadline;
        if (status) project.status = status;

        if (progress !== undefined) {
            project.progress = progress;
        }

        await project.save();

        return sendResponse(res, 200, true, {
            message: "Project updated successfully.",
            data: project
        });

    } catch (error) {
        next(error);
    }
};

// Delete Project
exports.deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return sendResponse(res, 200, false, {
                message: "Project not found.",
                data: {}
            });
        }

        if (project.owner.toString() !== req.user.id) {
            return sendResponse(res, 200, false, {
                message: "Not authorized.",
                data: {}
            });
        }

        await project.deleteOne();

        return sendResponse(res, 200, true, {
            message: "Project deleted successfully.",
            data: {}
        });

    } catch (error) {
        next(error);
    }
};

// Add Member
exports.addMember = async (req, res, next) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return sendResponse(res, 200, false, {
                message: "User ID is required.",
                data: {}
            });
        }

        const project = await Project.findById(req.params.id);

        if (!project) {
            return sendResponse(res, 200, false, {
                message: "Project not found.",
                data: {}
            });
        }

        // Only project owner can add members
        if (project.owner.toString() !== req.user.id) {
            return sendResponse(res, 200, false, {
                message: "Only project owner can add members.",
                data: {}
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return sendResponse(res, 200, false, {
                message: "User not found.",
                data: {}
            });
        }

        // Check if user is already a member
        if (
            project.members.some(
                member => member.toString() === userId
            )
        ) {
            return sendResponse(res, 200, false, {
                message: "User is already a member.",
                data: {}
            });
        }

        project.members.push(userId);

        await project.save();

        const updatedProject = await Project.findById(project._id)
            .populate("owner", "name email")
            .populate("members", "name email");

        return sendResponse(res, 200, true, {
            message: "Member added successfully.",
            data: updatedProject
        });

    } catch (error) {
        next(error);
    }
};


// Remove Member
exports.removeMember = async (req, res, next) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return sendResponse(res, 200, false, {
                message: "User ID is required.",
                data: {}
            });
        }

        const project = await Project.findById(req.params.id);

        if (!project) {
            return sendResponse(res, 200, false, {
                message: "Project not found.",
                data: {}
            });
        }

        // Only project owner can remove members
        if (project.owner.toString() !== req.user.id) {
            return sendResponse(res, 200, false, {
                message: "Only project owner can remove members.",
                data: {}
            });
        }

        // Check if user is actually a member
        const isMember = project.members.some(
            member => member.toString() === userId
        );

        if (!isMember) {
            return sendResponse(res, 200, false, {
                message: "User is not a member of this project.",
                data: {}
            });
        }

        // Prevent owner from removing themselves
        if (project.owner.toString() === userId) {
            return sendResponse(res, 200, false, {
                message: "Project owner cannot be removed.",
                data: {}
            });
        }

        project.members = project.members.filter(
            member => member.toString() !== userId
        );

        await project.save();

        const updatedProject = await Project.findById(project._id)
            .populate("owner", "name email")
            .populate("members", "name email");

        return sendResponse(res, 200, true, {
            message: "Member removed successfully.",
            data: updatedProject
        });

    } catch (error) {
        next(error);
    }
};