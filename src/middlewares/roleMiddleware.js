const sendResponse = require("../utils/responseUtil");

const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            // Check if user is authenticated
            if (!req.user) {
                return sendResponse(res, 200, false, {
                    message: "Authentication required.",
                    data: {}
                });
            }

            // Check if user's role is allowed
            if (!allowedRoles.includes(req.user.role)) {
                return sendResponse(res, 200, false, {
                    message: "Access denied. You do not have permission to perform this action.",
                    data: {}
                });
            }

            // User has required role
            return next();

        } catch (error) {
            next(error);
        }
    };
};

module.exports = roleMiddleware;