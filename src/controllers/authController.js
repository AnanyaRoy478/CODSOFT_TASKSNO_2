const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const sendResponse = require("../utils/responseUtil");

// Register User
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return sendResponse(res, 200, false, {
        message: "Please fill all required fields.",
        data: {},
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return sendResponse(res, 200, false, {
        message: "Email already registered.",
        data: {},
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return sendResponse(res, 200, true, {
      message: "User registered successfully.",
      data: {
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login User
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendResponse(res, 200, false, {
        message: "Email and password are required.",
        data: {},
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return sendResponse(res, 200, false, {
        message: "Invalid email or password.",
        data: {},
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return sendResponse(res, 200, false, {
        message: "Invalid email or password.",
        data: {},
      });
    }

    return sendResponse(res, 200, true, {
      message: "Login successful.",
      data: {
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

//Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");

    return sendResponse(res, 200, true, {
      message: "Users retrieved successfully.",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// Get Profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return sendResponse(res, 200, false, {
        message: "User not found.",
        data: {},
      });
    }

    return sendResponse(res, 200, true, {
      message: "Profile retrieved successfully.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Update Profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, password } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return sendResponse(res, 200, false, {
        message: "User not found.",
        data: {},
      });
    }

    if (name) {
      user.name = name;
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    return sendResponse(res, 200, true, {
      message: "Profile updated successfully.",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
