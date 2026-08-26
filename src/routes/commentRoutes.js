const express = require("express");
const router = express.Router();

const {
  addComment,
  getComments,
  deleteComment,
} = require("../controllers/commentController");

const authMiddleware = require("../middlewares/authMiddleware");

// Add a comment
router.post("/", authMiddleware, addComment);

// Get all comments for a task
router.get("/:taskId", authMiddleware, getComments);

// Delete a comment
router.delete("/:id", authMiddleware, deleteComment);

module.exports = router;
