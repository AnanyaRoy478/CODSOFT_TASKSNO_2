const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendResponse = require("../utils/responseUtil");

const authMiddleware = async (req, res, next) => {
    try {
        let token;

        // Check Authorization header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            // Extract token
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            // Find user
            req.user = await User.findById(decoded.id)
                .select("-password");

            // User not found
            if (!req.user) {
                return sendResponse(res, 401, false, {
                    message: "User not found.",
                    data: {}
                });
            }

            // Continue to controller
            return next();

        } else {
            return sendResponse(res, 401, false, {
                message: "Not authorized. No token provided.",
                data: {}
            });
        }

    } catch (error) {
        return sendResponse(res, 401, false, {
            message: "Invalid or expired token.",
            data: {}
        });
    }
};

module.exports = authMiddleware;