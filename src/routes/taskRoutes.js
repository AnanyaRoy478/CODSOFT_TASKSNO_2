const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  assignTask,
  updateTaskStatus,
  updateTaskPriority,
} = require("../controllers/taskController");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.post("/", authMiddleware, createTask);

router.get("/", authMiddleware, getTasks);

router.get("/:id", authMiddleware, getTaskById);

router.put("/:id", authMiddleware, updateTask);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin", "Manager"),
  deleteTask,
);

router.put("/:id/assign", authMiddleware, assignTask);

router.put("/:id/status", authMiddleware, updateTaskStatus);

router.put("/:id/priority", authMiddleware, updateTaskPriority);

module.exports = router;
