const Task = require("../models/Task");
const Project = require("../models/Project");

const calculateProgress = async (projectId) => {
    try {
        // Count total tasks in the project
        const totalTasks = await Task.countDocuments({
            project: projectId,
        });

        // Count completed tasks
        const completedTasks = await Task.countDocuments({
            project: projectId,
            status: "Completed",
        });

        // Calculate progress percentage
        let progress = 0;

        if (totalTasks > 0) {
            progress = Math.round((completedTasks / totalTasks) * 100);
        }

        // Update project progress
        await Project.findByIdAndUpdate(projectId, {
            progress,
        });

        return progress;

    } catch (error) {
        console.error("Error calculating project progress:", error.message);
    }
};

module.exports = calculateProgress;