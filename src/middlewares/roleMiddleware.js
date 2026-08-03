const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            // Check if user exists
            if (!req.user) {
                return res.status(401).json({
                    message: "Authentication required."
                });
            }

            // Check if user's role is allowed
            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    message: "Access denied. You do not have permission to perform this action."
                });
            }

            next();

        } catch (error) {
            return res.status(500).json({
                message: error.message
            });
        }
    };
};

module.exports = roleMiddleware;