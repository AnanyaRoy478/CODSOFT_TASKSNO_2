const Task = require("../models/Task");
const Project = require("../models/Project");

const calculateProgress = async (projectId) => {
  try {
    const totalTasks = await Task.countDocuments({
      project: projectId,
      is_delete: false,
    });

    const completedTasks = await Task.countDocuments({
      project: projectId,
      status: "Completed",
      is_delete: false,
    });

    let progress = 0;

    if (totalTasks > 0) {
      progress = Math.round((completedTasks / totalTasks) * 100);
    }

    await Project.findByIdAndUpdate(projectId, {
      progress,
    });

    return progress;
  } catch (error) {
    console.error("Error calculating project progress:", error.message);

    throw error;
  }
};

module.exports = calculateProgress;
