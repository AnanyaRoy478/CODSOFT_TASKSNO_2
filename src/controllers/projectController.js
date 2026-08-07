const Project = require("../models/Project");
const User = require("../models/User");

// Create Project
exports.createProject = async (req, res) => {
    try {
        const { title, description, startDate, deadline } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Project title is required."
            });
        }

        const project = await Project.create({
            title,
            description,
            owner: req.user.id,
            members: [req.user.id],
            startDate,
            deadline
        });

        res.status(201).json({
            message: "Project created successfully.",
            project
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get All Projects
exports.getProjects = async (req, res) => {
    try {

        const projects = await Project.find({
            members: req.user.id
            ,is_delete: false
        })
            .populate("owner", "name email")
            .populate("members", "name email");

        res.status(200).json(projects);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get Project By ID
exports.getProjectById = async (req, res) => {
    try {

        const project = await Project.findById(req.params.id)
            .populate("owner", "name email")
            .populate("members", "name email");

        if (!project) {
            return res.status(404).json({
                message: "Project not found."
            });
        }

        res.status(200).json(project);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Update Project
exports.updateProject = async (req, res) => {
    try {

        const { title, description, startDate, deadline, status, progress } = req.body;

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found."
            });
        }

        // Only owner can update
        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Not authorized."
            });
        }

        if (title) project.title = title;
        if (description) project.description = description;
        if (startDate) project.startDate = startDate;
        if (deadline) project.deadline = deadline;
        if (status) project.status = status;
        if (progress !== undefined) project.progress = progress;

        await project.save();

        res.status(200).json({
            message: "Project updated successfully.",
            project
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Delete Project
exports.deleteProject = async (req, res) => {
    try {

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found."
            });
        }

        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Not authorized."
            });
        }
        project.is_delete = true;
        await project.save();

        res.status(200).json({
            message: "Project deleted successfully."
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Add Member
exports.addMember = async (req, res) => {
    try {

        const { userId } = req.body;

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found."
            });
        }

        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Only project owner can add members."
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        if (project.members.includes(userId)) {
            return res.status(400).json({
                message: "User is already a member."
            });
        }

        project.members.push(userId);

        await project.save();

        res.status(200).json({
            message: "Member added successfully.",
            project
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Remove Member
exports.removeMember = async (req, res) => {
    try {

        const { userId } = req.body;

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found."
            });
        }

        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Only project owner can remove members."
            });
        }

        project.members = project.members.filter(
            member => member.toString() !== userId
        );

        await project.save();

        res.status(200).json({
            message: "Member removed successfully.",
            project
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};