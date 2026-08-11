const sendResponse = require("../utils/responseUtil");

const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);

    let statusCode = err.statusCode || 200;
    let message = err.message || "Internal Server Error";

    // Invalid MongoDB ObjectId
    if (err.name === "CastError") {
        statusCode = 200;
        message = "Invalid ID.";
    }

    // Mongoose Validation Error
    if (err.name === "ValidationError") {
        statusCode = 200;

        message = Object.values(err.errors)
            .map(error => error.message)
            .join(", ");
    }

    // Duplicate key
    if (err.code === 11000) {
        statusCode = 200;

        const field = Object.keys(err.keyValue)[0];

        message = `${field} already exists.`;
    }

    return sendResponse(res, statusCode, false, {
        message,
        data: {}
    });
};

module.exports = errorMiddleware;