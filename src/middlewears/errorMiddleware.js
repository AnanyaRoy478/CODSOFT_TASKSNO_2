const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);

    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Mongoose Invalid ObjectId
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID.";
    }

    // Mongoose Validation Error
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
            .map(error => error.message)
            .join(", ");
    }

    // Duplicate Key Error (e.g., duplicate email)
    if (err.code === 11000) {
        statusCode = 400;
        message = `${Object.keys(err.keyValue)[0]} already exists.`;
    }

    res.status(statusCode).json({
        success: false,
        message
    });
};

module.exports = errorMiddleware;