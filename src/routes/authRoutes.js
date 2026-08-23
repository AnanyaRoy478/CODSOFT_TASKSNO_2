const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  getAllUsers,
} = require("../controllers/authController");

const authMiddleware = require("../middlewares/authMiddleware");

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Routes
router.get("/all-users", authMiddleware, getAllUsers);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile/:id", authMiddleware, updateProfile);

module.exports = router;
