const express = require("express");
const router = express.Router();

const {
    createActivity,
    getProjectActivities,
    getTaskActivities
} = require("../controllers/activityController");

const authMiddleware = require("../middlewares/authMiddleware");

// Create Activity (Optional)
router.post("/", authMiddleware, createActivity);

// Get all activities of a project
router.get("/project/:projectId", authMiddleware, getProjectActivities);

// Get all activities of a task
router.get("/task/:taskId", authMiddleware, getTaskActivities);

module.exports = router;